import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { ImageBackground } from "react-native";
import Animated, { SlideInDown } from "react-native-reanimated";
import { Button, Image, Input, Stack, Text, YStack } from "tamagui";

const backgroundImages = [
    require("@/assets/images/background1.png"),
    require("@/assets/images/background2.png"),
    require("@/assets/images/background3.png"),
];

export default function SignUpPage() {
    const [bgIndex, setBgIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setBgIndex(
                (prevIndex) => (prevIndex + 1) % backgroundImages.length
            );
        }, 5000); // ganti gambar tiap 5 detik

        return () => clearInterval(interval);
    }, []);

    return (
        <ImageBackground
            source={backgroundImages[bgIndex]}
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            resizeMode="cover"
        >
            <Animated.View
                entering={SlideInDown.springify()
                    .damping(100)
                    .mass(2)
                    .stiffness(70)}
                style={{
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                }}
            >
                <YStack
                    width="100%"
                    backgroundColor="rgba(255, 248, 186, 0.75)"
                    alignItems="center"
                    gap="$4"
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

                    <Stack gap="$4" width="100%">
                        <Input
                            placeholder="Email"
                            placeholderTextColor="$gray6"
                            backgroundColor="white"
                            borderColor="$gray4"
                            borderWidth={1}
                            borderRadius={50}
                            padding={10}
                            focusStyle={{ borderColor: "$yellow6" }}
                        />
                        <Input
                            placeholder="User Name"
                            placeholderTextColor="$gray6"
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
                            placeholderTextColor="$gray6"
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
                            placeholderTextColor="$gray6"
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
                        marginTop={20}
                    >
                        Register
                    </Button>
                    <Text fontSize="$5">or</Text>
                    <Image
                        source={require("@/assets/images/logo.png")}
                        width={50}
                        height={50}
                    />
                    <Text fontSize="$5" color="$gray12" fontWeight="bold">
                        Already Have Account?{" "}
                        <Link href="/login" asChild>
                            <Text color="$blue8" fontWeight="bold">
                                Login
                            </Text>
                        </Link>
                    </Text>
                </YStack>
            </Animated.View>
        </ImageBackground>
    );
}
