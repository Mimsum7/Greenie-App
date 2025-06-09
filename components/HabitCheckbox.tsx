import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Check } from 'lucide-react-native';

interface HabitCheckboxProps {
  label: string;
  completed: boolean;
  onToggle: () => void;
  points?: number;
  disabled?: boolean;
}

export function HabitCheckbox({ 
  label, 
  completed, 
  onToggle, 
  points,
  disabled = false 
}: HabitCheckboxProps) {
  return (
    <TouchableOpacity 
      style={[styles.container, disabled && styles.disabled]} 
      onPress={onToggle}
      disabled={disabled}
    >
      <View style={[styles.checkbox, completed && styles.checkboxCompleted]}>
        {completed && <Check size={16} color="#FFFFFF" strokeWidth={3} />}
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.label, completed && styles.labelCompleted]}>
          {label}
        </Text>
        {points !== undefined && (
          <Text style={styles.points}>+{points} pts</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  disabled: {
    opacity: 0.6,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxCompleted: {
    backgroundColor: '#22C55E',
    borderColor: '#22C55E',
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    flex: 1,
  },
  labelCompleted: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  points: {
    fontSize: 12,
    fontWeight: '600',
    color: '#22C55E',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
});