import { Link } from "expo-router";
import { Button, Image, Text, YStack } from "tamagui";

export default function LandingPage() {
    return (
        <YStack
            flex={1}
            height="100%"
            alignItems="center"
            justifyContent="space-between"
            backgroundColor="$yellow4"
            py="$12"
            px="$6"
            gap="$4"
        >
            <YStack alignItems="center">
                <Text fontSize="$11" fontWeight="bold" color="$blue10">
                    Welcome to
                </Text>
                <Text fontSize="$11" fontWeight="bold" color="$green10">
                    TaskTale!
                </Text>
            </YStack>

            <Image
                source={require("@/assets/images/logo.png")}
                width={200}
                height={200}
                borderRadius={12}
            />

            <Text
                fontSize="$9"
                color="$green8"
                fontWeight="bold"
                textAlign="center"
                px="$6"
            >
                Share Your Day &{" "}
                <Text color="$blue8" fontWeight="bold">
                    Manage Your Task
                </Text>
                , All in {""}
                <Text color="$blue8" fontWeight="bold">
                    ONE {""}
                </Text>
                Place
            </Text>

            <Link href="/auth" asChild>
                <Button
                    backgroundColor="#4CAF50"
                    color="white"
                    fontSize="$8"
                    fontWeight="bold"
                    borderRadius={100}
                    width="80%"
                    height="$5"
                    animation="quick"
                    pressStyle={{
                        bg: "#4CAF50",
                        scale: 0.9,
                    }}
                >
                    Get Started
                </Button>
            </Link>

            <Text
                fontSize="$3"
                color="$green8"
                marginTop="$2"
                textAlign="center"
            >
                “Your Loyal and Productive Friend is HERE”
            </Text>
        </YStack>
    );
}
