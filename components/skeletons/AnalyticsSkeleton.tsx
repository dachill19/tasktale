import { Skeleton } from "moti/skeleton";
import { ScrollView } from "react-native";
import { XStack, YStack } from "tamagui";

export const SkeletonCard = ({ children }: { children: React.ReactNode }) => (
    <YStack
        backgroundColor="$background"
        borderRadius="$6"
        borderWidth={1}
        borderColor="$gray6"
        padding="$4"
        width="100%"
        marginBottom="$4"
        shadowColor="$shadowColor"
        shadowOpacity={0.1}
        shadowRadius={8}
        shadowOffset={{ width: 0, height: 2 }}
        elevation={3}
    >
        {children}
    </YStack>
);

export const HeaderSkeleton = () => (
    <YStack alignItems="center" marginVertical="$4">
        <Skeleton width={200} height={32} radius={6} colorMode="light" />
    </YStack>
);

export const WeeklySummaryCardSkeleton = () => (
    <SkeletonCard>
        <YStack gap="$2">
            {/* Title */}
            <Skeleton width={150} height={16} radius={4} colorMode="light" />
            {/* Stats */}
            {Array.from({ length: 4 }).map((_, index) => (
                <YStack key={index} gap="$2" marginBottom="$2">
                    <Skeleton
                        width={100}
                        height={14}
                        radius={4}
                        colorMode="light"
                    />
                    <XStack alignItems="center" gap="$2">
                        <Skeleton
                            width={60}
                            height={28}
                            radius={4}
                            colorMode="light"
                        />
                        <Skeleton
                            width={120}
                            height={24}
                            radius={12}
                            colorMode="light"
                        />
                    </XStack>
                </YStack>
            ))}
        </YStack>
    </SkeletonCard>
);

export const ChartCardSkeleton = ({
    titleWidth = 180,
}: {
    titleWidth?: number;
}) => (
    <SkeletonCard>
        <YStack gap="$2">
            {/* Title */}
            <Skeleton
                width={titleWidth}
                height={16}
                radius={4}
                colorMode="light"
            />
            {/* Chart */}
            <YStack alignItems="center" marginVertical="$2">
                <Skeleton
                    width="90%"
                    height={200}
                    radius={12}
                    colorMode="light"
                />
            </YStack>
            {/* Legend */}
            <XStack gap="$2" alignItems="center">
                <Skeleton
                    width={100}
                    height={24}
                    radius={12}
                    colorMode="light"
                />
            </XStack>
        </YStack>
    </SkeletonCard>
);

export const MoodDistributionCardSkeleton = () => (
    <SkeletonCard>
        <YStack gap="$2">
            {/* Title */}
            <Skeleton width={200} height={16} radius={4} colorMode="light" />
            {/* Pie Chart */}
            <YStack alignItems="center" justifyContent="center">
                <Skeleton
                    width={150}
                    height={150}
                    radius="round"
                    colorMode="light"
                />
            </YStack>
            {/* Legend Items */}
            <YStack gap="$2" width="100%" paddingHorizontal="$2">
                {Array.from({ length: 3 }).map((_, index) => (
                    <XStack
                        key={index}
                        alignItems="center"
                        gap="$2"
                        justifyContent="space-between"
                    >
                        <XStack alignItems="center" gap="$2" flex={1}>
                            <Skeleton
                                width={8}
                                height={8}
                                radius="round"
                                colorMode="light"
                            />
                            <Skeleton
                                width={80}
                                height={14}
                                radius={4}
                                colorMode="light"
                            />
                        </XStack>
                        <Skeleton
                            width={40}
                            height={14}
                            radius={4}
                            colorMode="light"
                        />
                    </XStack>
                ))}
            </YStack>
        </YStack>
    </SkeletonCard>
);

export function AnalyticsSkeleton() {
    return (
        <YStack flex={1} backgroundColor="$background" paddingHorizontal="$4">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                <YStack>
                    {/* Page Title */}
                    <HeaderSkeleton />

                    {/* Weekly Summary Card */}
                    <WeeklySummaryCardSkeleton />

                    {/* Task Completion Card */}
                    <ChartCardSkeleton titleWidth={180} />

                    {/* Mood Trend Card */}
                    <ChartCardSkeleton titleWidth={200} />

                    {/* Mood Distribution Card */}
                    <MoodDistributionCardSkeleton />

                    {/* Productivity Card */}
                    <ChartCardSkeleton titleWidth={220} />

                    <YStack height="$8" />
                </YStack>
            </ScrollView>
        </YStack>
    );
}
