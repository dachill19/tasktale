import FilterToggleGroup from "@/components/FilterToggleGroup";
import JournalCard from "@/components/journal/JournalCard";
import { JournalDialog } from "@/components/journal/JournalDialog";
import { JournalFormData as ServiceJournalFormData } from "@/lib/journal";
import { useJournalStore } from "@/lib/stores/journalStore"; // Adjust import path as needed
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, RefreshControl } from "react-native";
import { Spinner, Text, YStack } from "tamagui";

// Type untuk form data dari dialog
type DialogJournalFormData = {
    mood: string;
    content: string;
    images: Array<{ url: string; isLocal?: boolean }>;
    tags: string;
};

const Journals = () => {
    const {
        journals,
        filter,
        loading,
        error,
        currentUserId,
        setFilter,
        fetchFilteredJournals,
        createJournal,
        deleteJournal,
        initializeUser,
    } = useJournalStore();

    const [open, setOpen] = useState(false);
    const params = useLocalSearchParams();

    // Handle dialog opening from navigation params
    useEffect(() => {
        if (params.openDialog === "true") {
            setOpen(true);
            router.replace("/journals");
        }
    }, [params]);

    // Initialize user on mount
    useEffect(() => {
        initializeUser();
    }, [initializeUser]);

    // Use focus effect to refresh data when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            if (currentUserId) {
                fetchFilteredJournals(currentUserId, filter);
            }
        }, [currentUserId, filter, fetchFilteredJournals])
    );

    // Show error alerts when error state changes
    useEffect(() => {
        if (error) {
            Alert.alert("Error", error);
        }
    }, [error]);

    const handleRefresh = useCallback(async () => {
        if (currentUserId) {
            await fetchFilteredJournals(currentUserId, filter);
        }
    }, [currentUserId, filter, fetchFilteredJournals]);

    const handleSave = async (formData: DialogJournalFormData) => {
        if (!currentUserId) {
            Alert.alert("Error", "User not authenticated");
            return;
        }

        try {
            // Transform dialog form data to service form data
            const serviceFormData: ServiceJournalFormData = {
                mood: formData.mood,
                content: formData.content,
                created_at: new Date(),
                images: formData.images.map((img) => ({ url: img.url })),
                tags: formData.tags
                    .split(",")
                    .map((tag) => ({ name: tag.trim() }))
                    .filter((tag) => tag.name.length > 0),
            };

            const response = await createJournal(
                serviceFormData,
                currentUserId
            );

            if (response.success) {
                Alert.alert("Success", "Journal saved successfully!");
                setOpen(false);
            } else {
                Alert.alert(
                    "Error",
                    response.error || "Failed to save journal"
                );
            }
        } catch (error) {
            console.error("Error saving journal:", error);
            Alert.alert("Error", "Failed to save journal");
        }
    };

    const handleDelete = async (journalId: string) => {
        Alert.alert(
            "Delete Journal",
            "Are you sure you want to delete this journal entry? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const response = await deleteJournal(journalId);

                            if (response.success) {
                                Alert.alert(
                                    "Success",
                                    "Journal deleted successfully"
                                );
                            } else {
                                Alert.alert(
                                    "Error",
                                    response.error || "Failed to delete journal"
                                );
                            }
                        } catch (error) {
                            console.error("Error deleting journal:", error);
                            Alert.alert("Error", "Failed to delete journal");
                        }
                    },
                },
            ]
        );
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const toggleItems = [
        { value: "all", label: "All" },
        { value: "today", label: "Today" },
        { value: "this-week", label: "This Week" },
        { value: "this-month", label: "This Month" },
    ];

    if (loading) {
        return (
            <YStack
                flex={1}
                backgroundColor="$background"
                paddingHorizontal="$4"
                alignItems="center"
                justifyContent="center"
                paddingBottom={100}
            >
                <Spinner size="large" color="$green10" />
                <Text marginTop="$2" fontSize="$5" color="$green10">
                    Loading journals...
                </Text>
            </YStack>
        );
    }

    return (
        <YStack
            flex={1}
            backgroundColor="$background"
            paddingHorizontal="$4"
            alignItems="center"
            paddingBottom={100}
        >
            <JournalDialog
                open={open}
                onOpenChange={setOpen}
                onSave={handleSave}
                onCancel={handleCancel}
            />

            <Text
                fontSize="$8"
                fontWeight="bold"
                fontFamily="$display"
                color="$color10"
                marginVertical="$4"
            >
                Daily Journals
            </Text>

            <FilterToggleGroup
                items={toggleItems}
                selectedValue={filter}
                onValueChange={(value) => setFilter(value as any)}
            />

            {journals.length === 0 ? (
                <YStack
                    flex={1}
                    alignItems="center"
                    justifyContent="center"
                    gap="$4"
                >
                    <Text fontSize="$5" color="$color8" textAlign="center">
                        {filter === "all"
                            ? "No journals yet. Start by creating your first entry!"
                            : `No ${
                                  filter === "today"
                                      ? "today"
                                      : filter === "this-week"
                                      ? "this week"
                                      : "this month"
                              } journals found.`}
                    </Text>
                </YStack>
            ) : (
                <FlatList
                    data={journals}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ width: "100%" }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={loading}
                            onRefresh={handleRefresh}
                            colors={["#10b981"]}
                            tintColor="#10b981"
                        />
                    }
                    renderItem={({ item }) => (
                        <JournalCard
                            date={item.created_at}
                            mood={item.mood}
                            content={item.content}
                            images={
                                item.images?.map(
                                    (img: { url: string }) => img.url
                                ) || []
                            }
                            tags={
                                item.tags?.map(
                                    (tag: { name: string }) => `#${tag.name}`
                                ) || []
                            }
                            onDelete={() => handleDelete(item.id)}
                        />
                    )}
                />
            )}
        </YStack>
    );
};

export default Journals;
