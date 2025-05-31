import FilterToggleGroup from "@/components/FilterToggleGroup";
import TaskCard from "@/components/task/TaskCard";
import { TaskDialog } from "@/components/task/TaskDialog";
import { useTaskStore } from "@/lib/stores/taskStore";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { DateTime } from "luxon";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, RefreshControl } from "react-native";
import { Button, Spinner, Text, YStack } from "tamagui";

const Tasks = () => {
    const {
        tasks,
        filter,
        loading,
        error,
        currentUserId,
        taskToEdit,
        setFilter,
        setTaskToEdit,
        fetchFilteredTasks,
        initializeUser,
        updateTaskStatus,
        updateSubTaskStatus,
        deleteTask,
    } = useTaskStore();
    const params = useLocalSearchParams();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (params.openDialog === "true") {
            setOpen(true);
            router.replace("/tasks");
        }
    }, [params]);

    useEffect(() => {
        initializeUser();
    }, [initializeUser]);

    useFocusEffect(
        useCallback(() => {
            if (currentUserId) {
                fetchFilteredTasks(currentUserId, filter);
            }
        }, [currentUserId, filter, fetchFilteredTasks])
    );

    const handleRefresh = useCallback(async () => {
        if (currentUserId) {
            await fetchFilteredTasks(currentUserId, filter);
        }
    }, [currentUserId, filter, fetchFilteredTasks]);

    const handleEdit = useCallback(
        (id: string) => {
            const task = tasks.find((t) => t.id === id);
            if (task) {
                console.log("Setting taskToEdit:", task);
                const parsedDeadline = task.originalDeadline
                    ? DateTime.fromISO(task.originalDeadline, {
                          zone: "utc",
                      }).toLocal().toJSDate()
                    : null;
                setTaskToEdit({
                    id: task.id,
                    title: task.title,
                    description: task.description || "",
                    priority: task.originalPriority as
                        | "high"
                        | "medium"
                        | "low",
                    completed: task.completed,
                    deadline: parsedDeadline
                        ? parsedDeadline.toISOString()
                        : null,
                    sub_tasks:
                        task.subTasks?.map((st: any) => ({
                            id: st.id,
                            task_id: task.id,
                            title: st.title,
                            completed: st.completed,
                        })) || [],
                });
                setOpen(true);
            }
        },
        [tasks, setTaskToEdit]
    );

    const handleDelete = useCallback(
        (id: string) => {
            Alert.alert(
                "Delete Task",
                "Are you sure you want to delete this task?",
                [
                    {
                        text: "Cancel",
                        style: "cancel",
                    },
                    {
                        text: "Delete",
                        style: "destructive",
                        onPress: async () => {
                            const result = await deleteTask(id);
                            if (!result.success) {
                                Alert.alert(
                                    "Error",
                                    result.error || "Failed to delete task"
                                );
                            }
                        },
                    },
                ]
            );
        },
        [deleteTask]
    );

    const handleSave = useCallback(() => {
        setOpen(false);
        if (currentUserId) {
            fetchFilteredTasks(currentUserId, filter);
        }
    }, [currentUserId, filter, fetchFilteredTasks]);

    const handleCancel = useCallback(() => {
        setOpen(false);
        setTaskToEdit(null);
    }, [setTaskToEdit]);

    const toggleItems = [
        { value: "all", label: "All" },
        { value: "active", label: "Active" },
        { value: "done", label: "Done" },
        { value: "today", label: "Today" },
    ];

    if (loading && tasks.length === 0) {
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
                    Loading tasks...
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
            <TaskDialog
                open={open}
                onOpenChange={(isOpen) => {
                    setOpen(isOpen);
                    if (!isOpen) setTaskToEdit(null);
                }}
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
                Tasks
            </Text>
            <FilterToggleGroup
                items={toggleItems}
                selectedValue={filter}
                onValueChange={(value) => setFilter(value as any)}
            />
            {tasks.length === 0 ? (
                <YStack
                    flex={1}
                    alignItems="center"
                    justifyContent="center"
                    gap="$4"
                >
                    <Text fontSize="$5" color="$color8" textAlign="center">
                        {filter === "all"
                            ? "No tasks yet. Create your first task!"
                            : `No ${filter} tasks found.`}
                    </Text>
                    <Button
                        backgroundColor="$green10"
                        color="white"
                        onPress={() => setOpen(true)}
                    >
                        Add Task
                    </Button>
                </YStack>
            ) : (
                <FlatList
                    data={tasks}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ width: "100%" }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={loading}
                            onRefresh={handleRefresh}
                            colors={["#10b981"]}
                        />
                    }
                    renderItem={({ item }) => (
                        <TaskCard
                            title={item.title}
                            description={item.description}
                            priority={item.priority}
                            deadline={item.deadline}
                            completedCount={item.completedCount}
                            totalCount={item.totalCount}
                            subTasks={item.subTasks}
                            completed={item.completed}
                            onEdit={() => handleEdit(item.id)}
                            onDelete={() => handleDelete(item.id)}
                            onToggleComplete={(completed) =>
                                updateTaskStatus(item.id, completed)
                            }
                            onToggleSubTask={updateSubTaskStatus}
                        />
                    )}
                />
            )}
            {error && (
                <Text color="$red10" marginTop="$2">
                    {error}
                </Text>
            )}
        </YStack>
    );
};

export default Tasks;
