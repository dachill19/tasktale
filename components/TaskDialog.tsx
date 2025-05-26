import { Plus, X } from "@tamagui/lucide-icons";
import React, { useState } from "react";
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { Button, Dialog, Input, Label, Text, XStack, YStack } from "tamagui";

type TaskDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: () => void;
    onCancel?: () => void;
};

type SubTask = {
    id: number;
};

function AnimatedInput({
    id,
    index,
    onRemove,
}: {
    id: number;
    index: number;
    onRemove: (id: number) => void;
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
                    placeholder={`SubTask ${index + 1}`}
                    focusStyle={{ borderColor: "$green10" }}
                />
                <Button
                    icon={<X size="$1" color="$red10" />}
                    size="$2"
                    circular
                    backgroundColor="$red7"
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
}: TaskDialogProps) {
    const [subTasks, setSubTasks] = useState<SubTask[]>([]);
    const [nextId, setNextId] = useState(0);

    const handleAddSubTask = () => {
        setSubTasks((prev) => [...prev, { id: nextId }]);
        setNextId((prev) => prev + 1);
    };

    const handleRemoveSubTask = (id: number) => {
        setSubTasks((prev) => prev.filter((subTask) => subTask.id !== id));
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <Dialog.Trigger asChild>
                <Button>Click Me</Button>
            </Dialog.Trigger>
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
                    gap="$2"
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

                    <YStack gap="$1">
                        <Label htmlFor="title">Task Title</Label>
                        <Input
                            width="100%"
                            id="title"
                            placeholder="Apa yang perlu dilakukan?"
                            focusStyle={{ borderColor: "$green10" }}
                        />
                    </YStack>
                    <YStack gap="$1">
                        <Label htmlFor="description">
                            Description (optional)
                        </Label>
                        <Input
                            width="100%"
                            id="description"
                            placeholder="Tambahkan detail..."
                            focusStyle={{ borderColor: "$green10" }}
                        />
                    </YStack>
                    <YStack gap="$1">
                        <XStack
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Text>SubTask:</Text>
                            <Button
                                icon={<Plus size="$1" color="white" />}
                                bg="$green8"
                                circular
                                size="$2"
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
                        {/* Tombol Plus */}

                        {/* Input dinamis */}
                        <YStack gap="$1">
                            {subTasks.map((subTask, idx) => (
                                <AnimatedInput
                                    key={subTask.id}
                                    id={subTask.id}
                                    index={idx}
                                    onRemove={handleRemoveSubTask}
                                />
                            ))}
                        </YStack>
                    </YStack>

                    <XStack justifyContent="flex-end" gap="$2">
                        <Dialog.Close asChild>
                            <Button
                                onPress={onCancel}
                                aria-label="Cancel"
                                themeInverse
                            >
                                Cancel
                            </Button>
                        </Dialog.Close>
                        <Dialog.Close asChild>
                            <Button
                                onPress={onSave}
                                aria-label="Save"
                                marginRight="$2"
                            >
                                Save
                            </Button>
                        </Dialog.Close>
                    </XStack>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog>
    );
}
