import AnimatedAuthForm from "@/components/auth/AnimatedAuthForm";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import { useAuthFormStore } from "@/lib/stores/authFormStore";
import { useEffect, useState } from "react";
import { ImageBackground } from "react-native";

const backgroundImages = [
    require("@/assets/images/background1.png"),
    require("@/assets/images/background2.png"),
    require("@/assets/images/background3.png"),
];

export default function AuthPage() {
    const { isLogin } = useAuthFormStore();
    const [bgIndex, setBgIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setBgIndex(
                (prevIndex) => (prevIndex + 1) % backgroundImages.length
            );
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <ImageBackground
            source={backgroundImages[bgIndex]}
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            resizeMode="cover"
        >
            {isLogin ? (
                <AnimatedAuthForm key="login">
                    <LoginForm />
                </AnimatedAuthForm>
            ) : (
                <AnimatedAuthForm key="signup">
                    <SignupForm />
                </AnimatedAuthForm>
            )}
        </ImageBackground>
    );
}
