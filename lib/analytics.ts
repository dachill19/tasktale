import { DateTime } from "luxon";
import { supabase } from './supabase';

export interface TaskCompletionData {
  date: string;
  completed: number;
  total: number;
  percentage: number;
}

export interface MoodTrendData {
  date: string;
  mood: string;
  count: number;
  averageScore: number;
}

export interface MoodDistributionData {
  mood: string;
  count: number;
  percentage: number;
  color: string;
}

export interface ProductivityData {
  hour: number;
  completedTasks: number;
  journalEntries: number;
  productivity: number;
}

export interface WeeklySummaryStats {
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  totalJournals: number;
  dominantMood: string;
  productivityScore: number;
  taskIncrease: string;
  completionIncrease: string;
  averageMood: number;
  moodIncrease: string;
  mostProductiveDay: string;
  averageCompletionTime?: string;
}

const MOOD_SCORES = {
  'excited': 5,
  'happy': 4,
  'calm': 3,
  'neutral': 2,
  'tired': 1,
  'sad': 0,
  'angry': -1
};

const MOOD_COLORS = {
  'excited': '#FF6B6B',
  'happy': '#4ECDC4',
  'calm': '#45B7D1',
  'neutral': '#96CEB4',
  'tired': '#FECA57',
  'sad': '#FF9FF3',
  'angry': '#FF7675'
};

export const fetchTaskCompletionData = async (days: number = 7): Promise<TaskCompletionData[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days + 1);
    startDate.setHours(0, 0, 0, 0);

    const { data: allTasks, error } = await supabase
      .from('tasks')
      .select('created_at, completed, doneAt, deadline')
      .eq('user_id', user.id)
      .or(`created_at.gte.${startDate.toISOString()},doneAt.gte.${startDate.toISOString()}`)
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: true });

    if (error) throw error;

    console.log('Fetched tasks:', allTasks?.length || 0);

    const result: TaskCompletionData[] = [];

    for (let i = 0; i < days; i++) {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - (days - 1 - i));
      currentDate.setHours(0, 0, 0, 0);

      const nextDate = new Date(currentDate);
      nextDate.setDate(nextDate.getDate() + 1);

      const tasksCreatedToday = allTasks?.filter(task => {
        const taskDate = new Date(task.created_at);
        return taskDate >= currentDate && taskDate < nextDate;
      }) || [];

      const tasksCompletedToday = allTasks?.filter(task => {
        if (!task.completed || !task.doneAt) return false;
        const doneDate = new Date(task.doneAt);
        return doneDate >= currentDate && doneDate < nextDate;
      }) || [];

      const totalTasksForDay = allTasks?.filter(task => {
        const createdDate = new Date(task.created_at);
        const doneDate = task.doneAt ? new Date(task.doneAt) : null;
        return createdDate <= nextDate && (!doneDate || doneDate >= currentDate);
      }) || [];

      const completedCount = tasksCompletedToday.length;
      const totalCount = Math.max(tasksCreatedToday.length, completedCount);

      console.log(`Date: ${currentDate.toLocaleDateString()}, Created: ${tasksCreatedToday.length}, Completed: ${completedCount}, Total for day: ${totalTasksForDay.length}`);

      result.push({
        date: currentDate.toLocaleDateString('id-ID', { weekday: 'short' }),
        completed: completedCount,
        total: totalCount,
        percentage: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
      });
    }

    console.log('Task completion result:', result);
    return result;

  } catch (error) {
    console.error('Error fetching task completion data:', error);
    throw error;
  }
};

export const fetchTaskCompletionDataSimple = async (days: number = 7): Promise<TaskCompletionData[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days + 1);
    startDate.setHours(0, 0, 0, 0);

    const { data: completedTasks, error: completedError } = await supabase
      .from('tasks')
      .select('doneAt, created_at')
      .eq('user_id', user.id)
      .eq('completed', true)
      .not('doneAt', 'is', null)
      .gte('doneAt', startDate.toISOString())
      .order('doneAt', { ascending: true });

    const widerStartDate = new Date();
    widerStartDate.setDate(startDate.getDate() - 30);

    const { data: allTasks, error: allError } = await supabase
      .from('tasks')
      .select('created_at, completed, doneAt')
      .eq('user_id', user.id)
      .gte('created_at', widerStartDate.toISOString())
      .order('created_at', { ascending: true });

    if (completedError || allError) throw completedError || allError;

    console.log('Completed tasks:', completedTasks?.length || 0);
    console.log('All tasks:', allTasks?.length || 0);

    const result: TaskCompletionData[] = [];

    for (let i = 0; i < days; i++) {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - (days - 1 - i));
      currentDate.setHours(0, 0, 0, 0);

      const nextDate = new Date(currentDate);
      nextDate.setDate(nextDate.getDate() + 1);

      const completedOnDay = completedTasks?.filter(task => {
        const doneDate = new Date(task.doneAt);
        return doneDate >= currentDate && doneDate < nextDate;
      }).length || 0;

      const createdOnDay = allTasks?.filter(task => {
        const createdDate = new Date(task.created_at);
        return createdDate >= currentDate && createdDate < nextDate;
      }).length || 0;

      const totalForDay = Math.max(createdOnDay, completedOnDay);

      result.push({
        date: currentDate.toLocaleDateString('id-ID', { weekday: 'short' }),
        completed: completedOnDay,
        total: totalForDay,
        percentage: totalForDay > 0 ? Math.round((completedOnDay / totalForDay) * 100) : 0
      });
    }

    console.log('Simple task completion result:', result);
    return result;

  } catch (error) {
    console.error('Error fetching simple task completion data:', error);
    throw error;
  }
};

