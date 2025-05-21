import React from "react";
import { styled, Text, ToggleGroup } from "tamagui";

const Item = styled(ToggleGroup.Item, {
    unstyled: true,
    flex: 1,
    alignItems: "center",
    backgroundColor: "$background",
    color: "$gray9",
    paddingVertical: "$3",
    paddingHorizontal: "$2",
    borderWidth: 2,
    borderColor: "$gray8",
    borderRadius: "$3",
    pressStyle: {
        backgroundColor: "$color4",
    },
    variants: {
        active: {
            true: {
                borderColor: "$color10",
                backgroundColor: "$color4",
                color: "$color10",
            },
        },
    },
});

type ToggleItem = {
    value: string;
    label: string;
};

type FilterToggleGroupProps = {
    items: ToggleItem[];
    selectedValue: string;
    onValueChange: (value: string) => void;
};

const FilterToggleGroup = ({
    items,
    selectedValue,
    onValueChange,
}: FilterToggleGroupProps) => {
    return (
        <ToggleGroup
            width="100%"
            orientation="horizontal"
            borderRadius="$4"
            type="single"
            mb="$4"
            value={selectedValue}
            onValueChange={onValueChange}
        >
            {items.map((item, index) => (
                <Item
                    key={item.value}
                    value={item.value}
                    aria-label={item.label}
                    active={selectedValue === item.value}
                    marginLeft={index === 0 ? 0 : -2}
                >
                    <Text fontWeight="bold">{item.label}</Text>
                </Item>
            ))}
        </ToggleGroup>
    );
};

export default FilterToggleGroup;
