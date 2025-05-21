import AnimatedCard from "@/components/AnimatedCard";
import FilterToggleGroup from "@/components/FilterToggleGroup";
import JournalCard from "@/components/JournalCard";
import React, { useState } from "react";
import { ScrollView } from "react-native";
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
        { value: "all", label: "Semua" },
        { value: "today", label: "Hari Ini" },
        { value: "week", label: "Minggu Ini" },
        { value: "month", label: "Bulan Ini" },
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
                Jurnal Harian
            </Text>

            <FilterToggleGroup
                items={toggleItems}
                selectedValue={filter}
                onValueChange={setFilter}
            />

            <ScrollView
                contentContainerStyle={{ paddingBottom: 100, width: "100%" }}
            >
                {journal.map((task, index) => (
                    <AnimatedCard key={task.id} index={index}>
                        <JournalCard
                            date={task.date}
                            mood={task.mood}
                            content={task.content}
                            image={task.image}
                            tags={task.tags}
                            onEdit={() => handleEdit(task.id)}
                            onDelete={() => handleDelete(task.id)}
                        />
                    </AnimatedCard>
                ))}
            </ScrollView>
        </YStack>
    );
};

export default Journal;