export const fetchMoodTrendData = async (days: number = 7): Promise<MoodTrendData[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days + 1);
    startDate.setHours(0, 0, 0, 0);

    const { data: journals, error } = await supabase
      .from('journals')
      .select('created_at, mood')
      .eq('user_id', user.id)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    if (error) throw error;

    const journalsByDate = journals?.reduce((acc, journal) => {
      const date = new Date(journal.created_at).toDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(journal.mood);
      return acc;
    }, {} as Record<string, string[]>) || {};

    const result: MoodTrendData[] = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      const dateString = date.toDateString();
      const dayMoods = journalsByDate[dateString] || [];

      const moodScores = dayMoods.map(mood => MOOD_SCORES[mood as keyof typeof MOOD_SCORES] || 0);
      const averageScore = moodScores.length > 0
        ? moodScores.reduce((sum, score) => sum + score, 0) / moodScores.length
        : 0;

      const moodCounts = dayMoods.reduce((acc, mood) => {
        acc[mood] = (acc[mood] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const dominantMood = Object.entries(moodCounts).reduce((a, b) =>
        moodCounts[a[0]] > moodCounts[b[0]] ? a : b, ['neutral', 0])[0];

      result.push({
        date: date.toLocaleDateString('id-ID', { weekday: 'short' }),
        mood: dominantMood,
        count: dayMoods.length,
        averageScore: Math.round(averageScore * 100) / 100
      });
    }

    return result;
  } catch (error) {
    console.error('Error fetching mood trend data:', error);
    throw error;
  }
};

