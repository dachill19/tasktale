// components/skeletons/TasksSkeleton.tsx
import { Skeleton } from 'moti/skeleton';
import { ScrollView } from 'react-native';
import { XStack, YStack } from 'tamagui';

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
    <Skeleton 
      width={80} 
      height={28} 
      radius={6}
      colorMode="light"
    />
  </YStack>
);

const FilterToggleSkeleton = () => (
  <XStack justifyContent="space-between" marginBottom="$4" space="$2">
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

const TaskCardSkeleton = () => (
  <YStack position="relative" marginBottom="$3">
    <SkeletonCard>
      {/* Task Header (Checkbox + Title) */}
      <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
        <XStack alignItems="center" space="$2" flex={1}>
          <Skeleton width={24} height={24} radius="round" colorMode="light" />
          <Skeleton width="80%" height={16} radius={4} colorMode="light" />
        </XStack>
        <XStack space="$2">
          <Skeleton width={20} height={20} radius="round" colorMode="light" />
          <Skeleton width={20} height={20} radius="round" colorMode="light" />
        </XStack>
      </XStack>

      {/* Task Description */}
      <YStack marginBottom="$2">
        <Skeleton width="95%" height={14} radius={4} colorMode="light" />
        <Skeleton width="70%" height={14} radius={4} colorMode="light" />
      </YStack>

      {/* Priority, Deadline, and Subtask Count */}
      <XStack space="$2" marginBottom="$2">
        <Skeleton width={70} height={24} radius={12} colorMode="light" />
        <Skeleton width={100} height={24} radius={12} colorMode="light" />
        <Skeleton width={60} height={24} radius={12} colorMode="light" />
      </XStack>

      {/* Sub-Tasks */}
      <YStack marginTop="$2">
        <YStack marginBottom="$2">
          <Skeleton width={100} height={14} radius={4} colorMode="light" />
        </YStack>
        {Array.from({ length: 2 }).map((_, index) => (
          <XStack key={index} alignItems="center" space="$2" marginBottom="$2">
            <Skeleton width={24} height={24} radius="round" colorMode="light" />
            <Skeleton width="85%" height={16} radius={4} colorMode="light" />
          </XStack>
        ))}
      </YStack>
    </SkeletonCard>
  </YStack>
);

export function TasksSkeleton() {
  return (
    <YStack
      flex={1}
      backgroundColor="$background"
      paddingHorizontal="$4"
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <YStack>
          {/* Page Title */}
          <HeaderSkeleton />

          {/* Filter Toggles */}
          <FilterToggleSkeleton />

          {/* Task Cards */}
          <YStack space="$0">
            <TaskCardSkeleton />
            <TaskCardSkeleton />
            <TaskCardSkeleton />
          </YStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
}