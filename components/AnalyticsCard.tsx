// AnalyticsCards.tsx
import { Calendar, Clock, Target, TrendingUp } from "@tamagui/lucide-icons";
import React, { useState } from "react";
import { BarChart, LineChart, PieChart } from "react-native-chart-kit";
import { Circle, Text, XStack, YStack } from "tamagui";

interface BaseCardProps {
    title: string;
    icon?: string;
}

interface TaskCompletionCardProps extends BaseCardProps {
    data: {
        labels: string[];
        datasets: Array<{
            data: number[];
            color: (opacity?: number) => string;
            strokeWidth: number;
        }>;
    };
}

interface MoodTrendCardProps extends BaseCardProps {
    data: {
        labels: string[];
        datasets: Array<{
            data: number[];
            color: (opacity?: number) => string;
            strokeWidth: number;
        }>;
    };
}

interface ProductivityCardProps extends BaseCardProps {
    data: {
        labels: string[];
        datasets: Array<{
            data: number[];
            color: (opacity?: number) => string;
        }>;
    };
}

interface MoodDistributionCardProps extends BaseCardProps {
    data: Array<{
        name: string;
        population: number;
        color: string;
        legendFontColor: string;
        legendFontSize: number;
    }>;
}

interface WeeklySummaryCardProps extends BaseCardProps {
    stats: {
        totalTasks: number;
        taskIncrease: string;
        completionRate: number;
        completionIncrease: string;
        averageMood: number;
        moodIncrease: string;
        mostProductiveDay: string;
    };
}

const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
        borderRadius: 16,
    },
    propsForLabels: {
        fontSize: 12,
    },
};

export const TaskCompletionCard: React.FC<TaskCompletionCardProps> = ({
    title,
    icon,
    data,
}) => {
    const [cardWidth, setCardWidth] = useState(300);

    const handleLayout = (event: any) => {
        const { width } = event.nativeEvent.layout;
        setCardWidth(width - 32); // Subtract padding
    };

    return (
        <YStack
            backgroundColor="$background"
            borderRadius="$4"
            borderWidth={2}
            borderColor="$gray8"
            padding="$4"
            marginBottom="$4"
            elevation={2}
            onLayout={handleLayout}
        >
            <XStack alignItems="center" gap="$2" marginBottom="$3">
                {icon && <Text fontSize="$5">{icon}</Text>}
                <Text fontSize="$5" fontWeight="bold" color="$gray12">
                    {title}
                </Text>
            </XStack>

            <YStack alignItems="center" marginBottom="$2">
                <BarChart
                    data={data}
                    width={cardWidth}
                    height={200}
                    chartConfig={chartConfig}
                    verticalLabelRotation={0}
                    showValuesOnTopOfBars={true}
                    fromZero={true}
                    yAxisLabel={""}
                    yAxisSuffix={""}
                    style={{
                        borderRadius: 8,
                    }}
                />
            </YStack>

            <XStack gap="$3" marginTop="$2" justifyContent="center">
                <XStack alignItems="center" gap="$1">
                    <Circle size="$1" backgroundColor="$green8" />
                    <Text fontSize="$2" color="$gray10">
                        Selesai
                    </Text>
                </XStack>
                <XStack alignItems="center" gap="$1">
                    <Circle size="$1" backgroundColor="$gray8" />
                    <Text fontSize="$2" color="$gray10">
                        Total
                    </Text>
                </XStack>
            </XStack>
        </YStack>
    );
};

export const MoodTrendCard: React.FC<MoodTrendCardProps> = ({
    title,
    icon,
    data,
}) => {
    const [cardWidth, setCardWidth] = useState(300);

    const handleLayout = (event: any) => {
        const { width } = event.nativeEvent.layout;
        setCardWidth(width - 32); // Subtract padding
    };

    return (
        <YStack
            backgroundColor="$background"
            borderRadius="$4"
            borderWidth={2}
            borderColor="$gray8"
            padding="$4"
            marginBottom="$4"
            elevation={2}
            onLayout={handleLayout}
        >
            <XStack alignItems="center" gap="$2" marginBottom="$3">
                {icon && <Text fontSize="$5">{icon}</Text>}
                <Text fontSize="$5" fontWeight="bold" color="$gray12">
                    {title}
                </Text>
            </XStack>

            <YStack alignItems="center" marginBottom="$2">
                <LineChart
                    data={data}
                    width={cardWidth}
                    height={200}
                    chartConfig={{
                        ...chartConfig,
                        color: (opacity = 1) =>
                            `rgba(251, 146, 60, ${opacity})`,
                    }}
                    bezier
                    style={{
                        borderRadius: 8,
                    }}
                />
            </YStack>

            <XStack justifyContent="center" marginTop="$2">
                <XStack alignItems="center" gap="$1">
                    <Circle size="$1" backgroundColor="#FB923C" />
                    <Text fontSize="$2" color="$gray10">
                        Suasana Hati (1-10)
                    </Text>
                </XStack>
            </XStack>
        </YStack>
    );
};

