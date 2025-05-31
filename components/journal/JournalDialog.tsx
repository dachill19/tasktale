import { getCurrentUserId, uploadImageToStorage } from "@/lib/journal";
import { useJournalDialogStore } from "@/lib/stores/journalDialogStore"; // Adjust path as needed
import { Plus, X } from "@tamagui/lucide-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect } from "react";
import { Alert, FlatList } from "react-native";
import {
    Button,
    Dialog,
    Image,
    Input,
    Spinner,
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
        isUploading,
        uploadingImageIndex,
        uploadProgress,
        setMood,
        setContent,
        setTags,
        addImage,
        removeImage,
        updateImageUrl,
        setImageAsUploaded,
        setUploading,
        setUploadingImageIndex,
        setUploadProgress,
        isFormValid,
        hasLocalImages,
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

        if (hasLocalImages()) {
            Alert.alert(
                "Images Uploading",
                "Some images are still being processed. Please wait for all uploads to complete."
            );
            return;
        }

        onSave(getFormData());
        resetForm();
    };

    const handleCancel = () => {
        if (isUploading) {
            Alert.alert(
                "Upload in Progress",
                "Images are still being uploaded. Are you sure you want to cancel?",
                [
                    { text: "Continue", style: "cancel" },
                    {
                        text: "Cancel",
                        style: "destructive",
                        onPress: () => {
                            resetForm();
                            onCancel?.();
                        },
                    },
                ]
            );
        } else {
            resetForm();
            onCancel?.();
        }
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

                // Add image to store with local flag
                const newImage = addImage(uri, true);
                const newImageIndex = images.length; // Index before adding

                // Start upload process
                setUploading(true);
                setUploadingImageIndex(newImageIndex);
                setUploadProgress("Getting user information...");

                try {
                    // Get current user ID
                    const userResponse = await getCurrentUserId();

                    if (!userResponse.success || !userResponse.data) {
                        throw new Error("Failed to get user information");
                    }

                    setUploadProgress("Uploading image...");

                    // Upload image to storage
                    const uploadResponse = await uploadImageToStorage(
                        uri,
                        userResponse.data
                    );

                    if (
                        uploadResponse.success &&
                        uploadResponse.data &&
                        newImage.id
                    ) {
                        // Update the image URL with the uploaded URL
                        updateImageUrl(newImage.id, uploadResponse.data);
                        setImageAsUploaded(newImage.id);
                        setUploadProgress("Upload completed!");
                    } else {
                        // Remove the failed image
                        if (newImage.id) {
                            removeImage(newImage.id);
                        }
                        throw new Error(
                            uploadResponse.error || "Upload failed"
                        );
                    }
                } catch (error) {
                    console.error("Error uploading image:", error);
                    Alert.alert(
                        "Upload Failed",
                        error instanceof Error
                            ? error.message
                            : "Failed to upload image"
                    );

                    // Remove the failed image
                    if (newImage.id) {
                        removeImage(newImage.id);
                    }
                } finally {
                    setUploading(false);
                    setUploadingImageIndex(null);
                    setUploadProgress("");
                }
            }
        } catch (error) {
            console.error("Error picking image:", error);
            Alert.alert("Error", "Failed to pick image. Please try again.");
            setUploading(false);
            setUploadingImageIndex(null);
            setUploadProgress("");
        }
    };

    const handleRemoveImage = (imageId: string) => {
        const imageIndex = images.findIndex((img) => img.id === imageId);
        if (uploadingImageIndex === imageIndex) {
            Alert.alert(
                "Upload in Progress",
                "This image is still being uploaded. Please wait for it to complete."
            );
            return;
        }

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
                    <Dialog.Description>
                        Create a new journal entry.
                    </Dialog.Description>

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
                                Upload Images
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
                                disabled={isUploading}
                                opacity={isUploading ? 0.6 : 1}
                            />
                        </XStack>

                        {/* Upload Status */}
                        {isUploading && (
                            <XStack
                                gap="$2"
                                alignItems="center"
                                justifyContent="center"
                                backgroundColor="$green2"
                                padding="$2"
                                borderRadius="$2"
                            >
                                <Spinner size="small" color="$green10" />
                                <Text fontSize="$3" color="$green10">
                                    {uploadProgress}
                                </Text>
                            </XStack>
                        )}

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
                                renderItem={({ item, index }) => (
                                    <YStack
                                        width={80}
                                        height={80}
                                        position="relative"
                                    >
                                        {/* Upload indicator */}
                                        {item.isLocal && (
                                            <YStack
                                                position="absolute"
                                                top={0}
                                                left={0}
                                                right={0}
                                                bottom={0}
                                                backgroundColor="rgba(0,0,0,0.5)"
                                                borderRadius="$2"
                                                justifyContent="center"
                                                alignItems="center"
                                                zIndex={2}
                                            >
                                                <Spinner
                                                    size="small"
                                                    color="white"
                                                />
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
                                            disabled={item.isLocal}
                                            opacity={item.isLocal ? 0.6 : 1}
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
                                disabled={isUploading || isLoading}
                                opacity={isUploading || isLoading ? 0.6 : 1}
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
                                disabled={
                                    !isFormValid() ||
                                    isUploading ||
                                    hasLocalImages()
                                }
                                opacity={
                                    !isFormValid() ||
                                    isUploading ||
                                    hasLocalImages()
                                        ? 0.6
                                        : 1
                                }
                            >
                                {isUploading || isLoading
                                    ? "Saving..."
                                    : "Save"}
                            </Button>
                        </Dialog.Close>
                    </XStack>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog>
    );
}
