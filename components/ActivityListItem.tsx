import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Trash2, Car, Brain as Train, Zap, Coffee, ChefHat } from 'lucide-react-native';
import { Activity } from '@/types';

interface ActivityListItemProps {
  activity: Activity;
  onDelete?: () => void;
}

export function ActivityListItem({ activity, onDelete }: ActivityListItemProps) {
  const getActivityIcon = () => {
    const iconProps = { size: 20, color: '#6B7280' };
    
    switch (activity.activityType) {
      case 'car':
        return <Car {...iconProps} />;
      case 'transit':
        return <Train {...iconProps} />;
      case 'electricity':
        return <Zap {...iconProps} />;
      case 'coffee':
        return <Coffee {...iconProps} />;
      case 'cooking':
        return <ChefHat {...iconProps} />;
      default:
        return <Car {...iconProps} />;
    }
  };

  const formatActivityType = (type: string) => {
    const types: { [key: string]: string } = {
      car: 'Car Commute',
      transit: 'Public Transit',
      electricity: 'Electricity',
      shower: 'Hot Shower',
      cooking: 'Gas Cooking',
      coffee: 'Coffee',
      waste: 'Waste',
    };
    return types[type] || type;
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {getActivityIcon()}
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{formatActivityType(activity.activityType)}</Text>
        <Text style={styles.details}>
          {activity.quantity} {activity.unit} • {activity.kgCO2} kg CO₂
        </Text>
      </View>
      {onDelete && (
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Trash2 size={18} color="#EF4444" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 2,
  },
  details: {
    fontSize: 14,
    color: '#6B7280',
  },
  deleteButton: {
    padding: 8,
  },
});