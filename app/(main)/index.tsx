import DashboardCard from "@/components/DashboardCard";
import { format } from "date-fns";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { H2, Text, YStack } from "tamagui";

type TaskPriority = "high" | "medium" | "low";

interface Task {
    id: string;
    title: string;
    completed: boolean;
    priority: TaskPriority;
    dueDate: string;
}

interface JournalEntry {
    id: string;
    date: string;
    mood: string;
    content: string;
    hasMedia: boolean;
}

const Dashboard = () => {
    const today = new Date();
    const router = useRouter();
    const [greeting, setGreeting] = useState("");
    const [tasks, setTasks] = useState<Task[]>([]);
    const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

    useEffect(() => {
        const hours = today.getHours();
        if (hours < 12) setGreeting("Selamat Pagi");
        else if (hours < 17) setGreeting("Selamat Siang");
        else setGreeting("Selamat Malam");

        setTasks([
            {
                id: "1",
                title: "Menyelesaikan laporan proyek",
                completed: false,
                priority: "high",
                dueDate: format(today, "yyyy-MM-dd"),
            },
            {
                id: "2",
                title: "Meeting dengan tim",
                completed: true,
                priority: "medium",
                dueDate: format(today, "yyyy-MM-dd"),
            },
            {
                id: "3",
                title: "Beli hadiah untuk teman",
                completed: false,
                priority: "low",
                dueDate: format(today, "yyyy-MM-dd"),
            },
            {
                id: "4",
                title: "Review kode aplikasi",
                completed: false,
                priority: "medium",
                dueDate: format(today, "yyyy-MM-dd"),
            },
            {
                id: "5",
                title: "Panggilan dengan klen",
                completed: true,
                priority: "high",
                dueDate: format(today, "yyyy-MM-dd"),
            },
        ]);

        setJournalEntries([
            {
                id: "1",
                date: format(
                    new Date().setDate(today.getDate() - 1),
                    "yyyy-MM-dd"
                ),
                mood: "happy",
                content:
                    "Hari ini sangat menyenangkan! Bertemu dengan teman lama dan berhasil menyelesaikan proyek besar. Merasa sangat bersyukur dengan pencapaian hari ini.",
                hasMedia: true,
            },
            {
                id: "2",
                date: format(
                    new Date().setDate(today.getDate() - 2),
                    "yyyy-MM-dd"
                ),
                mood: "excited",
                content:
                    "Bekerja seperti biasa dan pulang agak terlambat. Hari yang cukup produktif meskipun sedikit lelah.",
                hasMedia: false,
            },
            {
                id: "3",
                date: format(
                    new Date().setDate(today.getDate() - 3),
                    "yyyy-MM-dd"
                ),
                mood: "sad",
                content:
                    "Hari yang cukup menantang. Ada beberapa masalah teknis yang harus diselesaikan dan deadline yang ketat.",
                hasMedia: true,
            },
            {
                id: "2",
                date: format(
                    new Date().setDate(today.getDate() - 2),
                    "yyyy-MM-dd"
                ),
                mood: "calm",
                content:
                    "Bekerja seperti biasa dan pulang agak terlambat. Hari yang cukup produktif meskipun sedikit lelah.",
                hasMedia: false,
            },
            {
                id: "2",
                date: format(
                    new Date().setDate(today.getDate() - 2),
                    "yyyy-MM-dd"
                ),
                mood: "neutral",
                content:
                    "Bekerja seperti biasa dan pulang agak terlambat. Hari yang cukup produktif meskipun sedikit lelah.",
                hasMedia: false,
            },
            {
                id: "2",
                date: format(
                    new Date().setDate(today.getDate() - 2),
                    "yyyy-MM-dd"
                ),
                mood: "tired",
                content:
                    "Bekerja seperti biasa dan pulang agak terlambat. Hari yang cukup produktif meskipun sedikit lelah.",
                hasMedia: false,
            },
            {
                id: "2",
                date: format(
                    new Date().setDate(today.getDate() - 2),
                    "yyyy-MM-dd"
                ),
                mood: "anggry",
                content:
                    "Bekerja seperti biasa dan pulang agak terlambat. Hari yang cukup produktif meskipun sedikit lelah.",
                hasMedia: false,
            },
        ]);
    }, []);

    const completedTasks = tasks.filter((t) => t.completed).length;
    const taskProgress =
        tasks.length > 0
            ? Math.round((completedTasks / tasks.length) * 100)
            : 0;
    const todayTasks = tasks.filter(
        (t) => t.dueDate === format(today, "yyyy-MM-dd")
    );
    const hasTodayJournal = journalEntries.some(
        (entry) => entry.date === format(today, "yyyy-MM-dd")
    );

    const toggleTask = (taskId: string) => {
        setTasks(
            tasks.map((t) =>
                t.id === taskId ? { ...t, completed: !t.completed } : t
            )
        );
    };

    return (
        <YStack flex={1} backgroundColor="$background" paddingHorizontal="$4">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                <YStack gap="$4" paddingTop="$4">
                    {/* Header Greeting */}
                    <YStack alignItems="center" paddingVertical="$2">
                        <H2 fontSize="$8" fontWeight="bold" color="$color12">
                            {greeting}, User!
                        </H2>
                        <Text color="$gray10" fontSize="$4" fontWeight="500">
                            {format(today, "EEEE, d MMMM yyyy")}
                        </Text>
                    </YStack>

                    {/* Progress Tugas */}
                    <DashboardCard
                        title="Progress Tugas"
                        icon=""
                        type="progress"
                        progress={taskProgress}
                        completedTasks={completedTasks}
                        totalTasks={tasks.length}
                    />

                    {/* Mood Minggu Ini */}
                    <DashboardCard
                        title="Mood Minggu Ini"
                        icon=""
                        type="weekly-mood"
                        journals={journalEntries}
                    />

                    {/* Tugas Hari Ini */}
                    <DashboardCard
                        title="Tugas Hari Ini"
                        icon=""
                        type="tasks"
                        tasks={todayTasks}
                        onToggleTask={toggleTask}
                        onViewAllTasks={() => router.push("/tasks")}
                    />

                    {/* Jurnal Terbaru */}
                    <DashboardCard
                        title="Jurnal Terbaru"
                        icon=""
                        type="recent-journals"
                        journals={journalEntries}
                        onViewAllJournals={() => router.push("/journal")}
                    />
                </YStack>
            </ScrollView>
        </YStack>
    );
};

export default Dashboard;
