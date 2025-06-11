import { ChevronRight } from "@tamagui/lucide-icons";
import { DateTime } from "luxon";
import React from "react";
import { TouchableOpacity } from "react-native";
import { Progress, Separator, Text, View, XStack, YStack } from "tamagui";

interface TaskItem {
    id: string;
    title: string;
    completed: boolean;
    priority: "high" | "medium" | "low";
    dueDate?: string;
    subTasks?: { id: string; title: string; completed: boolean }[];
}

interface JournalItem {
    id: string;
    date: string;
    mood: string;
    content: string;
    hasMedia: boolean;
}

interface DashboardCardProps {
    title: string;
    icon: React.ReactNode;
    type:
        | "progress"
        | "tasks"
        | "recent-journals"
        | "weekly-mood"
        | "overdue-tasks";
    progress?: number;
    completedTasks?: number;
    totalTasks?: number;
    tasks?: TaskItem[];
    onToggleTask?: (taskId: string) => void;
    onViewAllTasks?: () => void;
    journals?: JournalItem[];
    onViewAllJournals?: () => void;
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

const DashboardCard: React.FC<DashboardCardProps> = ({
    title,
    icon,
    type,
    progress,
    completedTasks,
    totalTasks,
    tasks = [],
    onToggleTask,
    onViewAllTasks,
    journals = [],
    onViewAllJournals,
}) => {
    const today = DateTime.local({ zone: "Asia/Jakarta" });

    const isTaskOverdue = (dueDate: string): boolean => {
        try {
            const taskDate = DateTime.fromISO(dueDate, {
                zone: "Asia/Jakarta",
            });
            if (!taskDate.isValid) return false;
            return taskDate < today.startOf("day");
        } catch {
            return false;
        }
    };

    const getPriorityColor = (priority: "high" | "medium" | "low") => {
        switch (priority) {
            case "high":
                return "$red10";
            case "medium":
                return "$yellow10";
            case "low":
                return "$green10";
            default:
                return "$gray10";
        }
    };

    const getMoodEmoji = (mood: string) => {
        return moodEmojis[mood] ?? "😐";
    };

    const formatDate = (dateString: string) => {
        const date = DateTime.fromISO(dateString, { zone: "Asia/Jakarta" });
        return date.isValid
            ? date.toLocaleString({
                  day: "numeric",
                  month: "short",
                  year: "numeric",
              })
            : "Invalid date";
    };

    const getWeeklyMoodStats = () => {
        const oneWeekAgo = today.minus({ days: 7 });

        const weeklyJournals = journals.filter((journal) => {
            const journalDate = DateTime.fromISO(journal.date, {
                zone: "Asia/Jakarta",
            });
            return journalDate >= oneWeekAgo && journalDate <= today;
        });

        const moodCount: Record<string, number> = {};
        weeklyJournals.forEach((journal) => {
            moodCount[journal.mood] = (moodCount[journal.mood] || 0) + 1;
        });

        const sortedMoods = Object.entries(moodCount)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 7);

        return sortedMoods;
    };

