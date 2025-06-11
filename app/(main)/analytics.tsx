// Analytics.tsx
import {
    MoodDistributionCard,
    MoodTrendCard,
    ProductivityCard,
    TaskCompletionCard,
    WeeklySummaryCard,
} from "@/components/AnalyticsCard";
import React from "react";
import { ScrollView } from "react-native";
import { Text, YStack } from "tamagui";

// Mock data
const taskCompletionData = {
    labels: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"],
    datasets: [
        {
            data: [4, 5, 2, 3, 6, 3, 1],
            color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`, // Green for completed
            strokeWidth: 2,
        },
        {
            data: [5, 6, 7, 4, 8, 3, 2],
            color: (opacity = 1) => `rgba(156, 163, 175, ${opacity})`, // Gray for total
            strokeWidth: 2,
        },
    ],
};

const moodTrendData = {
    labels: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"],
    datasets: [
        {
            data: [8, 7, 4, 6, 8, 9, 7],
            color: (opacity = 1) => `rgba(251, 146, 60, ${opacity})`, // Orange
            strokeWidth: 3,
        },
    ],
};

const productivityData = {
    labels: ["8-10", "10-12", "12-14", "14-16", "16-18", "18-20"],
    datasets: [
        {
            data: [65, 82, 45, 78, 60, 40],
            color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`, // Blue
        },
    ],
};

const moodDistribution = [
    {
        name: "Senang",
        population: 42,
        color: "#FCD34D",
        legendFontColor: "#7F7F7F",
        legendFontSize: 12,
    },
    {
        name: "Biasa",
        population: 28,
        color: "#34D399",
        legendFontColor: "#7F7F7F",
        legendFontSize: 12,
    },
    {
        name: "Lelah",
        population: 15,
        color: "#9CA3AF",
        legendFontColor: "#7F7F7F",
        legendFontSize: 12,
    },
    {
        name: "Sedih",
        population: 10,
        color: "#60A5FA",
        legendFontColor: "#7F7F7F",
        legendFontSize: 12,
    },
    {
        name: "Marah",
        population: 5,
        color: "#F87171",
        legendFontColor: "#7F7F7F",
        legendFontSize: 12,
    },
];

const weeklySummaryStats = {
    totalTasks: 35,
    taskIncrease: "+12%",
    completionRate: 78,
    completionIncrease: "+5%",
    averageMood: 7.2,
    moodIncrease: "+0.5",
    mostProductiveDay: "Jumat",
};

const Analytics = () => {
    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: "#ffffff" }}
            showsVerticalScrollIndicator={false}
        >
            <YStack
                flex={1}
                backgroundColor="$background"
                paddingHorizontal="$4"
                paddingBottom={100}
            >
                {/* Header */}
                <Text
                    fontSize="$8"
                    fontWeight="bold"
                    fontFamily="$display"
                    color="$color10"
                    marginVertical="$4"
                    textAlign="center"
                >
                    Analytics Dashboard
                </Text>

                {/* Task Completion Chart */}
                <TaskCompletionCard
                    title="Penyelesaian Tugas"
                    icon="📊"
                    data={taskCompletionData}
                />

                {/* Mood Trend Chart */}
                <MoodTrendCard
                    title="Tren Suasana Hati"
                    icon="😊"
                    data={moodTrendData}
                />

                {/* Mood Distribution Chart */}
                <MoodDistributionCard
                    title="Distribusi Suasana Hati"
                    icon="🥧"
                    data={moodDistribution}
                />

                {/* Productivity Chart */}
                <ProductivityCard
                    title="Produktivitas berdasarkan Waktu"
                    icon="⏰"
                    data={productivityData}
                />

                {/* Weekly Summary */}
                <WeeklySummaryCard
                    title="Ringkasan Mingguan"
                    icon="📋"
                    stats={weeklySummaryStats}
                />
            </YStack>
        </ScrollView>
    );
};

export default Analytics;
