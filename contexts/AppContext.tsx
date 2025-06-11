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
      return {
        ...state,
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
      // Load default habits
      const defaultHabits: Habit[] = [
        {
          id: '1',
          name: 'Plant-Based Meal',
          description: 'Choose a plant-based meal option',
          points: 5,
          icon: 'Salad',
          category: 'food',
        },
        {
          id: '2',
          name: 'Bike or Walk Commute',
          description: 'Use sustainable transport',
          points: 8,
          icon: 'Bike',
          category: 'transport',
        },
        {
          id: '3',
          name: 'No-Waste Day',
          description: 'Generate minimal waste today',
          points: 3,
          icon: 'Recycle',
          category: 'waste',
        },
        {
          id: '4',
          name: 'Energy-Saver',
          description: 'Reduce electricity consumption',
          points: 2,
          icon: 'Lightbulb',
          category: 'energy',
        },
        {
          id: '5',
          name: 'Meat-Free Day',
          description: 'Go completely meat-free today',
          points: 4,
          icon: 'LeafyGreen',
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