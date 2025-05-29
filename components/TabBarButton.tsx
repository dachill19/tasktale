import {
    BarChart2,
    BookOpen,
    CheckSquare,
    Layout,
} from "@tamagui/lucide-icons";
import React, { JSX, useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";

export type RouteName = "index" | "tasks" | "journals" | "analytics";

const TabBarButton = ({
    onPress = () => {},
    isFocused,
    routeName,
    label,
}: {
    onPress?: () => void;
    isFocused: boolean;
    routeName: RouteName;
    label: string;
}) => {
    const icon: Record<RouteName, (props: any) => JSX.Element> = {
        index: (props) => <Layout size={24} {...props} />,
        tasks: (props) => <CheckSquare size={24} {...props} />,
        journals: (props) => <BookOpen size={24} {...props} />,
        analytics: (props) => <BarChart2 size={24} {...props} />,
    };

    const scale = useSharedValue(0);

    useEffect(() => {
        scale.value = withSpring(
            typeof isFocused === "boolean" ? (isFocused ? 1 : 0) : isFocused,
            { duration: 350 }
        );
    }, [scale, isFocused]);

    const animatedIconStyle = useAnimatedStyle(() => {
        const scaleValue = interpolate(scale.value, [0, 1], [1, 1.3]);

        const top = interpolate(scale.value, [0, 1], [0, 12.5]);

        return {
            transform: [
                {
                    scale: scaleValue,
                },
            ],
            top,
        };
    });

    const animatedTextStyle = useAnimatedStyle(() => {
        const opacity = interpolate(scale.value, [0, 1], [1, 0]);

        return {
            opacity,
        };
    });

    return (
        <Pressable onPress={onPress} style={styles.tabBarItem}>
            <Animated.View style={animatedIconStyle}>
                {icon[routeName]({
                    color: isFocused ? "#fff" : "hsl(152, 57.5%, 37.6%)",
                })}
            </Animated.View>
            <Animated.Text
                style={[
                    {
                        color: isFocused ? "#fff" : "hsl(152, 57.5%, 37.6%)",
                        fontSize: 14,
                    },
                    animatedTextStyle,
                ]}
            >
                {label}
            </Animated.Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    tabBarItem: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
        alignSelf: "center",
    },
});

export default TabBarButton;
