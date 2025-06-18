import { AnimatedSubTask } from "@/components/task/AnimatedSubTask";
import { PriorityButton } from "@/components/task/PriorityButton";
import { useTaskDialogStore } from "@/lib/stores/taskDialogStore";
import { useTaskStore } from "@/lib/stores/taskStore";
import { SubTask } from "@/lib/task";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Calendar, Plus, X } from "@tamagui/lucide-icons";
import { DateTime } from "luxon";
import React, { useCallback, useEffect, useMemo } from "react";
import { Alert, FlatList, Platform } from "react-native";
import { Button, Dialog, Input, Text, TextArea, XStack, YStack } from "tamagui";

interface TaskDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave?: () => void;
    onCancel?: () => void;
}

const validateForm = (state: {
    title: string;
    description: string;
    deadline: Date | null;
}): string | null => {
    if (!state.title.trim()) return "Task title is required";
    if (state.title.length > 100)
        return "Title must be less than 100 characters";
    if (state.description.length > 500)
        return "Description must be less than 500 characters";
    if (!state.deadline) return "Deadline is required";
    return null;
};

const showAlert = (title: string, message: string) => {
    Alert.alert(title, message, [{ text: "OK" }]);
};

const formatDate = (deadline: Date): string => {
    return DateTime.fromJSDate(deadline)
        .toLocal()
        .toLocaleString({
            day: "numeric",
            month: "long",
            year: "numeric",
        });
};

