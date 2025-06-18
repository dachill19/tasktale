import { Trash2, X } from "@tamagui/lucide-icons";
import React, { useState } from "react";
import { Dimensions, FlatList, Modal, TouchableOpacity } from "react-native";
import { Image, Text, View, XStack, YStack } from "tamagui";

interface JournalCardProps {
    date: string;
    mood: string;
    content: string;
    images?: string[];
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

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const JournalCard: React.FC<JournalCardProps> = ({
    date,
    mood,
    content,
    images,
    tags,
    onDelete,
}) => {
    const [fullscreenVisible, setFullscreenVisible] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const openFullscreen = (index: number) => {
        setCurrentImageIndex(index);
        setFullscreenVisible(true);
    };

    const closeFullscreen = () => {
        setFullscreenVisible(false);
    };

    const goToNextImage = () => {
        if (images && currentImageIndex < images.length - 1) {
            setCurrentImageIndex(currentImageIndex + 1);
        }
    };

    const goToPrevImage = () => {
        if (currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1);
        }
    };

    const renderImages = () => {
        if (!images || images.length === 0) return null;

        if (images.length === 1) {
            return (
                <TouchableOpacity
                    onPress={() => openFullscreen(0)}
                    activeOpacity={0.8}
                >
                    <Image
                        source={{ uri: images[0] }}
                        width="100%"
                        height={200}
                        borderRadius="$3"
                        marginBottom="$3"
                        objectFit="cover"
                    />
                </TouchableOpacity>
            );
        } else if (images.length === 2) {
            return (
                <XStack gap="$2" marginBottom="$3">
                    {images.map((image, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => openFullscreen(index)}
                            activeOpacity={0.8}
                            style={{ flex: 1 }}
                        >
                            <Image
                                source={{ uri: image }}
                                width="100%"
                                height={150}
                                borderRadius="$3"
                                objectFit="cover"
                            />
                        </TouchableOpacity>
                    ))}
                </XStack>
            );
        } else if (images.length === 3) {
            return (
                <XStack gap="$2" marginBottom="$3">
                    <TouchableOpacity
                        onPress={() => openFullscreen(0)}
                        activeOpacity={0.8}
                        style={{ flex: 2 }}
                    >
                        <Image
                            source={{ uri: images[0] }}
                            width="100%"
                            height={150}
                            borderRadius="$3"
                            objectFit="cover"
                        />
                    </TouchableOpacity>
                    <YStack flex={1} gap="$2">
                        {images.slice(1, 3).map((image, index) => (
                            <TouchableOpacity
                                key={index + 1}
                                onPress={() => openFullscreen(index + 1)}
                                activeOpacity={0.8}
                            >
                                <Image
                                    source={{ uri: image }}
                                    width="100%"
                                    height={72}
                                    borderRadius="$3"
                                    objectFit="cover"
                                />
                            </TouchableOpacity>
                        ))}
                    </YStack>
                </XStack>
            );
        } else {
            return (
                <YStack marginBottom="$3">
                    <XStack gap="$2" marginBottom="$2">
                        <TouchableOpacity
                            onPress={() => openFullscreen(0)}
                            activeOpacity={0.8}
                            style={{ flex: 1 }}
                        >
                            <Image
                                source={{ uri: images[0] }}
                                width="100%"
                                height={100}
                                borderRadius="$3"
                                objectFit="cover"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => openFullscreen(1)}
                            activeOpacity={0.8}
                            style={{ flex: 1 }}
                        >
                            <Image
                                source={{ uri: images[1] }}
                                width="100%"
                                height={100}
                                borderRadius="$3"
                                objectFit="cover"
                            />
                        </TouchableOpacity>
                    </XStack>
                    <XStack gap="$2" marginBottom="$2">
                        <TouchableOpacity
                            onPress={() => openFullscreen(2)}
                            activeOpacity={0.8}
                            style={{ flex: 1 }}
                        >
                            <Image
                                source={{ uri: images[2] }}
                                width="100%"
                                height={100}
                                borderRadius="$3"
                                objectFit="cover"
                            />
                        </TouchableOpacity>
                        {images.length > 3 && (
                            <TouchableOpacity
                                onPress={() => openFullscreen(3)}
                                activeOpacity={0.8}
                                style={{ flex: 1 }}
                            >
                                <YStack
                                    width="100%"
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
                            </TouchableOpacity>
                        )}
                    </XStack>
                </YStack>
            );
        }
    };

    const renderFullscreenModal = () => {
        if (!images || !fullscreenVisible) return null;

        return (
            <Modal
                visible={fullscreenVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={closeFullscreen}
            >
                <YStack
                    flex={1}
                    bg="black"
                    justifyContent="center"
                    alignItems="center"
                >
                    {/* Tombol Tutup (X) */}
                    <TouchableOpacity
                        onPress={closeFullscreen}
                        style={{
                            position: "absolute",
                            top: 20,
                            right: 20,
                            zIndex: 10,
                            padding: 8,
                            backgroundColor: "rgba(0,0,0,0.4)",
                            borderRadius: 20,
                        }}
                    >
                        <X size={24} color="white" />
                    </TouchableOpacity>

                    {/* Counter */}
                    <Text
                        position="absolute"
                        top={25}
                        alignSelf="center"
                        color="white"
                        fontSize="$5"
                        zIndex={10}
                        backgroundColor="rgba(0,0,0,0.4)"
                        paddingHorizontal={10}
                        paddingVertical={4}
                        borderRadius={12}
                    >
                        {currentImageIndex + 1} / {images.length}
                    </Text>

                    {/* Gambar Utama */}
                    <Image
                        source={{ uri: images[currentImageIndex] }}
                        width={screenWidth}
                        height={screenHeight}
                        objectFit="contain"
                    />

                    {/* Navigasi Kiri */}
                    {currentImageIndex > 0 && (
                        <TouchableOpacity
                            onPress={goToPrevImage}
                            style={{
                                position: "absolute",
                                left: 0,
                                top: 0,
                                bottom: 0,
                                width: "30%",
                            }}
                        />
                    )}

                    {/* Navigasi Kanan */}
                    {currentImageIndex < images.length - 1 && (
                        <TouchableOpacity
                            onPress={goToNextImage}
                            style={{
                                position: "absolute",
                                right: 0,
                                top: 0,
                                bottom: 0,
                                width: "30%",
                            }}
                        />
                    )}

                    {/* Thumbnails di bawah */}
                    {images.length > 1 && (
                        <FlatList
                            data={images}
                            keyExtractor={(_, index) => index.toString()}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={{
                                position: "absolute",
                                bottom: 30,
                            }}
                            contentContainerStyle={{
                                paddingLeft: 20,
                                paddingRight: 20,
                                alignItems: "center",
                            }}
                            ItemSeparatorComponent={() => (
                                <View style={{ width: 8 }} />
                            )}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity
                                    onPress={() => setCurrentImageIndex(index)}
                                    style={{
                                        borderRadius: 6,
                                        overflow: "hidden",
                                        borderWidth:
                                            index === currentImageIndex ? 2 : 0,
                                        borderColor: "white",
                                        opacity:
                                            index === currentImageIndex
                                                ? 1
                                                : 0.6,
                                    }}
                                >
                                    <Image
                                        source={{ uri: item }}
                                        width={50}
                                        height={50}
                                        objectFit="cover"
                                    />
                                </TouchableOpacity>
                            )}
                        />
                    )}
                </YStack>
            </Modal>
        );
    };

    return (
        <>
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

            {/* Fullscreen Modal */}
            {renderFullscreenModal()}
        </>
    );
};

export default JournalCard;
