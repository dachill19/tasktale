import {
    Calendar,
    Check,
    CheckSquare,
    Edit3,
    Trash2,
} from "@tamagui/lucide-icons";
import React from "react";
import { TouchableOpacity } from "react-native";
import { Checkbox, Stack, styled, Text, XStack, YStack } from "tamagui";

const CustomCheckbox = styled(Checkbox, {
    unstyled: true,
    alignItems: "center",
    justifyContent: "center",
    width: 23,
    height: 23,
    borderWidth: 2,
    backgroundColor: "$color4",
    borderColor: "$color8",
    borderRadius: "$10",
});

const CustomIndicator = styled(Checkbox.Indicator, {
    name: "CustomCheckboxIndicator",
    unstyled: true,
    alignItems: "center",
    justifyContent: "center",
    width: 23,
    height: 23,
    borderWidth: 2,
    borderRadius: "$10",
    borderColor: "$color8",
    backgroundColor: "$color8",
});

interface SubTask {
    title: string;
    completed: boolean;
}

interface TaskCardProps {
    title: string;
    description?: string;
    priority: "Tinggi" | "Sedang" | "Rendah";
    date: string;
    completedCount?: number;
    totalCount?: number;
    subTasks?: SubTask[];
    completed?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
    title,
    description,
    priority,
    date,
    completedCount,
    totalCount,
    subTasks = [],
    completed = false,
    onEdit = () => {},
    onDelete = () => {},
}) => {
    const getBgPriorityColor = () => {
        switch (priority) {
            case "Tinggi":
                return "$red4";
            case "Sedang":
                return "$yellow4";
            case "Rendah":
                return "$green4";
            default:
                return "$gray4";
        }
    };

    const getPriorityColor = () => {
        switch (priority) {
            case "Tinggi":
                return "$red10";
            case "Sedang":
                return "#eab308";
            case "Rendah":
                return "$green10";
            default:
                return "$gray10";
        }
    };

    const getCheckboxColor = () => {
        switch (priority) {
            case "Tinggi":
                return "$red4";
            case "Sedang":
                return "$yellow4";
            case "Rendah":
                return "$green4";
            default:
                return "$gray4";
        }
    };

    const getCheckedColor = () => {
        switch (priority) {
            case "Tinggi":
                return "$red10";
            case "Sedang":
                return "$yellow10";
            case "Rendah":
                return "$green10";
            default:
                return "$gray10";
        }
    };

    return (
        <YStack
            backgroundColor="$background"
            borderRadius="$4"
            borderWidth={2}
            borderColor="$gray8"
            padding="$4"
            marginBottom="$4"
            position="relative"
            width="100%"
            elevation={2}
            animation="quick"
            pressStyle={{
                scale: 0.95, // opsional, beri efek scale saat ditekan
            }}
        >
            <XStack
                justifyContent="space-between"
                marginBottom="$2"
                alignItems="center"
                width="100%"
            >
                <XStack gap="$2" alignItems="center">
                    <CustomCheckbox
                        backgroundColor={getCheckboxColor()}
                        borderColor={getCheckedColor()}
                        // checked={completed}
                    >
                        <CustomIndicator
                            backgroundColor={getCheckedColor()}
                            borderColor={getCheckedColor()}
                        >
                            <Check color="white" size={15} />
                        </CustomIndicator>
                    </CustomCheckbox>
                    <Text
                        fontSize="$4"
                        fontWeight="bold"
                        textDecorationLine={completed ? "line-through" : "none"}
                        color={completed ? "$gray10" : "$gray12"}
                    >
                        {title}
                    </Text>
                </XStack>
                <XStack gap="$2" alignItems="center">
                    <TouchableOpacity onPress={onEdit}>
                        <Edit3 size="$1" color="$blue10" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onDelete}>
                        <Trash2 size="$1" color="$red10" />
                    </TouchableOpacity>
                </XStack>
            </XStack>

            <YStack flex={1} gap="$2">
                {description && (
                    <Text fontSize="$3" color="$gray11">
                        {description}
                    </Text>
                )}

                <XStack alignItems="center" gap="$2" flexWrap="wrap">
                    <XStack
                        bg={getBgPriorityColor()}
                        alignItems="center"
                        px="$2"
                        py="$1"
                        borderRadius="$10"
                        gap="$1"
                    >
                        <Stack
                            width={8}
                            height={8}
                            backgroundColor={getPriorityColor()}
                            borderRadius={99}
                        />
                        <Text fontSize="$1" color={getPriorityColor()}>
                            {priority}
                        </Text>
                    </XStack>

                    <XStack
                        alignItems="center"
                        bg="$blue4"
                        px="$2"
                        py="$1"
                        borderRadius="$10"
                        gap="$1"
                    >
                        <Calendar size={12} color="$blue10" />
                        <Text fontSize="$1" color="$blue10">
                            {date}
                        </Text>
                    </XStack>

                    {typeof completedCount !== "undefined" &&
                        typeof totalCount !== "undefined" && (
                            <XStack
                                alignItems="center"
                                bg="$purple4"
                                px="$2"
                                py="$1"
                                borderRadius="$10"
                                gap="$1"
                            >
                                <CheckSquare size={12} color="$purple10" />
                                <Text fontSize="$1" color="$purple10">
                                    {completedCount}/{totalCount}
                                </Text>
                            </XStack>
                        )}
                </XStack>
            </YStack>

            {subTasks.length > 0 && (
                <YStack
                    mt="$2"
                    pt="$2"
                    // pl={26}
                    borderTopWidth={1}
                    borderTopColor="$color4"
                    gap="$2"
                >
                    <Text fontSize="$3" color="$gray10">
                        Sub-tugas:
                    </Text>
                    {subTasks.map((sub, index) => (
                        <XStack key={index} alignItems="center" gap="$2">
                            <CustomCheckbox
                                backgroundColor={getCheckboxColor()}
                                borderColor={getCheckedColor()}
                                // checked={completed}
                            >
                                <CustomIndicator
                                    backgroundColor={getCheckedColor()}
                                    borderColor={getCheckedColor()}
                                >
                                    <Check color="white" size={15} />
                                </CustomIndicator>
                            </CustomCheckbox>
                            <Text
                                fontSize="$4"
                                color={sub.completed ? "$gray9" : "$gray11"}
                                textDecorationLine={
                                    sub.completed ? "line-through" : "none"
                                }
                            >
                                {sub.title}
                            </Text>
                        </XStack>
                    ))}
                </YStack>
            )}
        </YStack>
    );
};

export default TaskCard;
