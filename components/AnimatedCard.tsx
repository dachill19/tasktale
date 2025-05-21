import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { Pressable } from "react-native";
import Animated, {
    FadeInDown,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";

type AnimatedCardProps = {
    index: number;
    children: React.ReactNode;
};

const AnimatedCard = ({ index, children }: AnimatedCardProps) => {
    const [animationKey, setAnimationKey] = useState(0);
    const scale = useSharedValue(1);

    useFocusEffect(
        useCallback(() => {
            setAnimationKey((prev) => prev + 1);
        }, [])
    );

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    return (
        <Animated.View
            key={animationKey}
            entering={FadeInDown.delay(index * 200)
                .duration(500)
                .delay(500)}
        >
            <Pressable
                onPressIn={() => {
                    scale.value = withSpring(0.95, { damping: 10 });
                }}
                onPressOut={() => {
                    scale.value = withSpring(1, { damping: 10 });
                }}
            >
                <Animated.View style={animatedStyle}>{children}</Animated.View>
            </Pressable>
        </Animated.View>
    );
};

export default AnimatedCard;
