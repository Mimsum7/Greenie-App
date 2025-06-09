import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Award } from 'lucide-react-native';
import { HabitCheckbox } from '@/components/HabitCheckbox';
import { useApp } from '@/contexts/AppContext';

export default function HabitsScreen() {
  const [activeTab, setActiveTab] = useState<'habits' | 'history'>('habits');
  const { state, dispatch } = useApp();

  const user = state.user;
  const habits = state.habits;

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const toggleHabit = (habitId: string) => {
    const isActive = user.activeHabits.includes(habitId);
    const updatedActiveHabits = isActive
      ? user.activeHabits.filter(id => id !== habitId)
      : [...user.activeHabits, habitId];
    
    dispatch({ 
      type: 'UPDATE_USER_PROFILE', 
      payload: { activeHabits: updatedActiveHabits }
    });
  };

  const generateCalendarData = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    
    const calendarDays = [];
    
    // Empty cells for days before the first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push(null);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dateString = date.toISOString().split('T')[0];
      
      // Simulate some data
      const hasGoalMet = Math.random() > 0.4;
      const hasHabits = Math.random() > 0.3;
      
      calendarDays.push({
        day,
        date: dateString,
        goalMet: hasGoalMet,
        hasHabits: hasHabits,
        isToday: day === today.getDate() && currentMonth === today.getMonth(),
      });
    }
    
    return calendarDays;
  };

  const calendarData = generateCalendarData();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F0FDF4', '#DCFCE7']}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Habits</Text>
            <Text style={styles.subtitle}>Track your green habits</Text>
          </View>

          {/* Tab Navigation */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'habits' && styles.activeTab]}
              onPress={() => setActiveTab('habits')}
            >
              <Text style={[styles.tabText, activeTab === 'habits' && styles.activeTabText]}>
                My Habits
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'history' && styles.activeTab]}
              onPress={() => setActiveTab('history')}
            >
              <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
                History
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'habits' ? (
            <View style={styles.habitsContent}>
              <Text style={styles.sectionTitle}>Select Active Habits</Text>
              <Text style={styles.sectionSubtitle}>
                Choose which habits you want to track daily
              </Text>
              
              {habits.map((habit) => (
                <HabitCheckbox
                  key={habit.id}
                  label={habit.name}
                  completed={user.activeHabits.includes(habit.id)}
                  onToggle={() => toggleHabit(habit.id)}
                  points={habit.points}
                />
              ))}

              {/* Habit Streaks */}
              <View style={styles.streaksSection}>
                <Text style={styles.sectionTitle}>Current Streaks</Text>
                <View style={styles.streakCard}>
                  <Award size={24} color="#F59E0B" />
                  <View style={styles.streakInfo}>
                    <Text style={styles.streakName}>Plant-Based Meals</Text>
                    <Text style={styles.streakCount}>5 days in a row</Text>
                  </View>
                </View>
                <View style={styles.streakCard}>
                  <Award size={24} color="#10B981" />
                  <View style={styles.streakInfo}>
                    <Text style={styles.streakName}>Sustainable Transport</Text>
                    <Text style={styles.streakCount}>3 days in a row</Text>
                  </View>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.historyContent}>
              <Text style={styles.sectionTitle}>Habit History</Text>
              
              {/* Calendar View */}
              <View style={styles.calendarContainer}>
                <View style={styles.calendarHeader}>
                  <Calendar size={20} color="#22C55E" />
                  <Text style={styles.calendarTitle}>
                    {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </Text>
                </View>
                
                <View style={styles.weekDaysRow}>
                  {weekDays.map((day) => (
                    <Text key={day} style={styles.weekDayText}>
                      {day}
                    </Text>
                  ))}
                </View>
                
                <View style={styles.calendarGrid}>
                  {calendarData.map((day, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.calendarDay,
                        day?.isToday && styles.today,
                        !day && styles.emptyDay,
                      ]}
                      disabled={!day}
                    >
                      {day && (
                        <>
                          <Text style={[
                            styles.dayNumber,
                            day.isToday && styles.todayText
                          ]}>
                            {day.day}
                          </Text>
                          <View style={styles.dayIndicators}>
                            {day.goalMet && (
                              <View style={[styles.indicator, styles.goalIndicator]} />
                            )}
                            {day.hasHabits && (
                              <View style={[styles.indicator, styles.habitIndicator]} />
                            )}
                          </View>
                        </>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
                
                <View style={styles.legend}>
                  <View style={styles.legendItem}>
                    <View style={[styles.indicator, styles.goalIndicator]} />
                    <Text style={styles.legendText}>Carbon goal met</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.indicator, styles.habitIndicator]} />
                    <Text style={styles.legendText}>Habits completed</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
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
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#166534',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#22C55E',
  },
  tabText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  habitsContent: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 20,
  },
  streaksSection: {
    marginTop: 32,
  },
  streakCard: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  streakInfo: {
    marginLeft: 12,
    flex: 1,
  },
  streakName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  },
  streakCount: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  historyContent: {
    flex: 1,
  },
  calendarContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  calendarTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  },
  weekDaysRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  weekDayText: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 4,
  },
  emptyDay: {
    opacity: 0,
  },
  today: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
  },
  dayNumber: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  todayText: {
    fontFamily: 'Inter-SemiBold',
    color: '#92400E',
  },
  dayIndicators: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 2,
  },
  indicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  goalIndicator: {
    backgroundColor: '#22C55E',
  },
  habitIndicator: {
    backgroundColor: '#3B82F6',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
});