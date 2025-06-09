export interface User {
  id: string;
  email: string;
  name: string;
  dietPreference: 'omnivore' | 'vegetarian' | 'vegan' | 'pescatarian';
  commutePreference: 'car' | 'transit' | 'bike';
  dailyCarbonGoal: number;
  avatar?: string;
  createdAt: Date;
}

export interface Activity {
  id: string;
  userId: string;
  activityType: 'car' | 'transit' | 'electricity' | 'shower' | 'cooking' | 'coffee' | 'waste';
  quantity: number;
  unit: string;
  kgCO2: number;
  timestamp: Date;
}

export interface Habit {
  id: string;
  name: string;
  description: string;
  points: number;
  icon: string;
  category: 'transport' | 'food' | 'energy' | 'waste';
}

export interface HabitCompletion {
  id: string;
  userId: string;
  habitId: string;
  date: string; // YYYY-MM-DD format
  pointsEarned: number;
}

export interface DailyProgress {
  date: string; // YYYY-MM-DD format
  totalKgCO2: number;
  pointsEarned: number;
  habitsCompleted: string[];
  goalMet: boolean;
}

export interface PlantStage {
  id: number;
  name: string;
  minPoints: number;
  description: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface UserProfile extends User {
  totalPoints: number;
  currentStreak: number;
  plantStage: number;
  activeHabits: string[];
  badges: string[];
  notificationSettings: {
    dailyTip: boolean;
    goalMet: boolean;
    streakMilestone: boolean;
    tipTime: string;
  };
}