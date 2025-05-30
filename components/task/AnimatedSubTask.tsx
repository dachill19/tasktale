import { SubTask } from "@/lib/task";
import { X } from "@tamagui/lucide-icons";
import React, { useCallback, useEffect } from "react";
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { Button, Input, XStack } from "tamagui";

interface AnimatedSubTaskProps {
  subTask: SubTask;
  index: number;
  onRemove: (id: string) => void;
  onChange: (title: string, id: string) => void;
}

export const AnimatedSubTask = React.memo(
  ({ subTask, index, onRemove, onChange }: AnimatedSubTaskProps) => {
    const height = useSharedValue(0);
    const opacity = useSharedValue(0);

    useEffect(() => {
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
        if (finished && subTask.id) runOnJS(onRemove)(subTask.id);
      });
    }, [subTask.id, onRemove]);

    const handleChange = useCallback(
      (text: string) => {
        if (subTask.id) onChange(text, subTask.id);
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
          {subTask.id && (
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
          )}
        </XStack>
      </Animated.View>
    );
  }
);