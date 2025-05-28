import FilterToggleGroup from "@/components/FilterToggleGroup";
import TaskCard from "@/components/TaskCard";
import { TaskDialog } from "@/components/TaskDialog";
import {
    deleteTask,
    getCurrentUserId,
    getFilteredTasks,
    SubTask,
    TaskWithSubTasks,
    transformTaskForCard,
    updateSubTaskStatus,
    updateTaskStatus
} from "@/utils/task";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, RefreshControl } from "react-native";
import { Button, Text, YStack } from "tamagui";

const Tasks = () => {
    const [filter, setFilter] = useState("all");
    const params = useLocalSearchParams();
    const [open, setOpen] = useState(false);
    
    // State untuk data dari Supabase
    const [tasks, setTasks] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    useEffect(() => {
        if (params.openDialog === "true") {
            setOpen(true);
            router.replace("/tasks");
        }
    }, [params]);

    // Get current user ID saat komponen mount
    useEffect(() => {
        initializeUser();
    }, []);

    // Load tasks ketika user atau filter berubah
    useEffect(() => {
        if (currentUserId) {
            loadTasks();
        }
    }, [currentUserId, filter]);

    // Refresh tasks ketika komponen focus (kembali dari screen lain)
    useFocusEffect(
        useCallback(() => {
            if (currentUserId) {
                loadTasks();
            }
        }, [currentUserId, filter])
    );

    const initializeUser = async () => {
        const result = await getCurrentUserId();
        if (result.success && result.userId) {
            setCurrentUserId(result.userId);
        } else {
            Alert.alert('Error', 'Please login to view tasks');
            // Redirect ke login jika perlu
            // router.replace('/login');
        }
    };

    const loadTasks = async () => {
        if (!currentUserId) return;

        try {
            setIsLoading(true);
            const result = await getFilteredTasks(currentUserId, filter as any);
            
            if (result.success && result.data) {
                // Transform data untuk TaskCard
                const transformedTasks = result.data.map(transformTaskForCard);
                setTasks(transformedTasks);
            } else {
                Alert.alert('Error', result.error || 'Failed to load tasks');
                setTasks([]);
            }
        } catch (error) {
            console.error('Error loading tasks:', error);
            Alert.alert('Error', 'An unexpected error occurred');
            setTasks([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await loadTasks();
        setIsRefreshing(false);
    };

    const handleEdit = (id: string) => {
        // TODO: Implement edit functionality
        console.log('Edit task:', id);
        // Bisa buka dialog edit atau navigate ke edit screen
    };

    const handleDelete = async (id: string) => {
        Alert.alert(
            'Delete Task',
            'Are you sure you want to delete this task?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        const result = await deleteTask(id);
                        if (result.success) {
                            // Remove dari state lokal
                            setTasks(prev => prev.filter(task => task.id !== id));
                            Alert.alert('Success', 'Task deleted successfully');
                        } else {
                            Alert.alert('Error', result.error || 'Failed to delete task');
                        }
                    },
                },
            ]
        );
    };

    const handleToggleComplete = async (id: string, completed: boolean) => {
        try {
            const result = await updateTaskStatus(id, completed);
            if (result.success) {
                // Update state lokal
                setTasks(prev => 
                    prev.map(task => 
                        task.id === id ? { ...task, completed } : task
                    )
                );
            } else {
                Alert.alert('Error', result.error || 'Failed to update task');
            }
        } catch (error) {
            console.error('Error updating task:', error);
            Alert.alert('Error', 'An unexpected error occurred');
        }
    };

        const handleToggleSubTask = async (subTaskId: string, completed: boolean) => {
        try {
            const result = await updateSubTaskStatus(subTaskId, completed);
            if (result.success) {
                // Update state lokal
                setTasks(prev => 
                    prev.map(task => {
                        if (!task.subTasks) return task;
                        
                        // Update subtask dengan type assertion
                        const updatedSubTasks = task.subTasks.map((subTask: SubTask) => 
                            subTask.id === subTaskId 
                                ? { ...subTask, completed } 
                                : subTask
                        );
                        
                        // Hitung ulang completedCount
                        const newCompletedCount = updatedSubTasks.filter((st: SubTask) => st.completed).length;
                        
                        return {
                            ...task,
                            subTasks: updatedSubTasks,
                            completedCount: updatedSubTasks.length > 0 ? newCompletedCount : undefined
                        };
                    })
                );
            } else {
                Alert.alert('Error', result.error || 'Failed to update subtask');
            }
        } catch (error) {
            console.error('Error updating subtask:', error);
            Alert.alert('Error', 'An unexpected error occurred');
        }
    };
    
    const handleSave = () => {
        console.log("Task saved");
        setOpen(false);
        // Refresh tasks setelah menambah task baru
        loadTasks();
    };

    const handleCancel = () => {
        console.log("Cancel clicked");
        setOpen(false);
    };

    const handleTaskCreated = (newTask: TaskWithSubTasks) => {
        console.log('New task created:', newTask);
        // Transform dan tambahkan ke state lokal
        const transformedTask = transformTaskForCard(newTask);
        setTasks(prev => [transformedTask, ...prev]);
    };

    const toggleItems = [
        { value: "all", label: "All" },
        { value: "active", label: "Active" },
        { value: "done", label: "Done" },
        { value: "today", label: "Today" },
    ];

    // Loading state
    if (isLoading && tasks.length === 0) {
        return (
            <YStack
                flex={1}
                backgroundColor="$background"
                paddingHorizontal="$4"
                alignItems="center"
                justifyContent="center"
            >
                <Text fontSize="$5" color="$color10">
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
        >
            <TaskDialog
                open={open}
                onOpenChange={setOpen}
                onSave={handleSave}
                onCancel={handleCancel}
                onTaskCreated={handleTaskCreated}
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

            {tasks.length === 0 ? (
                <YStack
                    flex={1}
                    alignItems="center"
                    justifyContent="center"
                    gap="$4"
                >
                    <Text fontSize="$5" color="$color8" textAlign="center">
                        {filter === 'all' 
                            ? 'No tasks yet. Create your first task!' 
                            : `No ${filter} tasks found.`
                        }
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
                    contentContainerStyle={{ paddingBottom: 100, width: "100%" }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={handleRefresh}
                            colors={['#10b981']} // Green color
                        />
                    }
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
                            onToggleComplete={(completed) => 
                                handleToggleComplete(item.id, completed)
                            }
                            onToggleSubTask={handleToggleSubTask}
                        />
                    )}
                />
            )}
        </YStack>
    );
};

export default Tasks;
