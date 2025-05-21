import AnimatedCard from "@/components/AnimatedCard";
import FilterToggleGroup from "@/components/FilterToggleGroup";
import TaskCard from "@/components/TaskCard";
import React, { useState } from "react";
import { ScrollView } from "react-native";
import { Text, YStack } from "tamagui";

const Tasks = () => {
    const [filter, setFilter] = useState("all");

    type Priority = "Tinggi" | "Sedang" | "Rendah";

    interface Task {
        id: number;
        title: string;
        description?: string;
        priority: Priority;
        date: string;
        completedCount?: number;
        totalCount?: number;
        subTasks?: { title: string; completed: boolean }[];
        completed?: boolean;
    }

    const tasks: Task[] = [
        {
            id: 1,
            title: "Menyelesaikan laporan proyek",
            description: "Membuat laporan proyek untuk meeting besok",
            priority: "Tinggi",
            date: "19 May 2025",
            completedCount: 1,
            totalCount: 3,
            subTasks: [
                { title: "Mengumpulkan data", completed: true },
                { title: "Membuat grafik", completed: false },
                { title: "Menulis kesimpulan", completed: false },
            ],
            completed: false,
        },
        {
            id: 2,
            title: "Meeting dengan tim",
            priority: "Sedang",
            date: "19 May 2025",
            completed: true,
        },
        {
            id: 3,
            title: "Beli hadiah untuk teman",
            priority: "Rendah",
            date: "20 May 2025",
        },
        {
            id: 4,
            title: "Menyelesaikan laporan proyek",
            description: "Membuat laporan proyek untuk meeting besok",
            priority: "Tinggi",
            date: "19 May 2025",
            completedCount: 1,
            totalCount: 3,
            subTasks: [
                { title: "Mengumpulkan data", completed: true },
                { title: "Membuat grafik", completed: false },
                { title: "Menulis kesimpulan", completed: false },
            ],
            completed: false,
        },
        {
            id: 5,
            title: "Menyelesaikan laporan proyek",
            description: "Membuat laporan proyek untuk meeting besok",
            priority: "Tinggi",
            date: "19 May 2025",
            completedCount: 1,
            totalCount: 3,
            subTasks: [
                { title: "Mengumpulkan data", completed: true },
                { title: "Membuat grafik", completed: false },
                { title: "Menulis kesimpulan", completed: false },
            ],
            completed: false,
        },
    ];

    const handleEdit = (id: number) => {
        // logic edit
    };

    const handleDelete = (id: number) => {
        // logic delete
    };

    const toggleItems = [
        { value: "all", label: "Semua" },
        { value: "active", label: "Aktif" },
        { value: "done", label: "Selesai" },
        { value: "today", label: "Hari Ini" },
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
                Tugas
            </Text>

            <FilterToggleGroup
                items={toggleItems}
                selectedValue={filter}
                onValueChange={setFilter}
            />

            <ScrollView
                contentContainerStyle={{ paddingBottom: 100, width: "100%" }}
            >
                {tasks.map((task, index) => (
                    <AnimatedCard key={task.id} index={index}>
                        <TaskCard
                            title={task.title}
                            description={task.description}
                            priority={task.priority}
                            date={task.date}
                            completedCount={task.completedCount}
                            totalCount={task.totalCount}
                            subTasks={task.subTasks}
                            completed={task.completed}
                            onEdit={() => handleEdit(task.id)}
                            onDelete={() => handleDelete(task.id)}
                        />
                    </AnimatedCard>
                ))}
            </ScrollView>
        </YStack>
    );
};

export default Tasks;
