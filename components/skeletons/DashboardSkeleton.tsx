// components/skeletons/DashboardSkeleton.tsx
import { Skeleton } from "moti/skeleton";
import { ScrollView } from "react-native";
import { XStack, YStack } from "tamagui";

const SkeletonCard = ({ children }: { children: React.ReactNode }) => (
    <YStack
        backgroundColor="$background"
        borderRadius="$4"
        borderWidth={2}
        borderColor="$gray8"
        padding="$4"
        width="100%"
        marginBottom="$4"
        elevation={2}
    >
        {children}
    </YStack>
);

const SkeletonCardHeader = ({
    iconSize = 20,
    titleWidth = 120,
    showChevron = false,
}: {
    iconSize?: number;
    titleWidth?: number;
    showChevron?: boolean;
}) => (
    <XStack
        justifyContent="space-between"
        alignItems="center"
        marginBottom="$4"
    >
        <XStack alignItems="center" gap="$3">
            <Skeleton
                width={iconSize}
                height={iconSize}
                radius="round"
                colorMode="light"
            />
            <Skeleton
                width={titleWidth}
                height={20}
                radius={6}
                colorMode="light"
            />
        </XStack>
        {showChevron && (
            <YStack backgroundColor="$gray4" padding="$2.5" borderRadius="$8">
                <Skeleton
                    width={16}
                    height={16}
                    radius="round"
                    colorMode="light"
                />
            </YStack>
        )}
    </XStack>
);

const PriorityBadgeSkeleton = () => (
    <YStack
        backgroundColor="$gray3"
        borderRadius="$8"
        padding="$2"
        alignItems="center"
        justifyContent="center"
        width={16}
        height={16}
    >
        <Skeleton width={12} height={12} radius="round" colorMode="light" />
    </YStack>
);

const TaskSkeletonItem = ({
    showSubTasks = false,
}: {
    showSubTasks?: boolean;
}) => (
    <YStack>
        <XStack alignItems="flex-start" gap="$2" paddingVertical="$2">
            <PriorityBadgeSkeleton />
            <YStack flex={1} gap="$1.5">
                <Skeleton
                    width="85%"
                    height={16}
                    radius={4}
                    colorMode="light"
                />
                <Skeleton
                    width="45%"
                    height={12}
                    radius={4}
                    colorMode="light"
                />
                {showSubTasks && (
                    <YStack gap="$2" marginTop="$1">
                        <XStack alignItems="center" gap="$2">
                            <Skeleton
                                width={3}
                                height={3}
                                radius="round"
                                colorMode="light"
                            />
                            <Skeleton
                                width="60%"
                                height={12}
                                radius={4}
                                colorMode="light"
                            />
                        </XStack>
                        <XStack alignItems="center" gap="$2">
                            <Skeleton
                                width={3}
                                height={3}
                                radius="round"
                                colorMode="light"
                            />
                            <Skeleton
                                width="50%"
                                height={12}
                                radius={4}
                                colorMode="light"
                            />
                        </XStack>
                    </YStack>
                )}
            </YStack>
        </XStack>
    </YStack>
);

const JournalSkeletonItem = () => (
    <YStack gap="$2" paddingVertical="$2">
        <XStack justifyContent="space-between" alignItems="flex-start">
            <XStack gap="$2" alignItems="center" flex={1}>
                <Skeleton
                    width={24}
                    height={24}
                    radius="round"
                    colorMode="light"
                />
                <YStack flex={1}>
                    <Skeleton
                        width={100}
                        height={16}
                        radius={4}
                        colorMode="light"
                    />
                    <Skeleton
                        width={80}
                        height={12}
                        radius={4}
                        colorMode="light"
                    />
                </YStack>
            </XStack>
            <XStack
                backgroundColor="$gray3"
                paddingHorizontal="$2.5"
                paddingVertical="$1.5"
                borderRadius="$8"
                alignItems="center"
                gap="$1.5"
            >
                <Skeleton
                    width={12}
                    height={12}
                    radius="round"
                    colorMode="light"
                />
                <Skeleton width={30} height={8} radius={4} colorMode="light" />
            </XStack>
        </XStack>
        <Skeleton width="100%" height={24} radius={4} colorMode="light" />
    </YStack>
);

