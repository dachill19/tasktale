import { TabBar } from "@/components/TabBar";
import { useAuthStore } from "@/lib/stores/authStore";
import { useUserInfo } from "@/lib/stores/profileStore"; // Added for profile info
import { Bell, LogOut, Plus, User } from "@tamagui/lucide-icons";
import { router, Tabs } from "expo-router";
import React, { useState } from "react";
import { Alert, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    Avatar,
    Button,
    Image,
    Popover,
    Separator,
    Sheet,
    Text,
    View,
    XStack,
    YStack,
} from "tamagui";

function Header() {
    const { user, signOut } = useAuthStore();
    const [showUserMenu, setShowUserMenu] = useState(false);

    // Get user info using the helper hook
    const { userName, userEmail, userAvatar } = useUserInfo(user);

    const handleProfilePress = () => {
        setShowUserMenu(false);
        router.push("/profile");
    };

    const handleLogout = () => {
        Alert.alert("Logout", "Are you sure you want to logout?", [
            {
                text: "Cancel",
                style: "cancel",
            },
            {
                text: "Logout",
                style: "destructive",
                onPress: () => {
                    signOut();
                    setShowUserMenu(false);
                },
            },
        ]);
    };

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
                        {/* Notification Button */}
                        <Button
                            chromeless
                            circular
                            size="$3"
                            onPress={() => console.log("Notification clicked!")}
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

                        {/* User Avatar with Popover Menu */}
                        <Popover
                            open={showUserMenu}
                            onOpenChange={setShowUserMenu}
                            placement="bottom-end"
                        >
                            <Popover.Trigger asChild>
                                <TouchableOpacity>
                                    <Avatar circular size="$5">
                                        {userAvatar ? (
                                            <Avatar.Image
                                                accessibilityLabel={userName}
                                                src={userAvatar}
                                            />
                                        ) : (
                                            <Avatar.Fallback
                                                backgroundColor="$blue10"
                                                alignItems="center"
                                                justifyContent="center"
                                            >
                                                <User size={24} color="white" />
                                            </Avatar.Fallback>
                                        )}
                                    </Avatar>
                                </TouchableOpacity>
                            </Popover.Trigger>

                            <Popover.Content
                                bg="$background"
                                borderWidth={1}
                                borderColor="$borderColor"
                                borderRadius="$4"
                                padding="$4"
                                elevation={5}
                                shadowColor="$shadowColor"
                                shadowOffset={{ width: 0, height: 2 }}
                                shadowOpacity={0.25}
                                shadowRadius={3.84}
                            >
                                <YStack gap="$3" minWidth={200}>
                                    {/* User Info */}
                                    <YStack gap="$1">
                                        <Text
                                            fontSize="$5"
                                            fontWeight="bold"
                                            color="$color12"
                                        >
                                            {userName}
                                        </Text>
                                        <Text fontSize="$3" color="$color10">
                                            {userEmail}
                                        </Text>
                                    </YStack>

                                    <Separator />

                                    {/* Profile Button - Now navigates to profile page */}
                                    <Button
                                        size="$3"
                                        backgroundColor="transparent"
                                        color="$color11"
                                        justifyContent="flex-start"
                                        icon={<User size={16} />}
                                        onPress={handleProfilePress}
                                        pressStyle={{
                                            backgroundColor: "$color3",
                                            scale: 0.98,
                                        }}
                                    >
                                        Profile
                                    </Button>

                                    <Separator />

                                    {/* Logout Button */}
                                    <Button
                                        size="$3"
                                        backgroundColor="transparent"
                                        color="$red10"
                                        justifyContent="flex-start"
                                        icon={<LogOut size={16} />}
                                        onPress={handleLogout}
                                        pressStyle={{
                                            backgroundColor: "$red3",
                                            scale: 0.98,
                                        }}
                                    >
                                        Logout
                                    </Button>
                                </YStack>
                            </Popover.Content>
                        </Popover>
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
                        Add New
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
                                pathname: "/journals",
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

            {/* Floating Action Button */}
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
                <Tabs.Screen name="journals" options={{ title: "Journals" }} />
                <Tabs.Screen
                    name="analytics"
                    options={{ title: "Analytics" }}
                />
            </Tabs>
        </View>
    );
}