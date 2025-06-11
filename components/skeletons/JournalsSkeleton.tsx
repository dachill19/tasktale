// components/skeletons/JournalsSkeleton.tsx
import { Skeleton } from "moti/skeleton";
import { ScrollView } from "react-native";
import { XStack, YStack } from "tamagui";

const SkeletonCard = ({ children }: { children: React.ReactNode }) => (
    <YStack
        backgroundColor="$background"
        borderRadius="$6" // Mengikuti DashboardSkeleton
        borderWidth={1} // Mengikuti DashboardSkeleton
        borderColor="$gray6" // Mengikuti DashboardSkeleton
        padding="$4"
        width="100%"
        marginBottom="$4"
        shadowColor="$shadowColor"
        shadowOpacity={0.1}
        shadowRadius={8}
        shadowOffset={{ width: 0, height: 2 }}
        elevation={3} // Mengikuti DashboardSkeleton
    >
        {children}
    </YStack>
);

const HeaderSkeleton = () => (
    <YStack alignItems="center" marginVertical="$4">
        <Skeleton width={150} height={28} radius={6} colorMode="light" />
    </YStack>
);

const FilterToggleSkeleton = () => (
    <XStack justifyContent="space-between" marginBottom="$4" gap="$2">
        {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton
                key={index}
                width={75}
                height={36}
                radius={18}
                colorMode="light"
            />
        ))}
    </XStack>
);

const JournalCardSkeleton = () => (
    <YStack position="relative" marginBottom="$3">
        <SkeletonCard>
            {/* Journal Header (Mood + Date) */}
            <XStack
                justifyContent="space-between"
                alignItems="center"
                marginBottom="$2"
            >
                <XStack alignItems="center" gap="$2">
                    <Skeleton
                        width={24}
                        height={24}
                        radius="round"
                        colorMode="light"
                    />
                    <Skeleton
                        width={120}
                        height={16}
                        radius={4}
                        colorMode="light"
                    />
                </XStack>
                <Skeleton
                    width={20}
                    height={20}
                    radius="round"
                    colorMode="light"
                />
            </XStack>

            {/* Journal Content */}
            <YStack gap="$2" marginBottom="$3">
                <Skeleton
                    width="95%"
                    height={14}
                    radius={4}
                    colorMode="light"
                />
                <Skeleton
                    width="80%"
                    height={14}
                    radius={4}
                    colorMode="light"
                />
                <Skeleton
                    width="60%"
                    height={14}
                    radius={4}
                    colorMode="light"
                />
            </YStack>

            {/* Journal Images (Single image placeholder for simplicity) */}
            <YStack marginBottom="$3">
                <Skeleton
                    width="100%"
                    height={150}
                    radius={8}
                    colorMode="light"
                />
            </YStack>

            {/* Journal Tags */}
            <XStack gap="$2" alignItems="center" flexWrap="wrap">
                <Skeleton
                    width={70}
                    height={24}
                    radius={12}
                    colorMode="light"
                />
                <Skeleton
                    width={90}
                    height={24}
                    radius={12}
                    colorMode="light"
                />
                <Skeleton
                    width={60}
                    height={24}
                    radius={12}
                    colorMode="light"
                />
            </XStack>
        </SkeletonCard>
    </YStack>
);

export function JournalsSkeleton() {
    return (
        <YStack flex={1} backgroundColor="$background" paddingHorizontal="$4">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                <YStack>
                    {/* Page Title */}
                    <HeaderSkeleton />

                    {/* Filter Toggles */}
                    <FilterToggleSkeleton />

                    {/* Journal Cards */}
                    <YStack gap="$0">
                        <JournalCardSkeleton />
                        <JournalCardSkeleton />
                        <JournalCardSkeleton />
                    </YStack>
                </YStack>
            </ScrollView>
        </YStack>
    );
}
