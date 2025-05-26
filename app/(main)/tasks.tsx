import FilterToggleGroup from "@/components/FilterToggleGroup";
import { FormDialog } from "@/components/FormDialog";
import TaskCard from "@/components/TaskCard";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { Input, Label, Text, YStack } from "tamagui";

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
            <FormDialog
                open={open}
                onOpenChange={setOpen}
                title="Add Task"
                description="Make changes to your profile here. Click save when you're done."
                onSave={handleSave}
                onCancel={handleCancel}
            >
                <YStack gap="$2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                        width="100%"
                        id="title"
                        placeholder="Apa yang perlu dilakukan?"
                    />
                </YStack>
                <YStack gap="$2">
                    <Label htmlFor="description">Description (optional)</Label>
                    <Input
                        width="100%"
                        id="description"
                        placeholder="Tambahkan detail..."
                    />
                </YStack>
            </FormDialog>
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
