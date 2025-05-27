import { TabBar } from "@/components/TabBar";
import { Bell, Plus } from "@tamagui/lucide-icons";
import { router, Tabs } from "expo-router";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    Avatar,
    Button,
    Image,
    Sheet,
    Text,
    View,
    XStack,
    YStack,
} from "tamagui";

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
                            fontSize="$8"
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
                            <Bell size={20} color="#000" />
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
    const [openSheet, setOpenSheet] = useState(false);

    return (
        <View flex={1} position="relative">
            {/* Sheet muncul dari bawah */}
            <Sheet
                open={openSheet}
                onOpenChange={setOpenSheet}
                modal
                dismissOnSnapToBottom
                snapPoints={[30]}
                animation="medium"
            >
                <Sheet.Overlay />
                <Sheet.Handle />
                <Sheet.Frame
                    padding="$4"
                    gap="$4"
                    backgroundColor="$background"
                >
                    <Text fontSize="$8" fontWeight="bold" color="$green10">
                        Tambah Baru
                    </Text>
                    <Button
                        size="$5"
                        bg="$green10"
                        color="white"
                        fontSize="$6"
                        fontWeight="bold"
                        animation="quick"
                        pressStyle={{
                            bg: "$green8",
                            borderColor: "$green10",
                            borderWidth: 2,
                            scale: 0.9,
                        }}
                        onPress={() => {
                            console.log("Tambah Tugas");
                            setOpenSheet(false);
                            router.push({
                                pathname: "/tasks",
                                params: {
                                    openDialog: "true",
                                },
                            });
                        }}
                    >
                        Add Task
                    </Button>
                    <Button
                        size="$5"
                        bg="$blue10"
                        color="white"
                        fontSize="$6"
                        fontWeight="bold"
                        animation="quick"
                        pressStyle={{
                            bg: "$blue8",
                            borderColor: "$blue10",
                            borderWidth: 2,
                            scale: 0.9,
                        }}
                        onPress={() => {
                            console.log("Tambah Jurnal");
                            setOpenSheet(false);
                            router.push({
                                pathname: "/journal",
                                params: {
                                    openDialog: "true",
                                },
                            });
                        }}
                    >
                        Add Journal
                    </Button>
                </Sheet.Frame>
            </Sheet>
            <Button
                icon={<Plus size="$3" color="white" />}
                size="$6"
                bg="$green10"
                circular
                position="absolute"
                bottom="$14"
                right="$4"
                zIndex={999}
                onPress={() => setOpenSheet(true)}
                animation="quick"
                pressStyle={{
                    bg: "$green8",
                    scale: 0.9,
                }}
            />

            <Tabs
                tabBar={(props) => <TabBar {...props} />}
                screenOptions={{
                    header: () => <Header />,
                }}
            >
                <Tabs.Screen name="index" options={{ title: "Dashboard" }} />
                <Tabs.Screen name="tasks" options={{ title: "Tasks" }} />
                <Tabs.Screen name="journal" options={{ title: "Journals" }} />
                <Tabs.Screen
                    name="analytics"
                    options={{ title: "Analytics" }}
                />
            </Tabs>
        </View>
    );
}