const MoodSkeletonItem = ({
    size = 48,
    isHighlight = false,
}: {
    size?: number;
    isHighlight?: boolean;
}) => (
    <YStack alignItems="center" gap="$2">
        <YStack
            alignItems="center"
            justifyContent="center"
            backgroundColor={isHighlight ? "$gray4" : "$gray3"}
            borderRadius="$8"
            width={size}
            height={size}
        >
            <Skeleton
                width={size * 0.5}
                height={size * 0.5}
                radius="round"
                colorMode="light"
            />
        </YStack>
        <YStack alignItems="center" gap="$0.5">
            <Skeleton width={16} height={16} radius={4} colorMode="light" />
            <Skeleton width={24} height={8} radius={4} colorMode="light" />
        </YStack>
    </YStack>
);

const SeparatorSkeleton = () => (
    <YStack height={2} backgroundColor="$gray5" marginVertical="$2" />
);

const EmptyStateSkeleton = ({ bgColor = "$gray3" }: { bgColor?: string }) => (
    <YStack
        alignItems="center"
        justifyContent="center"
        paddingVertical="$6"
        borderRadius="$4"
        backgroundColor={bgColor}
        gap="$2"
    >
        <Skeleton width={28} height={28} radius="round" colorMode="light" />
        <YStack alignItems="center" gap="$1">
            <Skeleton width={120} height={16} radius={4} colorMode="light" />
            <Skeleton width={140} height={12} radius={4} colorMode="light" />
        </YStack>
    </YStack>
);

