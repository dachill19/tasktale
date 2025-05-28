import { Calendar, Plus, X } from "@tamagui/lucide-icons";
import React, { useRef, useState } from "react";
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { Button, Dialog, Input, Text, XStack, YStack } from "tamagui";

// For React Native DateTimePicker
import DateTimePicker from "@react-native-community/datetimepicker";
import { FlatList, Platform } from "react-native";

// Database integration imports
import { supabase } from "../utils/supabase";
import { createTask, TaskFormData } from "../utils/task";

type TaskDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: () => void;
    onCancel?: () => void;
    onTaskCreated?: (task: any) => void;
};

type SubTask = {
    id: number;
};

function AnimatedInput({
    id,
    index,
    onRemove,
    onChange,
}: {
    id: number;
    index: number;
    onRemove: (id: number) => void;
    onChange: (id: number, value: string) => void;
}) {
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

    const handleRemove = () => {
        height.value = withTiming(0, { duration: 200 });
        opacity.value = withTiming(0, { duration: 200 }, (finished) => {
            if (finished) runOnJS(onRemove)(id);
        });
    };

    return (
        <Animated.View style={animatedStyle}>
            <XStack alignItems="center" gap="$2">
                <Input
                    flex={1}
                    placeholder={`Sub-Task ${index + 1}`}
                    focusStyle={{ borderColor: "$green10" }}
                    onChangeText={(text) => onChange(id, text)}
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

export function TaskDialog({
    open,
    onOpenChange,
    onSave,
    onCancel,
    onTaskCreated,
}: TaskDialogProps) {
    // Existing state
    const [subTasks, setSubTasks] = useState<SubTask[]>([]);
    const [nextId, setNextId] = useState(0);
    const [deadline, setDeadline] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedPriority, setSelectedPriority] = useState<
        "high" | "medium" | "low"
    >("medium");

    // New state for form handling and database integration
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const subTaskRefs = useRef<{ [key: number]: string }>({});

    const handleSubTaskChange = (id: number, value: string) => {
        subTaskRefs.current[id] = value;
    };

    const handleAddSubTask = () => {
        setSubTasks((prev) => [...prev, { id: nextId }]);
        setNextId((prev) => prev + 1);
    };

    const handleRemoveSubTask = (id: number) => {
        setSubTasks((prev) => prev.filter((subTask) => subTask.id !== id));
        // Clean up the ref for removed subtask
        delete subTaskRefs.current[id];
    };

    const renderSubTaskItem = ({
        item,
        index,
    }: {
        item: SubTask;
        index: number;
    }) => (
        <AnimatedInput
            id={item.id}
            index={index}
            onRemove={handleRemoveSubTask}
            onChange={handleSubTaskChange}
        />
    );

    const keyExtractor = (item: SubTask) => item.id.toString();

    const handleDateChange = (event: any, selectedDate?: Date) => {
        if (Platform.OS === "android") {
            setShowDatePicker(false);
        }

        if (selectedDate) {
            if (deadline) {
                const newDate = new Date(selectedDate);
                setDeadline(newDate);
            } else {
                setDeadline(selectedDate);
            }

            if (Platform.OS === "ios") {
                setShowDatePicker(false);
            }
        }
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const clearDeadline = () => {
        setDeadline(null);
    };

    const handleSave = async () => {
        if (!taskTitle.trim()) {
            alert('Please enter a task title');
            return;
        }

        setIsLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            
            if (!user) {
                alert('Please login first');
                setIsLoading(false);
                return;
            }

            const subTasksData = subTasks
                .map(subTask => ({
                    title: subTaskRefs.current[subTask.id] || ''
                }))
                .filter(subTask => subTask.title.trim() !== '');

            const taskData: TaskFormData = {
                title: taskTitle.trim(),
                description: taskDescription.trim() || undefined,
                priority: selectedPriority,
                deadline: deadline,
                subTasks: subTasksData,
            };

            const result = await createTask(taskData, user.id);

            if (result.success) {
                // Reset form
                setTaskTitle('');
                setTaskDescription('');
                setSelectedPriority('medium');
                setDeadline(null);
                setSubTasks([]);
                setNextId(0);
                subTaskRefs.current = {};

                if (onTaskCreated && result.data) {
                    onTaskCreated(result.data);
                }

                onOpenChange(false);
                if (onSave) onSave();
                alert('Task created successfully!');
            } else {
                alert(`Failed to create task: ${result.error}`);
            }
        } catch (error) {
            console.error('Error saving task:', error);
            alert('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setTaskTitle('');
        setTaskDescription('');
        setSelectedPriority('medium');
        setDeadline(null);
        setSubTasks([]);
        setNextId(0);
        subTaskRefs.current = {};
        if (onCancel) onCancel();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <Dialog.Trigger />
            <Dialog.Portal>
                <Dialog.Overlay
                    key="overlay"
                    backgroundColor="$shadow6"
                    animateOnly={["transform", "opacity"]}
                    animation={[
                        "quicker",
                        {
                            opacity: {
                                overshootClamping: true,
                            },
                        },
                    ]}
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
                    animateOnly={["transform", "opacity"]}
                    animation={[
                        "quicker",
                        {
                            opacity: {
                                overshootClamping: true,
                            },
                        },
                    ]}
                    enterStyle={{ x: 0, y: 0, opacity: 0, scale: 0.7 }}
                    exitStyle={{ x: 0, y: 0, opacity: 0, scale: 0.7 }}
                    gap="$4"
                >
                    <Dialog.Title
                        fontSize="$8"
                        fontWeight="bold"
                        color="$green10"
                    >
                        Add Task
                    </Dialog.Title>
                    <Dialog.Description>
                        Make changes to your task here. Click save when you're
                        done.
                    </Dialog.Description>

                    <YStack gap="$2">
                        <Text fontSize="$5" fontWeight="bold">
                            Task Title
                        </Text>
                        <Input
                            width="100%"
                            id="title"
                            placeholder="What needs to be done?"
                            focusStyle={{ borderColor: "$green10" }}
                            value={taskTitle}
                            onChangeText={setTaskTitle}
                        />
                    </YStack>
                    <YStack gap="$2">
                        <Text fontSize="$5" fontWeight="bold">
                            Description (optional)
                        </Text>
                        <Input
                            width="100%"
                            id="description"
                            placeholder="Add details..."
                            focusStyle={{ borderColor: "$green10" }}
                            value={taskDescription}
                            onChangeText={setTaskDescription}
                        />
                    </YStack>
                    <YStack gap="$2">
                        <Text fontSize="$5" fontWeight="bold">
                            Priority
                        </Text>
                        <XStack gap="$2">
                            <Button
                                flex={1}
                                backgroundColor={
                                    selectedPriority === "high"
                                        ? "$red8"
                                        : "$red4"
                                }
                                borderWidth={
                                    selectedPriority === "high" ? 2 : 0
                                }
                                borderColor={
                                    selectedPriority === "high"
                                        ? "$red10"
                                        : "transparent"
                                }
                                onPress={() => setSelectedPriority("high")}
                                pressStyle={{
                                    backgroundColor: "$red8",
                                    scale: 0.95,
                                    ...(selectedPriority === "high" && {
                                        borderColor: "$red10",
                                        borderWidth: 2,
                                    }),
                                }}
                            >
                                <XStack alignItems="center" gap="$2">
                                    <XStack
                                        width={8}
                                        height={8}
                                        backgroundColor="$red10"
                                        borderRadius={99}
                                    />
                                    <Text
                                        fontSize="$4"
                                        color={
                                            selectedPriority === "high"
                                                ? "white"
                                                : "$red10"
                                        }
                                        fontWeight={
                                            selectedPriority === "high"
                                                ? "bold"
                                                : "normal"
                                        }
                                    >
                                        High
                                    </Text>
                                </XStack>
                            </Button>

                            <Button
                                flex={1}
                                backgroundColor={
                                    selectedPriority === "medium"
                                        ? "$yellow8"
                                        : "$yellow4"
                                }
                                borderWidth={
                                    selectedPriority === "medium" ? 2 : 0
                                }
                                borderColor={
                                    selectedPriority === "medium"
                                        ? "$yellow10"
                                        : "transparent"
                                }
                                onPress={() => setSelectedPriority("medium")}
                                pressStyle={{
                                    backgroundColor: "$yellow8",
                                    scale: 0.95,
                                    ...(selectedPriority === "medium" && {
                                        borderColor: "$yellow10",
                                        borderWidth: 2,
                                    }),
                                }}
                            >
                                <XStack alignItems="center" gap="$2">
                                    <XStack
                                        width={8}
                                        height={8}
                                        backgroundColor="$yellow10"
                                        borderRadius={99}
                                    />
                                    <Text
                                        fontSize="$4"
                                        color={
                                            selectedPriority === "medium"
                                                ? "white"
                                                : "$yellow10"
                                        }
                                        fontWeight={
                                            selectedPriority === "medium"
                                                ? "bold"
                                                : "normal"
                                        }
                                    >
                                        Medium
                                    </Text>
                                </XStack>
                            </Button>

                            <Button
                                flex={1}
                                backgroundColor={
                                    selectedPriority === "low"
                                        ? "$green8"
                                        : "$green4"
                                }
                                borderWidth={selectedPriority === "low" ? 2 : 0}
                                borderColor={
                                    selectedPriority === "low"
                                        ? "$green10"
                                        : "transparent"
                                }
                                onPress={() => setSelectedPriority("low")}
                                pressStyle={{
                                    backgroundColor: "$green8",
                                    scale: 0.95,
                                    ...(selectedPriority === "low" && {
                                        borderColor: "$green10",
                                        borderWidth: 2,
                                    }),
                                }}
                            >
                                <XStack
                                    alignItems="center"
                                    justifyContent="center"
                                    gap="$2"
                                >
                                    <XStack
                                        width={8}
                                        height={8}
                                        backgroundColor="$green10"
                                        borderRadius={99}
                                    />
                                    <Text
                                        fontSize="$4"
                                        color={
                                            selectedPriority === "low"
                                                ? "white"
                                                : "$green10"
                                        }
                                        fontWeight={
                                            selectedPriority === "low"
                                                ? "bold"
                                                : "normal"
                                        }
                                    >
                                        Low
                                    </Text>
                                </XStack>
                            </Button>
                        </XStack>
                    </YStack>

                    {/* Deadline Section */}
                    <YStack gap="$2">
                        <XStack
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Text fontSize="$5" fontWeight="bold">
                                Deadline
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
                                    onPress={clearDeadline}
                                />
                            )}
                        </XStack>

                        {deadline ? (
                            <YStack gap="$2">
                                <XStack>
                                    <Button
                                        flex={1}
                                        icon={<Calendar size="$1" />}
                                        backgroundColor="$blue8"
                                        color="white"
                                        animation="quick"
                                        pressStyle={{
                                            borderColor: "$blue8",
                                            borderWidth: 2,
                                            backgroundColor: "$blue8",
                                            scale: 0.95,
                                        }}
                                        onPress={() => setShowDatePicker(true)}
                                    >
                                        {formatDate(deadline)}
                                    </Button>
                                </XStack>
                            </YStack>
                        ) : (
                            <Button
                                icon={<Calendar size="$1" />}
                                backgroundColor="$gray8"
                                color="white"
                                animation="quick"
                                pressStyle={{
                                    borderColor: "$gray8",
                                    borderWidth: 2,
                                    backgroundColor: "$gray8",
                                    scale: 0.95,
                                }}
                                onPress={() => setShowDatePicker(true)}
                            >
                                Set Deadline
                            </Button>
                        )}
                    </YStack>

                    <YStack gap="$2">
                        <XStack
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Text fontSize="$5" fontWeight="bold">
                                Sub-Task:
                            </Text>
                            <Button
                                icon={<Plus size={18} color="white" />}
                                bg="$green8"
                                circular
                                size={25}
                                borderWidth={0}
                                animation="quick"
                                pressStyle={{
                                    borderWidth: 0,
                                    bg: "$green8",
                                    scale: 0.9,
                                }}
                                onPress={handleAddSubTask}
                            />
                        </XStack>

                        {/* Scrollable SubTasks Container */}
                        {subTasks.length > 0 && (
                            <YStack maxHeight={150}>
                                <FlatList
                                    data={subTasks}
                                    renderItem={renderSubTaskItem}
                                    keyExtractor={keyExtractor}
                                    showsVerticalScrollIndicator={false}
                                    removeClippedSubviews={true}
                                    maxToRenderPerBatch={10}
                                    windowSize={10}
                                    initialNumToRender={5}
                                />
                            </YStack>
                        )}

                        {subTasks.length === 0 && (
                            <XStack
                                justifyContent="center"
                                alignItems="center"
                                backgroundColor="$gray8"
                                borderRadius={8}
                                height="$4"
                            >
                                <Text color="white" fontSize="$4">
                                    There are no sub-tasks yet. Click + to add.
                                </Text>
                            </XStack>
                        )}
                    </YStack>

                    <XStack justifyContent="flex-end" gap="$2">
                        <Dialog.Close asChild>
                            <Button
                                onPress={handleCancel}
                                aria-label="Cancel"
                                backgroundColor="$green4"
                                color="black"
                                animation="quick"
                                pressStyle={{
                                    borderWidth: 0,
                                    bg: "$green4",
                                    scale: 0.9,
                                }}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                        </Dialog.Close>
                        <Dialog.Close asChild>
                            <Button
                                onPress={handleSave}
                                aria-label="Save"
                                backgroundColor="$green10"
                                color="white"
                                animation="quick"
                                pressStyle={{
                                    borderWidth: 0,
                                    bg: "$green10",
                                    scale: 0.9,
                                }}
                                disabled={isLoading}
                                opacity={isLoading ? 0.6 : 1}
                            >
                                {isLoading ? 'Saving...' : 'Save'}
                            </Button>
                        </Dialog.Close>
                    </XStack>
                </Dialog.Content>
            </Dialog.Portal>

            {/* Date Picker */}
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
