// components/skeletons/DashboardSkeleton.tsx
import { Skeleton } from 'moti/skeleton';
import { ScrollView } from 'react-native';
import { XStack, YStack } from 'tamagui';

const SkeletonCard = ({ children }: { children: React.ReactNode }) => (
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

const SkeletonRow = ({ 
  iconSize = 20, 
  titleWidth = 120, 
  showChevron = false 
}: { 
  iconSize?: number; 
  titleWidth?: number; 
  showChevron?: boolean; 
}) => (
  <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
    <XStack alignItems="center" space="$3">
      <Skeleton 
        width={iconSize} 
        height={iconSize} 
        radius="round"
        colorMode="light"
      />
      <Skeleton 
        width={titleWidth} 
        height={24} 
        radius={6}
        colorMode="light"
      />
    </XStack>
    {showChevron && (
      <Skeleton 
        width={16} 
        height={16} 
        radius="round"
        colorMode="light"
      />
    )}
  </XStack>
);

const TaskSkeletonItem = ({ showCheckbox = true }: { showCheckbox?: boolean }) => (
  <XStack alignItems="center" space="$3" paddingVertical="$2">
    <Skeleton width={12} height={12} radius="round" colorMode="light" />
    <YStack flex={1} space="$1">
      <Skeleton width="85%" height={16} radius={4} colorMode="light" />
      <Skeleton width="45%" height={12} radius={4} colorMode="light" />
    </YStack>
    {showCheckbox && (
      <Skeleton width={24} height={24} radius="round" colorMode="light" />
    )}
  </XStack>
);

const JournalSkeletonItem = () => (
  <YStack paddingVertical="$3">
    <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
      <XStack alignItems="center" space="$2">
        <Skeleton width={24} height={24} radius="round" colorMode="light" />
        <Skeleton width={100} height={14} radius={4} colorMode="light" />
      </XStack>
      <XStack alignItems="center" space="$1">
        <Skeleton width={16} height={16} radius="round" colorMode="light" />
        <Skeleton width={40} height={12} radius={4} colorMode="light" />
      </XStack>
    </XStack>
    <Skeleton width="100%" height={48} radius={6} colorMode="light" />
  </YStack>
);

const MoodSkeletonItem = ({ size = 32 }: { size?: number }) => (
  <YStack alignItems="center" space="$2">
    <Skeleton 
      width={size} 
      height={size} 
      radius="round" 
      colorMode="light" 
    />
    <Skeleton width={24} height={16} radius={4} colorMode="light" />
  </YStack>
);

export function DashboardSkeleton() {
  return (
    <YStack
      flex={1}
      backgroundColor="$background"
      paddingHorizontal="$4"
      alignItems="center"
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <YStack>
          {/* Enhanced Header Skeleton */}
          <YStack alignItems="center" marginVertical="$6" space="$3">
            <Skeleton 
              width={280} 
              height={36} 
              radius={8}
              colorMode="light"
            />
            <Skeleton 
              width={200} 
              height={18} 
              radius={6}
              colorMode="light"
            />
          </YStack>

          {/* Enhanced Task Progress Card */}
          <SkeletonCard>
            <SkeletonRow iconSize={24} titleWidth={140} />
            <YStack space="$3">
              <Skeleton 
                width="100%" 
                height={12} 
                radius={6}
                colorMode="light"
              />
              <XStack justifyContent="space-between" alignItems="center">
                <Skeleton width={140} height={16} radius={4} colorMode="light" />
                <Skeleton width={60} height={20} radius={6} colorMode="light" />
              </XStack>
            </YStack>
          </SkeletonCard>

          {/* Enhanced Overdue Tasks Card */}
          <SkeletonCard>
            <SkeletonRow iconSize={24} titleWidth={140} showChevron />
            <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
              <Skeleton width={120} height={14} radius={4} colorMode="light" />
            </XStack>
            <YStack space="$2">
              <TaskSkeletonItem showCheckbox={false} />
              <YStack height={1} backgroundColor="$gray4" marginVertical="$1" />
              <TaskSkeletonItem showCheckbox={false} />
            </YStack>
          </SkeletonCard>

          {/* Enhanced Today's Tasks Card */}
          <SkeletonCard>
            <SkeletonRow iconSize={24} titleWidth={140} showChevron />
            <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
              <Skeleton width={80} height={14} radius={4} colorMode="light" />
            </XStack>
            <YStack space="$2">
              <TaskSkeletonItem />
              <YStack height={1} backgroundColor="$gray4" marginVertical="$1" />
              <TaskSkeletonItem />
              <YStack height={1} backgroundColor="$gray4" marginVertical="$1" />
              <TaskSkeletonItem />
            </YStack>
          </SkeletonCard>

          {/* Enhanced Weekly Mood Card */}
          <SkeletonCard>
            <SkeletonRow iconSize={24} titleWidth={140} />
            <YStack space="$3">
              <XStack 
                justifyContent="center" 
                alignItems="flex-end" 
                space="$4" 
                paddingVertical="$2"
              >
                <MoodSkeletonItem size={40} />
                <MoodSkeletonItem size={36} />
                <MoodSkeletonItem size={32} />
                <MoodSkeletonItem size={28} />
              </XStack>
              <YStack alignItems="center">
                <Skeleton width={180} height={14} radius={4} colorMode="light" />
              </YStack>
            </YStack>
          </SkeletonCard>

          {/* Enhanced Recent Journals Card */}
          <SkeletonCard>
            <SkeletonRow iconSize={24} titleWidth={140} showChevron />
            <YStack>
              <JournalSkeletonItem />
              <YStack height={1} backgroundColor="$gray4" marginVertical="$2" />
              <JournalSkeletonItem />
              <YStack height={1} backgroundColor="$gray4" marginVertical="$2" />
              <JournalSkeletonItem />
            </YStack>
          </SkeletonCard>

          {/* Enhanced Journal Reminder Card */}
          <YStack
            backgroundColor="$blue2"
            borderRadius="$6"
            borderWidth={1}
            borderColor="$blue6"
            padding="$4"
            marginBottom="$4"
            shadowColor="$blue8"
            shadowOpacity={0.1}
            shadowRadius={6}
            shadowOffset={{ width: 0, height: 2 }}
            elevation={2}
          >
            <YStack space="$2">
              <Skeleton 
                width="90%" 
                height={22} 
                radius={6}
                colorMode="light"
              />
              <Skeleton 
                width="75%" 
                height={16} 
                radius={4}
                colorMode="light"
              />
            </YStack>
          </YStack>

          {/* Enhanced Upcoming Tasks Card */}
          <SkeletonCard>
            <SkeletonRow iconSize={24} titleWidth={140} showChevron />
            <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
              <Skeleton width={100} height={14} radius={4} colorMode="light" />
            </XStack>
            <YStack space="$2">
              <TaskSkeletonItem />
              <YStack height={1} backgroundColor="$gray4" marginVertical="$1" />
              <TaskSkeletonItem />
            </YStack>
          </SkeletonCard>
        </YStack>
      </ScrollView>
    </YStack>
  );
}