import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Flame, Trophy, MessageCircle, History, Activity } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PlantGraphic } from '@/components/PlantGraphic';
import { ProgressBar } from '@/components/ProgressBar';
import { HabitCheckbox } from '@/components/HabitCheckbox';
import { useApp } from '@/contexts/AppContext';
import { getCurrentPlantStage, getNextPlantStage, getProgressToNextStage } from '@/utils/plantStages';

export default function DashboardScreen() {
  const { state, dispatch } = useApp();
  const router = useRouter();

  const user = state.user;
  const dailyProgress = state.dailyProgress;
  const activeHabits = state.habits.filter(habit => 
    user?.activeHabits.includes(habit.id)
  );

  if (!user || !dailyProgress) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const currentPlantStage = getCurrentPlantStage(user.totalPoints);
  const nextPlantStage = getNextPlantStage(user.totalPoints);
  const progressToNext = getProgressToNextStage(user.totalPoints);

  const handleHabitToggle = (habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const isCompleted = dailyProgress.habitsCompleted.includes(habitId);
    
    if (isCompleted) {
      // Remove from completed habits
      const updatedProgress = {
        ...dailyProgress,
        habitsCompleted: dailyProgress.habitsCompleted.filter(id => id !== habitId),
        pointsEarned: dailyProgress.pointsEarned - (state.habits.find(h => h.id === habitId)?.points || 0),
      };
      dispatch({ type: 'UPDATE_DAILY_PROGRESS', payload: updatedProgress });
    } else {
      // Add to completed habits
      const habit = state.habits.find(h => h.id === habitId);
      if (habit) {
        const updatedProgress = {
          ...dailyProgress,
          habitsCompleted: [...dailyProgress.habitsCompleted, habitId],
          pointsEarned: dailyProgress.pointsEarned + habit.points,
        };
        dispatch({ type: 'UPDATE_DAILY_PROGRESS', payload: updatedProgress });
        dispatch({ type: 'COMPLETE_HABIT', payload: { habitId, date: today } });
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F0FDF4', '#DCFCE7']}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.greeting}>Hi, Alexandra!</Text>
            <Text style={styles.date}>
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
          </View>

          {/* Plant Growth Panel */}
          <View style={styles.plantPanel}>
            <PlantGraphic stage={currentPlantStage} size={100} />
            <Text style={styles.plantStageName}>{currentPlantStage.name}</Text>
            <Text style={styles.plantDescription}>{currentPlantStage.description}</Text>
            
            {nextPlantStage && (
              <View style={styles.plantProgress}>
                <Text style={styles.progressLabel}>
                  Progress to {nextPlantStage.name}
                </Text>
                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBackground}>
                    <View 
                      style={[
                        styles.progressFill,
                        { width: `${progressToNext * 100}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {user.totalPoints} / {nextPlantStage.minPoints} pts
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Points & Streak */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Trophy size={24} color="#F59E0B" />
              <Text style={styles.statValue}>{user.totalPoints}</Text>
              <Text style={styles.statLabel}>Total Points</Text>
            </View>
            <View style={styles.statCard}>
              <Flame size={24} color="#EF4444" />
              <Text style={styles.statValue}>{user.currentStreak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
          </View>

          {/* Today's Carbon Summary */}
          <View style={styles.carbonPanel}>
            <Text style={styles.panelTitle}>Today's Carbon Footprint</Text>
            <ProgressBar
              current={dailyProgress.totalKgCO2}
              goal={user.dailyCarbonGoal}
              unit=" kg CO₂"
              color={dailyProgress.totalKgCO2 <= user.dailyCarbonGoal ? '#22C55E' : '#EF4444'}
            />
            <Text style={[
              styles.carbonStatus,
              { color: dailyProgress.totalKgCO2 <= user.dailyCarbonGoal ? '#22C55E' : '#EF4444' }
            ]}>
              {dailyProgress.totalKgCO2 <= user.dailyCarbonGoal 
                ? '🎉 Great job! You\'re on track!'
                : '⚠️ Over your goal today'
              }
            </Text>
          </View>

          {/* Habit Tracker Mini-Panel */}
          <View style={styles.habitsPanel}>
            <Text style={styles.panelTitle}>Today's Habits</Text>
            {activeHabits.map((habit) => (
              <HabitCheckbox
                key={habit.id}
                label={habit.name}
                completed={dailyProgress.habitsCompleted.includes(habit.id)}
                onToggle={() => handleHabitToggle(habit.id)}
                points={habit.points}
              />
            ))}
            <Text style={styles.todayPoints}>+{dailyProgress.pointsEarned} pts today</Text>
          </View>

          {/* Quick Action Buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/log-activity')}
            >
              <Activity size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Log Activity</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/history')}
            >
              <History size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>View History</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/chat')}
            >
              <MessageCircle size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Chat with Greenie</Text>
            </TouchableOpacity>
          </View>

          {/* Daily Tip Banner */}
          <View style={styles.tipBanner}>
            <Text style={styles.tipHeader}>🌱 Greenie's Tip</Text>
            <Text style={styles.tipText}>
              Try biking 10 km tomorrow to save 2.1 kg CO₂ and earn 8 points!
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#166534',
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  plantPanel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  plantStageName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#166534',
    marginTop: 16,
    marginBottom: 4,
  },
  plantDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  plantProgress: {
    width: '100%',
  },
  progressLabel: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBackground: {
    flex: 1,
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#22C55E',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#22C55E',
    minWidth: 60,
    textAlign: 'right',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#374151',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  carbonPanel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  panelTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 16,
  },
  carbonStatus: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
    marginTop: 8,
  },
  habitsPanel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  todayPoints: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#22C55E',
    textAlign: 'center',
    marginTop: 16,
    backgroundColor: '#F0FDF4',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#22C55E',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actionButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  tipBanner: {
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  tipHeader: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#92400E',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#78350F',
    lineHeight: 20,
  },
});