import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { UserProfile, Activity, DailyProgress, ChatMessage, Habit, HabitCompletion } from '@/types';

interface AppState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  activities: Activity[];
  dailyProgress: DailyProgress | null;
  chatMessages: ChatMessage[];
  habits: Habit[];
  habitCompletions: HabitCompletion[];
  onboardingCompleted: boolean;
}

type AppAction =
  | { type: 'SET_USER'; payload: UserProfile }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'ADD_ACTIVITY'; payload: Activity }
  | { type: 'UPDATE_DAILY_PROGRESS'; payload: DailyProgress }
  | { type: 'ADD_CHAT_MESSAGE'; payload: ChatMessage }
  | { type: 'COMPLETE_HABIT'; payload: { habitId: string; date: string } }
  | { type: 'SET_HABITS'; payload: Habit[] }
  | { type: 'SET_ONBOARDING_COMPLETED'; payload: boolean }
  | { type: 'UPDATE_USER_PROFILE'; payload: Partial<UserProfile> }
  | { type: 'LOGOUT' };

const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  activities: [],
  dailyProgress: null,
  chatMessages: [],
  habits: [],
  habitCompletions: [],
  onboardingCompleted: false,
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    case 'ADD_ACTIVITY':
      return {
        ...state,
        activities: [...state.activities, action.payload],
      };
    case 'UPDATE_DAILY_PROGRESS':
      return { ...state, dailyProgress: action.payload };
    case 'ADD_CHAT_MESSAGE':
      return {
        ...state,
        chatMessages: [...state.chatMessages, action.payload],
      };
    case 'COMPLETE_HABIT':
      const newCompletion: HabitCompletion = {
        id: Date.now().toString(),
        userId: state.user?.id || '',
        habitId: action.payload.habitId,
        date: action.payload.date,
        pointsEarned: state.habits.find(h => h.id === action.payload.habitId)?.points || 0,
      };
      
      // Update user's total points
      const updatedUser = state.user ? {
        ...state.user,
        totalPoints: state.user.totalPoints + newCompletion.pointsEarned
      } : null;
      
      return {
        ...state,
        user: updatedUser,
        habitCompletions: [...state.habitCompletions, newCompletion],
      };
    case 'SET_HABITS':
      return { ...state, habits: action.payload };
    case 'SET_ONBOARDING_COMPLETED':
      return { ...state, onboardingCompleted: action.payload };
    case 'UPDATE_USER_PROFILE':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    case 'LOGOUT':
      return {
        ...initialState,
        isLoading: false,
        habits: state.habits, // Keep habits loaded
      };
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    // Initialize app data
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      // Load updated habits with new options
      const defaultHabits: Habit[] = [
        {
          id: '1',
          name: '💧 Cold Wash Laundry Day',
          description: 'Wash clothes in cold water',
          points: 5,
          icon: 'Droplets',
          category: 'energy',
        },
        {
          id: '2',
          name: 'Zero Single-Use Plastics',
          description: 'Avoid disposable plastic items',
          points: 4,
          icon: 'Recycle',
          category: 'waste',
        },
        {
          id: '3',
          name: '🔌 Unplug Idle Devices',
          description: 'Unplug unused electronics',
          points: 2,
          icon: 'Unplug',
          category: 'energy',
        },
        {
          id: '4',
          name: '💧 5-Minute Shower',
          description: 'Limit shower duration',
          points: 4,
          icon: 'Timer',
          category: 'energy',
        },
        {
          id: '5',
          name: '🔌 Digital Detox Evening',
          description: 'No streaming/gaming after 7PM',
          points: 4,
          icon: 'Smartphone',
          category: 'energy',
        },
        {
          id: '6',
          name: '🌾 Meat-Free Day',
          description: 'Choose vegetarian/plant-based meals',
          points: 8,
          icon: 'Leaf',
          category: 'food',
        },
        {
          id: '7',
          name: 'Walk/Bike Commute',
          description: 'Replace a short car trip with walking or cycling (7pts/10km)',
          points: 7,
          icon: 'Bike',
          category: 'transport',
        },
        {
          id: '8',
          name: '🚌 Public Transit/Carpool',
          description: 'Take public transit or share a ride instead of driving (8pts/trip)',
          points: 8,
          icon: 'Bus',
          category: 'transport',
        },
        {
          id: '9',
          name: '🌾 Zero Food Waste Day',
          description: 'Mindful food management',
          points: 5,
          icon: 'ChefHat',
          category: 'food',
        },
      ];

      dispatch({ type: 'SET_HABITS', payload: defaultHabits });

      // Start with no authenticated user - let the flow begin naturally
      dispatch({ type: 'SET_LOADING', payload: false });

    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}