import FilterToggleGroup from "@/components/FilterToggleGroup";
import TaskCard from "@/components/TaskCard";
import { TaskDialog } from "@/components/TaskDialog";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { Text, YStack } from "tamagui";

const Tasks = () => {
    const [filter, setFilter] = useState("all");
    const params = useLocalSearchParams();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (params.openDialog === "true") {
            setOpen(true);
            router.replace("/tasks");
        }
    }, [params]);

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

    const handleSave = () => {
        // Logic simpan data
        console.log("Save clicked");
        setOpen(false);
    };

    const handleCancel = () => {
        console.log("Cancel clicked");
        setOpen(false);
    };

    const toggleItems = [
        { value: "all", label: "All" },
        { value: "active", label: "Active" },
        { value: "done", label: "Done" },
        { value: "today", label: "Today" },
    ];

    return (
        <YStack
            flex={1}
            backgroundColor="$background"
            paddingHorizontal="$4"
            alignItems="center"
        >
            <TaskDialog
                open={open}
                onOpenChange={setOpen}
                onSave={handleSave}
                onCancel={handleCancel}
            />
            <Text
                fontSize="$7"
                fontWeight="bold"
                fontFamily="$display"
                color="$color10"
                marginVertical="$4"
            >
                Tasks
            </Text>

            <FilterToggleGroup
                items={toggleItems}
                selectedValue={filter}
                onValueChange={setFilter}
            />

            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingBottom: 100, width: "100%" }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TaskCard
                        title={item.title}
                        description={item.description}
                        priority={item.priority}
                        date={item.date}
                        completedCount={item.completedCount}
                        totalCount={item.totalCount}
                        subTasks={item.subTasks}
                        completed={item.completed}
                        onEdit={() => handleEdit(item.id)}
                        onDelete={() => handleDelete(item.id)}
                    />
                )}
            />
        </YStack>
    );
};

export default Tasks;
