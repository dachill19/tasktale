import { createTask, getCurrentUserId, TaskFormData, TaskWithSubTasks, updateTask } from "@/lib/task";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Calendar, Plus, X } from "@tamagui/lucide-icons";
import React, { useCallback, useMemo, useReducer } from "react";
import { Alert, FlatList, Platform } from "react-native";
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { Button, Dialog, Input, Text, XStack, YStack } from "tamagui";

// ===== TYPES =====
type Priority = "high" | "medium" | "low";

interface SubTask {
    id: number;
    title: string;
}

interface TaskFormState {
    title: string;
    description: string;
    priority: Priority;
    deadline: Date | null;
    subTasks: SubTask[];
    isLoading: boolean;
    showDatePicker: boolean;
    nextSubTaskId: number;
}

type TaskFormAction =
    | { type: "SET_TITLE"; payload: string }
    | { type: "SET_DESCRIPTION"; payload: string }
    | { type: "SET_PRIORITY"; payload: Priority }
    | { type: "SET_DEADLINE"; payload: Date | null }
    | { type: "ADD_SUBTASK" }
    | { type: "UPDATE_SUBTASK"; payload: { id: number; title: string } }
    | { type: "REMOVE_SUBTASK"; payload: number }
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "TOGGLE_DATE_PICKER"; payload?: boolean }
    | { type: "RESET_FORM" };

interface TaskDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave?: () => void;
    onCancel?: () => void;
    onTaskCreated?: (task: any) => void;
    taskToEdit?: TaskWithSubTasks;
}

// ===== REDUCER =====
const initialState: TaskFormState = {
    title: "",
    description: "",
    priority: "medium",
    deadline: null,
    subTasks: [],
    isLoading: false,
    showDatePicker: false,
    nextSubTaskId: 0,
};

function taskFormReducer(
    state: TaskFormState,
    action: TaskFormAction
): TaskFormState {
    switch (action.type) {
        case "SET_TITLE":
            return { ...state, title: action.payload };
        case "SET_DESCRIPTION":
            return { ...state, description: action.payload };
        case "SET_PRIORITY":
            return { ...state, priority: action.payload };
        case "SET_DEADLINE":
            return { ...state, deadline: action.payload };
        case "ADD_SUBTASK":
            return {
                ...state,
                subTasks: [
                    ...state.subTasks,
                    { id: state.nextSubTaskId, title: "" },
                ],
                nextSubTaskId: state.nextSubTaskId + 1,
            };
        case "UPDATE_SUBTASK":
            return {
                ...state,
                subTasks: state.subTasks.map((st) =>
                    st.id === action.payload.id
                        ? { ...st, title: action.payload.title }
                        : st
                ),
            };
        case "REMOVE_SUBTASK":
            return {
                ...state,
                subTasks: state.subTasks.filter(
                    (st) => st.id !== action.payload
                ),
            };
        case "SET_LOADING":
            return { ...state, isLoading: action.payload };
        case "TOGGLE_DATE_PICKER":
            return {
                ...state,
                showDatePicker: action.payload ?? !state.showDatePicker,
            };
        case "RESET_FORM":
            return initialState;
        default:
            return state;
    }
}

// ===== UTILITY FUNCTIONS =====
const formatDate = (deadline: Date): string => {
    return deadline.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};

const validateForm = (state: TaskFormState): string | null => {
    if (!state.title.trim()) return "Task title is required";
    if (state.title.length > 100)
        return "Title must be less than 100 characters";
    if (state.description.length > 500)
        return "Description must be less than 500 characters";
    if (!state.deadline) return "Deadline is required"; // Validasi tambahan untuk deadline
    return null;
};

const showAlert = (title: string, message: string) => {
    Alert.alert(title, message, [{ text: "OK" }]);
};

