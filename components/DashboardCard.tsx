import { ChevronRight } from "@tamagui/lucide-icons";
import { DateTime } from "luxon";
import React from "react";
import { TouchableOpacity } from "react-native";
import {
    Progress,
    Separator,
    Stack,
    Text,
    View,
    XStack,
    YStack,
} from "tamagui";

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
                return "$orange10";
            case "low":
                return "$green10";
            default:
                return "$gray10";
        }
    };

    const getPriorityBgColor = (priority: "high" | "medium" | "low") => {
        switch (priority) {
            case "high":
                return "$red4";
            case "medium":
                return "$orange4";
            case "low":
                return "$green4";
            default:
                return "$gray4";
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

    const renderPriorityBadge = (priority: "high" | "medium" | "low") => (
        <Stack
            bg={getPriorityBgColor(priority)}
            borderRadius="$8"
            padding="$2"
            alignItems="center"
        >
            <View
                width={12}
                height={12}
                backgroundColor={getPriorityColor(priority)}
                borderRadius="$10"
            />
        </Stack>
    );

    const renderEmptyState = (
        emoji: string,
        title: string,
        subtitle: string,
        bgColor: string = "$gray2"
    ) => (
        <YStack
            alignItems="center"
            justifyContent="center"
            paddingVertical="$6"
            borderRadius="$4"
            backgroundColor={bgColor}
            gap="$2"
        >
            <Text fontSize="$7">{emoji}</Text>
            <YStack alignItems="center" gap="$1">
                <Text color="$gray12" fontSize="$4" fontWeight="600">
                    {title}
                </Text>
                <Text color="$gray10" fontSize="$3">
                    {subtitle}
                </Text>
            </YStack>
        </YStack>
    );

    const renderContent = () => {
        switch (type) {
            case "progress":
                return (
                    <YStack gap="$4">
                        <YStack gap="$3">
                            <Progress
                                value={progress || 0}
                                height="$1"
                                backgroundColor="$gray4"
                                borderRadius="$10"
                            >
                                <Progress.Indicator
                                    backgroundColor="$blue9"
                                    borderRadius="$10"
                                />
                            </Progress>
                            <XStack
                                justifyContent="space-between"
                                alignItems="center"
                            >
                                <Text
                                    color="$gray11"
                                    fontSize="$3"
                                    fontWeight="500"
                                >
                                    {completedTasks || 0} of {totalTasks || 0}{" "}
                                    completed
                                </Text>
                                <XStack
                                    bg={
                                        (progress || 0) === 100
                                            ? "$green3"
                                            : "$blue3"
                                    }
                                    paddingHorizontal="$3"
                                    paddingVertical="$1.5"
                                    borderRadius="$8"
                                >
                                    <Text
                                        fontWeight="600"
                                        fontSize="$3"
                                        color={
                                            (progress || 0) === 100
                                                ? "$green11"
                                                : "$blue11"
                                        }
                                    >
                                        {progress || 0}%
                                    </Text>
                                </XStack>
                            </XStack>
                        </YStack>
                    </YStack>
                );

            case "tasks":
                return (
                    <YStack gap="$2">
                        <XStack
                            bg="$purple3"
                            paddingHorizontal="$3"
                            paddingVertical="$1.5"
                            borderRadius="$8"
                            alignSelf="flex-start"
                        >
                            <Text
                                fontSize="$3"
                                color="$purple11"
                                fontWeight="600"
                            >
                                {tasks.length}{" "}
                                {tasks.length === 1 ? "task" : "tasks"}
                            </Text>
                        </XStack>

                        {tasks.length ? (
                            <YStack>
                                {tasks.map((task, index) => (
                                    <YStack key={task.id}>
                                        <XStack
                                            alignItems="flex-start"
                                            gap="$2"
                                            paddingVertical="$2"
                                        >
                                            {renderPriorityBadge(task.priority)}
                                            <YStack flex={1} gap="$1.5">
                                                <Text
                                                    color={
                                                        task.completed
                                                            ? "$gray9"
                                                            : "$gray12"
                                                    }
                                                    textDecorationLine={
                                                        task.completed
                                                            ? "line-through"
                                                            : "none"
                                                    }
                                                    fontSize="$4"
                                                    fontWeight="500"
                                                    lineHeight="$1"
                                                >
                                                    {task.title}
                                                </Text>
                                                {task.dueDate && (
                                                    <Text
                                                        fontSize="$3"
                                                        color="$gray10"
                                                    >
                                                        Due{" "}
                                                        {formatDate(
                                                            task.dueDate
                                                        )}
                                                    </Text>
                                                )}
                                                {task.subTasks &&
                                                    task.subTasks.length >
                                                        0 && (
                                                        <YStack gap="$2">
                                                            {task.subTasks.map(
                                                                (subTask) => (
                                                                    <XStack
                                                                        key={
                                                                            subTask.id
                                                                        }
                                                                        alignItems="center"
                                                                        gap="$2"
                                                                    >
                                                                        <View
                                                                            width={
                                                                                3
                                                                            }
                                                                            height={
                                                                                3
                                                                            }
                                                                            backgroundColor="$gray8"
                                                                            borderRadius="$10"
                                                                        />
                                                                        <Text
                                                                            color={
                                                                                subTask.completed
                                                                                    ? "$gray8"
                                                                                    : "$gray11"
                                                                            }
                                                                            textDecorationLine={
                                                                                subTask.completed
                                                                                    ? "line-through"
                                                                                    : "none"
                                                                            }
                                                                            fontSize="$3"
                                                                        >
                                                                            {
                                                                                subTask.title
                                                                            }
                                                                        </Text>
                                                                    </XStack>
                                                                )
                                                            )}
                                                        </YStack>
                                                    )}
                                            </YStack>
                                        </XStack>
                                        {index < tasks.length - 1 && (
                                            <Separator
                                                borderColor="$gray5"
                                                marginVertical="$2"
                                            />
                                        )}
                                    </YStack>
                                ))}
                            </YStack>
                        ) : (
                            renderEmptyState(
                                "🎉",
                                "No tasks today",
                                "Great job staying on top of things!"
                            )
                        )}
                    </YStack>
                );

            case "recent-journals":
                return (
                    <YStack gap="$2">
                        {journals.length ? (
                            <YStack gap="$2">
                                {journals.slice(0, 3).map((entry, index) => (
                                    <YStack key={entry.id}>
                                        <YStack gap="$2" paddingVertical="$2">
                                            <XStack
                                                justifyContent="space-between"
                                                alignItems="flex-start"
                                            >
                                                <XStack
                                                    gap="$2"
                                                    alignItems="center"
                                                    flex={1}
                                                >
                                                    <Text fontSize="$6">
                                                        {getMoodEmoji(
                                                            entry.mood
                                                        )}
                                                    </Text>
                                                    <YStack flex={1}>
                                                        <Text
                                                            fontSize="$4"
                                                            color="$gray12"
                                                            fontWeight="600"
                                                        >
                                                            {formatDate(
                                                                entry.date
                                                            )}
                                                        </Text>
                                                        <Text
                                                            fontSize="$3"
                                                            color="$gray10"
                                                            textTransform="capitalize"
                                                        >
                                                            Feeling {entry.mood}
                                                        </Text>
                                                    </YStack>
                                                </XStack>
                                                {entry.hasMedia && (
                                                    <XStack
                                                        bg="$blue3"
                                                        paddingHorizontal="$2.5"
                                                        paddingVertical="$1.5"
                                                        borderRadius="$8"
                                                        alignItems="center"
                                                        gap="$1.5"
                                                    >
                                                        <Text fontSize="$3">
                                                            📎
                                                        </Text>
                                                        <Text
                                                            fontSize="$2"
                                                            color="$blue11"
                                                            fontWeight="500"
                                                        >
                                                            Media
                                                        </Text>
                                                    </XStack>
                                                )}
                                            </XStack>
                                            <Text
                                                fontSize="$3"
                                                color="$gray11"
                                                numberOfLines={2}
                                                lineHeight="$2"
                                            >
                                                {entry.content}
                                            </Text>
                                        </YStack>
                                        {index <
                                            Math.min(journals.length, 3) -
                                                1 && (
                                            <Separator
                                                borderColor="$gray5"
                                                marginVertical="$1"
                                            />
                                        )}
                                    </YStack>
                                ))}
                            </YStack>
                        ) : (
                            renderEmptyState(
                                "📔",
                                "No journals yet",
                                "Start writing today!"
                            )
                        )}
                    </YStack>
                );

            case "weekly-mood":
                const weeklyMoodStats = getWeeklyMoodStats();

                if (weeklyMoodStats.length === 0) {
                    return renderEmptyState(
                        "📊",
                        "No moods recorded",
                        "Track your mood this week"
                    );
                }

                return (
                    <YStack gap="$2">
                        <XStack
                            justifyContent="center"
                            alignItems="flex-end"
                            gap="$2"
                            paddingVertical="$2"
                            flexWrap="wrap"
                        >
                            {weeklyMoodStats
                                .slice(0, 5)
                                .map(([mood, count], index) => (
                                    <YStack
                                        key={mood}
                                        alignItems="center"
                                        gap="$2"
                                    >
                                        <YStack
                                            alignItems="center"
                                            justifyContent="center"
                                            bg={
                                                index === 0
                                                    ? "$green3"
                                                    : "$gray3"
                                            }
                                            borderRadius="$8"
                                            width={index === 0 ? 56 : 48}
                                            height={index === 0 ? 56 : 48}
                                        >
                                            <Text
                                                fontSize={
                                                    index === 0 ? "$7" : "$6"
                                                }
                                            >
                                                {getMoodEmoji(mood)}
                                            </Text>
                                        </YStack>
                                        <YStack alignItems="center" gap="$0.5">
                                            <Text
                                                fontWeight="600"
                                                fontSize="$4"
                                                color={
                                                    index === 0
                                                        ? "$green11"
                                                        : "$gray12"
                                                }
                                            >
                                                {count}
                                            </Text>
                                            <Text
                                                fontSize="$2"
                                                color="$gray10"
                                                textTransform="capitalize"
                                            >
                                                {mood}
                                            </Text>
                                        </YStack>
                                    </YStack>
                                ))}
                        </XStack>

                        {weeklyMoodStats.length > 0 && (
                            <XStack
                                bg="$green3"
                                padding="$3"
                                borderRadius="$4"
                                justifyContent="center"
                            >
                                <Text
                                    textAlign="center"
                                    color="$green11"
                                    fontSize="$3"
                                    fontWeight="500"
                                >
                                    Most frequent:{" "}
                                    {getMoodEmoji(weeklyMoodStats[0][0])}{" "}
                                    {weeklyMoodStats[0][0]} (
                                    {weeklyMoodStats[0][1]}{" "}
                                    {weeklyMoodStats[0][1] === 1
                                        ? "day"
                                        : "days"}
                                    )
                                </Text>
                            </XStack>
                        )}
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
                    <YStack gap="$2">
                        <XStack
                            bg="$red3"
                            paddingHorizontal="$3"
                            paddingVertical="$1.5"
                            borderRadius="$8"
                            alignSelf="flex-start"
                        >
                            <Text fontSize="$3" color="$red11" fontWeight="600">
                                {overdueTasks.length} overdue{" "}
                                {overdueTasks.length === 1 ? "task" : "tasks"}
                            </Text>
                        </XStack>

                        {overdueTasks.length ? (
                            <YStack>
                                {overdueTasks.map((task, index) => (
                                    <YStack key={task.id}>
                                        <XStack
                                            alignItems="flex-start"
                                            gap="$2"
                                            paddingVertical="$2"
                                        >
                                            {renderPriorityBadge(task.priority)}
                                            <YStack flex={1} gap="$2">
                                                <Text
                                                    color="$gray12"
                                                    fontSize="$4"
                                                    fontWeight="500"
                                                >
                                                    {task.title}
                                                </Text>
                                                <XStack
                                                    bg="$red3"
                                                    paddingHorizontal="$2.5"
                                                    paddingVertical="$1"
                                                    borderRadius="$6"
                                                    alignSelf="flex-start"
                                                >
                                                    <Text
                                                        color="$red11"
                                                        fontSize="$2"
                                                        fontWeight="500"
                                                    >
                                                        Due{" "}
                                                        {formatDate(
                                                            task.dueDate!
                                                        )}
                                                    </Text>
                                                </XStack>
                                                {task.subTasks &&
                                                    task.subTasks.length >
                                                        0 && (
                                                        <YStack gap="$2">
                                                            {task.subTasks.map(
                                                                (subTask) => (
                                                                    <XStack
                                                                        key={
                                                                            subTask.id
                                                                        }
                                                                        alignItems="center"
                                                                        gap="$2"
                                                                    >
                                                                        <View
                                                                            width={
                                                                                3
                                                                            }
                                                                            height={
                                                                                3
                                                                            }
                                                                            backgroundColor="$gray8"
                                                                            borderRadius="$10"
                                                                        />
                                                                        <Text
                                                                            color={
                                                                                subTask.completed
                                                                                    ? "$gray8"
                                                                                    : "$gray11"
                                                                            }
                                                                            textDecorationLine={
                                                                                subTask.completed
                                                                                    ? "line-through"
                                                                                    : "none"
                                                                            }
                                                                            fontSize="$3"
                                                                        >
                                                                            {
                                                                                subTask.title
                                                                            }
                                                                        </Text>
                                                                    </XStack>
                                                                )
                                                            )}
                                                        </YStack>
                                                    )}
                                            </YStack>
                                        </XStack>
                                        {index < overdueTasks.length - 1 && (
                                            <Separator
                                                borderColor="$gray5"
                                                marginVertical="$2"
                                            />
                                        )}
                                    </YStack>
                                ))}
                            </YStack>
                        ) : (
                            renderEmptyState(
                                "🎉",
                                "No overdue tasks",
                                "You're all caught up!",
                                "$green2"
                            )
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
                marginBottom="$4"
            >
                <XStack alignItems="center" gap="$3">
                    {icon && <Text fontSize="$5">{icon}</Text>}
                    <Text fontWeight="700" fontSize="$5" color="$gray12">
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
                        <YStack
                            bg="$gray4"
                            padding="$2.5"
                            borderRadius="$8"
                            pressStyle={{
                                backgroundColor: "$gray6",
                                scale: 0.95,
                            }}
                        >
                            <ChevronRight size="$1" color="$gray11" />
                        </YStack>
                    </TouchableOpacity>
                )}
            </XStack>
            {renderContent()}
        </YStack>
    );
};

export default DashboardCard;
