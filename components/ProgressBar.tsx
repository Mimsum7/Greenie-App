import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ProgressBarProps {
  current: number;
  goal: number;
  color?: string;
  label?: string;
  unit?: string;
}

export function ProgressBar({ 
  current, 
  goal, 
  color = '#22C55E', 
  label,
  unit = ''
}: ProgressBarProps) {
  const progress = Math.min(current / goal, 1);
  const isOverGoal = current > goal;
  const displayColor = isOverGoal ? '#EF4444' : color;

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>{label}</Text>
      )}
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${Math.min(progress * 100, 100)}%`,
                backgroundColor: displayColor 
              }
            ]} 
          />
        </View>
        <Text style={[styles.progressText, { color: displayColor }]}>
          {current.toFixed(1)}{unit} / {goal}{unit}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    transition: 'width 0.3s ease',
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 80,
    textAlign: 'right',
  },
});