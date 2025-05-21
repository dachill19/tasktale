import { useEffect } from "react";
import { Dimensions, ImageBackground } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

const backgroundImages = [
    require("@/assets/images/background1.png"),
    require("@/assets/images/background2.png"),
    require("@/assets/images/background3.png"),
];

export default function FadeBackgroundWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const index = useSharedValue(0);
    const opacity = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    useEffect(() => {
        const interval = setInterval(() => {
            // Fade out
            opacity.value = withTiming(
                0,
                {
                    duration: 800,
                    easing: Easing.out(Easing.ease),
                },
                () => {
                    // Setelah fade out selesai, ganti gambar dan fade in
                    index.value = (index.value + 1) % backgroundImages.length;

                    opacity.value = withTiming(1, {
                        duration: 800,
                        easing: Easing.in(Easing.ease),
                    });
                }
            );
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Animated.View
            style={[{ width, height, position: "absolute" }, animatedStyle]}
        >
            <ImageBackground
                source={backgroundImages[index.value]}
                style={{ flex: 1, width: "100%", height: "100%" }}
                resizeMode="cover"
            />
        </Animated.View>
    );
}
