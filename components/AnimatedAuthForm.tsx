import { usePathname } from "expo-router";
import React from "react";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";

type AnimatedAuthFormProps = {
    children: React.ReactNode;
    style?: any;
};

export default function AnimatedAuthForm({
    children,
    style,
}: AnimatedAuthFormProps) {
    const pathname = usePathname(); // dapatkan path route sekarang

    return (
        <Animated.View
            key={pathname} // paksa remount tiap route berubah
            entering={SlideInDown.delay(300)
                .springify()
                .damping(100)
                .mass(2)
                .stiffness(70)}
            exiting={SlideOutDown.springify()
                .damping(100)
                .mass(2)
                .stiffness(70)}
            style={[{ position: "absolute", bottom: 0, width: "100%" }, style]}
        >
            {children}
        </Animated.View>
    );
}