export const fetchMoodDistributionData = async (days: number = 7): Promise<MoodDistributionData[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data: journals, error } = await supabase
      .from('journals')
      .select('mood')
      .eq('user_id', user.id)
      .gte('created_at', startDate.toISOString());

    if (error) throw error;

    if (!journals || journals.length === 0) {
      return [];
    }

    const moodCounts = journals.reduce((acc, journal) => {
      acc[journal.mood] = (acc[journal.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalEntries = journals.length;

    const result: MoodDistributionData[] = Object.entries(moodCounts).map(([mood, count]) => ({
      mood,
      count,
      percentage: Math.round((count / totalEntries) * 100),
      color: MOOD_COLORS[mood as keyof typeof MOOD_COLORS] || '#95a5a6'
    }));

    return result.sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error('Error fetching mood distribution data:', error);
    throw error;
  }
};

export const fetchProductivityData = async (days: number = 7): Promise<ProductivityData[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('created_at, doneAt')
      .eq('user_id', user.id)
      .eq('completed', true)
      .not('doneAt', 'is', null)
      .gte('doneAt', startDate.toISOString());

    if (tasksError) throw tasksError;

    const { data: journals, error: journalsError } = await supabase
      .from('journals')
      .select('created_at')
      .eq('user_id', user.id)
      .gte('created_at', startDate.toISOString());

    if (journalsError) throw journalsError;

    const productivityByHour: Record<number, { tasks: number; journals: number }> = {};

    for (let hour = 0; hour < 24; hour++) {
      productivityByHour[hour] = { tasks: 0, journals: 0 };
    }

    tasks?.forEach(task => {
      if (task.doneAt) {
        const hour = new Date(task.doneAt).getHours();
        productivityByHour[hour].tasks++;
      }
    });

    journals?.forEach(journal => {
      const hour = new Date(journal.created_at).getHours();
      productivityByHour[hour].journals++;
    });

    const result: ProductivityData[] = Object.entries(productivityByHour).map(([hour, data]) => ({
      hour: parseInt(hour),
      completedTasks: data.tasks,
      journalEntries: data.journals,
      productivity: data.tasks + data.journals
    }));

    return result.sort((a, b) => a.hour - b.hour);
  } catch (error) {
    console.error('Error fetching productivity data:', error);
    throw error;
  }
};

export const fetchWeeklySummaryStats = async (): Promise<WeeklySummaryStats> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 7);
    const prevWeekEnd = new Date(startDate);
    const prevWeekStart = new Date(prevWeekEnd);
    prevWeekStart.setDate(prevWeekEnd.getDate() - 7);

    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('completed, created_at, doneAt')
      .eq('user_id', user.id)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    const { data: prevTasks, error: prevTasksError } = await supabase
      .from('tasks')
      .select('completed')
      .eq('user_id', user.id)
      .gte('created_at', prevWeekStart.toISOString())
      .lte('created_at', prevWeekEnd.toISOString());

    const { data: journals, error: journalsError } = await supabase
      .from('journals')
      .select('mood, created_at')
      .eq('user_id', user.id)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    const { data: prevJournals, error: prevJournalsError } = await supabase
      .from('journals')
      .select('mood')
      .eq('user_id', user.id)
      .gte('created_at', prevWeekStart.toISOString())
      .lte('created_at', prevWeekEnd.toISOString());

    if (tasksError || prevTasksError || journalsError || prevJournalsError) {
      throw new Error('Failed to fetch data');
    }

    const totalTasks = tasks?.length || 0;
    const completedTasks = tasks?.filter(task => task.completed).length || 0;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const prevTotalTasks = prevTasks?.length || 0;
    const prevCompletedTasks = prevTasks?.filter(task => task.completed).length || 0;
    const prevCompletionRate = prevTotalTasks > 0 ? Math.round((prevCompletedTasks / prevTotalTasks) * 100) : 0;

    const taskIncrease = prevTotalTasks > 0
      ? `${Math.round(((totalTasks - prevTotalTasks) / prevTotalTasks) * 100)}%`
      : 'N/A';

    const completionIncrease = prevCompletionRate > 0
      ? `${Math.round(completionRate - prevCompletionRate)}%`
      : 'N/A';

    const totalJournals = journals?.length || 0;
    const moodCounts = journals?.reduce((acc, journal) => {
      acc[journal.mood] = (acc[journal.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    const dominantMood = Object.entries(moodCounts).length > 0 
      ? Object.entries(moodCounts).reduce((a, b) =>
          moodCounts[a[0]] > moodCounts[b[0]] ? a : b)[0]
      : 'neutral';

    const prevMoodScores = prevJournals?.map(journal => MOOD_SCORES[journal.mood as keyof typeof MOOD_SCORES] || 0) || [];
    const prevAverageMood = prevMoodScores.length > 0
      ? prevMoodScores.reduce((sum, score) => sum + score, 0) / prevMoodScores.length
      : 0;

    const moodScores = journals?.map(journal => MOOD_SCORES[journal.mood as keyof typeof MOOD_SCORES] || 0) || [];
    const averageMood = moodScores.length > 0
      ? Math.round((moodScores.reduce((sum, score) => sum + score, 0) / moodScores.length) * 100) / 100
      : 0;

    const moodIncrease = prevAverageMood > 0
      ? `${Math.round((averageMood - prevAverageMood) * 100) / 100}`
      : 'N/A';

    const productivityScore = Math.round(
      (completionRate * 0.6) + (((averageMood + 1) / 6) * 100 * 0.4)
    );

    const tasksByDay = tasks?.reduce((acc, task) => {
      const day = new Date(task.doneAt || task.created_at).toLocaleDateString('id-ID', { weekday: 'long' });
      acc[day] = (acc[day] || 0) + (task.completed ? 1 : 0);
      return acc;
    }, {} as Record<string, number>) || {};

    const mostProductiveDay = Object.keys(tasksByDay).length > 0
      ? Object.entries(tasksByDay).reduce((a, b) => a[1] > b[1] ? a : b)[0]
      : 'N/A';

    const completedTasksWithTimes = tasks?.filter(task => task.completed && task.doneAt) || [];
    const completionTimes = completedTasksWithTimes.map(task => {
      const created = DateTime.fromISO(task.created_at);
      const done = DateTime.fromISO(task.doneAt!);
      return done.diff(created, 'days').days;
    });
    
    const averageCompletionTime = completionTimes.length > 0
      ? `${Math.round(completionTimes.reduce((sum, time) => sum + time, 0) / completionTimes.length)} days`
      : undefined;

    return {
      totalTasks,
      completedTasks,
      completionRate,
      totalJournals,
      dominantMood,
      productivityScore: Math.max(0, Math.min(100, productivityScore)),
      taskIncrease,
      completionIncrease,
      averageMood,
      moodIncrease,
      mostProductiveDay,
      averageCompletionTime,
    };
  } catch (error) {
    console.error('Error fetching weekly summary stats:', error);
    throw error;
  }
};