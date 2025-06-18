import React, { useState } from "react";
import { BarChart, LineChart, PieChart } from "react-native-chart-kit";
import { Stack, Text, XStack, YStack } from "tamagui";

interface BaseCardProps {
    title: string;
    icon?: string;
}

interface TaskCompletionCardProps extends BaseCardProps {
    data?: {
        labels: string[];
        datasets: Array<{
            data: number[];
            color: (opacity?: number) => string;
            strokeWidth: number;
        }>;
    };
}

interface MoodTrendCardProps extends BaseCardProps {
    data?: {
        labels: string[];
        datasets: Array<{
            data: number[];
            color: (opacity?: number) => string;
            strokeWidth: number;
        }>;
    };
}

interface ProductivityCardProps extends BaseCardProps {
    data?: {
        labels: string[];
        datasets: Array<{
            data: number[];
            color: (opacity?: number) => string;
        }>;
    };
}

interface MoodDistributionCardProps extends BaseCardProps {
    data?: Array<{
        name: string;
        population: number;
        color: string;
        legendFontColor: string;
        legendFontSize: number;
    }>;
}

interface WeeklySummaryCardProps extends BaseCardProps {
    stats?: {
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
    color: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    style: {
        borderRadius: 16,
    },
    propsForLabels: {
        fontSize: 11,
        fontWeight: "500",
    },
    propsForVerticalLabels: {
        fontSize: 10,
        fill: "#6B7280",
    },
    propsForHorizontalLabels: {
        fontSize: 10,
        fill: "#6B7280",
    },
};

const CardWrapper: React.FC<{ children: React.ReactNode; title: string }> = ({
    children,
    title,
}) => (
    <YStack
        backgroundColor="$background"
        borderRadius="$4"
        borderWidth={2}
        borderColor="$gray8"
        padding="$4"
        marginBottom="$4"
        position="relative"
        width="100%"
        elevation={2}
        animation="quick"
        pressStyle={{ scale: 0.95 }}
    >
        <XStack
            justifyContent="space-between"
            marginBottom="$2"
            alignItems="center"
            flex={1}
        >
            <Text
                fontSize="$4"
                fontWeight="bold"
                color="$gray12"
                numberOfLines={1}
                ellipsizeMode="tail"
            >
                {title}
            </Text>
        </XStack>
        {children}
    </YStack>
);

export const TaskCompletionCard: React.FC<TaskCompletionCardProps> = ({
    title,
    icon,
    data,
}) => {
    const [cardWidth, setCardWidth] = useState(300);

    const handleLayout = (event: any) => {
        const { width } = event.nativeEvent.layout;
        setCardWidth(width - 48);
    };

    if (!data || !data.labels || !data.datasets || data.datasets.length === 0) {
        return (
            <CardWrapper title={title}>
                <Text fontSize="$3" color="$red10">
                    Tidak ada data tersedia
                </Text>
            </CardWrapper>
        );
    }

    const completedTasksData = {
        labels: data.labels,
        datasets: [data.datasets[0]],
    };

    return (
        <CardWrapper title={title}>
            <YStack gap="$2" onLayout={handleLayout}>
                <YStack alignItems="center" marginVertical="$2">
                    <BarChart
                        data={completedTasksData}
                        width={cardWidth}
                        height={200}
                        chartConfig={{
                            ...chartConfig,
                            barPercentage: 0.35,
                            fillShadowGradient: "#22C55E",
                            fillShadowGradientOpacity: 0.8,
                        }}
                        yAxisLabel=""
                        yAxisSuffix=""
                        verticalLabelRotation={0}
                        showValuesOnTopOfBars={false}
                        fromZero={true}
                        style={{
                            borderRadius: 12,
                            paddingRight: 20,
                            marginLeft: 20,
                        }}
                        withInnerLines={true}
                        withHorizontalLabels={true}
                        withVerticalLabels={true}
                    />
                </YStack>
                <XStack gap="$2" alignItems="center">
                    <XStack
                        bg="$green4"
                        alignItems="center"
                        px="$2"
                        py="$1"
                        borderRadius="$10"
                        gap="$1"
                    >
                        <Stack
                            width={8}
                            height={8}
                            backgroundColor="$green10"
                            borderRadius={99}
                        />
                        <Text fontSize="$1" color="$green10">
                            Tugas Selesai
                        </Text>
                    </XStack>
                </XStack>
            </YStack>
        </CardWrapper>
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
        setCardWidth(width - 48);
    };

    if (!data || !data.labels || !data.datasets || data.datasets.length === 0) {
        return (
            <CardWrapper title={title}>
                <Text fontSize="$3" color="$red10">
                    Tidak ada data tersedia
                </Text>
            </CardWrapper>
        );
    }

    return (
        <CardWrapper title={title}>
            <YStack gap="$2" onLayout={handleLayout}>
                <YStack alignItems="center" marginVertical="$2">
                    <LineChart
                        data={data}
                        width={cardWidth}
                        height={200}
                        chartConfig={{
                            ...chartConfig,
                            color: (opacity = 1) =>
                                `rgba(251, 146, 60, ${opacity})`,
                            propsForDots: {
                                r: "4",
                                strokeWidth: "2",
                                stroke: "#FB923C",
                                fill: "#FB923C",
                            },
                            propsForBackgroundLines: {
                                strokeDasharray: "5,5",
                                stroke: "#E5E7EB",
                                strokeWidth: 1,
                            },
                        }}
                        bezier
                        style={{
                            borderRadius: 12,
                            paddingRight: 20,
                            marginLeft: 20,
                        }}
                        withDots={true}
                        withInnerLines={true}
                        withHorizontalLabels={true}
                        withVerticalLabels={true}
                        withShadow={false}
                    />
                </YStack>
                <XStack gap="$2" alignItems="center">
                    <XStack
                        bg="$orange4"
                        alignItems="center"
                        px="$2"
                        py="$1"
                        borderRadius="$10"
                        gap="$1"
                    >
                        <Stack
                            width={8}
                            height={8}
                            backgroundColor="$orange10"
                            borderRadius={99}
                        />
                        <Text fontSize="$1" color="$orange10">
                            Suasana Hati (1-5)
                        </Text>
                    </XStack>
                </XStack>
            </YStack>
        </CardWrapper>
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
        setCardWidth(width - 48);
    };

    if (!data || data.length === 0) {
        return (
            <CardWrapper title={title}>
                <Text fontSize="$3" color="$red10">
                    Tidak ada data tersedia
                </Text>
            </CardWrapper>
        );
    }

    const totalCount = data.reduce((sum, item) => sum + item.population, 0);
    const dataWithPercentages = data.map((item) => ({
        ...item,
        percentage: Math.round((item.population / totalCount) * 100),
    }));

    return (
        <CardWrapper title={title}>
            <YStack gap="$2" onLayout={handleLayout}>
                <YStack gap="$2" alignItems="center">
                    <YStack alignItems="center" justifyContent="center">
                        <PieChart
                            data={data}
                            width={cardWidth}
                            height={220}
                            chartConfig={{
                                ...chartConfig,
                                color: (opacity = 1) =>
                                    `rgba(0, 0, 0, ${opacity})`,
                            }}
                            accessor="population"
                            backgroundColor="transparent"
                            paddingLeft="0"
                            center={[cardWidth / 4, 0]}
                            absolute={false}
                            hasLegend={false}
                        />
                    </YStack>
                    <YStack gap="$2" width="100%" paddingHorizontal="$2">
                        {dataWithPercentages.map((item, index) => (
                            <XStack
                                key={index}
                                alignItems="center"
                                gap="$2"
                                justifyContent="space-between"
                            >
                                <XStack alignItems="center" gap="$2" flex={1}>
                                    <Stack
                                        width={8}
                                        height={8}
                                        backgroundColor={item.color}
                                        borderRadius={99}
                                    />
                                    <Text
                                        fontSize="$3"
                                        color="$gray11"
                                        fontWeight="500"
                                        textTransform="capitalize"
                                        flex={1}
                                    >
                                        {item.name}
                                    </Text>
                                </XStack>
                                <Text
                                    fontSize="$3"
                                    color="$gray12"
                                    fontWeight="600"
                                >
                                    {item.percentage}%
                                </Text>
                            </XStack>
                        ))}
                    </YStack>
                </YStack>
            </YStack>
        </CardWrapper>
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
        setCardWidth(width - 48);
    };

    if (!data || !data.labels || !data.datasets || data.datasets.length === 0) {
        return (
            <CardWrapper title={title}>
                <Text fontSize="$3" color="$red10">
                    Tidak ada data tersedia
                </Text>
            </CardWrapper>
        );
    }

    const filteredData = {
        ...data,
        labels: data.labels.map((label, index) => {
            if (index % 3 === 0) {
                return label.length > 5 ? `${label.split(":")[0]}:00` : label;
            }
            return "";
        }),
    };

    return (
        <CardWrapper title={title}>
            <YStack gap="$2" onLayout={handleLayout}>
                <YStack alignItems="center" marginVertical="$2">
                    <BarChart
                        data={filteredData}
                        width={cardWidth}
                        height={200}
                        chartConfig={{
                            ...chartConfig,
                            color: (opacity = 1) =>
                                `rgba(59, 130, 246, ${opacity})`,
                            barPercentage: 0.8,
                            fillShadowGradient: "#3B82F6",
                            fillShadowGradientOpacity: 0.8,
                            propsForHorizontalLabels: {
                                fontSize: 9,
                                fill: "#6B7280",
                            },
                        }}
                        yAxisLabel=""
                        yAxisSuffix=""
                        verticalLabelRotation={0}
                        showValuesOnTopOfBars={false}
                        fromZero={true}
                        style={{
                            borderRadius: 12,
                            paddingRight: 20,
                            marginLeft: 20,
                        }}
                        withInnerLines={true}
                        withHorizontalLabels={true}
                        withVerticalLabels={true}
                    />
                </YStack>
                <XStack gap="$2" alignItems="center">
                    <XStack
                        bg="$blue4"
                        alignItems="center"
                        px="$2"
                        py="$1"
                        borderRadius="$10"
                        gap="$1"
                    >
                        <Stack
                            width={8}
                            height={8}
                            backgroundColor="$blue10"
                            borderRadius={99}
                        />
                        <Text fontSize="$1" color="$blue10">
                            Tingkat Produktivitas
                        </Text>
                    </XStack>
                </XStack>
            </YStack>
        </CardWrapper>
    );
};

export const WeeklySummaryCard: React.FC<WeeklySummaryCardProps> = ({
    title,
    icon,
    stats,
}) => {
    const formatChange = (
        change: string
    ): string | { value: string; color: string; prefix: string } => {
        if (change === "N/A") return change;
        const isPositive = !change.startsWith("-");
        return {
            value: change,
            color: isPositive ? "$green10" : "$red10",
            prefix: isPositive ? "+" : "",
        };
    };

    const getChangeDisplay = (change: string) => {
        const formatted = formatChange(change);
        if (typeof formatted === "string") {
            return { value: formatted, color: "$gray8", prefix: "" };
        }
        return formatted;
    };

    if (!stats) {
        return (
            <CardWrapper title={title}>
                <Text fontSize="$3" color="$red10">
                    Tidak ada statistik tersedia
                </Text>
            </CardWrapper>
        );
    }

    return (
        <CardWrapper title={title}>
            <YStack gap="$2">
                <YStack gap="$2">
                    <Text fontSize="$3" color="$gray10" fontWeight="500">
                        Total Tugas
                    </Text>
                    <XStack alignItems="center" gap="$2">
                        <Text fontSize="$6" fontWeight="700" color="$gray12">
                            {stats.totalTasks}
                        </Text>
                        <XStack
                            bg={
                                getChangeDisplay(stats.taskIncrease).color ===
                                "$green10"
                                    ? "$green4"
                                    : "$red4"
                            }
                            alignItems="center"
                            px="$2"
                            py="$1"
                            borderRadius="$10"
                            gap="$1"
                        >
                            <Text
                                fontSize="$1"
                                color={
                                    getChangeDisplay(stats.taskIncrease).color
                                }
                            >
                                {getChangeDisplay(stats.taskIncrease).prefix}
                                {
                                    getChangeDisplay(stats.taskIncrease).value
                                }{" "}
                                dari minggu lalu
                            </Text>
                        </XStack>
                    </XStack>
                </YStack>
                <YStack gap="$2">
                    <Text fontSize="$3" color="$gray10" fontWeight="500">
                        Tingkat Penyelesaian
                    </Text>
                    <XStack alignItems="center" gap="$2">
                        <Text fontSize="$6" fontWeight="700" color="$gray12">
                            {stats.completionRate}%
                        </Text>
                        <XStack
                            bg={
                                getChangeDisplay(stats.completionIncrease)
                                    .color === "$green10"
                                    ? "$green4"
                                    : "$red4"
                            }
                            alignItems="center"
                            px="$2"
                            py="$1"
                            borderRadius="$10"
                            gap="$1"
                        >
                            <Text
                                fontSize="$1"
                                color={
                                    getChangeDisplay(stats.completionIncrease)
                                        .color
                                }
                            >
                                {
                                    getChangeDisplay(stats.completionIncrease)
                                        .prefix
                                }
                                {
                                    getChangeDisplay(stats.completionIncrease)
                                        .value
                                }{" "}
                                dari minggu lalu
                            </Text>
                        </XStack>
                    </XStack>
                </YStack>
                <YStack gap="$2">
                    <Text fontSize="$3" color="$gray10" fontWeight="500">
                        Rata-rata Suasana Hati
                    </Text>
                    <XStack alignItems="center" gap="$2">
                        <Text fontSize="$6" fontWeight="700" color="$gray12">
                            {stats.averageMood}/5
                        </Text>
                        <XStack
                            bg={
                                getChangeDisplay(stats.moodIncrease).color ===
                                "$green10"
                                    ? "$green4"
                                    : "$red4"
                            }
                            alignItems="center"
                            px="$2"
                            py="$1"
                            borderRadius="$10"
                            gap="$1"
                        >
                            <Text
                                fontSize="$1"
                                color={
                                    getChangeDisplay(stats.moodIncrease).color
                                }
                            >
                                {getChangeDisplay(stats.moodIncrease).prefix}
                                {
                                    getChangeDisplay(stats.moodIncrease).value
                                }{" "}
                                dari minggu lalu
                            </Text>
                        </XStack>
                    </XStack>
                </YStack>
                <YStack gap="$2">
                    <Text fontSize="$3" color="$gray10" fontWeight="500">
                        Hari Paling Produktif
                    </Text>
                    <Text fontSize="$4" fontWeight="600" color="$gray12">
                        {stats.mostProductiveDay}
                    </Text>
                </YStack>
            </YStack>
        </CardWrapper>
    );
};
