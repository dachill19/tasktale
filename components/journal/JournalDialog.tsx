import { useJournalDialogStore } from "@/lib/stores/journalDialogStore";
import { Plus, X } from "@tamagui/lucide-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect } from "react";
import { Alert, FlatList } from "react-native";
import {
    Button,
    Dialog,
    Image,
    Input,
    Text,
    TextArea,
    XStack,
    YStack,
} from "tamagui";

type JournalFormData = {
    mood: string;
    content: string;
    images: Array<{ url: string; isLocal?: boolean }>;
    tags: string;
};

type JournalDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (data: JournalFormData) => void;
    onCancel?: () => void;
};

const moodOptions = [
    { value: "happy", label: "😊", name: "Happy" },
    { value: "excited", label: "🤩", name: "Excited" },
    { value: "calm", label: "😌", name: "Calm" },
    { value: "neutral", label: "😐", name: "Neutral" },
    { value: "tired", label: "😫", name: "Tired" },
    { value: "sad", label: "😢", name: "Sad" },
    { value: "angry", label: "😠", name: "Angry" },
];

export function JournalDialog({
    open,
    onOpenChange,
    onSave,
    onCancel,
}: JournalDialogProps) {
    const {
        // Form state
        mood,
        content,
        images,
        tags,
        isLoading,
        setMood,
        setContent,
        setTags,
        addImage,
        removeImage,
        isFormValid,
        resetForm,
        getFormData,
    } = useJournalDialogStore();

    // Reset form when dialog opens
    useEffect(() => {
        if (open) {
            resetForm();
        }
    }, [open, resetForm]);

    const handleSave = async () => {
        if (!isFormValid()) {
            Alert.alert(
                "Validation Error",
                "Please fill in both mood and content fields"
            );
            return;
        }

        onSave(getFormData());
        resetForm();
    };

    const handleCancel = () => {
        resetForm();
        onCancel?.();
    };

    const pickImage = async () => {
        try {
            // Request permission first
            const permissionResult =
                await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (permissionResult.granted === false) {
                Alert.alert(
                    "Permission Required",
                    "Permission to access photo library is required!"
                );
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ["images"],
                allowsEditing: true,
                quality: 1,
                allowsMultipleSelection: false,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const uri = result.assets[0].uri;
                // Just add the local image URI to the store
                addImage(uri, true); // true = isLocal (will be uploaded on save)
            }
        } catch (error) {
            console.error("Error picking image:", error);
            Alert.alert("Error", "Failed to pick image. Please try again.");
        }
    };

    const handleRemoveImage = (imageId: string) => {
        Alert.alert(
            "Remove Image",
            "Are you sure you want to remove this image?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Remove",
                    style: "destructive",
                    onPress: () => removeImage(imageId),
                },
            ]
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <Dialog.Trigger />
            <Dialog.Portal>
                <Dialog.Overlay
                    key="overlay"
                    backgroundColor="$shadow6"
                    animation="quicker"
                    enterStyle={{ opacity: 0 }}
                    exitStyle={{ opacity: 0 }}
                />
                <Dialog.Content
                    bordered
                    m="$4"
                    elevate
                    borderColor="$green8"
                    borderWidth={2}
                    borderRadius="$6"
                    key="content"
                    animation="quicker"
                    enterStyle={{ opacity: 0, scale: 0.7 }}
                    exitStyle={{ opacity: 0, scale: 0.7 }}
                    gap="$4"
                    maxHeight="90%"
                >
                    <Dialog.Title
                        fontSize="$8"
                        fontWeight="bold"
                        color="$green10"
                    >
                        Add Journal
                    </Dialog.Title>

                    {/* Mood Selection */}
                    <YStack gap="$2">
                        <Text fontSize="$5" fontWeight="bold">
                            How are you feeling today?
                        </Text>
                        <XStack
                            gap="$2"
                            flexWrap="wrap"
                            justifyContent="center"
                        >
                            {moodOptions.map((moodOption) => (
                                <YStack
                                    key={moodOption.value}
                                    alignItems="center"
                                    gap="$1"
                                    onPress={() => setMood(moodOption.value)}
                                    pressStyle={{ scale: 0.95 }}
                                    padding="$2"
                                    borderRadius="$3"
                                    backgroundColor={
                                        mood === moodOption.value
                                            ? "$green4"
                                            : "transparent"
                                    }
                                    borderWidth={
                                        mood === moodOption.value ? 2 : 1
                                    }
                                    borderColor={
                                        mood === moodOption.value
                                            ? "$green10"
                                            : "$gray6"
                                    }
                                    width={70}
                                >
                                    <Text fontSize="$7">
                                        {moodOption.label}
                                    </Text>
                                    <Text fontSize="$2" color="$gray10">
                                        {moodOption.name}
                                    </Text>
                                </YStack>
                            ))}
                        </XStack>
                    </YStack>

                    {/* Content */}
                    <YStack gap="$2">
                        <Text fontSize="$5" fontWeight="bold">
                            How was your day?
                        </Text>
                        <TextArea
                            value={content}
                            onChangeText={setContent}
                            placeholder="What did you do or think about today?"
                            focusStyle={{ borderColor: "$green10" }}
                            maxLength={500}
                            multiline
                            numberOfLines={4}
                        />
                        <Text fontSize="$2" color="$gray10" textAlign="right">
                            {content.length}/500
                        </Text>
                    </YStack>

                    {/* Tags - Simplified */}
                    <YStack gap="$2">
                        <Text fontSize="$5" fontWeight="bold">
                            Tags
                        </Text>
                        <Input
                            value={tags}
                            onChangeText={setTags}
                            placeholder="Work, Family, Exercise, ..."
                            focusStyle={{ borderColor: "$green10" }}
                        />
                        <Text fontSize="$2" color="$gray10">
                            Separate multiple tags with commas
                        </Text>
                    </YStack>

                    {/* Images */}
                    <YStack gap="$2">
                        <XStack
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Text fontSize="$5" fontWeight="bold">
                                Images
                            </Text>
                            <Button
                                icon={<Plus size={18} color="white" />}
                                bg="$green8"
                                animation="quick"
                                pressStyle={{
                                    borderWidth: 0,
                                    bg: "$green8",
                                    scale: 0.9,
                                }}
                                circular
                                size={25}
                                onPress={pickImage}
                            />
                        </XStack>

                        {/* Preview Images */}
                        {images.length > 0 ? (
                            <FlatList
                                data={images}
                                horizontal
                                keyExtractor={(item) => item.id || item.url}
                                contentContainerStyle={{
                                    gap: 8,
                                    alignItems: "center",
                                }}
                                style={{ height: 80, flexGrow: 0 }}
                                showsHorizontalScrollIndicator={false}
                                renderItem={({ item }) => (
                                    <YStack
                                        width={80}
                                        height={80}
                                        position="relative"
                                    >
                                        {/* Local image indicator */}
                                        {item.isLocal && (
                                            <YStack
                                                position="absolute"
                                                top={2}
                                                left={2}
                                                backgroundColor="$blue8"
                                                borderRadius="$2"
                                                paddingHorizontal="$1"
                                                zIndex={2}
                                            >
                                                <Text
                                                    fontSize="$1"
                                                    color="white"
                                                >
                                                    NEW
                                                </Text>
                                            </YStack>
                                        )}

                                        {/* Remove button */}
                                        <Button
                                            icon={<X size={14} color="white" />}
                                            position="absolute"
                                            top={0}
                                            right={0}
                                            size="$1"
                                            circular
                                            bg="$red10"
                                            zIndex={3}
                                            onPress={() =>
                                                item.id &&
                                                handleRemoveImage(item.id)
                                            }
                                        />

                                        {/* Image */}
                                        <Image
                                            source={{ uri: item.url }}
                                            objectFit="cover"
                                            width={80}
                                            height={80}
                                            borderRadius="$2"
                                        />
                                    </YStack>
                                )}
                            />
                        ) : (
                            <XStack
                                justifyContent="center"
                                alignItems="center"
                                backgroundColor="$gray3"
                                borderRadius={8}
                                height={80}
                                padding="$3"
                                borderWidth={1}
                                borderColor="$gray6"
                                borderStyle="dashed"
                            >
                                <Text
                                    color="$gray11"
                                    fontSize="$3"
                                    textAlign="center"
                                >
                                    No images yet. Click + to add one.
                                </Text>
                            </XStack>
                        )}
                    </YStack>

                    {/* Action Buttons */}
                    <XStack justifyContent="flex-end" gap="$2" paddingTop="$3">
                        <Dialog.Close asChild>
                            <Button
                                onPress={handleCancel}
                                backgroundColor="$green4"
                                color="black"
                                animation="quick"
                                pressStyle={{
                                    borderWidth: 0,
                                    bg: "$green4",
                                    scale: 0.9,
                                }}
                                disabled={isLoading}
                                opacity={isLoading ? 0.6 : 1}
                            >
                                Cancel
                            </Button>
                        </Dialog.Close>
                        <Dialog.Close asChild>
                            <Button
                                onPress={handleSave}
                                backgroundColor="$green10"
                                color="white"
                                animation="quick"
                                pressStyle={{
                                    borderWidth: 0,
                                    bg: "$green10",
                                    scale: 0.9,
                                }}
                                disabled={!isFormValid() || isLoading}
                                opacity={!isFormValid() || isLoading ? 0.6 : 1}
                            >
                                {isLoading ? "Saving..." : "Save"}
                            </Button>
                        </Dialog.Close>
                    </XStack>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog>
    );
}
