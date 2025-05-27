import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useEffect, useState } from "react";
import { LayoutChangeEvent } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import { YStack } from "tamagui";
import type { RouteName } from "./TabBarButton";
import TabBarButton from "./TabBarButton";

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const [dimensions, setDimensions] = useState({ height: 20, width: 100 });
    const buttonWidth = dimensions.width / state.routes.length;
    const onTabBarLayout = (e: LayoutChangeEvent) => {
        setDimensions({
            height: e.nativeEvent.layout.height,
            width: e.nativeEvent.layout.width,
        });
    };

    const tabPositionX = useSharedValue(0);
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: tabPositionX.value }],
        };
    });

    useEffect(() => {
        tabPositionX.value = withSpring(buttonWidth * state.index, {
            damping: 20,
            stiffness: 200,
        });
    }, [state.index, buttonWidth]);

    return (
        <YStack position="absolute" bottom={0} width="100%">
            <YStack
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                backgroundColor="$background"
                paddingVertical="$3"
                elevation={2}
                borderTopWidth={2}
                borderColor="$borderColor"
                onLayout={onTabBarLayout}
            >
                <Animated.View
                    style={[
                        animatedStyle,
                        {
                            position: "absolute",
                            backgroundColor: "hsl(152, 57.5%, 37.6%)",
                            borderRadius: 40,
                            marginHorizontal: 8,
                            height: dimensions.height - 20,
                            width: buttonWidth - 16,
                        },
                    ]}
                />
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const label =
                        typeof options.tabBarLabel === "string"
                            ? options.tabBarLabel
                            : typeof options.title === "string"
                            ? options.title
                            : route.name;

                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: "tabPress",
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name, route.params);
                        }
                    };

                    return (
                        <TabBarButton
                            key={route.name}
                            onPress={onPress}
                            isFocused={isFocused}
                            routeName={route.name as RouteName}
                            label={label}
                        />
                    );
                })}
            </YStack>
            <YStack height={20} backgroundColor="$background" />
        </YStack>
    );
}
