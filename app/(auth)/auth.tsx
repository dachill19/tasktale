import AnimatedAuthForm from "@/components/AnimatedAuthForm";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ImageBackground, TouchableOpacity } from "react-native";
import { Button, Image, Input, Stack, Text, YStack } from "tamagui";

import { loginWithEmail, loginWithGoogle, signupWithEmail } from "@/utils/auth";

const backgroundImages = [
    require("@/assets/images/background1.png"),
    require("@/assets/images/background2.png"),
    require("@/assets/images/background3.png"),
];

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
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
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const { error } = await loginWithEmail(email, password);
            if (error) {
                setError(error.message);
            } else {
                router.replace("/(main)");
            }
        } catch {
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

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
                    value={email}
                    onChangeText={setEmail}
                    placeholderTextColor="$gray10"
                    backgroundColor="white"
                    borderColor="$gray4"
                    borderWidth={1}
                    borderRadius={50}
                    padding={10}
                    focusStyle={{ borderColor: "$yellow6" }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    disabled={loading}
                />
                <Input
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholderTextColor="$gray10"
                    backgroundColor="white"
                    borderColor="$gray4"
                    borderWidth={1}
                    borderRadius={50}
                    padding={10}
                    focusStyle={{ borderColor: "$yellow6" }}
                    disabled={loading}
                />
            </Stack>

            {error ? <Text color="red">{error}</Text> : null}

            <Button
                onPress={handleLogin}
                backgroundColor="#4CAF50"
                color="white"
                fontSize="$8"
                fontWeight="bold"
                borderRadius={20}
                width="100%"
                height="$5"
                disabled={loading}
                opacity={loading ? 0.6 : 1}
            >
                {loading ? "Signing In..." : "Login"}
            </Button>

            <Text fontSize="$5">or</Text>

            <TouchableOpacity
                onPress={() => loginWithGoogle(router, setLoading, setError)}
                disabled={loading}
                style={{ opacity: loading ? 0.6 : 1 }}
            >
                <YStack alignItems="center" gap="$2">
                    <Image
                        source={require("@/assets/images/google_icon.png")}
                        width={50}
                        height={50}
                    />
                    <Text fontSize="$3" color="$gray11">
                        {loading ? "Connecting..." : "Continue with Google"}
                    </Text>
                </YStack>
            </TouchableOpacity>

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
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        if (!username || !email || !password || !confirmPassword) {
            setError("Please fill in all fields");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const { error } = await signupWithEmail(username, email, password);
            if (error) {
                setError(error.message);
            } else {
                Alert.alert(
                    "Check your email",
                    "We've sent you a confirmation link to complete your registration.",
                    [{ text: "OK", onPress: () => switchToLogin() }]
                );
            }
        } catch {
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

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
                    value={username}
                    onChangeText={setUsername}
                    placeholderTextColor="$gray10"
                    backgroundColor="white"
                    borderColor="$gray4"
                    borderWidth={1}
                    borderRadius={50}
                    padding={10}
                    focusStyle={{ borderColor: "$yellow6" }}
                    disabled={loading}
                />
                <Input
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    placeholderTextColor="$gray10"
                    backgroundColor="white"
                    borderColor="$gray4"
                    borderWidth={1}
                    borderRadius={50}
                    padding={10}
                    focusStyle={{ borderColor: "$yellow6" }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    disabled={loading}
                />
                <Input
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholderTextColor="$gray10"
                    backgroundColor="white"
                    borderColor="$gray4"
                    borderWidth={1}
                    borderRadius={50}
                    padding={10}
                    focusStyle={{ borderColor: "$yellow6" }}
                    disabled={loading}
                />
                <Input
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    placeholderTextColor="$gray10"
                    backgroundColor="white"
                    borderColor="$gray4"
                    borderWidth={1}
                    borderRadius={50}
                    padding={10}
                    focusStyle={{ borderColor: "$yellow6" }}
                    disabled={loading}
                />
            </Stack>

            {error ? <Text color="red">{error}</Text> : null}

            <Button
                onPress={handleSignup}
                backgroundColor="#4CAF50"
                color="white"
                fontSize="$8"
                fontWeight="bold"
                borderRadius={20}
                width="100%"
                height="$5"
                disabled={loading}
                opacity={loading ? 0.6 : 1}
            >
                {loading ? "Creating Account..." : "Register"}
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
