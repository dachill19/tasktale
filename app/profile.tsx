import { useAuthStore } from "@/lib/stores/authStore";
import { useJournalStore } from "@/lib/stores/journalStore";
import { useProfileStore, useUserInfo } from "@/lib/stores/profileStore";
import { useTaskStore } from "@/lib/stores/taskStore";
import {
    ArrowLeft,
    BookOpen,
    Calendar,
    CheckSquare,
    User,
} from "@tamagui/lucide-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Dimensions, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    Avatar,
    Button,
    Card,
    Input,
    ScrollView,
    Text,
    View,
    XStack,
    YStack,
} from "tamagui";

const { width, height } = Dimensions.get("window");

export default function Profile() {
    const { user, signOut } = useAuthStore();
    const { tasks } = useTaskStore();
    const { journals } = useJournalStore();
    const { updateProfile, isLoading, error, clearError } = useProfileStore();

    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    const { userName, userEmail, userAvatar, userPhone, accountCreated } =
        useUserInfo(user);

    const totalTasks = tasks?.length || 0;
    const totalJournals = journals?.length || 0;

    useEffect(() => {
        setName(userName);
        setPhoneNumber(userPhone);
        clearError();
    }, [user, userName, userPhone, clearError]);

    const handleSaveProfile = async () => {
        if (!name.trim()) {
            Alert.alert("Error", "Name cannot be empty");
            return;
        }

        const result = await updateProfile({
            full_name: name.trim(),
            phone: phoneNumber.trim(),
        });

        if (result.error) {
            Alert.alert("Error", result.error);
        } else {
            setIsEditing(false);
            Alert.alert("Success", "Profile updated successfully");
        }
    };

    const handleCancelEdit = () => {
        setName(userName);
        setPhoneNumber(userPhone);
        setIsEditing(false);
        clearError();
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
                onPress: () => signOut(),
            },
        ]);
    };

    return (
        <ImageBackground
            source={require("@/assets/images/logo.png")}
            style={{ flex: 1, width, height }}
            resizeMode="cover"
        >
            <View flex={1} backgroundColor="rgba(255, 255, 255, 0.95)">
                <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
                    {/* Header */}
                    <XStack
                        w="100%"
                        bg="$background"
                        borderBottomWidth={1}
                        borderBottomColor="$borderColor"
                        py="$4"
                        px="$4"
                        ai="center"
                        gap="$3"
                    >
                        <Button
                            chromeless
                            circular
                            size="$3"
                            onPress={() => router.back()}
                            pressStyle={{
                                backgroundColor: "$color3",
                                scale: 0.9,
                            }}
                        >
                            <ArrowLeft size={20} color="$color12" />
                        </Button>
                        <Text fontSize="$7" fontWeight="bold" color="$color12">
                            Profile
                        </Text>
                    </XStack>

                    <ScrollView flex={1} showsVerticalScrollIndicator={false}>
                        <YStack flex={1} p="$4" gap="$4">
                            {/* Profile Header */}
                            <Card
                                elevate
                                size="$4"
                                bordered
                                backgroundColor="$background"
                                borderRadius="$6"
                                p="$4"
                            >
                                <YStack ai="center" gap="$3">
                                    <Avatar circular size="$8">
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
                                                <User size={32} color="white" />
                                            </Avatar.Fallback>
                                        )}
                                    </Avatar>
                                    <YStack ai="center" gap="$1">
                                        <Text
                                            fontSize="$7"
                                            fontWeight="bold"
                                            color="$color12"
                                        >
                                            {userName}
                                        </Text>
                                        <Text fontSize="$4" color="$color10">
                                            {userEmail}
                                        </Text>
                                        {accountCreated && (
                                            <Text fontSize="$3" color="$color9">
                                                Member since {accountCreated}
                                            </Text>
                                        )}
                                    </YStack>
                                </YStack>
                            </Card>

                            {/* Stats Cards */}
                            <XStack gap="$3">
                                <Card
                                    flex={1}
                                    elevate
                                    size="$4"
                                    bordered
                                    backgroundColor="$green2"
                                    borderColor="$green8"
                                    borderRadius="$4"
                                    p="$3"
                                >
                                    <YStack ai="center" gap="$2">
                                        <CheckSquare
                                            size={24}
                                            color="$green10"
                                        />
                                        <Text
                                            fontSize="$6"
                                            fontWeight="bold"
                                            color="$green11"
                                        >
                                            {totalTasks}
                                        </Text>
                                        <Text
                                            fontSize="$3"
                                            color="$green10"
                                            textAlign="center"
                                        >
                                            Total Tasks
                                        </Text>
                                    </YStack>
                                </Card>

                                <Card
                                    flex={1}
                                    elevate
                                    size="$4"
                                    bordered
                                    backgroundColor="$blue2"
                                    borderColor="$blue8"
                                    borderRadius="$4"
                                    p="$3"
                                >
                                    <YStack ai="center" gap="$2">
                                        <BookOpen size={24} color="$blue10" />
                                        <Text
                                            fontSize="$6"
                                            fontWeight="bold"
                                            color="$blue11"
                                        >
                                            {totalJournals}
                                        </Text>
                                        <Text
                                            fontSize="$3"
                                            color="$blue10"
                                            textAlign="center"
                                        >
                                            Total Journals
                                        </Text>
                                    </YStack>
                                </Card>
                            </XStack>

                            {/* Account Info */}
                            <Card
                                elevate
                                size="$4"
                                bordered
                                backgroundColor="$background"
                                borderRadius="$6"
                                p="$4"
                            >
                                <YStack gap="$3">
                                    <XStack ai="center" gap="$2">
                                        <Calendar size={20} color="$color10" />
                                        <Text
                                            fontSize="$5"
                                            fontWeight="600"
                                            color="$color12"
                                        >
                                            Account Information
                                        </Text>
                                    </XStack>
                                    <YStack gap="$2" ml="$6">
                                        <Text fontSize="$4" color="$color10">
                                            <Text fontWeight="600">
                                                Created:
                                            </Text>{" "}
                                            {accountCreated}
                                        </Text>
                                        <Text fontSize="$4" color="$color10">
                                            <Text fontWeight="600">Email:</Text>{" "}
                                            {userEmail}
                                        </Text>
                                    </YStack>
                                </YStack>
                            </Card>

                            {/* Profile Information */}
                            <Card
                                elevate
                                size="$4"
                                bordered
                                backgroundColor="$background"
                                borderRadius="$6"
                                p="$4"
                            >
                                <YStack gap="$4">
                                    <XStack jc="space-between" ai="center">
                                        <Text
                                            fontSize="$6"
                                            fontWeight="bold"
                                            color="$green10"
                                        >
                                            Profile Information
                                        </Text>
                                        <Button
                                            size="$3"
                                            variant="outlined"
                                            borderColor="$green8"
                                            color="$green10"
                                            onPress={() =>
                                                setIsEditing(!isEditing)
                                            }
                                            pressStyle={{
                                                backgroundColor: "$green3",
                                                scale: 0.95,
                                            }}
                                        >
                                            {isEditing ? "Cancel" : "Edit"}
                                        </Button>
                                    </XStack>

                                    {/* Show error if exists */}
                                    {error && (
                                        <Card
                                            backgroundColor="$red2"
                                            borderColor="$red8"
                                            p="$3"
                                        >
                                            <Text fontSize="$3" color="$red10">
                                                {error}
                                            </Text>
                                        </Card>
                                    )}

                                    <YStack gap="$3">
                                        <YStack gap="$2">
                                            <Text
                                                fontSize="$4"
                                                fontWeight="600"
                                                color="$color11"
                                            >
                                                Name
                                            </Text>
                                            {isEditing ? (
                                                <Input
                                                    value={name}
                                                    onChangeText={setName}
                                                    placeholder="Enter your name"
                                                    size="$4"
                                                    borderColor="$green8"
                                                    focusStyle={{
                                                        borderColor: "$green10",
                                                    }}
                                                />
                                            ) : (
                                                <Text
                                                    fontSize="$4"
                                                    color="$color10"
                                                >
                                                    {name || "Not set"}
                                                </Text>
                                            )}
                                        </YStack>

                                        <YStack gap="$2">
                                            <Text
                                                fontSize="$4"
                                                fontWeight="600"
                                                color="$color11"
                                            >
                                                Phone Number
                                            </Text>
                                            {isEditing ? (
                                                <Input
                                                    value={phoneNumber}
                                                    onChangeText={
                                                        setPhoneNumber
                                                    }
                                                    placeholder="Enter your phone number"
                                                    size="$4"
                                                    keyboardType="phone-pad"
                                                    borderColor="$green8"
                                                    focusStyle={{
                                                        borderColor: "$green10",
                                                    }}
                                                />
                                            ) : (
                                                <Text
                                                    fontSize="$4"
                                                    color="$color10"
                                                >
                                                    {phoneNumber || "Not set"}
                                                </Text>
                                            )}
                                        </YStack>

                                        {isEditing && (
                                            <XStack gap="$3" mt="$2">
                                                <Button
                                                    flex={1}
                                                    size="$4"
                                                    variant="outlined"
                                                    borderColor="$color8"
                                                    color="$color11"
                                                    onPress={handleCancelEdit}
                                                    disabled={isLoading}
                                                    pressStyle={{
                                                        backgroundColor:
                                                            "$color3",
                                                        scale: 0.95,
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    flex={2}
                                                    size="$4"
                                                    bg="$green10"
                                                    color="white"
                                                    fontWeight="bold"
                                                    onPress={handleSaveProfile}
                                                    disabled={isLoading}
                                                    opacity={
                                                        isLoading ? 0.5 : 1
                                                    }
                                                    pressStyle={{
                                                        backgroundColor:
                                                            "$green9",
                                                        scale: 0.95,
                                                    }}
                                                >
                                                    {isLoading
                                                        ? "Saving..."
                                                        : "Save Changes"}
                                                </Button>
                                            </XStack>
                                        )}
                                    </YStack>
                                </YStack>
                            </Card>

                            {/* Logout Button */}
                            <Button
                                size="$5"
                                bg="$red10"
                                color="white"
                                fontSize="$5"
                                fontWeight="bold"
                                onPress={handleLogout}
                                mt="$4"
                                mb="$8"
                                pressStyle={{
                                    backgroundColor: "$red9",
                                    scale: 0.95,
                                }}
                            >
                                Logout
                            </Button>
                        </YStack>
                    </ScrollView>
                </SafeAreaView>
            </View>
        </ImageBackground>
    );
}
