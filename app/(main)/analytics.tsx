import {
    MoodDistributionCard,
    MoodTrendCard,
    ProductivityCard,
    TaskCompletionCard,
    WeeklySummaryCard,
} from "@/components/AnalyticsCard";
import {
    AnalyticsSkeleton,
    ChartCardSkeleton,
    MoodDistributionCardSkeleton,
    WeeklySummaryCardSkeleton,
} from "@/components/skeletons/AnalyticsSkeleton";
import { useAnalyticsStore } from "@/lib/stores/analyticsStore";
import { AlertCircle } from "@tamagui/lucide-icons";
import { useFocusEffect } from "expo-router";
import React, { useCallback } from "react";
import { RefreshControl, ScrollView } from "react-native";
import { Text, XStack, YStack } from "tamagui";

const Analytics = () => {
  const {
    taskCompletionData,
    moodTrendData,
    productivityData,
    moodDistribution,
    weeklySummaryStats,
    loadingTaskCompletion,
    loadingMoodTrend,
    loadingMoodDistribution,
    loadingProductivity,
    loadingWeeklySummary,
    error,
    fetchAnalyticsData,
    clearError,
  } = useAnalyticsStore();

  // Fetch data every time the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchAnalyticsData();
    }, [fetchAnalyticsData])
  );

  const handleRefresh = useCallback(async () => {
    await fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  const handleRetry = useCallback(() => {
    clearError();
    fetchAnalyticsData();
  }, [clearError, fetchAnalyticsData]);

  // Check if any section is loading
  const isLoading =
    loadingTaskCompletion ||
    loadingMoodTrend ||
    loadingMoodDistribution ||
    loadingProductivity ||
    loadingWeeklySummary;

  // Show full skeleton if all data is missing and at least one section is loading
  const isInitialLoading =
    !taskCompletionData &&
    !moodTrendData &&
    !productivityData &&
    !moodDistribution &&
    !weeklySummaryStats &&
    isLoading;

  if (isInitialLoading) {
    return <AnalyticsSkeleton />;
  }

  // Check if no data is available and not loading
  const hasData =
    taskCompletionData ||
    moodTrendData ||
    productivityData ||
    moodDistribution ||
    weeklySummaryStats;

  if (!hasData && !isLoading) {
    return (
      <YStack
        flex={1}
        backgroundColor="$background"
        justifyContent="center"
        alignItems="center"
        paddingHorizontal="$4"
        gap="$4"
      >
        <Text color="$gray8" textAlign="center" fontSize="$4">
          Belum ada data untuk ditampilkan
        </Text>
        <Text color="$gray6" textAlign="center" fontSize="$3">
          Mulai dengan menambahkan beberapa tugas dan jurnal untuk melihat analytics
        </Text>
        <XStack
          bg="$blue4"
          alignItems="center"
          px="$2"
          py="$1"
          borderRadius="$10"
          gap="$1"
          onPress={handleRefresh}
          disabled={isLoading}
          pressStyle={{ opacity: 0.8 }}
        >
          <Text fontSize="$3" color="$blue10">
            Refresh
          </Text>
        </XStack>
      </YStack>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#ffffff" }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={handleRefresh}
          colors={["#007AFF"]}
          tintColor="#007AFF"
        />
      }
    >
      <YStack
        flex={1}
        backgroundColor="$background"
        paddingHorizontal="$4"
        paddingBottom={100}
        alignItems="center"
      >
        <Text
          fontSize="$8"
          fontWeight="bold"
          fontFamily="$display"
          color="$green10"
          marginVertical="$4"
        >
          Analytics Dashboard
        </Text>

        {error && (
          <XStack
            backgroundColor="$red4"
            padding="$3"
            borderRadius="$4"
            marginBottom="$4"
            alignItems="center"
            gap="$2"
            borderWidth={2}
            borderColor="$red8"
            width="100%"
          >
            <AlertCircle size={16} color="$red10" />
            <Text color="$red10" fontSize="$2" flex={1}>
              Beberapa data mungkin tidak terbaru: {error}
            </Text>
            <XStack
              bg="$red4"
              alignItems="center"
              px="$2"
              py="$1"
              borderRadius="$10"
              gap="$1"
              onPress={handleRetry}
              disabled={isLoading}
              pressStyle={{ opacity: 0.8 }}
            >
              <Text fontSize="$2" color="$red10">
                Retry
              </Text>
            </XStack>
          </XStack>
        )}

        {loadingWeeklySummary ? (
          <WeeklySummaryCardSkeleton />
        ) : weeklySummaryStats ? (
          <WeeklySummaryCard
            title="Ringkasan Mingguan"
            icon="📋"
            stats={weeklySummaryStats}
          />
        ) : null}

        {loadingTaskCompletion ? (
          <ChartCardSkeleton titleWidth={180} />
        ) : taskCompletionData && taskCompletionData.length > 0 ? (
          <TaskCompletionCard
            title="Penyelesaian Tugas (Minggu Ini)"
            icon="📊"
            data={{
              labels: taskCompletionData.map((item) => item.date),
              datasets: [
                {
                  data: taskCompletionData.map((item) => item.completed),
                  color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
                  strokeWidth: 2,
                },
              ],
            }}
          />
        ) : null}

        {loadingMoodTrend ? (
          <ChartCardSkeleton titleWidth={200} />
        ) : moodTrendData && moodTrendData.length > 0 ? (
          <MoodTrendCard
            title="Tren Suasana Hati (Minggu Ini)"
            icon="😊"
            data={{
              labels: moodTrendData.map((item) => item.date),
              datasets: [
                {
                  data: moodTrendData.map((item) => item.averageScore),
                  color: (opacity = 1) => `rgba(251, 146, 60, ${opacity})`,
                  strokeWidth: 2,
                },
              ],
            }}
          />
        ) : null}

        {loadingMoodDistribution ? (
          <MoodDistributionCardSkeleton />
        ) : moodDistribution && moodDistribution.length > 0 ? (
          <MoodDistributionCard
            title="Distribusi Suasana Hati (Minggu Ini)"
            icon="🥧"
            data={moodDistribution.map((item) => ({
              name: item.mood,
              population: item.count,
              color: item.color,
              legendFontColor: "#000000",
              legendFontSize: 12,
            }))}
          />
        ) : null}

        {loadingProductivity ? (
          <ChartCardSkeleton titleWidth={220} />
        ) : productivityData && productivityData.length > 0 ? (
          <ProductivityCard
            title="Produktivitas berdasarkan Waktu (Minggu Ini)"
            icon="⏰"
            data={{
              labels: productivityData.map((item) => `${item.hour}:00`),
              datasets: [
                {
                  data: productivityData.map((item) => item.productivity),
                  color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                },
              ],
            }}
          />
        ) : null}

        <YStack height="$8" />
      </YStack>
    </ScrollView>
  );
};

export default Analytics;