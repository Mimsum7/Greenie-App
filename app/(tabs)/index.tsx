import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Flame, Trophy, MessageCircle, History, Activity, Plus } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PlantGraphic } from '@/components/PlantGraphic';
import { ProgressBar } from '@/components/ProgressBar';
import { HabitCheckbox } from '@/components/HabitCheckbox';
import { useApp } from '@/contexts/AppContext';
import { getCurrentPlantStage, getNextPlantStage, getProgressToNextStage } from '@/utils/plantStages';

export default function DashboardScreen() {
  const { state, dispatch } = useApp();
  const router = useRouter();
  const [tipPressed, setTipPressed] = useState(false);

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

  // Calculate bonus points
  const completedHabitsToday = dailyProgress.habitsCompleted.length;
  const dailyComboBonus = completedHabitsToday >= 3 ? 5 : 0;
  const streakBonus = user.currentStreak >= 5 ? 10 : 0;

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

  const handleTipPress = () => {
    setTipPressed(true);
    // Add the linked chat response
    const chatResponse = {
      id: Date.now().toString(),
      text: "🚗 Why it matters: Short, separate car trips burn more fuel because engines use the most fuel when cold. By grouping tasks (like grocery shopping, pharmacy, and picking someone up), your car runs more efficiently and produces fewer emissions.\n\n🌍 Carbon savings: You can cut 1–2 kg of CO₂ in a single day just by optimizing your driving pattern!\n\nWould you like some more green advice to make your day Greenie-r?",
      isUser: false,
      timestamp: new Date(),
    };
    dispatch({ type: 'ADD_CHAT_MESSAGE', payload: chatResponse });
    router.push('/chat');
  };

  const availableHabits = state.habits.filter(habit => 
    !user.activeHabits.includes(habit.id)
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#C0F0C0', '#A6E6A6']} // 20% darker greens
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Daily Tip Banner - Updated with brown color and tappable */}
          <TouchableOpacity style={styles.tipBanner} onPress={handleTipPress}>
            <Text style={styles.tipHeader}>🌱 Greenie's Tip</Text>
            <Text style={styles.tipText}>
              Combine your errands into one trip and take the most efficient route.
            </Text>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.greeting}>Hi, Alexandra!</Text>
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
              <Trophy size={24} color="#CC7A00" /> {/* 20% darker gold */}
              <Text style={styles.statValue}>{user.totalPoints}</Text>
              <Text style={styles.statLabel}>Total Points</Text>
            </View>
            <View style={styles.statCard}>
              <Flame size={24} color="#BF3636" /> {/* 20% darker red */}
              <Text style={styles.statValue}>{user.currentStreak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
          </View>

          {/* Bonus System Display */}
          {(dailyComboBonus > 0 || streakBonus > 0) && (
            <View style={styles.bonusPanel}>
              <Text style={styles.bonusPanelTitle}>🎉 Bonus Points!</Text>
              {dailyComboBonus > 0 && (
                <Text style={styles.bonusText}>Daily Combo: +{dailyComboBonus} pts (3+ habits)</Text>
              )}
              {streakBonus > 0 && (
                <Text style={styles.bonusText}>Green Streak: +{streakBonus} pts (5+ days)</Text>
              )}
            </View>
          )}

          {/* Today's Carbon Summary */}
          <View style={styles.carbonPanel}>
            <Text style={styles.panelTitle}>Today's Carbon Footprint</Text>
            <ProgressBar
              current={dailyProgress.totalKgCO2}
              goal={user.dailyCarbonGoal}
              unit=" kg CO₂"
              color={dailyProgress.totalKgCO2 <= user.dailyCarbonGoal ? '#1B8B3B' : '#BF3636'} // 20% darker colors
            />
            <Text style={[
              styles.carbonStatus,
              { color: dailyProgress.totalKgCO2 <= user.dailyCarbonGoal ? '#1B8B3B' : '#BF3636' } // 20% darker colors
            ]}>
              {dailyProgress.totalKgCO2 <= user.dailyCarbonGoal 
                ? '🎉 Great job! You\'re on track!'
                : '⚠️ Over your goal today'
              }
            </Text>
          </View>

          {/* Habit Tracker Mini-Panel */}
          <View style={styles.habitsPanel}>
            <View style={styles.habitsPanelHeader}>
              <Text style={styles.panelTitle}>Today's Habits</Text>
              {availableHabits.length > 0 && (
                <TouchableOpacity 
                  style={styles.addHabitButton}
                  onPress={() => router.push('/habits')}
                >
                  <Plus size={16} color="#1B8B3B" /> {/* 20% darker green */}
                  <Text style={styles.addHabitText}>Add Habit</Text>
                </TouchableOpacity>
              )}
            </View>
            
            {activeHabits.length === 0 ? (
              <View style={styles.noHabitsContainer}>
                <Text style={styles.noHabitsText}>No habits selected yet</Text>
                <TouchableOpacity 
                  style={styles.selectHabitsButton}
                  onPress={() => router.push('/habits')}
                >
                  <Text style={styles.selectHabitsButtonText}>Select Habits</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {activeHabits.map((habit) => (
                  <HabitCheckbox
                    key={habit.id}
                    label={habit.name}
                    completed={dailyProgress.habitsCompleted.includes(habit.id)}
                    onToggle={() => handleHabitToggle(habit.id)}
                    points={habit.points}
                  />
                ))}
                <Text style={styles.todayPoints}>
                  +{dailyProgress.pointsEarned + dailyComboBonus + streakBonus} pts today
                  {(dailyComboBonus > 0 || streakBonus > 0) && (
                    <Text style={styles.bonusBreakdown}>
                      {' '}(+{dailyComboBonus + streakBonus} bonus)
                    </Text>
                  )}
                </Text>
              </>
            )}
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
    color: '#545454', // 20% darker gray
  },
  tipBanner: {
    backgroundColor: '#8B5A2B', // Brown color matching the logo
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#A0522D',
    marginBottom: 20,
  },
  tipHeader: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    lineHeight: 20,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#0F4A1A', // 20% darker green
    marginBottom: 4,
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
    color: '#0F4A1A', // 20% darker green
    marginTop: 16,
    marginBottom: 4,
  },
  plantDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#545454', // 20% darker gray
    textAlign: 'center',
    marginBottom: 16,
  },
  plantProgress: {
    width: '100%',
  },
  progressLabel: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#2A3A2A', // 20% darker gray
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
    backgroundColor: '#E6E6E6', // 20% darker background
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1B8B3B', // 20% darker green
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#1B8B3B', // 20% darker green
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
    color: '#2A3A2A', // 20% darker gray
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#545454', // 20% darker gray
  },
  bonusPanel: {
    backgroundColor: '#FFF3CD', // Light yellow background
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F0E68C',
  },
  bonusPanelTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#8B7500', // Dark yellow
    marginBottom: 8,
    textAlign: 'center',
  },
  bonusText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#8B7500', // Dark yellow
    textAlign: 'center',
    marginBottom: 4,
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
    color: '#2A3A2A', // 20% darker gray
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
  habitsPanelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addHabitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#C0F0C0', // 20% darker background
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#96E896', // 20% darker border
  },
  addHabitText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#1B8B3B', // 20% darker green
  },
  noHabitsContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  noHabitsText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#545454', // 20% darker gray
    marginBottom: 12,
  },
  selectHabitsButton: {
    backgroundColor: '#1B8B3B', // 20% darker green
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  selectHabitsButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  todayPoints: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1B8B3B', // 20% darker green
    textAlign: 'center',
    marginTop: 16,
    backgroundColor: '#C0F0C0', // 20% darker background
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  bonusBreakdown: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#CC7A00', // Gold color for bonus
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#1B8B3B', // 20% darker green
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
});