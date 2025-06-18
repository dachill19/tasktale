import React, { useCallback } from "react";
import { Button, Text, XStack } from "tamagui";

type Priority = "high" | "medium" | "low";

interface PriorityButtonProps {
    priority: Priority;
    selectedPriority: Priority;
    onSelect: (priority: Priority) => void;
    color: string;
}

export const PriorityButton = React.memo(
    ({ priority, selectedPriority, onSelect, color }: PriorityButtonProps) => {
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
