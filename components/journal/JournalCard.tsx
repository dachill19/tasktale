import { Trash2 } from "@tamagui/lucide-icons";
import React from "react";
import { TouchableOpacity } from "react-native";
import { Image, Text, XStack, YStack } from "tamagui";

interface JournalCardProps {
    date: string;
    mood: string;
    content: string;
    image?: string;
    tags: string[];
    onDelete: () => void;
}

const moodEmojis: Record<string, string> = {
    happy: "😊",
    excited: "🤩",
    calm: "😌",
    neutral: "😐",
    tired: "😫",
    sad: "😢",
    angry: "😡",
};

const JournalCard: React.FC<JournalCardProps> = ({
    date,
    mood,
    content,
    image,
    tags,
    onDelete,
}) => {
    return (
        <YStack
            backgroundColor="$background"
            borderRadius="$4"
            borderWidth={2}
            borderColor="$gray8"
            padding="$4"
            marginBottom="$4"
            position="relative"
            width="100%"
            elevation={2}
            animation="quick"
            pressStyle={{
                scale: 0.95, // opsional, beri efek scale saat ditekan
            }}
        >
            {/* Mood + Date */}
            <XStack
                justifyContent="space-between"
                marginBottom="$2"
                alignItems="center"
                width="100%"
            >
                <XStack alignItems="center" gap="$2">
                    <Text fontSize="$7">{moodEmojis[mood] ?? "📝"}</Text>
                    <Text color="$gray12" fontSize="$4" fontWeight="bold">
                        {date}
                    </Text>
                </XStack>

                <TouchableOpacity onPress={onDelete}>
                    <Trash2 size="$1" color="$red10" />
                </TouchableOpacity>
            </XStack>

            {/* Content */}
            <Text color="$gray11" marginBottom="$2" fontSize="$4">
                {content}
            </Text>

            {/* Image */}
            {image && (
                <Image
                    source={{ uri: image }}
                    width={160}
                    height={160}
                    borderRadius="$5"
                    marginBottom="$2"
                    objectFit="cover"
                />
            )}

            {/* Tags */}
            <XStack flexWrap="wrap" gap="$2">
                {tags.map((tag, index) => (
                    <YStack
                        key={index}
                        backgroundColor="$color4"
                        borderRadius="$10"
                        paddingHorizontal="$3"
                        paddingVertical="$1"
                    >
                        <Text fontSize="$2" color="$color10">
                            {tag}
                        </Text>
                    </YStack>
                ))}
            </XStack>
        </YStack>
    );
};

export default JournalCard;
