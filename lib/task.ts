import { supabase } from "@/lib/supabase";

// ===== TYPES =====
export interface Task {
  id?: string;
  user_id?: string;
  title: string;
  description?: string;
  priority: "high" | "medium" | "low";
  completed: boolean;
  deadline?: string | null;
  created_at?: string;
}

export interface SubTask {
  id?: string;
  task_id: string;
  title: string;
  completed: boolean;
}

export interface TaskWithSubTasks extends Task {
  sub_tasks?: SubTask[];
}

export interface TaskFormData {
  title: string;
  description?: string;
  priority: "high" | "medium" | "low";
  deadline?: Date | null;
  subTasks: Array<{ title: string }>;
}

export type TaskFilter = "all" | "active" | "done" | "today";

export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ===== UTILITIES =====
const handleError = (error: unknown, context: string): string => {
  console.error(`${context}:`, error);
  return error instanceof Error ? error.message : "Unknown error occurred";
};

const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch (error) {
    return "Invalid date";
  }
};

// ===== CORE FUNCTIONS =====
export const getCurrentUserId = async (): Promise<ServiceResponse<string>> => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) return { success: false, error: error.message };
    if (!user) return { success: false, error: "User not authenticated" };

    return { success: true, data: user.id };
  } catch (error) {
    return {
      success: false,
      error: handleError(error, "Getting current user"),
    };
  }
};

export const createTask = async (
  taskData: TaskFormData,
  userId: string
): Promise<ServiceResponse<TaskWithSubTasks>> => {
  try {
    const { data: task, error: taskError } = await supabase
      .from("tasks")
      .insert({
        user_id: userId,
        title: taskData.title,
        description: taskData.description || null,
        priority: taskData.priority,
        completed: false,
        deadline: taskData.deadline?.toISOString() || null,
      })
      .select()
      .single();

    if (taskError) {
      return { success: false, error: taskError.message };
    }

    const validSubTasks = taskData.subTasks
      .filter((st) => st.title.trim())
      .map((st) => ({
        task_id: task.id,
        title: st.title.trim(),
        completed: false,
      }));

    let subTasks: SubTask[] = [];
    if (validSubTasks.length > 0) {
      const { data: subTasksData, error: subTasksError } = await supabase
        .from("sub_tasks")
        .insert(validSubTasks)
        .select();

      if (subTasksError) {
        return {
          success: false,
          error: `Task created but sub-tasks failed: ${subTasksError.message}`,
        };
      }
      subTasks = subTasksData || [];
    }

    return {
      success: true,
      data: { ...task, sub_tasks: subTasks },
    };
  } catch (error) {
    return { success: false, error: handleError(error, "Creating task") };
  }
};

export const getUserTasks = async (
  userId: string
): Promise<ServiceResponse<TaskWithSubTasks[]>> => {
  try {
    const { data: tasks, error } = await supabase
      .from("tasks")
      .select("*, sub_tasks (*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) return { success: false, error: error.message };
    return { success: true, data: tasks || [] };
  } catch (error) {
    return { success: false, error: handleError(error, "Fetching tasks") };
  }
};

export const getFilteredTasks = async (
  userId: string,
  filter: TaskFilter
): Promise<ServiceResponse<TaskWithSubTasks[]>> => {
  try {
    let query = supabase
      .from("tasks")
      .select("*, sub_tasks (*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    switch (filter) {
      case "active":
        query = query.eq("completed", false);
        break;
      case "done":
        query = query.eq("completed", true);
        break;
      case "today":
        const today = new Date();
        const startOfDay = new Date(today);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);

        query = query
          .gte("deadline", startOfDay.toISOString())
          .lte("deadline", endOfDay.toISOString());
        break;
    }

    const { data: tasks, error } = await query;
    if (error) return { success: false, error: error.message };
    return { success: true, data: tasks || [] };
  } catch (error) {
    return {
      success: false,
      error: handleError(error, "Fetching filtered tasks"),
    };
  }
};

