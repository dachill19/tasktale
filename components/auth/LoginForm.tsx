import { useAuthFormStore } from "@/lib/stores/authFormStore";
import { useAuthStore } from "@/lib/stores/authStore";
import { Alert, TouchableOpacity } from "react-native";
import { Button, Image, Input, Stack, Text, YStack } from "tamagui";

export default function LoginForm() {
    const { signInWithEmail, signInWithGoogle, isLoading } = useAuthStore();
    const {
        email,
        password,
        error,
        setEmail,
        setPassword,
        setError,
        switchForm,
        validateLoginForm,
    } = useAuthFormStore();

    const handleLogin = async () => {
        const validationError = validateLoginForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setError("");
        const result = await signInWithEmail(email, password);

        if (result.error) {
            setError(result.error);
        }
    };

    const handleGoogleLogin = async () => {
        setError("");
        const result = await signInWithGoogle();

        if (result.error) {
            setError(result.error);
            Alert.alert("Login Error", result.error);
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
                    disabled={isLoading}
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
                    disabled={isLoading}
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
                disabled={isLoading}
                opacity={isLoading ? 0.6 : 1}
            >
                {isLoading ? "Signing In..." : "Login"}
            </Button>

            <Text fontSize="$5">or</Text>

            <TouchableOpacity
                onPress={handleGoogleLogin}
                disabled={isLoading}
                style={{ opacity: isLoading ? 0.6 : 1 }}
            >
                <YStack alignItems="center" gap="$2">
                    <Image
                        source={require("@/assets/images/google_icon.png")}
                        width={50}
                        height={50}
                    />
                    <Text fontSize="$3" color="$gray11">
                        {isLoading ? "Connecting..." : "Continue with Google"}
                    </Text>
                </YStack>
            </TouchableOpacity>

            <Text fontSize="$5" color="$gray12" fontWeight="bold">
                Don't have an account?{" "}
                <Text color="$blue8" fontWeight="bold" onPress={switchForm}>
                    Sign Up
                </Text>
            </Text>
        </YStack>
    );
}
