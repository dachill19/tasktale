import { TabBar } from "@/components/TabBar";
import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, Button, Image, Text, XStack, YStack } from "tamagui";

function Header() {
    return (
        <SafeAreaView edges={["top"]}>
            <YStack
                w="100%"
                bg="$background"
                borderBottomWidth={2}
                borderBottomColor="$borderColor"
                py="$4"
                px="$4"
            >
                <XStack jc="space-between" ai="center">
                    {/* Logo dan Nama App */}
                    <XStack ai="center" gap="$2">
                        <Image
                            source={require("@/assets/images/logo.png")}
                            width={48}
                            height={48}
                            borderRadius={8}
                        />
                        <Text
                            fontSize="$7"
                            fontFamily="$display"
                            fontWeight="bold"
                            color="$color10"
                        >
                            TaskTale
                        </Text>
                    </XStack>

                    {/* Notifikasi dan Avatar */}
                    <XStack ai="center" gap="$3">
                        <Button
                            chromeless
                            circular
                            size="$3"
                            onPress={() => console.log("Tombol diklik!")}
                        >
                            <Feather name="bell" size={20} color="#000" />
                            <YStack
                                position="absolute"
                                top={2}
                                right={2}
                                width={8}
                                height={8}
                                bg="$color8"
                                borderRadius={999}
                            />
                        </Button>

                        <TouchableOpacity>
                            <Avatar circular size="$5">
                                <Avatar.Image
                                    accessibilityLabel="Cam"
                                    src="https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80"
                                />
                                <Avatar.Fallback backgroundColor="$blue10" />
                            </Avatar>
                        </TouchableOpacity>
                    </XStack>
                </XStack>
            </YStack>
        </SafeAreaView>
    );
}

export default function Layout() {
    return (
        <Tabs
            tabBar={(props) => <TabBar {...props} />}
            screenOptions={{
                header: () => <Header />,
            }}
        >
            <Tabs.Screen name="index" options={{ title: "Dashboard" }} />
            <Tabs.Screen name="tasks" options={{ title: "Tugas" }} />
            <Tabs.Screen name="journal" options={{ title: "Jurnal" }} />
            <Tabs.Screen name="analytics" options={{ title: "Analisis" }} />
        </Tabs>
    );
}
