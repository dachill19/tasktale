import { SubTask, TaskWithSubTasks } from "@/lib/task";
import { DateTime } from "luxon";
import { create } from "zustand";

interface TaskDialogState {
    title: string;
    description: string;
    priority: "high" | "medium" | "low";
    deadline: Date | null;
    subTasks: SubTask[];
    isLoading: boolean;
    showDatePicker: boolean;
    nextSubTaskId: number;
    setTitle: (title: string) => void;
    setDescription: (description: string) => void;
    setPriority: (priority: "high" | "medium" | "low") => void;
    setDeadline: (deadline: Date | null) => void;
    addSubTask: () => void;
    updateSubTask: (id: string, title: string) => void;
    removeSubTask: (id: string) => void;
    setLoading: (isLoading: boolean) => void;
    toggleDatePicker: (show?: boolean) => void;
    resetForm: () => void;
    populateForm: (task: TaskWithSubTasks) => void;
}

export const useTaskDialogStore = create<TaskDialogState>((set) => ({
    title: "",
    description: "",
    priority: "medium",
    deadline: null,
    subTasks: [],
    isLoading: false,
    showDatePicker: false,
    nextSubTaskId: 0,

    setTitle: (title) => set({ title }),
    setDescription: (description) => set({ description }),
    setPriority: (priority) => set({ priority }),
    setDeadline: (deadline) => set({ deadline }),
    addSubTask: () =>
        set((state) => ({
            subTasks: [
                ...state.subTasks,
                {
                    id: `temp-${state.nextSubTaskId}`,
                    task_id: "",
                    title: "",
                    completed: false,
                },
            ],
            nextSubTaskId: state.nextSubTaskId + 1,
        })),
    updateSubTask: (id, title) =>
        set((state) => ({
            subTasks: state.subTasks.map((st) =>
                st.id === id ? { ...st, title } : st
            ),
        })),
    removeSubTask: (id) =>
        set((state) => ({
            subTasks: state.subTasks.filter((st) => st.id !== id),
        })),
    setLoading: (isLoading) => set({ isLoading }),
    toggleDatePicker: (show) =>
        set((state) => ({ showDatePicker: show ?? !state.showDatePicker })),
    resetForm: () =>
        set({
            title: "",
            description: "",
            priority: "medium",
            deadline: null,
            subTasks: [],
            isLoading: false,
            showDatePicker: false,
            nextSubTaskId: 0,
        }),
    populateForm: (task) =>
        set((state) => {
            let nextId = state.nextSubTaskId;
            const subTasks =
                task.sub_tasks?.map((st) => ({
                    id: st.id || `temp-${nextId++}`,
                    task_id: st.task_id,
                    title: st.title,
                    completed: st.completed,
                })) || [];
            const parsedDeadline = task.deadline
                ? DateTime.fromISO(task.deadline, { zone: "utc" })
                      .toLocal()
                      .toJSDate()
                : null;
            return {
                title: task.title,
                description: task.description || "",
                priority: task.priority,
                deadline:
                    parsedDeadline && !isNaN(parsedDeadline.getTime())
                        ? parsedDeadline
                        : null,
                subTasks,
                nextSubTaskId: nextId,
            };
        }),
}));