    const renderContent = () => {
        switch (type) {
            case "progress":
                return (
                    <YStack gap="$3">
                        <Progress
                            value={progress || 0}
                            height="$1.5"
                            backgroundColor="$gray5"
                        >
                            <Progress.Indicator backgroundColor="$blue10" />
                        </Progress>
                        <XStack
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Text color="$gray11" fontSize="$3">
                                {completedTasks || 0}/{totalTasks || 0} tasks
                                completed
                            </Text>
                            <Text
                                fontWeight="600"
                                fontSize="$4"
                                color={
                                    (progress || 0) === 100
                                        ? "$green10"
                                        : "$blue10"
                                }
                            >
                                {progress || 0}%
                            </Text>
                        </XStack>
                    </YStack>
                );

            case "tasks":
                return (
                    <YStack gap="$3">
                        <XStack
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Text fontSize="$3" color="$gray10">
                                {tasks.length} tasks
                            </Text>
                        </XStack>
                        {tasks.length ? (
                            <YStack gap="$1">
                                {tasks.map((task, index) => (
                                    <YStack key={task.id}>
                                        <XStack
                                            alignItems="center"
                                            justifyContent="space-between"
                                            paddingVertical="$2"
                                            borderBottomWidth={
                                                index < tasks.length - 1 ? 1 : 0
                                            }
                                            borderBottomColor="$borderColor"
                                        >
                                            <XStack
                                                alignItems="center"
                                                gap="$3"
                                                flex={1}
                                            >
                                                <View
                                                    width={12}
                                                    height={12}
                                                    borderRadius={6}
                                                    backgroundColor={getPriorityColor(
                                                        task.priority
                                                    )}
                                                />
                                                <Text
                                                    flex={1}
                                                    color={
                                                        task.completed
                                                            ? "$gray8"
                                                            : "$color"
                                                    }
                                                    textDecorationLine={
                                                        task.completed
                                                            ? "line-through"
                                                            : "none"
                                                    }
                                                    fontSize="$4"
                                                >
                                                    {task.title}
                                                </Text>
                                            </XStack>
                                            <TouchableOpacity
                                                onPress={() =>
                                                    onToggleTask?.(task.id)
                                                }
                                            >
                                                <View
                                                    width={24}
                                                    height={24}
                                                    borderRadius={12}
                                                    borderWidth={2}
                                                    borderColor={
                                                        task.completed
                                                            ? "$green10"
                                                            : "$gray8"
                                                    }
                                                    backgroundColor={
                                                        task.completed
                                                            ? "$green10"
                                                            : "$background"
                                                    }
                                                    alignItems="center"
                                                    justifyContent="center"
                                                >
                                                    {task.completed && (
                                                        <Text
                                                            color="white"
                                                            fontSize="$2"
                                                            fontWeight="bold"
                                                        >
                                                            ✓
                                                        </Text>
                                                    )}
                                                </View>
                                            </TouchableOpacity>
                                        </XStack>
                                        {task.subTasks?.map((subTask) => (
                                            <XStack
                                                key={subTask.id}
                                                alignItems="center"
                                                paddingLeft="$5"
                                                paddingVertical="$1"
                                            >
                                                <Text
                                                    color={
                                                        subTask.completed
                                                            ? "$gray8"
                                                            : "$color"
                                                    }
                                                    textDecorationLine={
                                                        subTask.completed
                                                            ? "line-through"
                                                            : "none"
                                                    }
                                                    fontSize="$3"
                                                >
                                                    - {subTask.title}
                                                </Text>
                                            </XStack>
                                        ))}
                                    </YStack>
                                ))}
                            </YStack>
                        ) : (
                            <XStack
                                alignItems="center"
                                gap="$2"
                                paddingVertical="$3"
                            >
                                <Text fontSize="$4">🎉</Text>
                                <Text color="$gray10" fontSize="$4">
                                    No tasks for today
                                </Text>
                            </XStack>
                        )}
                    </YStack>
                );

            case "recent-journals":
                return (
                    <YStack gap="$3">
                        {journals.length ? (
                            <YStack>
                                {journals.slice(0, 3).map((entry, index) => (
                                    <View key={entry.id}>
                                        <YStack paddingVertical="$3">
                                            <XStack
                                                alignItems="center"
                                                justifyContent="space-between"
                                                marginBottom="$2"
                                            >
                                                <XStack
                                                    gap="$2"
                                                    alignItems="center"
                                                >
                                                    <Text fontSize="$5">
                                                        {getMoodEmoji(
                                                            entry.mood
                                                        )}
                                                    </Text>
                                                    <Text
                                                        fontSize="$3"
                                                        color="$gray10"
                                                    >
                                                        {formatDate(entry.date)}
                                                    </Text>
                                                </XStack>
                                                {entry.hasMedia && (
                                                    <XStack
                                                        alignItems="center"
                                                        gap="$1"
                                                    >
                                                        <Text
                                                            fontSize="$2"
                                                            color="$blue10"
                                                        >
                                                            📎
                                                        </Text>
                                                        <Text
                                                            fontSize="$2"
                                                            color="$blue10"
                                                        >
                                                            Media
                                                        </Text>
                                                    </XStack>
                                                )}
                                            </XStack>
                                            <Text
                                                fontSize="$3"
                                                color="$gray11"
                                                numberOfLines={3}
                                            >
                                                {entry.content}
                                            </Text>
                                        </YStack>
                                        {index <
                                            Math.min(journals.length, 3) -
                                                1 && (
                                            <Separator borderColor="$borderColor" />
                                        )}
                                    </View>
                                ))}
                            </YStack>
                        ) : (
                            <XStack
                                alignItems="center"
                                gap="$2"
                                paddingVertical="$3"
                            >
                                <Text fontSize="$4">📔</Text>
                                <Text color="$gray10" fontSize="$4">
                                    No journals yet. Start writing today!
                                </Text>
                            </XStack>
                        )}
                    </YStack>
                );

            case "weekly-mood":
                const weeklyMoodStats = getWeeklyMoodStats();

                if (weeklyMoodStats.length === 0) {
                    return (
                        <XStack
                            alignItems="center"
                            gap="$2"
                            paddingVertical="$3"
                        >
                            <Text fontSize="$4">📊</Text>
                            <Text color="$gray10" fontSize="$4">
                                No moods recorded this week
                            </Text>
                        </XStack>
                    );
                }

                return (
                    <YStack gap="$3">
                        <XStack
                            justifyContent="center"
                            alignItems="flex-end"
                            gap="$3"
                            paddingVertical="$2"
                            flexWrap="wrap"
                        >
                            {weeklyMoodStats.map(([mood, count], index) => (
                                <YStack key={mood} alignItems="center" gap="$2">
                                    <View
                                        alignItems="center"
                                        justifyContent="center"
                                        marginBottom="$2"
                                    >
                                        <Text
                                            fontSize={
                                                index === 0
                                                    ? "$9"
                                                    : index === 1
                                                    ? "$8"
                                                    : "$7"
                                            }
                                        >
                                            {getMoodEmoji(mood)}
                                        </Text>
                                    </View>
                                    <Text
                                        fontWeight="600"
                                        fontSize="$4"
                                        color="$color12"
                                    >
                                        {count}
                                    </Text>
                                </YStack>
                            ))}
                        </XStack>
                        <Text textAlign="center" color="$gray11" fontSize="$3">
                            {weeklyMoodStats.length > 0 &&
                                `Most frequent mood: ${getMoodEmoji(
                                    weeklyMoodStats[0][0]
                                )} (${weeklyMoodStats[0][1]} days)`}
                        </Text>
                    </YStack>
                );

            case "overdue-tasks":
                const overdueTasks = tasks.filter(
                    (task) =>
                        !task.completed &&
                        task.dueDate &&
                        isTaskOverdue(task.dueDate)
                );

                return (
                    <YStack gap="$3">
                        <XStack
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Text fontSize="$3" color="$gray10">
                                {overdueTasks.length} overdue tasks
                            </Text>
                        </XStack>
                        {overdueTasks.length ? (
                            <YStack gap="$1">
                                {overdueTasks.map((task, index) => (
                                    <YStack key={task.id}>
                                        <XStack
                                            alignItems="center"
                                            justifyContent="space-between"
                                            paddingVertical="$2"
                                            borderBottomWidth={
                                                index < overdueTasks.length - 1
                                                    ? 1
                                                    : 0
                                            }
                                            borderBottomColor="$borderColor"
                                        >
                                            <XStack
                                                alignItems="center"
                                                gap="$3"
                                                flex={1}
                                            >
                                                <View
                                                    width={12}
                                                    height={12}
                                                    borderRadius={6}
                                                    backgroundColor={getPriorityColor(
                                                        task.priority
                                                    )}
                                                />
                                                <YStack flex={1}>
                                                    <Text
                                                        color="$color"
                                                        fontSize="$4"
                                                    >
                                                        {task.title}
                                                    </Text>
                                                    <Text
                                                        color="$red10"
                                                        fontSize="$3"
                                                    >
                                                        Due:{" "}
                                                        {formatDate(
                                                            task.dueDate!
                                                        )}
                                                    </Text>
                                                </YStack>
                                            </XStack>
                                            <TouchableOpacity
                                                onPress={() =>
                                                    onToggleTask?.(task.id)
                                                }
                                            >
                                                <View
                                                    width={24}
                                                    height={24}
                                                    borderRadius={12}
                                                    borderWidth={2}
                                                    borderColor={
                                                        task.completed
                                                            ? "$green10"
                                                            : "$gray8"
                                                    }
                                                    backgroundColor={
                                                        task.completed
                                                            ? "$green10"
                                                            : "$background"
                                                    }
                                                    alignItems="center"
                                                    justifyContent="center"
                                                >
                                                    {task.completed && (
                                                        <Text
                                                            color="white"
                                                            fontSize="$2"
                                                            fontWeight="bold"
                                                        >
                                                            ✓
                                                        </Text>
                                                    )}
                                                </View>
                                            </TouchableOpacity>
                                        </XStack>
                                        {task.subTasks?.map((subTask) => (
                                            <XStack
                                                key={subTask.id}
                                                alignItems="center"
                                                paddingLeft="$5"
                                                paddingVertical="$1"
                                            >
                                                <Text
                                                    color={
                                                        subTask.completed
                                                            ? "$gray8"
                                                            : "$color"
                                                    }
                                                    textDecorationLine={
                                                        subTask.completed
                                                            ? "line-through"
                                                            : "none"
                                                    }
                                                    fontSize="$3"
                                                >
                                                    - {subTask.title}
                                                </Text>
                                            </XStack>
                                        ))}
                                    </YStack>
                                ))}
                            </YStack>
                        ) : (
                            <XStack
                                alignItems="center"
                                gap="$2"
                                paddingVertical="$3"
                            >
                                <Text fontSize="$4">🎉</Text>
                                <Text color="$gray10" fontSize="$4">
                                    No overdue tasks
                                </Text>
                            </XStack>
                        )}
                    </YStack>
                );

            default:
                return null;
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
            <XStack
                justifyContent="space-between"
                alignItems="center"
                marginBottom="$3"
            >
                <XStack alignItems="center" gap="$2">
                    {icon && <Text>{icon}</Text>}
                    <Text fontWeight="600" fontSize="$6" color="$color12">
                        {title}
                    </Text>
                </XStack>
                {(type === "tasks" ||
                    type === "recent-journals" ||
                    type === "overdue-tasks") && (
                    <TouchableOpacity
                        onPress={
                            type === "tasks" || type === "overdue-tasks"
                                ? onViewAllTasks
                                : onViewAllJournals
                        }
                    >
                        <ChevronRight size="$1" color="$gray10" />
                    </TouchableOpacity>
                )}
            </XStack>
            {renderContent()}
        </YStack>
    );
};

export default DashboardCard;
