import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

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
    marginVertical: width * 0.02,
  },
  label: {
    fontSize: width * 0.035,
    fontWeight: '600',
    color: '#374151',
    marginBottom: width * 0.02,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.03,
  },
  progressBackground: {
    flex: 1,
    height: width * 0.02,
    backgroundColor: '#F3F4F6',
    borderRadius: width * 0.01,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: width * 0.01,
    transition: 'width 0.3s ease',
  },
  progressText: {
    fontSize: width * 0.03,
    fontWeight: '600',
    minWidth: width * 0.2,
    textAlign: 'right',
  },
});