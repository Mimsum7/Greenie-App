import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Calculator, Save } from 'lucide-react-native';
import { ActivityListItem } from '@/components/ActivityListItem';
import { useApp } from '@/contexts/AppContext';
import { calculateCarbonFootprint, getActivityTypes, getActivityUnit } from '@/utils/carbonCalculator';

export default function LogActivityScreen() {
  const [selectedActivityType, setSelectedActivityType] = useState('car');
  const [quantity, setQuantity] = useState('');
  const [calculatedCO2, setCalculatedCO2] = useState(0);
  const [isCalculated, setIsCalculated] = useState(false);
  
  const { state, dispatch } = useApp();
  
  // Filter out coffee and electricity from activity types
  const activityTypes = getActivityTypes().filter(type => 
    type.id !== 'coffee' && type.id !== 'electricity'
  );
  
  const todayActivities = state.activities.filter(activity => {
    const today = new Date().toISOString().split('T')[0];
    const activityDate = new Date(activity.timestamp).toISOString().split('T')[0];
    return activityDate === today;
  });

  const handleCalculate = () => {
    const qty = parseFloat(quantity);
    if (isNaN(qty) || qty <= 0) {
      Alert.alert('Error', 'Please enter a valid quantity');
      return;
    }

    const co2 = calculateCarbonFootprint(selectedActivityType, qty);
    setCalculatedCO2(co2);
    setIsCalculated(true);
  };

  const handleSave = () => {
    if (!isCalculated || calculatedCO2 === 0) {
      Alert.alert('Error', 'Please calculate CO₂ first');
      return;
    }

    const newActivity = {
      id: Date.now().toString(),
      userId: state.user?.id || '',
      activityType: selectedActivityType as any,
      quantity: parseFloat(quantity),
      unit: getActivityUnit(selectedActivityType),
      kgCO2: calculatedCO2,
      timestamp: new Date(),
    };

    dispatch({ type: 'ADD_ACTIVITY', payload: newActivity });

    // Update daily progress
    if (state.dailyProgress) {
      const updatedProgress = {
        ...state.dailyProgress,
        totalKgCO2: state.dailyProgress.totalKgCO2 + calculatedCO2,
      };
      dispatch({ type: 'UPDATE_DAILY_PROGRESS', payload: updatedProgress });
    }

    // Reset form
    setQuantity('');
    setCalculatedCO2(0);
    setIsCalculated(false);

    Alert.alert('Success', `+${calculatedCO2} kg CO₂ logged`);
  };

  const handleDeleteActivity = (activityId: string) => {
    // This would typically dispatch a DELETE_ACTIVITY action
    Alert.alert('Delete Activity', 'Activity deleted successfully');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F0FDF4', '#DCFCE7']}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Log Activity</Text>
            <Text style={styles.subtitle}>Track your carbon footprint</Text>
          </View>

          {/* Activity Type Picker */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Activity Type</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.activityTypesContainer}
            >
              {activityTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.activityTypeCard,
                    selectedActivityType === type.id && styles.selectedActivityType
                  ]}
                  onPress={() => {
                    setSelectedActivityType(type.id);
                    setIsCalculated(false);
                    setCalculatedCO2(0);
                  }}
                >
                  <Text style={[
                    styles.activityTypeName,
                    selectedActivityType === type.id && styles.selectedActivityTypeName
                  ]}>
                    {type.name}
                  </Text>
                  <Text style={[
                    styles.activityTypeUnit,
                    selectedActivityType === type.id && styles.selectedActivityTypeUnit
                  ]}>
                    per {type.unit}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Quantity Input */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.quantityInput}
                value={quantity}
                onChangeText={(text) => {
                  setQuantity(text);
                  setIsCalculated(false);
                  setCalculatedCO2(0);
                }}
                placeholder={`Enter ${getActivityUnit(selectedActivityType)}`}
                keyboardType="numeric"
              />
              <Text style={styles.unitLabel}>
                {getActivityUnit(selectedActivityType)}
              </Text>
            </View>
          </View>

          {/* Calculate & Save */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.calculateButton, !quantity && styles.disabledButton]}
              onPress={handleCalculate}
              disabled={!quantity}
            >
              <Calculator size={20} color="#FFFFFF" />
              <Text style={styles.buttonText}>Calculate CO₂</Text>
            </TouchableOpacity>

            {isCalculated && (
              <View style={styles.resultContainer}>
                <Text style={styles.resultText}>
                  {calculatedCO2} kg CO₂
                </Text>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSave}
                >
                  <Save size={20} color="#FFFFFF" />
                  <Text style={styles.buttonText}>Save Activity</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Recent Activities */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Today's Activities</Text>
            {todayActivities.length === 0 ? (
              <Text style={styles.emptyState}>No activities logged today</Text>
            ) : (
              todayActivities.slice(-5).map((activity) => (
                <ActivityListItem
                  key={activity.id}
                  activity={activity}
                  onDelete={() => handleDeleteActivity(activity.id)}
                />
              ))
            )}
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 12,
  },
  activityTypesContainer: {
    gap: 12,
    paddingHorizontal: 4,
  },
  activityTypeCard: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    minWidth: 120,
    alignItems: 'center',
  },
  selectedActivityType: {
    backgroundColor: '#22C55E',
    borderColor: '#22C55E',
  },
  activityTypeName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 2,
  },
  selectedActivityTypeName: {
    color: '#FFFFFF',
  },
  activityTypeUnit: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
  },
  selectedActivityTypeUnit: {
    color: '#FFFFFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    overflow: 'hidden',
  },
  quantityInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  unitLabel: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    backgroundColor: '#F9FAFB',
    borderLeftWidth: 1,
    borderLeftColor: '#E5E7EB',
  },
  actionsContainer: {
    marginBottom: 24,
  },
  calculateButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  resultContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  resultText: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#EF4444',
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: '#22C55E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  emptyState: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
});