import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Car, Brain as Train, Bike, Utensils, Leaf, Fish } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

export default function OnboardingScreen() {
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState({
    diet: '',
    commute: '',
    carbonGoal: 8,
  });
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);
  
  const router = useRouter();
  const { state, dispatch } = useApp();

  const dietOptions = [
    { id: 'omnivore', label: 'Omnivore', icon: Utensils },
    { id: 'vegetarian', label: 'Vegetarian', icon: Leaf },
    { id: 'vegan', label: 'Vegan', icon: Leaf },
    { id: 'pescatarian', label: 'Pescatarian', icon: Fish },
  ];

  const commuteOptions = [
    { id: 'car', label: 'Car', icon: Car },
    { id: 'transit', label: 'Public Transit', icon: Train },
    { id: 'bike', label: 'Bike/Walk', icon: Bike },
  ];

  const carbonGoals = [6, 8, 10, 12];

  const availableHabits = state.habits;

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      finishOnboarding();
    }
  };

  const finishOnboarding = () => {
    if (state.user) {
      const updatedUser = {
        ...state.user,
        dietPreference: preferences.diet as any,
        commutePreference: preferences.commute as any,
        dailyCarbonGoal: preferences.carbonGoal,
        activeHabits: selectedHabits,
      };
      
      dispatch({ type: 'UPDATE_USER_PROFILE', payload: updatedUser });
      dispatch({ type: 'SET_ONBOARDING_COMPLETED', payload: true });
      router.replace('/(tabs)');
    }
  };

  const toggleHabit = (habitId: string) => {
    setSelectedHabits(prev => 
      prev.includes(habitId) 
        ? prev.filter(id => id !== habitId)
        : [...prev, habitId]
    );
  };

  const canProceed = () => {
    if (step === 1) {
      return preferences.diet && preferences.commute;
    }
    return selectedHabits.length > 0;
  };

  if (step === 1) {
    return (
      <LinearGradient
        colors={['#F0FDF4', '#DCFCE7']}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Let's personalize your experience</Text>
            <Text style={styles.subtitle}>Tell us about your lifestyle</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What's your typical diet?</Text>
            <View style={styles.optionsGrid}>
              {dietOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.optionCard,
                      preferences.diet === option.id && styles.selectedCard
                    ]}
                    onPress={() => setPreferences({ ...preferences, diet: option.id })}
                  >
                    <IconComponent 
                      size={32} 
                      color={preferences.diet === option.id ? '#FFFFFF' : '#22C55E'} 
                    />
                    <Text style={[
                      styles.optionText,
                      preferences.diet === option.id && styles.selectedText
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How do you usually get around?</Text>
            <View style={styles.optionsGrid}>
              {commuteOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.optionCard,
                      preferences.commute === option.id && styles.selectedCard
                    ]}
                    onPress={() => setPreferences({ ...preferences, commute: option.id })}
                  >
                    <IconComponent 
                      size={32} 
                      color={preferences.commute === option.id ? '#FFFFFF' : '#22C55E'} 
                    />
                    <Text style={[
                      styles.optionText,
                      preferences.commute === option.id && styles.selectedText
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What's your daily carbon goal?</Text>
            <View style={styles.goalContainer}>
              {carbonGoals.map((goal) => (
                <TouchableOpacity
                  key={goal}
                  style={[
                    styles.goalCard,
                    preferences.carbonGoal === goal && styles.selectedCard
                  ]}
                  onPress={() => setPreferences({ ...preferences, carbonGoal: goal })}
                >
                  <Text style={[
                    styles.goalText,
                    preferences.carbonGoal === goal && styles.selectedText
                  ]}>
                    {goal} kg
                  </Text>
                  <Text style={[
                    styles.goalSubtext,
                    preferences.carbonGoal === goal && styles.selectedText
                  ]}>
                    CO₂/day
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.nextButton, !canProceed() && styles.nextButtonDisabled]}
            onPress={handleNext}
            disabled={!canProceed()}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#F0FDF4', '#DCFCE7']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Choose your habits</Text>
          <Text style={styles.subtitle}>Select the green habits you'd like to track daily</Text>
        </View>

        <View style={styles.habitsGrid}>
          {availableHabits.map((habit) => (
            <TouchableOpacity
              key={habit.id}
              style={[
                styles.habitCard,
                selectedHabits.includes(habit.id) && styles.selectedCard
              ]}
              onPress={() => toggleHabit(habit.id)}
            >
              <View style={styles.habitHeader}>
                <Text style={[
                  styles.habitName,
                  selectedHabits.includes(habit.id) && styles.selectedText
                ]}>
                  {habit.name}
                </Text>
                <Text style={[
                  styles.habitPoints,
                  selectedHabits.includes(habit.id) && styles.selectedText
                ]}>
                  +{habit.points} pts
                </Text>
              </View>
              <Text style={[
                styles.habitDescription,
                selectedHabits.includes(habit.id) && styles.selectedText
              ]}>
                {habit.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.finishButton, !canProceed() && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!canProceed()}
        >
          <Text style={styles.nextButtonText}>Finish Setup</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#166534',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 16,
    textAlign: 'center',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  optionCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  selectedCard: {
    backgroundColor: '#22C55E',
    borderColor: '#22C55E',
  },
  optionText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginTop: 8,
    textAlign: 'center',
  },
  selectedText: {
    color: '#FFFFFF',
  },
  goalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  goalCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  goalText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#374151',
  },
  goalSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  habitsGrid: {
    gap: 12,
    marginBottom: 32,
  },
  habitCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  habitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  habitName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    flex: 1,
  },
  habitPoints: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#22C55E',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  habitDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  nextButton: {
    backgroundColor: '#22C55E',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 'auto',
  },
  finishButton: {
    backgroundColor: '#22C55E',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    opacity: 0.6,
  },
  nextButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});