export const updateTaskStatus = async (
  taskId: string,
  completed: boolean
): Promise<ServiceResponse<void>> => {
  try {
    const { error } = await supabase
      .from("tasks")
      .update({ completed })
      .eq("id", taskId);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (error) {
    return { success: false, error: handleError(error, "Updating task status") };
  }
};

export const updateSubTaskStatus = async (
  subTaskId: string,
  completed: boolean
): Promise<ServiceResponse<void>> => {
  try {
    const { error } = await supabase
      .from("sub_tasks")
      .update({ completed })
      .eq("id", subTaskId);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: handleError(error, "Updating sub-task status"),
    };
  }
};

export const deleteTask = async (
  taskId: string
): Promise<ServiceResponse<void>> => {
  try {
    const { error: subTaskError } = await supabase
      .from("sub_tasks")
      .delete()
      .eq("task_id", taskId);

    if (subTaskError) {
      console.warn("Warning deleting sub-tasks:", subTaskError.message);
    }

    const { error } = await supabase.from("tasks").delete().eq("id", taskId);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (error) {
    return { success: false, error: handleError(error, "Deleting task") };
  }
};

export const getTaskStats = async (
  userId: string
): Promise<
  ServiceResponse<{
    total: number;
    completed: number;
    pending: number;
    overdue: number;
  }>
> => {
  try {
    const { data: tasks, error } = await supabase
      .from("tasks")
      .select("completed, deadline")
      .eq("user_id", userId);

    if (error) return { success: false, error: error.message };

    const now = new Date();
    const stats = {
      total: tasks.length,
      completed: tasks.filter((t) => t.completed).length,
      pending: tasks.filter((t) => !t.completed).length,
      overdue: tasks.filter(
        (t) => !t.completed && t.deadline && new Date(t.deadline) < now
      ).length,
    };

    return { success: true, data: stats };
  } catch (error) {
    return {
      success: false,
      error: handleError(error, "Getting task stats"),
    };
  }
};

export const updateTask = async (
  taskId: string,
  taskData: TaskFormData
): Promise<ServiceResponse<void>> => {
  try {
    const { error: taskError } = await supabase
      .from("tasks")
      .update({
        title: taskData.title,
        description: taskData.description || null,
        priority: taskData.priority,
        deadline: taskData.deadline?.toISOString() || null,
      })
      .eq("id", taskId);

    if (taskError) return { success: false, error: taskError.message };

    const { error: deleteError } = await supabase
      .from("sub_tasks")
      .delete()
      .eq("task_id", taskId);

    if (deleteError) {
      return {
        success: false,
        error: `Task updated but failed to clear old sub-tasks: ${deleteError.message}`,
      };
    }

    const validSubTasks = taskData.subTasks
      .filter((st) => st.title.trim())
      .map((st) => ({
        task_id: taskId,
        title: st.title.trim(),
        completed: false,
      }));

    if (validSubTasks.length > 0) {
      const { error: insertError } = await supabase
        .from("sub_tasks")
        .insert(validSubTasks);

      if (insertError) {
        return {
          success: false,
          error: `Task updated but failed to insert sub-tasks: ${insertError.message}`,
        };
      }
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: handleError(error, "Updating task") };
  }
};

export const transformTaskForCard = (task: TaskWithSubTasks) => {
  const completedSubTasks = task.sub_tasks?.filter((st) => st.completed).length || 0;
  const totalSubTasks = task.sub_tasks?.length || 0;

  const priorityMap = {
    high: "High" as const,
    medium: "Medium" as const,
    low: "Low" as const,
  };

  return {
    id: task.id!,
    title: task.title,
    description: task.description,
    priority: priorityMap[task.priority],
    deadline: task.deadline
      ? formatDate(task.deadline)
      : task.created_at
      ? formatDate(task.created_at)
      : "No date",
    originalDeadline: task.deadline,
    completedCount: totalSubTasks > 0 ? completedSubTasks : undefined,
    totalCount: totalSubTasks > 0 ? totalSubTasks : undefined,
    subTasks: task.sub_tasks?.map((st) => ({
      id: st.id,
      title: st.title,
      completed: st.completed,
    })),
    completed: task.completed,
    originalPriority: task.priority,
  };
};