// ===== ANIMATED SUBTASK COMPONENT =====
const AnimatedSubTask = React.memo(
    ({
        subTask,
        index,
        onRemove,
        onChange,
    }: {
        subTask: SubTask;
        index: number;
        onRemove: (id: number) => void;
        onChange: (id: number, value: string) => void;
    }) => {
        const height = useSharedValue(0);
        const opacity = useSharedValue(0);

        React.useEffect(() => {
            height.value = withTiming(60, { duration: 300 });
            opacity.value = withTiming(1, { duration: 300 });
        }, []);

        const animatedStyle = useAnimatedStyle(() => ({
            height: height.value,
            opacity: opacity.value,
            marginBottom: 8,
        }));

        const handleRemove = useCallback(() => {
            height.value = withTiming(0, { duration: 200 });
            opacity.value = withTiming(0, { duration: 200 }, (finished) => {
                if (finished) runOnJS(onRemove)(subTask.id);
            });
        }, [subTask.id, onRemove]);

        const handleChange = useCallback(
            (text: string) => {
                onChange(subTask.id, text);
            },
            [subTask.id, onChange]
        );

        return (
            <Animated.View style={animatedStyle}>
                <XStack alignItems="center" gap="$2">
                    <Input
                        flex={1}
                        placeholder={`Sub-Task ${index + 1}`}
                        focusStyle={{ borderColor: "$green10" }}
                        value={subTask.title}
                        onChangeText={handleChange}
                    />
                    <Button
                        icon={<X size={18} color="$red10" />}
                        size={25}
                        circular
                        backgroundColor="$red7"
                        animation="quick"
                        pressStyle={{
                            borderWidth: 0,
                            bg: "$red7",
                            scale: 0.9,
                        }}
                        onPress={handleRemove}
                    />
                </XStack>
            </Animated.View>
        );
    }
);

// ===== PRIORITY BUTTON COMPONENT =====
const PriorityButton = React.memo(
    ({
        priority,
        selectedPriority,
        onSelect,
        color,
    }: {
        priority: Priority;
        selectedPriority: Priority;
        onSelect: (priority: Priority) => void;
        color: string;
    }) => {
        const isSelected = selectedPriority === priority;
        const handlePress = useCallback(
            () => onSelect(priority),
            [priority, onSelect]
        );

        return (
            <Button
                flex={1}
                backgroundColor={isSelected ? `$${color}8` : `$${color}4`}
                borderWidth={isSelected ? 2 : 0}
                borderColor={isSelected ? `$${color}10` : "transparent"}
                onPress={handlePress}
                pressStyle={{
                    backgroundColor: `$${color}8`,
                    scale: 0.95,
                    ...(isSelected && {
                        borderColor: `$${color}10`,
                        borderWidth: 2,
                    }),
                }}
            >
                <XStack alignItems="center" gap="$2">
                    <XStack
                        width={8}
                        height={8}
                        backgroundColor={`$${color}10`}
                        borderRadius={99}
                    />
                    <Text
                        fontSize="$4"
                        color={isSelected ? "white" : `$${color}10`}
                        fontWeight={isSelected ? "bold" : "normal"}
                        textTransform="capitalize"
                    >
                        {priority}
                    </Text>
                </XStack>
            </Button>
        );
    }
);

