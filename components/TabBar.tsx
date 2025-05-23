import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useState } from "react";
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

    return (
        <YStack position="absolute" bottom={0} width="100%">
            <YStack
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                backgroundColor="$background" // atau langsung "#fff"
                paddingVertical="$3" // 15px jika $1 = 4px
                elevation={2}
                borderTopWidth={2}
                borderColor="$borderColor" // opsional, bisa custom warna
                onLayout={onTabBarLayout}
            >
                <Animated.View
                    style={[
                        animatedStyle,
                        {
                            position: "absolute",
                            backgroundColor: "#388e3c",
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
                        tabPositionX.value = withSpring(buttonWidth * index, {
                            duration: 1500,
                        });
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