export const MoodDistributionCard: React.FC<MoodDistributionCardProps> = ({
    title,
    icon,
    data,
}) => {
    const [cardWidth, setCardWidth] = useState(300);

    const handleLayout = (event: any) => {
        const { width } = event.nativeEvent.layout;
        setCardWidth(width - 32); // Subtract padding
    };

    return (
        <YStack
            backgroundColor="$background"
            borderRadius="$4"
            borderWidth={2}
            borderColor="$gray8"
            padding="$4"
            marginBottom="$4"
            elevation={2}
            onLayout={handleLayout}
        >
            <XStack alignItems="center" gap="$2" marginBottom="$3">
                {icon && <Text fontSize="$5">{icon}</Text>}
                <Text fontSize="$5" fontWeight="bold" color="$gray12">
                    {title}
                </Text>
            </XStack>

            <YStack alignItems="center">
                <PieChart
                    data={data}
                    width={cardWidth}
                    height={200}
                    chartConfig={chartConfig}
                    accessor="population"
                    backgroundColor="transparent"
                    paddingLeft="0"
                    center={[0, 0]}
                    absolute={false}
                />
            </YStack>
        </YStack>
    );
};

export const ProductivityCard: React.FC<ProductivityCardProps> = ({
    title,
    icon,
    data,
}) => {
    const [cardWidth, setCardWidth] = useState(300);

    const handleLayout = (event: any) => {
        const { width } = event.nativeEvent.layout;
        setCardWidth(width - 32); // Subtract padding
    };

    return (
        <YStack
            backgroundColor="$background"
            borderRadius="$4"
            borderWidth={2}
            borderColor="$gray8"
            padding="$4"
            marginBottom="$4"
            elevation={2}
            onLayout={handleLayout}
        >
            <XStack alignItems="center" gap="$2" marginBottom="$3">
                {icon && <Text fontSize="$5">{icon}</Text>}
                <Text fontSize="$5" fontWeight="bold" color="$gray12">
                    {title}
                </Text>
            </XStack>

            <YStack alignItems="center">
                <BarChart
                    data={data}
                    width={cardWidth}
                    height={200}
                    chartConfig={{
                        ...chartConfig,
                        color: (opacity = 1) =>
                            `rgba(59, 130, 246, ${opacity})`,
                    }}
                    verticalLabelRotation={0}
                    showValuesOnTopOfBars={true}
                    fromZero={true}
                    yAxisLabel={""}
                    yAxisSuffix={""}
                    style={{
                        borderRadius: 8,
                    }}
                />
            </YStack>
        </YStack>
    );
};

export const WeeklySummaryCard: React.FC<WeeklySummaryCardProps> = ({
    title,
    icon,
    stats,
}) => {
    return (
        <YStack
            backgroundColor="$background"
            borderRadius="$4"
            borderWidth={2}
            borderColor="$gray8"
            padding="$4"
            marginBottom="$4"
            elevation={2}
        >
            <XStack alignItems="center" gap="$2" marginBottom="$3">
                {icon && <Text fontSize="$5">{icon}</Text>}
                <Text fontSize="$5" fontWeight="bold" color="$gray12">
                    {title}
                </Text>
            </XStack>

            <YStack gap="$3">
                {/* Total Tasks */}
                <XStack justifyContent="space-between" alignItems="center">
                    <XStack alignItems="center" gap="$2">
                        <Target size="$1" color="$gray10" />
                        <Text fontSize="$4" color="$gray11">
                            Total Tugas
                        </Text>
                    </XStack>
                    <XStack alignItems="center" gap="$2">
                        <Text fontSize="$6" fontWeight="bold" color="$gray12">
                            {stats.totalTasks}
                        </Text>
                        <Text fontSize="$3" color="$green10">
                            {stats.taskIncrease} dari minggu lalu
                        </Text>
                    </XStack>
                </XStack>

                {/* Completion Rate */}
                <XStack justifyContent="space-between" alignItems="center">
                    <XStack alignItems="center" gap="$2">
                        <TrendingUp size="$1" color="$gray10" />
                        <Text fontSize="$4" color="$gray11">
                            Tingkat Penyelesaian
                        </Text>
                    </XStack>
                    <XStack alignItems="center" gap="$2">
                        <Text fontSize="$6" fontWeight="bold" color="$gray12">
                            {stats.completionRate}%
                        </Text>
                        <Text fontSize="$3" color="$green10">
                            {stats.completionIncrease} dari minggu lalu
                        </Text>
                    </XStack>
                </XStack>

                {/* Average Mood */}
                <XStack justifyContent="space-between" alignItems="center">
                    <XStack alignItems="center" gap="$2">
                        <Calendar size="$1" color="$gray10" />
                        <Text fontSize="$4" color="$gray11">
                            Rata-rata Suasana Hati
                        </Text>
                    </XStack>
                    <XStack alignItems="center" gap="$2">
                        <Text fontSize="$6" fontWeight="bold" color="$gray12">
                            {stats.averageMood}/10
                        </Text>
                        <Text fontSize="$3" color="$green10">
                            {stats.moodIncrease} dari minggu lalu
                        </Text>
                    </XStack>
                </XStack>

                {/* Most Productive Day */}
                <XStack justifyContent="space-between" alignItems="center">
                    <XStack alignItems="center" gap="$2">
                        <Clock size="$1" color="$gray10" />
                        <Text fontSize="$4" color="$gray11">
                            Hari Paling Produktif
                        </Text>
                    </XStack>
                    <Text fontSize="$5" fontWeight="bold" color="$gray12">
                        {stats.mostProductiveDay}
                    </Text>
                </XStack>
            </YStack>
        </YStack>
    );
};
