import AnimatedAuthForm from "@/components/AnimatedAuthForm";
import { useEffect, useState } from "react";
import { ImageBackground } from "react-native";
import { Button, Image, Input, Stack, Text, YStack } from "tamagui";

const backgroundImages = [
    require("@/assets/images/background1.png"),
    require("@/assets/images/background2.png"),
    require("@/assets/images/background3.png"),
];

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(false);
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
                    <LoginForm switchToSignup={() => setIsLogin(false)} />
                </AnimatedAuthForm>
            ) : (
                <AnimatedAuthForm key="signup">
                    <SignupForm switchToLogin={() => setIsLogin(true)} />
                </AnimatedAuthForm>
            )}
        </ImageBackground>
    );
}

function LoginForm({ switchToSignup }: { switchToSignup: () => void }) {
    return (
        <YStack
            width="100%"
            backgroundColor="rgba(255, 248, 186, 0.75)"
            alignItems="center"
            gap="$5"
            padding={30}
            borderTopLeftRadius={40}
            borderTopRightRadius={40}
        >
            <YStack alignItems="center" gap="$2">
                <Text fontSize="$9" fontWeight="bold" color="$gray12">
                    Sign In
                </Text>
                <Text fontSize="$4" color="$gray12">
                    Please Sign in to Continue
                </Text>
            </YStack>

            <Stack gap="$5" width="100%">
                <Input
                    placeholder="Email"
                    placeholderTextColor="$gray10"
                    backgroundColor="white"
                    borderColor="$gray4"
                    borderWidth={1}
                    borderRadius={50}
                    padding={10}
                    focusStyle={{ borderColor: "$yellow6" }}
                />
                <Input
                    placeholder="Password"
                    secureTextEntry
                    placeholderTextColor="$gray10"
                    backgroundColor="white"
                    borderColor="$gray4"
                    borderWidth={1}
                    borderRadius={50}
                    padding={10}
                    focusStyle={{ borderColor: "$yellow6" }}
                />
            </Stack>
            <Button
                backgroundColor="#4CAF50"
                color="white"
                fontSize="$8"
                fontWeight="bold"
                borderRadius={20}
                width="100%"
                height="$5"
            >
                Login
            </Button>
            <Text fontSize="$5">or</Text>
            <Image
                source={require("@/assets/images/google_icon.png")}
                width={50}
                height={50}
            />
            <Text fontSize="$5" color="$gray12" fontWeight="bold">
                Don't have an account?{" "}
                <Text color="$blue8" fontWeight="bold" onPress={switchToSignup}>
                    Sign Up
                </Text>
            </Text>
        </YStack>
    );
}

function SignupForm({ switchToLogin }: { switchToLogin: () => void }) {
    return (
        <YStack
            width="100%"
            backgroundColor="rgba(255, 248, 186, 0.75)"
            alignItems="center"
            gap="$5"
            padding={30}
            borderTopLeftRadius={40}
            borderTopRightRadius={40}
        >
            <YStack alignItems="center" gap="$2">
                <Text fontSize="$9" fontWeight="bold" color="$gray12">
                    Sign Up
                </Text>
                <Text fontSize="$4" color="$gray12">
                    Enter your Personal Information
                </Text>
            </YStack>

            <Stack gap="$5" width="100%">
                <Input
                    placeholder="User Name"
                    placeholderTextColor="$gray10"
                    backgroundColor="white"
                    borderColor="$gray4"
                    borderWidth={1}
                    borderRadius={50}
                    padding={10}
                    focusStyle={{ borderColor: "$yellow6" }}
                />
                <Input
                    placeholder="Email"
                    placeholderTextColor="$gray10"
                    backgroundColor="white"
                    borderColor="$gray4"
                    borderWidth={1}
                    borderRadius={50}
                    padding={10}
                    focusStyle={{ borderColor: "$yellow6" }}
                />
                <Input
                    placeholder="Password"
                    secureTextEntry
                    placeholderTextColor="$gray10"
                    backgroundColor="white"
                    borderColor="$gray4"
                    borderWidth={1}
                    borderRadius={50}
                    padding={10}
                    focusStyle={{ borderColor: "$yellow6" }}
                />
                <Input
                    placeholder="Confirm Password"
                    secureTextEntry
                    placeholderTextColor="$gray10"
                    backgroundColor="white"
                    borderColor="$gray4"
                    borderWidth={1}
                    borderRadius={50}
                    padding={10}
                    focusStyle={{ borderColor: "$yellow6" }}
                />
            </Stack>
            <Button
                backgroundColor="#4CAF50"
                color="white"
                fontSize="$8"
                fontWeight="bold"
                borderRadius={20}
                width="100%"
                height="$5"
            >
                Register
            </Button>
            <Text fontSize="$5" color="$gray12" fontWeight="bold">
                Already Have Account?{" "}
                <Text color="$blue8" fontWeight="bold" onPress={switchToLogin}>
                    Login
                </Text>
            </Text>
        </YStack>
    );
}