export function TaskDialog({
    open,
    onOpenChange,
    onSave,
    onCancel,
}: TaskDialogProps) {
    const {
        title,
        description,
        priority,
        deadline,
        subTasks,
        isLoading,
        showDatePicker,
        setTitle,
        setDescription,
        setPriority,
        setDeadline,
        addSubTask,
        updateSubTask,
        removeSubTask,
        setLoading,
        toggleDatePicker,
        resetForm,
        populateForm,
    } = useTaskDialogStore();

    const { createTask, updateTask, currentUserId, taskToEdit, tasks } =
        useTaskStore();

    const shouldFixButtons = tasks.length >= 2;

    useEffect(() => {
        if (open) {
            if (taskToEdit) {
                console.log("Populating form with taskToEdit:", taskToEdit);
                populateForm(taskToEdit);
            } else {
                console.log("Resetting form for new task");
                resetForm();
            }
        }
    }, [open, taskToEdit, populateForm, resetForm]);

    const handleSave = useCallback(async () => {
        const validationError = validateForm({ title, description, deadline });
        if (validationError) {
            showAlert("Validation Error", validationError);
            return;
        }

        setLoading(true);
        try {
            if (!currentUserId) {
                showAlert("Authentication Error", "Please login first");
                return;
            }

            const validSubTasks = subTasks
                .filter((st) => st.title.trim())
                .map((st) => ({ title: st.title.trim() }));

            const taskData = {
                title: title.trim(),
                description: description.trim() || undefined,
                priority,
                deadline,
                subTasks: validSubTasks,
            };

            let success = false;
            let errorMsg = "";

            if (taskToEdit?.id) {
                const result = await updateTask(taskToEdit.id, taskData);
                success = result.success;
                errorMsg = result.error || "Failed to update task";
            } else {
                const result = await createTask(taskData, currentUserId);
                success = result.success;
                errorMsg = result.error || "Failed to create task";
            }

            if (success) {
                resetForm();
                onOpenChange(false);
                onSave?.();
                showAlert(
                    "Success",
                    taskToEdit ? "Task updated!" : "Task created!"
                );
            } else {
                showAlert("Error", errorMsg);
            }
        } catch (error) {
            console.error("Error saving task:", error);
            showAlert("Error", "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    }, [
        title,
        description,
        priority,
        deadline,
        subTasks,
        taskToEdit,
        currentUserId,
        createTask,
        updateTask,
        onOpenChange,
        onSave,
        resetForm,
        setLoading,
    ]);

    const handleCancel = useCallback(() => {
        resetForm();
        onCancel?.();
        onOpenChange(false);
    }, [onCancel, resetForm, onOpenChange]);

    const handleDateChange = useCallback(
        (event: any, selectedDate?: Date) => {
            if (Platform.OS === "android") {
                toggleDatePicker(false);
            }
            if (selectedDate) {
                setDeadline(selectedDate);
                if (Platform.OS === "ios") {
                    toggleDatePicker(false);
                }
            }
        },
        [setDeadline, toggleDatePicker]
    );

    const renderSubTask = useCallback(
        ({ item, index }: { item: SubTask; index: number }) => (
            <AnimatedSubTask
                subTask={item}
                index={index}
                onRemove={removeSubTask}
                onChange={(title, id) => updateSubTask(id, title)}
            />
        ),
        [removeSubTask, updateSubTask]
    );

    const keyExtractor = useCallback(
        (item: SubTask) => item.id ?? `temp-${Math.random()}`,
        []
    );

    const priorityButtons = useMemo(
        () => (
            <XStack gap="$2">
                <PriorityButton
                    priority="high"
                    selectedPriority={priority}
                    onSelect={setPriority}
                    color="red"
                />
                <PriorityButton
                    priority="medium"
                    selectedPriority={priority}
                    onSelect={setPriority}
                    color="yellow"
                />
                <PriorityButton
                    priority="low"
                    selectedPriority={priority}
                    onSelect={setPriority}
                    color="green"
                />
            </XStack>
        ),
        [priority, setPriority]
    );

    const getButtonText = () => {
        if (isLoading) {
            if (taskToEdit) {
                return "Updating...";
            } else {
                return "Creating...";
            }
        } else {
            if (taskToEdit) {
                return "Update";
            } else {
                return "Create";
            }
        }
    };

    const getDialogTitle = () => {
        if (taskToEdit) {
            return "Edit Task";
        } else {
            return "Add Task";
        }
    };

    const getDialogDescription = () => {
        if (taskToEdit) {
            return "Update your task details below.";
        } else {
            return "Create a new task with optional sub-task and deadline.";
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay
                    key="overlay"
                    backgroundColor="$shadow6"
                    animation="quick"
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
                    animation="quick"
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
                        color="$green10"
                    >
                        {getDialogTitle()}
                    </Dialog.Title>
                    <Dialog.Description>
                        {getDialogDescription()}
                    </Dialog.Description>

                    <YStack gap="$2">
                        <Text fontSize="$5" fontWeight="bold">
                            Task Title *
                        </Text>
                        <Input
                            placeholder="What needs to be done?"
                            focusStyle={{ borderColor: "$green10" }}
                            value={title}
                            onChangeText={setTitle}
                            maxLength={100}
                        />
                    </YStack>

                    <YStack gap="$2">
                        <Text fontSize="$5" fontWeight="bold">
                            Description
                        </Text>
                        <TextArea
                            placeholder="Add details..."
                            focusStyle={{ borderColor: "$green10" }}
                            value={description}
                            onChangeText={setDescription}
                            maxLength={500}
                            multiline
                        />
                    </YStack>

                    <YStack gap="$2">
                        <Text fontSize="$5" fontWeight="bold">
                            Priority
                        </Text>
                        {priorityButtons}
                    </YStack>

                    <YStack gap="$2">
                        <XStack
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Text fontSize="$5" fontWeight="bold">
                                Deadline *
                            </Text>
                            {deadline && (
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
                                    onPress={() => setDeadline(null)}
                                />
                            )}
                        </XStack>
                        <Button
                            icon={<Calendar size="$1" />}
                            backgroundColor={deadline ? "$blue8" : "$gray8"}
                            color="white"
                            animation="quick"
                            pressStyle={{
                                borderColor: deadline ? "$blue8" : "$gray8",
                                borderWidth: 2,
                                backgroundColor: deadline ? "$blue8" : "$gray8",
                                scale: 0.95,
                            }}
                            onPress={() => toggleDatePicker(true)}
                        >
                            {deadline ? formatDate(deadline) : "Set Deadline"}
                        </Button>
                    </YStack>

                    <YStack gap="$2">
                        <XStack
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Text fontSize="$5" fontWeight="bold">
                                Sub-Tasks ({subTasks.length})
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
                                onPress={addSubTask}
                            />
                        </XStack>
                        {subTasks.length > 0 ? (
                            <YStack maxHeight={150}>
                                <FlatList
                                    data={subTasks}
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

                    {/* Add padding bottom when buttons are fixed */}
                    {shouldFixButtons && <YStack height="$6" />}

                    <XStack 
                        justifyContent="flex-end" 
                        gap="$2"
                        {...(shouldFixButtons && {
                            position: "absolute",
                            bottom: "$4",
                            right: "$4",
                            left: "$4",
                            backgroundColor: "white",
                            paddingTop: "$2",
                            borderTopWidth: 1,
                            borderTopColor: "$gray6"
                        })}
                    >
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
                                disabled={isLoading}
                                opacity={isLoading ? 0.6 : 1}
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
                            disabled={isLoading || !title.trim() || !deadline}
                            opacity={
                                isLoading || !title.trim() || !deadline
                                    ? 0.6
                                    : 1
                            }
                        >
                            {getButtonText()}
                        </Button>
                    </XStack>
                </Dialog.Content>
            </Dialog.Portal>

            {showDatePicker && (
                <DateTimePicker
                    value={deadline || new Date()}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={handleDateChange}
                    minimumDate={new Date()}
                />
            )}
        </Dialog>
    );
}