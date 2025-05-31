import { Trash2 } from "@tamagui/lucide-icons";
import React from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { Image, Text, XStack, YStack } from "tamagui";

interface JournalCardProps {
    date: string;
    mood: string;
    content: string;
    images?: string[]; // Changed to array of strings
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
    images,
    tags,
    onDelete,
}) => {
    // Helper function to render images based on count
    const renderImages = () => {
        if (!images || images.length === 0) return null;

        if (images.length === 1) {
            // Single image - display large
            return (
                <Image
                    source={{ uri: images[0] }}
                    width="100%"
                    height={200}
                    borderRadius="$3"
                    marginBottom="$3"
                    objectFit="cover"
                />
            );
        } else if (images.length === 2) {
            // Two images - display side by side
            return (
                <XStack gap="$2" marginBottom="$3">
                    {images.map((image, index) => (
                        <Image
                            key={index}
                            source={{ uri: image }}
                            flex={1}
                            height={150}
                            borderRadius="$3"
                            objectFit="cover"
                        />
                    ))}
                </XStack>
            );
        } else if (images.length === 3) {
            // Three images - first large, two small on the right
            return (
                <XStack gap="$2" marginBottom="$3">
                    <Image
                        source={{ uri: images[0] }}
                        flex={2}
                        height={150}
                        borderRadius="$3"
                        objectFit="cover"
                    />
                    <YStack flex={1} gap="$2">
                        <Image
                            source={{ uri: images[1] }}
                            width="100%"
                            height={72}
                            borderRadius="$3"
                            objectFit="cover"
                        />
                        <Image
                            source={{ uri: images[2] }}
                            width="100%"
                            height={72}
                            borderRadius="$3"
                            objectFit="cover"
                        />
                    </YStack>
                </XStack>
            );
        } else {
            // Four or more images - grid layout with horizontal scroll for overflow
            return (
                <YStack marginBottom="$3">
                    <XStack gap="$2" marginBottom="$2">
                        <Image
                            source={{ uri: images[0] }}
                            flex={1}
                            height={100}
                            borderRadius="$3"
                            objectFit="cover"
                        />
                        <Image
                            source={{ uri: images[1] }}
                            flex={1}
                            height={100}
                            borderRadius="$3"
                            objectFit="cover"
                        />
                    </XStack>
                    <XStack gap="$2">
                        <Image
                            source={{ uri: images[2] }}
                            flex={1}
                            height={100}
                            borderRadius="$3"
                            objectFit="cover"
                        />
                        {images.length > 3 && (
                            <YStack
                                flex={1}
                                height={100}
                                borderRadius="$3"
                                backgroundColor="$gray8"
                                alignItems="center"
                                justifyContent="center"
                                position="relative"
                            >
                                <Image
                                    source={{ uri: images[3] }}
                                    width="100%"
                                    height="100%"
                                    borderRadius="$3"
                                    objectFit="cover"
                                    position="absolute"
                                />
                                {images.length > 4 && (
                                    <YStack
                                        position="absolute"
                                        width="100%"
                                        height="100%"
                                        backgroundColor="rgba(0,0,0,0.5)"
                                        borderRadius="$3"
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        <Text
                                            color="white"
                                            fontSize="$6"
                                            fontWeight="bold"
                                        >
                                            +{images.length - 4}
                                        </Text>
                                    </YStack>
                                )}
                            </YStack>
                        )}
                    </XStack>
                    {images.length > 4 && (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={{ marginTop: 8 }}
                        >
                            <XStack gap="$2" paddingRight="$4">
                                {images.slice(4).map((image, index) => (
                                    <Image
                                        key={index + 4}
                                        source={{ uri: image }}
                                        width={80}
                                        height={80}
                                        borderRadius="$2"
                                        objectFit="cover"
                                    />
                                ))}
                            </XStack>
                        </ScrollView>
                    )}
                </YStack>
            );
        }
    };

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
                scale: 0.95,
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

            {/* Images */}
            {renderImages()}

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
