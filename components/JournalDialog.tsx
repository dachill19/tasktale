import { Image } from "@tamagui/lucide-icons";
import React, { useState } from "react";
import { Button, Dialog, Input, Text, TextArea, XStack, YStack } from "tamagui";

type JournalFormData = {
    mood: string;
    content: string;
    images: Array<{ url: string }>;
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
    const [formData, setFormData] = useState<JournalFormData>({
        mood: "",
        content: "",
        images: [],
        tags: "",
    });

    const handleSave = () => {
        if (!formData.mood || !formData.content.trim()) {
            alert("Mohon isi kolom mood dan ceritakan harimu");
            return;
        }
        onSave(formData);
        resetForm();
    };

    const handleCancel = () => {
        resetForm();
        onCancel?.();
    };

    const resetForm = () => {
        setFormData({
            mood: "",
            content: "",
            images: [],
            tags: "",
        });
    };

    const selectMood = (moodValue: string) => {
        setFormData((prev) => ({
            ...prev,
            mood: moodValue,
        }));
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
                >
                    <Dialog.Title
                        fontSize="$8"
                        fontWeight="bold"
                        color="$green10"
                    >
                        Add Journal
                    </Dialog.Title>

                    <Dialog.Description>
                        Create a new journal.
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
                            {moodOptions.map((mood) => (
                                <YStack
                                    key={mood.value}
                                    alignItems="center"
                                    gap="$1"
                                    onPress={() => selectMood(mood.value)}
                                    pressStyle={{ scale: 0.95 }}
                                    padding="$2"
                                    borderRadius="$3"
                                    backgroundColor={
                                        formData.mood === mood.value
                                            ? "$green4"
                                            : "transparent"
                                    }
                                    borderWidth={
                                        formData.mood === mood.value ? 2 : 1
                                    }
                                    borderColor={
                                        formData.mood === mood.value
                                            ? "$green10"
                                            : "$gray6"
                                    }
                                    width={70}
                                >
                                    <Text fontSize="$7">{mood.label}</Text>
                                    <Text fontSize="$2" color="$gray10">
                                        {mood.name}
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
                            value={formData.content}
                            onChangeText={(text) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    content: text,
                                }))
                            }
                            placeholder="What did you do or think about today?"
                            focusStyle={{ borderColor: "$green10" }}
                            maxLength={500}
                            multiline
                        />
                    </YStack>

                    {/* Tags */}
                    <YStack gap="$2">
                        <Text fontSize="$5" fontWeight="bold">
                            Tags (comma separated)
                        </Text>
                        <Input
                            value={formData.tags}
                            onChangeText={(text) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    tags: text,
                                }))
                            }
                            placeholder="Work, Hobby, Family, ..."
                            focusStyle={{ borderColor: "$green10" }}
                        />
                    </YStack>

                    {/* Images */}
                    <YStack gap="$2">
                        <Text fontSize="$5" fontWeight="bold">
                            Upload Photo
                        </Text>
                        <YStack
                            alignItems="center"
                            justifyContent="center"
                            height={100}
                            borderWidth={2}
                            borderStyle="dashed"
                            borderColor="$gray8"
                            borderRadius="$3"
                            backgroundColor="$gray2"
                            gap="$2"
                        >
                            <Image size={24} color="$gray9" />
                            <Text fontSize="$3" color="$gray9">
                                Tambah
                            </Text>
                        </YStack>
                    </YStack>

                    <XStack justifyContent="flex-end" gap="$2" paddingTop="$3">
                        <Dialog.Close asChild>
                            <Button
                                onPress={handleCancel}
                                backgroundColor="$gray6"
                                color="$gray12"
                                borderRadius="$3"
                                paddingHorizontal="$4"
                                paddingVertical="$2"
                                fontSize="$3"
                            >
                                Batal
                            </Button>
                        </Dialog.Close>
                        <Dialog.Close asChild>
                            <Button
                                onPress={handleSave}
                                backgroundColor="$green9"
                                color="white"
                                borderRadius="$3"
                                paddingHorizontal="$4"
                                paddingVertical="$2"
                                fontSize="$3"
                                disabled={
                                    !formData.mood || !formData.content.trim()
                                }
                                opacity={
                                    !formData.mood || !formData.content.trim()
                                        ? 0.5
                                        : 1
                                }
                            >
                                Simpan
                            </Button>
                        </Dialog.Close>
                    </XStack>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog>
    );
}
