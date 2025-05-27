import FilterToggleGroup from "@/components/FilterToggleGroup";
import JournalCard from "@/components/JournalCard";
import React, { useState } from "react";
import { FlatList } from "react-native";
import { Text, YStack } from "tamagui";

const Journal = () => {
    const [filter, setFilter] = useState("all");
    const journal = [
        {
            id: 1,
            date: "Sabtu, 10 Mei 2025",
            mood: "happy",
            content:
                "Hari ini sangat menyenangkan! Bertemu dengan teman lama dan mengobrol banyak.",
            image: "https://img.freepik.com/free-vector/cute-cool-boy-dabbing-pose-cartoon-vector-icon-illustration-people-fashion-icon-concept-isolated_138676-5680.jpg?semt=ais_hybrid&w=740",
            tags: ["#teman", "#kafe", "#nostalgia"],
        },
        {
            id: 2,
            date: "Kamis, 8 Mei 2025",
            mood: "sad",
            content: "Hari yang biasa saja. Bekerja dari pagi hingga sore...",
            image: undefined, // Jangan pakai `null`, gunakan `undefined` atau hapus field
            tags: ["#kerja", "#rutinitas"],
        },
        {
            id: 3,
            date: "Kamis, 8 Mei 2025",
            mood: "sad",
            content: "Hari yang biasa saja. Bekerja dari pagi hingga sore...",
            image: undefined, // Jangan pakai `null`, gunakan `undefined` atau hapus field
            tags: ["#kerja", "#rutinitas"],
        },
        {
            id: 4,
            date: "Kamis, 8 Mei 2025",
            mood: "sad",
            content: "Hari yang biasa saja. Bekerja dari pagi hingga sore...",
            image: undefined, // Jangan pakai `null`, gunakan `undefined` atau hapus field
            tags: ["#kerja", "#rutinitas"],
        },
    ];

    const handleEdit = (id: number) => {
        console.log("Edit task dengan ID:", id);
        // Tambahkan logika edit task di sini
    };

    const handleDelete = (id: number) => {
        console.log("Hapus task dengan ID:", id);
        // Tambahkan logika delete task di sini
    };

    const toggleItems = [
        { value: "all", label: "All" },
        { value: "today", label: "Today" },
        { value: "week", label: "This Week" },
        { value: "month", label: "This Month" },
    ];

    return (
        <YStack
            flex={1}
            backgroundColor="$background"
            paddingHorizontal="$4"
            alignItems="center"
        >
            <Text
                fontSize="$7"
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
                onValueChange={setFilter}
            />

            <FlatList
                data={journal}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingBottom: 100, width: "100%" }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <JournalCard
                        date={item.date}
                        mood={item.mood}
                        content={item.content}
                        image={item.image}
                        tags={item.tags}
                        onEdit={() => handleEdit(item.id)}
                        onDelete={() => handleDelete(item.id)}
                    />
                )}
            />
        </YStack>
    );
};

export default Journal;