export function DashboardSkeleton() {
    return (
        <YStack flex={1} backgroundColor="$background" paddingHorizontal="$4">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                <YStack>
                    {/* Header Skeleton */}
                    <YStack alignItems="center" marginVertical="$4">
                        <Skeleton
                            width={280}
                            height={32}
                            radius={8}
                            colorMode="light"
                        />
                        <Skeleton
                            width={200}
                            height={16}
                            radius={6}
                            colorMode="light"
                        />
                    </YStack>

                    {/* Task Progress Card */}
                    <SkeletonCard>
                        <SkeletonCardHeader iconSize={20} titleWidth={120} />
                        <YStack gap="$4">
                            <YStack gap="$3">
                                <Skeleton
                                    width="100%"
                                    height={8}
                                    radius={10}
                                    colorMode="light"
                                />
                                <XStack
                                    justifyContent="space-between"
                                    alignItems="center"
                                >
                                    <Skeleton
                                        width={140}
                                        height={12}
                                        radius={4}
                                        colorMode="light"
                                    />
                                    <XStack
                                        backgroundColor="$gray3"
                                        paddingHorizontal="$3"
                                        paddingVertical="$1.5"
                                        borderRadius="$8"
                                    >
                                        <Skeleton
                                            width={40}
                                            height={12}
                                            radius={4}
                                            colorMode="light"
                                        />
                                    </XStack>
                                </XStack>
                            </YStack>
                        </YStack>
                    </SkeletonCard>

                    {/* Overdue Tasks Card */}
                    <SkeletonCard>
                        <SkeletonCardHeader
                            iconSize={20}
                            titleWidth={140}
                            showChevron
                        />
                        <YStack gap="$2">
                            <XStack
                                backgroundColor="$gray3"
                                paddingHorizontal="$3"
                                paddingVertical="$1.5"
                                borderRadius="$8"
                                alignSelf="flex-start"
                            >
                                <Skeleton
                                    width={80}
                                    height={12}
                                    radius={4}
                                    colorMode="light"
                                />
                            </XStack>
                            <YStack>
                                <TaskSkeletonItem />
                                <SeparatorSkeleton />
                                <TaskSkeletonItem showSubTasks />
                            </YStack>
                        </YStack>
                    </SkeletonCard>

                    {/* Today's Tasks Card */}
                    <SkeletonCard>
                        <SkeletonCardHeader
                            iconSize={20}
                            titleWidth={140}
                            showChevron
                        />
                        <YStack gap="$2">
                            <XStack
                                backgroundColor="$gray3"
                                paddingHorizontal="$3"
                                paddingVertical="$1.5"
                                borderRadius="$8"
                                alignSelf="flex-start"
                            >
                                <Skeleton
                                    width={60}
                                    height={12}
                                    radius={4}
                                    colorMode="light"
                                />
                            </XStack>
                            <YStack>
                                <TaskSkeletonItem />
                                <SeparatorSkeleton />
                                <TaskSkeletonItem />
                                <SeparatorSkeleton />
                                <TaskSkeletonItem showSubTasks />
                            </YStack>
                        </YStack>
                    </SkeletonCard>

                    {/* Weekly Mood Card */}
                    <SkeletonCard>
                        <SkeletonCardHeader iconSize={20} titleWidth={120} />
                        <YStack gap="$2">
                            <XStack
                                justifyContent="center"
                                alignItems="flex-end"
                                gap="$2"
                                paddingVertical="$2"
                                flexWrap="wrap"
                            >
                                <MoodSkeletonItem size={56} isHighlight />
                                <MoodSkeletonItem size={48} />
                                <MoodSkeletonItem size={48} />
                                <MoodSkeletonItem size={48} />
                                <MoodSkeletonItem size={48} />
                            </XStack>
                            <XStack
                                backgroundColor="$gray3"
                                padding="$3"
                                borderRadius="$4"
                                justifyContent="center"
                            >
                                <Skeleton
                                    width={180}
                                    height={12}
                                    radius={4}
                                    colorMode="light"
                                />
                            </XStack>
                        </YStack>
                    </SkeletonCard>

                    {/* Recent Journals Card */}
                    <SkeletonCard>
                        <SkeletonCardHeader
                            iconSize={20}
                            titleWidth={140}
                            showChevron
                        />
                        <YStack gap="$2">
                            <JournalSkeletonItem />
                            <SeparatorSkeleton />
                            <JournalSkeletonItem />
                            <SeparatorSkeleton />
                            <JournalSkeletonItem />
                        </YStack>
                    </SkeletonCard>

                    {/* Journal Reminder Card */}
                    <YStack
                        backgroundColor="$gray2"
                        borderRadius="$4"
                        borderWidth={1}
                        borderColor="$gray8"
                        padding="$4"
                        marginBottom="$4"
                    >
                        <YStack gap="$2">
                            <XStack alignItems="center" gap="$2">
                                <Skeleton
                                    width={16}
                                    height={16}
                                    radius="round"
                                    colorMode="light"
                                />
                                <Skeleton
                                    width={200}
                                    height={20}
                                    radius={6}
                                    colorMode="light"
                                />
                            </XStack>
                            <Skeleton
                                width="90%"
                                height={16}
                                radius={4}
                                colorMode="light"
                            />
                        </YStack>
                    </YStack>

                    {/* Upcoming Tasks Card */}
                    <SkeletonCard>
                        <SkeletonCardHeader
                            iconSize={20}
                            titleWidth={140}
                            showChevron
                        />
                        <YStack gap="$2">
                            <XStack
                                backgroundColor="$gray3"
                                paddingHorizontal="$3"
                                paddingVertical="$1.5"
                                borderRadius="$8"
                                alignSelf="flex-start"
                            >
                                <Skeleton
                                    width={70}
                                    height={12}
                                    radius={4}
                                    colorMode="light"
                                />
                            </XStack>
                            <YStack>
                                <TaskSkeletonItem />
                                <SeparatorSkeleton />
                                <TaskSkeletonItem />
                            </YStack>
                        </YStack>
                    </SkeletonCard>
                </YStack>
            </ScrollView>
        </YStack>
    );
}
