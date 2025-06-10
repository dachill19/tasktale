// lib/stores/dashboardStore.ts
import { DateTime } from 'luxon';
import { create } from 'zustand';
import { getCurrentUserProfile } from '../auth';
import { getFilteredJournals, transformJournalForCard } from '../journal';
import { getFilteredTasks, transformTaskForCard, updateTaskStatus } from '../task';

type TaskPriority = 'high' | 'medium' | 'low';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: TaskPriority;
  dueDate: string;
  subTasks?: { id: string; title: string; completed: boolean }[];
}

interface JournalEntry {
  id: string;
  date: string;
  mood: string;
  content: string;
  hasMedia: boolean;
}

interface DashboardState {
  greeting: string;
  userName: string;
  todayTasks: Task[];
  allTasks: Task[];
  journalEntries: JournalEntry[];
  loading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
  toggleTask: (taskId: string) => Promise<void>;
  safeFormatDate: (dateValue: any) => string;
  isTaskOverdue: (dueDate: string) => boolean;
  isTaskUpcoming: (dueDate: string) => boolean;
}

export const useDashboardStore = create<DashboardState>((set, get) => {
  const today = DateTime.local({ zone: 'Asia/Jakarta' });

  return {
    greeting: '',
    userName: 'User',
    todayTasks: [],
    allTasks: [],
    journalEntries: [],
    loading: true,
    error: null,

    safeFormatDate: (dateValue: any): string => {
      if (!dateValue) {
        return today.toFormat('yyyy-MM-dd');
      }

      let date: DateTime;
      if (typeof dateValue === 'string') {
        date = DateTime.fromISO(dateValue, { zone: 'Asia/Jakarta' });
        if (!date.isValid) {
          console.warn(`Invalid date format: ${dateValue}`);
          return today.toFormat('yyyy-MM-dd');
        }
      } else if (dateValue instanceof Date) {
        date = DateTime.fromJSDate(dateValue, { zone: 'Asia/Jakarta' });
      } else {
        console.warn(`Invalid date input: ${dateValue}`);
        return today.toFormat('yyyy-MM-dd');
      }

      return date.toFormat('yyyy-MM-dd');
    },

    isTaskOverdue: (dueDate: string): boolean => {
      try {
        const taskDate = DateTime.fromISO(dueDate, { zone: 'Asia/Jakarta' });
        if (!taskDate.isValid) {
          console.warn(`Invalid dueDate in isTaskOverdue: ${dueDate}`);
          return false;
        }
        return taskDate < today.startOf('day');
      } catch (err) {
        console.warn(`Error parsing dueDate: ${dueDate}`, err);
        return false;
      }
    },

    isTaskUpcoming: (dueDate: string): boolean => {
      try {
        const taskDate = DateTime.fromISO(dueDate, { zone: 'Asia/Jakarta' });
        if (!taskDate.isValid) {
          console.warn(`Invalid dueDate in isTaskUpcoming: ${dueDate}`);
          return true;
        }
        return taskDate > today.endOf('day');
      } catch (err) {
        console.warn(`Error parsing dueDate: ${dueDate}`, err);
        return true;
      }
    },

    fetchData: async () => {
      set({ loading: true, error: null, todayTasks: [], allTasks: [], journalEntries: [] });

      try {
        // Set greeting based on time
        const hours = today.hour;
        const greeting =
          hours >= 4 && hours < 12
            ? 'Good Morning'
            : hours >= 12 && hours < 17
            ? 'Good Afternoon'
            : 'Good Evening';
        set({ greeting });

        // Fetch user profile
        const userProfileResponse = await getCurrentUserProfile();
        if (userProfileResponse.success && userProfileResponse.data) {
          set({ userName: userProfileResponse.data.full_name });
        } else {
          console.warn('User profile fetch warning:', userProfileResponse.error);
        }

        const userResponse = await getCurrentUserProfile();
        if (!userResponse.success || !userResponse.data) {
          set({ error: userResponse.error || 'Failed to get user ID' });
          return;
        }
        const userId = userResponse.data.id;

        // Fetch tasks for today
        const todayTaskResponse = await getFilteredTasks(userId, 'today');
        if (todayTaskResponse.success && todayTaskResponse.data) {
          const transformedTodayTasks = todayTaskResponse.data.map((task) => {
            const transformed = transformTaskForCard(task);
            const formattedDueDate = get().safeFormatDate(transformed.originalDeadline);
            return {
              id: transformed.id,
              title: transformed.title,
              completed: transformed.completed,
              priority: transformed.originalPriority,
              dueDate: formattedDueDate,
              subTasks: transformed.subTasks || [],
            };
          });
          set({ todayTasks: transformedTodayTasks });
          console.log('Tasks for today:', transformedTodayTasks);
        } else {
          console.warn('Today task fetch warning:', todayTaskResponse.error);
          set({ todayTasks: [] });
        }

        // Fetch all tasks
        const allTaskResponse = await getFilteredTasks(userId, 'all');
        if (allTaskResponse.success && allTaskResponse.data) {
          const transformedAllTasks = allTaskResponse.data.map((task) => {
            const transformed = transformTaskForCard(task);
            const formattedDueDate = get().safeFormatDate(transformed.originalDeadline);
            return {
              id: transformed.id,
              title: transformed.title,
              completed: transformed.completed,
              priority: transformed.originalPriority,
              dueDate: formattedDueDate,
              subTasks: transformed.subTasks || [],
            };
          });
          set({ allTasks: transformedAllTasks });
          console.log('All tasks:', transformedAllTasks);
        } else {
          console.warn('All task fetch warning:', allTaskResponse.error);
          set({ allTasks: [] });
        }

        // Fetch journals for this week
        const journalResponse = await getFilteredJournals(userId, 'this-week');
        if (journalResponse.success && journalResponse.data) {
          const transformedJournals = journalResponse.data.map((journal) => {
            const transformed = transformJournalForCard(journal);
            const formattedDate = get().safeFormatDate(transformed.created_at);
            return {
              id: transformed.id,
              date: formattedDate,
              mood: transformed.mood || 'neutral',
              content: transformed.content || '',
              hasMedia: Boolean((transformed.images || []).length > 0),
            };
          });
          set({ journalEntries: transformedJournals });
        } else {
          console.warn('Journal fetch warning:', journalResponse.error);
          set({ journalEntries: [] });
        }
      } catch (err) {
        console.error('Multipanel fetch error:', err);
        set({ error: 'An unexpected error occurred' });
      } finally {
        set({ loading: false });
      }
    },

    toggleTask: async (taskId: string) => {
      const taskToUpdate = get().todayTasks.find((t) => t.id === taskId);
      if (!taskToUpdate) return;

      const newCompletedStatus = !taskToUpdate.completed;

      try {
        const updateResponse = await updateTaskStatus(taskId, newCompletedStatus);

        if (updateResponse.success) {
          set((state) => ({
            todayTasks: state.todayTasks.map((t) =>
              t.id === taskId
                ? {
                    ...t,
                    completed: newCompletedStatus,
                    subTasks: t.subTasks?.map((subTask) => ({
                      ...subTask,
                      completed: newCompletedStatus,
                    })) || [],
                  }
                : t
            ),
            allTasks: state.allTasks.map((t) =>
              t.id === taskId
                ? {
                    ...t,
                    completed: newCompletedStatus,
                    subTasks: t.subTasks?.map((subTask) => ({
                      ...subTask,
                      completed: newCompletedStatus,
                    })) || [],
                  }
                : t
            ),
          }));
        } else {
          console.error('Failed to update task status:', updateResponse.error);
          set({ error: `Failed to update task: ${updateResponse.error}` });
          setTimeout(() => set({ error: null }), 3000);
        }
      } catch (err) {
        console.error('Error updating task status:', err);
        set({ error: 'An error occurred while updating the task' });
        setTimeout(() => set({ error: null }), 3000);
      }
    },
  };
});