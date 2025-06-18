import {
    createTask,
    deleteTask,
    getCurrentUserId,
    getFilteredTasks,
    ServiceResponse,
    TaskFilter,
    TaskFormData,
    TaskWithSubTasks,
    transformTaskForCard,
    updateSubTaskStatus,
    updateTask,
    updateTaskStatus,
} from "@/lib/task";
import { DateTime } from "luxon";
import { create } from "zustand";

interface TransformedTask {
    id: string;
    title: string;
    description?: string;
    priority: "High" | "Medium" | "Low";
    deadline: string;
    originalDeadline?: string;
    completedCount?: number;
    totalCount?: number;
    subTasks: Array<{ id: string; title: string; completed: boolean }>;
    completed: boolean;
    originalPriority: "high" | "medium" | "low";
    doneAt?: string | null;
}

interface TaskState {
    tasks: TransformedTask[];
    filter: TaskFilter;
    loading: boolean;
    error: string | null;
    currentUserId: string | null;
    taskToEdit: TaskWithSubTasks | null;
    setFilter: (filter: TaskFilter) => void;
    setTaskToEdit: (task: TaskWithSubTasks | null) => void;
    fetchFilteredTasks: (userId: string, filter: TaskFilter) => Promise<void>;
    createTask: (
        taskData: TaskFormData,
        userId: string
    ) => Promise<ServiceResponse<TaskWithSubTasks>>;
    updateTask: (
        taskId: string,
        taskData: TaskFormData
    ) => Promise<ServiceResponse<void>>;
    updateTaskStatus: (taskId: string, completed: boolean) => Promise<void>;
    updateSubTaskStatus: (
        subTaskId: string,
        completed: boolean
    ) => Promise<void>;
    deleteTask: (
        taskId: string
    ) => Promise<{ success: boolean; error?: string }>;
    initializeUser: () => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
    tasks: [],
    filter: "all",
    loading: false,
    error: null,
    currentUserId: null,
    taskToEdit: null,

    setFilter: (filter) => set({ filter }),
    setTaskToEdit: (task) => set({ taskToEdit: task }),

    fetchFilteredTasks: async (userId, filter) => {
        set({ loading: true, error: null });
        const response = await getFilteredTasks(userId, filter);
        set({
            tasks:
                response.success && response.data
                    ? response.data.map(transformTaskForCard)
                    : [],
            error: response.error || null,
            loading: false,
        });
    },

    createTask: async (taskData, userId) => {
        set({ loading: true, error: null });
        const response = await createTask(taskData, userId);
        if (response.success && response.data) {
            const newTask = transformTaskForCard(
                response.data as TaskWithSubTasks
            );
            set((state) => ({
                tasks: [newTask, ...state.tasks],
                error: null,
            }));
        } else {
            set({ error: response.error || "Failed to create task" });
        }
        set({ loading: false });
        return response;
    },

    updateTask: async (taskId, taskData) => {
        set({ loading: true, error: null });
        const response = await updateTask(taskId, taskData);
        if (response.success) {
            set((state) => ({
                tasks: state.tasks.map((task) =>
                    task.id === taskId
                        ? transformTaskForCard({
                              id: taskId,
                              title: taskData.title,
                              description: taskData.description,
                              priority: taskData.priority,
                              deadline: taskData.deadline
                                  ? DateTime.fromJSDate(taskData.deadline)
                                        .setZone("Asia/Jakarta")
                                        .toUTC()
                                        .toISO()
                                  : null,
                              sub_tasks: taskData.subTasks.map((st) => ({
                                  id: "", // Placeholder, not used
                                  task_id: taskId,
                                  title: st.title,
                                  completed: false,
                              })),
                              completed: task.completed,
                              doneAt: task.doneAt,
                          })
                        : task
                ),
                error: null,
                taskToEdit: null,
            }));
        } else {
            set({ error: response.error });
        }
        set({ loading: false });
        return response;
    },

    updateTaskStatus: async (taskId, completed) => {
        set({ loading: true, error: null });
        const response = await updateTaskStatus(taskId, completed);
        if (response.success) {
            const state = get();
            const currentTask = state.tasks.find((task) => task.id === taskId);

            set((state) => ({
                tasks: state.tasks.map((task) => {
                    if (task.id !== taskId) return task;
                    const updatedSubTasks = task.subTasks?.map((sub: any) => ({
                        ...sub,
                        completed,
                    }));
                    const newCompletedCount = updatedSubTasks?.filter(
                        (st: any) => st.completed
                    ).length;
                    return {
                        ...task,
                        completed,
                        doneAt: completed ? new Date().toISOString() : null,
                        subTasks: updatedSubTasks,
                        completedCount:
                            updatedSubTasks?.length > 0
                                ? newCompletedCount
                                : undefined,
                    };
                }),
                error: null,
            }));

            if (currentTask?.subTasks) {
                for (const subTask of currentTask.subTasks) {
                    await updateSubTaskStatus(subTask.id, completed);
                }
            }
        } else {
            set({ error: response.error });
        }
        set({ loading: false });
    },

    updateSubTaskStatus: async (subTaskId, completed) => {
        set({ loading: true, error: null });
        const response = await updateSubTaskStatus(subTaskId, completed);
        if (response.success) {
            set((state) => ({
                tasks: state.tasks.map((task) => {
                    if (!task.subTasks) return task;
                    const updatedSubTasks = task.subTasks.map((subTask: any) =>
                        subTask.id === subTaskId
                            ? { ...subTask, completed }
                            : subTask
                    );
                    const newCompletedCount = updatedSubTasks.filter(
                        (st: any) => st.completed
                    ).length;
                    return {
                        ...task,
                        subTasks: updatedSubTasks,
                        completedCount:
                            updatedSubTasks.length > 0
                                ? newCompletedCount
                                : undefined,
                    };
                }),
                error: null,
            }));
        } else {
            set({ error: response.error });
        }
        set({ loading: false });
    },

    deleteTask: async (taskId) => {
        set({ loading: true, error: null });
        const response = await deleteTask(taskId);
        if (response.success) {
            set((state) => ({
                tasks: state.tasks.filter((task) => task.id !== taskId),
                error: null,
            }));
            return { success: true };
        } else {
            set({ error: response.error });
            return {
                success: false,
                error: response.error || "Failed to delete task",
            };
        }
    },

    initializeUser: async () => {
        set({ loading: true, error: null });
        const response = await getCurrentUserId();
        set({
            currentUserId: response.success ? response.data : null,
            error: response.error || null,
            loading: false,
        });
    },
}));