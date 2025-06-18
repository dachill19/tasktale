import { create } from "zustand";
import {
  fetchMoodDistributionData,
  fetchMoodTrendData,
  fetchProductivityData,
  fetchTaskCompletionData,
  fetchWeeklySummaryStats,
  type MoodDistributionData,
  type MoodTrendData,
  type ProductivityData,
  type TaskCompletionData,
  type WeeklySummaryStats,
} from "../analytics";

interface AnalyticsState {
  // Data
  taskCompletionData: TaskCompletionData[] | null;
  moodTrendData: MoodTrendData[] | null;
  moodDistribution: MoodDistributionData[] | null;
  productivityData: ProductivityData[] | null;
  weeklySummaryStats: WeeklySummaryStats | null;

  // Loading states
  loadingTaskCompletion: boolean;
  loadingMoodTrend: boolean;
  loadingMoodDistribution: boolean;
  loadingProductivity: boolean;
  loadingWeeklySummary: boolean;
  error: string | null;

  // Actions
  fetchAnalyticsData: () => Promise<void>;
  fetchTaskCompletion: (days?: number) => Promise<void>;
  fetchMoodTrend: (days?: number) => Promise<void>;
  fetchMoodDistribution: (days?: number) => Promise<void>;
  fetchProductivity: (days?: number) => Promise<void>;
  fetchWeeklySummary: () => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  // Initial state
  taskCompletionData: null,
  moodTrendData: null,
  moodDistribution: null,
  productivityData: null,
  weeklySummaryStats: null,
  loadingTaskCompletion: false,
  loadingMoodTrend: false,
  loadingMoodDistribution: false,
  loadingProductivity: false,
  loadingWeeklySummary: false,
  error: null,

  // Fetch all analytics data
  fetchAnalyticsData: async () => {
    try {
      set({
        loadingTaskCompletion: true,
        loadingMoodTrend: true,
        loadingMoodDistribution: true,
        loadingProductivity: true,
        loadingWeeklySummary: true,
        error: null,
      });

      const [
        taskCompletionData,
        moodTrendData,
        moodDistribution,
        productivityData,
        weeklySummaryStats,
      ] = await Promise.all([
        fetchTaskCompletionData(7),
        fetchMoodTrendData(7),
        fetchMoodDistributionData(7),
        fetchProductivityData(7),
        fetchWeeklySummaryStats(),
      ]);

      set({
        taskCompletionData,
        moodTrendData,
        moodDistribution,
        productivityData,
        weeklySummaryStats,
        loadingTaskCompletion: false,
        loadingMoodTrend: false,
        loadingMoodDistribution: false,
        loadingProductivity: false,
        loadingWeeklySummary: false,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      set({
        loadingTaskCompletion: false,
        loadingMoodTrend: false,
        loadingMoodDistribution: false,
        loadingProductivity: false,
        loadingWeeklySummary: false,
        error:
          error instanceof Error
            ? error.message
            : "Gagal memuat data analytics",
      });
    }
  },

  // Fetch individual data types
  fetchTaskCompletion: async (days = 7) => {
    try {
      set({ loadingTaskCompletion: true, error: null });
      const taskCompletionData = await fetchTaskCompletionData(days);
      set({ taskCompletionData, loadingTaskCompletion: false });
    } catch (error) {
      console.error("Error fetching task completion data:", error);
      set({
        loadingTaskCompletion: false,
        error:
          error instanceof Error
            ? error.message
            : "Gagal memuat data penyelesaian tugas",
      });
    }
  },

  fetchMoodTrend: async (days = 7) => {
    try {
      set({ loadingMoodTrend: true, error: null });
      const moodTrendData = await fetchMoodTrendData(days);
      set({ moodTrendData, loadingMoodTrend: false });
    } catch (error) {
      console.error("Error fetching mood trend data:", error);
      set({
        loadingMoodTrend: false,
        error:
          error instanceof Error
            ? error.message
            : "Gagal memuat data tren suasana hati",
      });
    }
  },

  fetchMoodDistribution: async (days = 7) => {
    try {
      set({ loadingMoodDistribution: true, error: null });
      const moodDistribution = await fetchMoodDistributionData(days);
      set({ moodDistribution, loadingMoodDistribution: false });
    } catch (error) {
      console.error("Error fetching mood distribution data:", error);
      set({
        loadingMoodDistribution: false,
        error:
          error instanceof Error
            ? error.message
            : "Gagal memuat data distribusi suasana hati",
      });
    }
  },

  fetchProductivity: async (days = 7) => {
    try {
      set({ loadingProductivity: true, error: null });
      const productivityData = await fetchProductivityData(days);
      set({ productivityData, loadingProductivity: false });
    } catch (error) {
      console.error("Error fetching productivity data:", error);
      set({
        loadingProductivity: false,
        error:
          error instanceof Error
            ? error.message
            : "Gagal memuat data produktivitas",
      });
    }
  },

  fetchWeeklySummary: async () => {
    try {
      set({ loadingWeeklySummary: true, error: null });
      const weeklySummaryStats = await fetchWeeklySummaryStats();
      set({ weeklySummaryStats, loadingWeeklySummary: false });
    } catch (error) {
      console.error("Error fetching weekly summary stats:", error);
      set({
        loadingWeeklySummary: false,
        error:
          error instanceof Error
            ? error.message
            : "Gagal memuat ringkasan mingguan",
      });
    }
  },

  // Utility actions
  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    set({
      taskCompletionData: null,
      moodTrendData: null,
      moodDistribution: null,
      productivityData: null,
      weeklySummaryStats: null,
      loadingTaskCompletion: false,
      loadingMoodTrend: false,
      loadingMoodDistribution: false,
      loadingProductivity: false,
      loadingWeeklySummary: false,
      error: null,
    });
  },
}));