import DashboardCard from '@/components/DashboardCard';
import { DashboardSkeleton } from '@/components/skeletons/DashboardSkeleton';
import { useDashboardStore } from '@/lib/stores/dashboardStore';
import { useFocusEffect, useRouter } from 'expo-router';
import { DateTime } from 'luxon';
import { useCallback } from 'react';
import { ScrollView } from 'react-native';
import { Text, YStack } from 'tamagui';

   const Dashboard = () => {
     const router = useRouter();
     const {
       greeting,
       userName,
       todayTasks,
       allTasks,
       journalEntries,
       loading,
       error,
       fetchData,
       toggleTask,
       isTaskOverdue,
       isTaskUpcoming,
     } = useDashboardStore();

     const today = DateTime.local({ zone: 'Asia/Jakarta' });

     useFocusEffect(
       useCallback(() => {
         fetchData();
       }, [fetchData])
     );

     const overdueTasks = allTasks.filter((task) => task.dueDate && isTaskOverdue(task.dueDate));
     const upcomingTasks = allTasks.filter((task) => task.dueDate && isTaskUpcoming(task.dueDate));

     const completedTasksCount = allTasks.filter((t) => t.completed).length;
     const totalTasksCount = allTasks.length;
     const taskProgress = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

     const hasTodayJournal = journalEntries.some((entry) => {
       try {
         return DateTime.fromISO(entry.date, { zone: 'Asia/Jakarta' }).hasSame(today, 'day');
       } catch {
         return false;
       }
     });

     if (loading) {
       return <DashboardSkeleton />;
     }

     if (error) {
       return (
         <YStack flex={1} justifyContent="center" alignItems="center" padding="$4">
           <Text color="$red10" textAlign="center" marginBottom="$2">
             Error: {error}
           </Text>
           <Text
             color="$blue10"
             textDecorationLine="underline"
             onPress={() => {
               fetchData();
             }}
           >
             Tap to retry
           </Text>
         </YStack>
       );
     }

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
             <YStack alignItems="center" marginVertical="$4">
               <Text fontSize="$8" fontWeight="bold" color="$color10">
                 {greeting}, {userName}!
               </Text>
               <Text color="$gray10" fontSize="$4" fontWeight="500">
                 {today.toFormat('EEEE, d MMMM yyyy')}
               </Text>
             </YStack>

             <DashboardCard
               title="Task Progress"
               icon="📈"
               type="progress"
               progress={taskProgress}
               completedTasks={completedTasksCount}
               totalTasks={totalTasksCount}
             />

             {overdueTasks.length > 0 && (
               <DashboardCard
                 title="Overdue Tasks"
                 icon="⚠️"
                 type="overdue-display"
                 tasks={overdueTasks}
                 onViewAllTasks={() => router.push('/tasks')}
               />
             )}

             <DashboardCard
               title="Today's Tasks"
               icon="📅"
               type="tasks"
               tasks={todayTasks}
               onToggleTask={toggleTask}
               onViewAllTasks={() => router.push('/tasks')}
             />

             <DashboardCard
               title="Weekly Mood"
               icon="📊"
               type="weekly-mood"
               journals={journalEntries}
             />

             <DashboardCard
               title="Recent Journals"
               icon="📔"
               type="recent-journals"
               journals={journalEntries}
               onViewAllJournals={() => router.push('/journals')}
             />

             {!hasTodayJournal && (
               <YStack
                 backgroundColor="$blue2"
                 borderRadius="$4"
                 borderWidth={1}
                 borderColor="$blue8"
                 padding="$4"
                 marginBottom="$4"
               >
                 <Text
                   fontSize="$5"
                   fontWeight="600"
                   color="$blue10"
                   marginBottom="$2"
                 >
                   📝 Don't forget to journal today!
                 </Text>
                 <Text color="$blue11" fontSize="$4">
                   Take a moment to reflect on your day and track your mood.
                 </Text>
               </YStack>
             )}

             {upcomingTasks.length > 0 && upcomingTasks.length <= 5 && (
               <DashboardCard
                 title="Upcoming Tasks"
                 icon="📋"
                 type="tasks"
                 tasks={upcomingTasks.slice(0, 3)}
                 onToggleTask={toggleTask}
                 onViewAllTasks={() => router.push('/tasks')}
               />
             )}
           </YStack>
         </ScrollView>
       </YStack>
     );
   };

   export default Dashboard;