// ===== MAIN COMPONENT =====
export function TaskDialog({
    open,
    onOpenChange,
    onSave,
    onCancel,
    onTaskCreated,
    taskToEdit,
}: TaskDialogProps) {
    const [state, dispatch] = useReducer(taskFormReducer, initialState);

    // ===== HANDLERS =====
    const handleSave = useCallback(async () => {
        const validationError = validateForm(state);
        if (validationError) {
            showAlert("Validation Error", validationError);
            return;
        }

        dispatch({ type: "SET_LOADING", payload: true });

        try {
            const userResult = await getCurrentUserId();
            if (!userResult.success || !userResult.data) {
                showAlert("Authentication Error", "Please login first");
                return;
            }

            const validSubTasks = state.subTasks
                .filter((st) => st.title.trim())
                .map((st) => ({ title: st.title.trim() }));

            const taskData: TaskFormData = {
                title: state.title.trim(),
                description: state.description.trim() || undefined,
                priority: state.priority,
                deadline: state.deadline,
                subTasks: validSubTasks,
            };

            let success = false;
            let errorMsg = "";

            if (taskToEdit?.id) {
                const result = await updateTask(taskToEdit.id, taskData);
                success = result.success;
                errorMsg = result.error || "Failed to update task";
            } else {
                const result = await createTask(taskData, userResult.data);
                success = result.success;
                errorMsg = result.error || "Failed to create task";
                if (success) {
                    onTaskCreated?.(result.data);
                }
            }

            if (success) {
                dispatch({ type: "RESET_FORM" });
                onOpenChange(false);
                onSave?.();
                showAlert("Success", taskToEdit ? "Task updated!" : "Task created!");
            } else {
                showAlert("Error", errorMsg);
            }

        } catch (error) {
            console.error("Error saving task:", error);
            showAlert("Error", "An unexpected error occurred");
        } finally {
            dispatch({ type: "SET_LOADING", payload: false });
        }
    }, [state, onTaskCreated, onOpenChange, onSave]);

    const handleCancel = useCallback(() => {
        dispatch({ type: "RESET_FORM" });
        onCancel?.();
    }, [onCancel]);

    const handleDateChange = useCallback((event: any, selectedDate?: Date) => {
        if (Platform.OS === "android") {
            dispatch({ type: "TOGGLE_DATE_PICKER", payload: false });
        }

        if (selectedDate) {
            dispatch({ type: "SET_DEADLINE", payload: selectedDate });
            if (Platform.OS === "ios") {
                dispatch({ type: "TOGGLE_DATE_PICKER", payload: false });
            }
        }
    }, []);

    const handleSubTaskChange = useCallback((id: number, title: string) => {
        dispatch({ type: "UPDATE_SUBTASK", payload: { id, title } });
    }, []);

    const handleRemoveSubTask = useCallback((id: number) => {
        dispatch({ type: "REMOVE_SUBTASK", payload: id });
    }, []);

    const handleAddSubTask = useCallback(() => {
        dispatch({ type: "ADD_SUBTASK" });
    }, []);

    const handlePrioritySelect = useCallback((priority: Priority) => {
        dispatch({ type: "SET_PRIORITY", payload: priority });
    }, []);

    React.useEffect(() => {
        console.log("taskToEdit changed:", taskToEdit);
        
        if (taskToEdit) {
            dispatch({ type: "RESET_FORM" });
            
            dispatch({ type: "SET_TITLE", payload: taskToEdit.title });
            dispatch({ type: "SET_DESCRIPTION", payload: taskToEdit.description ?? "" });
            dispatch({ type: "SET_PRIORITY", payload: taskToEdit.priority });
            
            if (taskToEdit.deadline) {
                let deadlineDate: Date | null = null;
                
                try {
                    const parsed = new Date(taskToEdit.deadline);
                    if (!isNaN(parsed.getTime())) {
                        deadlineDate = parsed;
                    } else {
                        console.warn("Could not parse deadline:", taskToEdit.deadline);
                    }
                } catch (error) {
                    console.warn("Error parsing deadline:", taskToEdit.deadline, error);
                }
                
                if (deadlineDate) {
                    dispatch({ type: "SET_DEADLINE", payload: deadlineDate });
                }
            }

            if (taskToEdit.sub_tasks && taskToEdit.sub_tasks.length > 0) {
                let nextId = 0;
                
                taskToEdit.sub_tasks.forEach((st) => {
                    dispatch({ type: "ADD_SUBTASK" });
                    dispatch({ 
                        type: "UPDATE_SUBTASK", 
                        payload: { id: nextId, title: st.title } 
                    });
                    nextId++;
                });
            }
        } else {
            dispatch({ type: "RESET_FORM" });
        }
    }, [taskToEdit, open]);

    // ===== MEMOIZED VALUES =====
    const priorityButtons = useMemo(
        () => (
            <XStack gap="$2">
                <PriorityButton
                    priority="high"
                    selectedPriority={state.priority}
                    onSelect={handlePrioritySelect}
                    color="red"
                />
                <PriorityButton
                    priority="medium"
                    selectedPriority={state.priority}
                    onSelect={handlePrioritySelect}
                    color="yellow"
                />
                <PriorityButton
                    priority="low"
                    selectedPriority={state.priority}
                    onSelect={handlePrioritySelect}
                    color="green"
                />
            </XStack>
        ),
        [state.priority, handlePrioritySelect]
    );

    const renderSubTask = useCallback(
        ({ item, index }: { item: SubTask; index: number }) => (
            <AnimatedSubTask
                subTask={item}
                index={index}
                onRemove={handleRemoveSubTask}
                onChange={handleSubTaskChange}
            />
        ),
        [handleRemoveSubTask, handleSubTaskChange]
    );

    const keyExtractor = useCallback((item: SubTask) => item.id.toString(), []);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay
                    key="overlay"
                    backgroundColor="$shadow6"
                    animation="quicker"
                    enterStyle={{ opacity: 0 }}
                    exitStyle={{ opacity: 0 }}
                />
                <Dialog.Content
                    bordered
                    m="$4"
                    elevate
                    borderColor="$green8"
                    borderWidth={2}
                    borderRadius="$6"
                    key="content"
                    animation="quicker"
                    enterStyle={{ opacity: 0, scale: 0.7 }}
                    exitStyle={{ opacity: 0, scale: 0.7 }}
                    gap="$4"
                    width="90%"
                    maxWidth={400}
                    minHeight={600}
                    maxHeight="85%"
                    alignSelf="center"
                >
                    <Dialog.Title 
                    fontSize="$8" 
                    fontWeight="bold" 
                    color="$green10">
                    {taskToEdit ? "Edit Task" : "Add Task"}
                    </Dialog.Title>

                    <Dialog.Description>
                        {taskToEdit
                            ? "Update your task details below."
                            : "Create a new task with optional sub-tasks and deadline."}
                    </Dialog.Description>

                    {/* Title Input */}
                    <YStack gap="$2">
                        <Text fontSize="$5" fontWeight="bold">
                            Task Title *
                        </Text>
                        <Input
                            placeholder="What needs to be done?"
                            focusStyle={{ borderColor: "$green10" }}
                            value={state.title}
                            onChangeText={(text) =>
                                dispatch({ type: "SET_TITLE", payload: text })
                            }
                            maxLength={100}
                        />
                    </YStack>

                    {/* Description Input */}
                    <YStack gap="$2">
                        <Text fontSize="$5" fontWeight="bold">
                            Description
                        </Text>
                        <Input
                            placeholder="Add details..."
                            focusStyle={{ borderColor: "$green10" }}
                            value={state.description}
                            onChangeText={(text) =>
                                dispatch({
                                    type: "SET_DESCRIPTION",
                                    payload: text,
                                })
                            }
                            maxLength={500}
                            multiline
                        />
                    </YStack>

                    {/* Priority Selection */}
                    <YStack gap="$2">
                        <Text fontSize="$5" fontWeight="bold">
                            Priority
                        </Text>
                        {priorityButtons}
                    </YStack>

                    {/* Deadline Section */}
                    <YStack gap="$2">
                        <XStack
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Text fontSize="$5" fontWeight="bold">
                                Deadline *
                            </Text>
                            {state.deadline && (
                                <Button
                                    icon={<X size={18} color="$red10" />}
                                    size={25}
                                    circular
                                    backgroundColor="$red7"
                                    animation="quick"
                                    pressStyle={{
                                        borderWidth: 0,
                                        bg: "$red7",
                                        scale: 0.9,
                                    }}
                                    onPress={() =>
                                        dispatch({
                                            type: "SET_DEADLINE",
                                            payload: null,
                                        })
                                    }
                                />
                            )}
                        </XStack>

                        <Button
                            icon={<Calendar size="$1" />}
                            backgroundColor={
                                state.deadline ? "$blue8" : "$gray8"
                            }
                            color="white"
                            animation="quick"
                            pressStyle={{
                                borderColor: state.deadline
                                    ? "$blue8"
                                    : "$gray8",
                                borderWidth: 2,
                                backgroundColor: state.deadline
                                    ? "$blue8"
                                    : "$gray8",
                                scale: 0.95,
                            }}
                            onPress={() =>
                                dispatch({
                                    type: "TOGGLE_DATE_PICKER",
                                    payload: true,
                                })
                            }
                        >
                            {state.deadline
                                ? formatDate(state.deadline)
                                : "Set Deadline"}
                        </Button>
                    </YStack>

                    {/* Sub-Tasks Section */}
                    <YStack gap="$2">
                        <XStack
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Text fontSize="$5" fontWeight="bold">
                                Sub-Tasks ({state.subTasks.length})
                            </Text>
                            <Button
                                icon={<Plus size={18} color="white" />}
                                bg="$green8"
                                animation="quick"
                                pressStyle={{
                                    borderWidth: 0,
                                    bg: "$green8",
                                    scale: 0.9,
                                }}
                                circular
                                size={25}
                                onPress={handleAddSubTask}
                            />
                        </XStack>

                        {state.subTasks.length > 0 ? (
                            <YStack maxHeight={150}>
                                <FlatList
                                    data={state.subTasks}
                                    renderItem={renderSubTask}
                                    keyExtractor={keyExtractor}
                                    showsVerticalScrollIndicator={false}
                                    removeClippedSubviews
                                    maxToRenderPerBatch={5}
                                    windowSize={5}
                                />
                            </YStack>
                        ) : (
                            <XStack
                                justifyContent="center"
                                alignItems="center"
                                backgroundColor="$gray6"
                                borderRadius={8}
                                padding="$3"
                            >
                                <Text color="$gray11" fontSize="$3">
                                    No sub-tasks yet. Click + to add one.
                                </Text>
                            </XStack>
                        )}
                    </YStack>

                    {/* Action Buttons */}
                    <XStack justifyContent="flex-end" gap="$2">
                        <Dialog.Close asChild>
                            <Button
                                onPress={handleCancel}
                                backgroundColor="$green4"
                                color="black"
                                animation="quick"
                                pressStyle={{
                                    borderWidth: 0,
                                    bg: "$green4",
                                    scale: 0.9,
                                }}
                                disabled={state.isLoading}
                            >
                                Cancel
                            </Button>
                        </Dialog.Close>
                        <Button
    onPress={handleSave}
    backgroundColor="$green10"
    color="white"
    animation="quick"
    pressStyle={{
        borderWidth: 0,
        bg: "$green10",
        scale: 0.9,
    }}
    disabled={
        state.isLoading ||
        !state.title.trim() ||
        !state.deadline
    }
    opacity={
        state.isLoading ||
        !state.title.trim() ||
        !state.deadline
            ? 0.6
            : 1
    }
>
    {state.isLoading 
        ? (taskToEdit ? "Updating..." : "Creating...") 
        : (taskToEdit ? "Update Task" : "Create Task")
    }
            </Button>
                    </XStack>
                </Dialog.Content>
            </Dialog.Portal>

            {/* Date Picker */}
            {state.showDatePicker && (
                <DateTimePicker
                    value={state.deadline || new Date()}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={handleDateChange}
                    minimumDate={new Date()}
                />
            )}
        </Dialog>
    );
}
