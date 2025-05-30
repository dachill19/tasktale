import { useAuthFormStore } from "@/lib/stores/authFormStore";
import { useAuthStore } from "@/lib/stores/authStore";
import { Alert } from "react-native";
import { Button, Input, Stack, Text, YStack } from "tamagui";

export default function SignupForm() {
    const { signUpWithEmail, isLoading } = useAuthStore();
    const {
        username,
        email,
        password,
        confirmPassword,
        error,
        setUsername,
        setEmail,
        setPassword,
        setConfirmPassword,
        setError,
        switchForm,
        validateSignupForm,
    } = useAuthFormStore();

    const handleSignup = async () => {
        const validationError = validateSignupForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setError("");
        const result = await signUpWithEmail(username, email, password);

        if (result.error) {
            setError(result.error);
        } else {
            Alert.alert(
                "Check your email",
                "We've sent you a confirmation link to complete your registration.",
                [{ text: "OK", onPress: switchForm }]
            );
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
                    disabled={isLoading}
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
                    disabled={isLoading}
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
                disabled={isLoading}
                opacity={isLoading ? 0.6 : 1}
            >
                {isLoading ? "Creating Account..." : "Register"}
            </Button>

            <Text fontSize="$5" color="$gray12" fontWeight="bold">
                Already Have Account?{" "}
                <Text color="$blue8" fontWeight="bold" onPress={switchForm}>
                    Login
                </Text>
            </Text>
        </YStack>
    );
}
