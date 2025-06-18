import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Car, Brain as Train, Bike, Utensils, Leaf, Fish, Zap, Fuel, ChevronDown, ChevronUp } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

export default function OnboardingScreen() {
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState({
    diet: '',
    commute: '',
    carType: '',
    carbonGoal: 8,
  });
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);
  const [showGoalHelp, setShowGoalHelp] = useState(false);
  const [customGoal, setCustomGoal] = useState('');
  const [showCustomGoal, setShowCustomGoal] = useState(false);
  
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

  const carTypeOptions = [
    { id: 'electric', label: 'Electric', icon: Zap },
    { id: 'hybrid', label: 'Hybrid', icon: Leaf },
    { id: 'fuel', label: 'Fuel Powered', icon: Fuel },
  ];

  const carbonGoals = [5, 8, 15, 25];

  const availableHabits = state.habits;

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      finishOnboarding();
    }
  };

  const finishOnboarding = () => {
    if (state.user) {
      const finalCarbonGoal = showCustomGoal ? parseFloat(customGoal) || 8 : preferences.carbonGoal;
      
      const updatedUser = {
        ...state.user,
        dietPreference: preferences.diet as any,
        commutePreference: preferences.commute as any,
        dailyCarbonGoal: finalCarbonGoal,
        activeHabits: selectedHabits,
      };
      
      dispatch({ type: 'UPDATE_USER_PROFILE', payload: updatedUser });
      dispatch({ type: 'SET_ONBOARDING_COMPLETED', payload: true });
      
      // Initialize daily progress for today
      const today = new Date().toISOString().split('T')[0];
      const initialProgress = {
        date: today,
        totalKgCO2: 0,
        pointsEarned: 0,
        habitsCompleted: [],
        goalMet: false,
      };
      dispatch({ type: 'UPDATE_DAILY_PROGRESS', payload: initialProgress });
      
      // Go directly to the main app dashboard
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
      return preferences.diet && preferences.commute && (preferences.commute !== 'car' || preferences.carType);
    } else if (step === 2) {
      return showCustomGoal ? customGoal.trim() !== '' : preferences.carbonGoal > 0;
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
                    onPress={() => setPreferences({ ...preferences, commute: option.id, carType: '' })}
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

          {preferences.commute === 'car' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>What type of car do you drive?</Text>
              <View style={styles.optionsGrid}>
                {carTypeOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <TouchableOpacity
                      key={option.id}
                      style={[
                        styles.optionCard,
                        preferences.carType === option.id && styles.selectedCard
                      ]}
                      onPress={() => setPreferences({ ...preferences, carType: option.id })}
                    >
                      <IconComponent 
                        size={32} 
                        color={preferences.carType === option.id ? '#FFFFFF' : '#22C55E'} 
                      />
                      <Text style={[
                        styles.optionText,
                        preferences.carType === option.id && styles.selectedText
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

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

  if (step === 2) {
    return (
      <LinearGradient
        colors={['#F0FDF4', '#DCFCE7']}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Set your carbon goal</Text>
            <Text style={styles.subtitle}>Choose your daily carbon limit</Text>
          </View>

          <View style={styles.goalContainer}>
            {carbonGoals.map((goal) => (
              <TouchableOpacity
                key={goal}
                style={[
                  styles.goalCard,
                  preferences.carbonGoal === goal && !showCustomGoal && styles.selectedCard
                ]}
                onPress={() => {
                  setPreferences({ ...preferences, carbonGoal: goal });
                  setShowCustomGoal(false);
                }}
              >
                <Text style={[
                  styles.goalText,
                  preferences.carbonGoal === goal && !showCustomGoal && styles.selectedText
                ]}>
                  {goal} kg
                </Text>
                <Text style={[
                  styles.goalSubtext,
                  preferences.carbonGoal === goal && !showCustomGoal && styles.selectedText
                ]}>
                  CO₂/day
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.customGoalButton, showCustomGoal && styles.selectedCard]}
            onPress={() => setShowCustomGoal(!showCustomGoal)}
          >
            <Text style={[styles.customGoalText, showCustomGoal && styles.selectedText]}>
              Custom Goal
            </Text>
          </TouchableOpacity>

          {showCustomGoal && (
            <View style={styles.customGoalInput}>
              <Text style={styles.inputLabel}>Enter your custom goal (kg CO₂/day):</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputValue}>{customGoal}</Text>
                <Text style={styles.inputUnit}>kg CO₂/day</Text>
              </View>
              <View style={styles.numberPad}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0, '⌫'].map((num) => (
                  <TouchableOpacity
                    key={num}
                    style={styles.numberButton}
                    onPress={() => {
                      if (num === '⌫') {
                        setCustomGoal(prev => prev.slice(0, -1));
                      } else if (num === '.' && !customGoal.includes('.')) {
                        setCustomGoal(prev => prev + '.');
                      } else if (typeof num === 'number') {
                        setCustomGoal(prev => prev + num.toString());
                      }
                    }}
                  >
                    <Text style={styles.numberButtonText}>{num}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <TouchableOpacity
            style={styles.helpButton}
            onPress={() => setShowGoalHelp(!showGoalHelp)}
          >
            <Text style={styles.helpButtonText}>Need help setting your goal?</Text>
            {showGoalHelp ? <ChevronUp size={20} color="#22C55E" /> : <ChevronDown size={20} color="#22C55E" />}
          </TouchableOpacity>

          {showGoalHelp && (
            <View style={styles.helpContent}>
              <Text style={styles.helpTitle}>🌍 Choose Your Daily Carbon Limit</Text>
              <Text style={styles.helpText}>
                Your daily carbon limit is the amount of carbon dioxide (CO₂) emissions you're aiming to stay under each day. It's like a personal budget—but for the planet.
              </Text>
              
              <Text style={styles.helpSubtitle}>💡 Why set a daily carbon goal?</Text>
              <Text style={styles.helpText}>• It helps you track your impact</Text>
              <Text style={styles.helpText}>• You get rewards for reducing emissions</Text>
              <Text style={styles.helpText}>• It's the first step toward a more sustainable lifestyle</Text>
              
              <Text style={styles.helpSubtitle}>🧮 What's the average?</Text>
              <Text style={styles.helpText}>🌆 Urban lifestyle: ~20–25 kg CO₂ per day</Text>
              <Text style={styles.helpText}>🌿 Sustainable target: ~6–8 kg CO₂ per day</Text>
              <Text style={styles.helpText}>🏆 Climate-safe goal: ~2.5 kg CO₂ per day (Paris Agreement-aligned)</Text>
              
              <Text style={styles.helpSubtitle}>🏁 What do the options mean?</Text>
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <Text style={styles.tableHeaderText}>Carbon Limit</Text>
                  <Text style={styles.tableHeaderText}>Lifestyle Level</Text>
                  <Text style={styles.tableHeaderText}>What it Means</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableCellBold}>25 kg CO₂/day</Text>
                  <Text style={styles.tableCell}>🧑‍💼 Starting Out</Text>
                  <Text style={styles.tableCell}>A typical high-carbon lifestyle. Useful for tracking, not yet reducing.</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableCellBold}>15 kg CO₂/day</Text>
                  <Text style={styles.tableCell}>⚖️ Moderate</Text>
                  <Text style={styles.tableCell}>A step toward awareness. You'll still drive, eat meat, fly occasionally.</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableCellBold}>8 kg CO₂/day</Text>
                  <Text style={styles.tableCell}>🌱 Sustainable</Text>
                  <Text style={styles.tableCell}>The global average needed by 2030. Requires daily eco-friendly choices.</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableCellBold}>5 kg CO₂/day</Text>
                  <Text style={styles.tableCell}>🍃 Green Warrior</Text>
                  <Text style={styles.tableCell}>Great for those already biking, reducing meat, and saving energy.</Text>
                </View>
              </View>
            </View>
          )}

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
          <Text style={styles.nextButtonText}>Start Your Journey</Text>
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
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 16,
  },
  goalCard: {
    flex: 1,
    minWidth: '22%',
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
  customGoalButton: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  customGoalText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  },
  customGoalInput: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  inputValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#374151',
    minWidth: 60,
    textAlign: 'center',
  },
  inputUnit: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginLeft: 8,
  },
  numberPad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  numberButton: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    marginBottom: 16,
  },
  helpButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#22C55E',
  },
  helpContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  helpTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#374151',
    marginBottom: 12,
  },
  helpSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 4,
  },
  table: {
    marginTop: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#374151',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  tableCellBold: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    textAlign: 'center',
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
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