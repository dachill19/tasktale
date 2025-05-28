import { supabase } from './supabase';

// Types berdasarkan struktur database
export interface Task {
  id?: string;
  user_id?: string;
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
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

// Interface untuk data dari form
export interface TaskFormData {
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  deadline?: Date | null;
  subTasks: Array<{
    title: string;
  }>;
}

/**
 * Menambahkan task baru beserta sub-tasks ke database
 */
export const createTask = async (
  taskData: TaskFormData,
  userId: string
): Promise<{ success: boolean; data?: TaskWithSubTasks; error?: string }> => {
  try {
    // 1. Insert task utama
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .insert({
        user_id: userId,
        title: taskData.title,
        description: taskData.description || null,
        priority: taskData.priority,
        completed: false,
        deadline: taskData.deadline ? taskData.deadline.toISOString() : null,
      })
      .select()
      .single();

    if (taskError) {
      console.error('Error creating task:', taskError);
      return { success: false, error: taskError.message };
    }

    // 2. Insert sub-tasks jika ada
    const subTasksToInsert = taskData.subTasks
      .filter(subTask => subTask.title.trim() !== '') // Filter sub-task kosong
      .map(subTask => ({
        task_id: task.id,
        title: subTask.title.trim(),
        completed: false,
      }));

    let subTasks: SubTask[] = [];
    if (subTasksToInsert.length > 0) {
      const { data: subTasksData, error: subTasksError } = await supabase
        .from('sub_tasks')
        .insert(subTasksToInsert)
        .select();

      if (subTasksError) {
        console.error('Error creating sub-tasks:', subTasksError);
        // Task sudah dibuat, tapi sub-tasks gagal
        return { 
          success: false, 
          error: `Task created but sub-tasks failed: ${subTasksError.message}` 
        };
      }

      subTasks = subTasksData || [];
    }

    return {
      success: true,
      data: {
        ...task,
        sub_tasks: subTasks,
      },
    };
  } catch (error) {
    console.error('Unexpected error creating task:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

/**
 * Mengambil semua tasks untuk user tertentu beserta sub-tasks
 */
export const getUserTasks = async (
  userId: string
): Promise<{ success: boolean; data?: TaskWithSubTasks[]; error?: string }> => {
  try {
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select(`
        *,
        sub_tasks (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: tasks || [] };
  } catch (error) {
    console.error('Unexpected error fetching tasks:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

/**
 * Update status completed task
 */
export const updateTaskStatus = async (
  taskId: string,
  completed: boolean
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('tasks')
      .update({ completed })
      .eq('id', taskId);

    if (error) {
      console.error('Error updating task status:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Unexpected error updating task:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

/**
 * Update status completed sub-task
 */
export const updateSubTaskStatus = async (
  subTaskId: string,
  completed: boolean
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('sub_tasks')
      .update({ completed })
      .eq('id', subTaskId);

    if (error) {
      console.error('Error updating sub-task status:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Unexpected error updating sub-task:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

/**
 * Hapus task (akan otomatis menghapus sub-tasks karena foreign key cascade)
 */
export const deleteTask = async (
  taskId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) {
      console.error('Error deleting task:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Unexpected error deleting task:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

/**
 * Update task
 */
export const updateTask = async (
  taskId: string,
  updates: Partial<Omit<Task, 'id' | 'user_id' | 'created_at'>>
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId);

    if (error) {
      console.error('Error updating task:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Unexpected error updating task:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

/**
 * Filter tasks berdasarkan status dan tanggal
 */
export const getFilteredTasks = async (
  userId: string,
  filter: 'all' | 'active' | 'done' | 'today'
): Promise<{ success: boolean; data?: TaskWithSubTasks[]; error?: string }> => {
  try {
    let query = supabase
      .from('tasks')
      .select(`
        *,
        sub_tasks (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    // Apply filters
    switch (filter) {
      case 'active':
        query = query.eq('completed', false);
        break;
      case 'done':
        query = query.eq('completed', true);
        break;
      case 'today':
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
        const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();
        query = query.gte('deadline', startOfDay).lte('deadline', endOfDay);
        break;
      // 'all' tidak perlu filter tambahan
    }

    const { data: tasks, error } = await query;

    if (error) {
      console.error('Error fetching filtered tasks:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: tasks || [] };
  } catch (error) {
    console.error('Unexpected error fetching filtered tasks:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

/**
 * Transform data dari database ke format yang dibutuhkan TaskCard
 */
export const transformTaskForCard = (task: TaskWithSubTasks) => {
  const completedSubTasks = task.sub_tasks?.filter(st => st.completed).length || 0;
  const totalSubTasks = task.sub_tasks?.length || 0;
  
  // Convert priority dari database format ke UI format
  const priorityMap = {
    'high': 'Tinggi' as const,
    'medium': 'Sedang' as const,
    'low': 'Rendah' as const,
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return {
    id: task.id!,
    title: task.title,
    description: task.description || undefined,
    priority: priorityMap[task.priority],
    date: task.deadline ? formatDate(task.deadline) : formatDate(task.created_at!),
    completedCount: totalSubTasks > 0 ? completedSubTasks : undefined,
    totalCount: totalSubTasks > 0 ? totalSubTasks : undefined,
    subTasks: task.sub_tasks?.map(st => ({
      id: st.id,
      title: st.title,
      completed: st.completed,
    })),
    completed: task.completed,
  };
};

/**
 * Get current user ID
 */
export const getCurrentUserId = async (): Promise<{ success: boolean; userId?: string; error?: string }> => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }
    
    return { success: true, userId: user.id };
  } catch (error) {
    console.error('Error getting current user:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};