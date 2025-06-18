import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withSequence
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const { dispatch } = useApp();
  const logoScale = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  useEffect(() => {
    // Logo entrance animation
    logoScale.value = withSpring(1, {
      damping: 8,
      stiffness: 100,
    });
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: logoScale.value }
      ],
    };
  });

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });

  const handleGetStarted = () => {
    buttonScale.value = withSequence(
      withSpring(0.95, { duration: 100 }),
      withSpring(1, { duration: 100 })
    );
    
    setTimeout(() => {
      // Create a default user and go directly to onboarding
      const userData = {
        id: '1',
        email: 'user@greenie.app',
        name: 'User',
        dietPreference: 'omnivore' as const,
        commutePreference: 'car' as const,
        dailyCarbonGoal: 8,
        totalPoints: 0,
        currentStreak: 0,
        plantStage: 0,
        activeHabits: [] as string[],
        badges: [] as string[],
        createdAt: new Date(),
        notificationSettings: {
          dailyTip: true,
          goalMet: true,
          streakMilestone: true,
          tipTime: '09:00',
        },
      };

      dispatch({ type: 'SET_USER', payload: userData });
      dispatch({ type: 'SET_ONBOARDING_COMPLETED', payload: false });
      router.replace('/onboarding');
    }, 200);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo Section */}
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <Image
            source={require('@/assets/images/Greenie logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Welcome Text */}
        <View style={styles.textContainer}>
          <Text style={styles.subtitle}>Your carbon coach</Text>
          <Text style={styles.description}>
            Track your carbon footprint, build sustainable habits, and watch your plant grow as you make eco-friendly choices every day.
          </Text>
        </View>

        {/* Get Started Button */}
        <Animated.View style={[styles.buttonContainer, buttonAnimatedStyle]}>
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={handleGetStarted}
            activeOpacity={0.9}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Decorative Elements */}
        <View style={styles.decorativeContainer}>
          <View style={[styles.decorativeCircle, styles.circle1]} />
          <View style={[styles.decorativeCircle, styles.circle2]} />
          <View style={[styles.decorativeCircle, styles.circle3]} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A6B1A', // 20% darker green
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    position: 'relative',
    maxWidth: width * 0.9,
  },
  logoContainer: {
    marginBottom: 17, // Reduced by 30%
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 196, // Reduced by 30%
    height: 196, // Reduced by 30%
    shadowColor: '#1b3b2f',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 45, // Reduced by 30%
    maxWidth: width * 0.85,
  },
  subtitle: {
    fontSize: 14, // Reduced by 30%
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 17, // Reduced by 30%
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 11, // Reduced by 30%
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 17, // Reduced by 30%
    opacity: 0.9,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 196, // Reduced by 30%
    marginBottom: 34, // Reduced by 30%
  },
  getStartedButton: {
    backgroundColor: '#152F25', // 20% darker
    paddingVertical: 13, // Reduced by 30%
    paddingHorizontal: 22, // Reduced by 30%
    borderRadius: 20, // Reduced by 30%
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    fontSize: 13, // Reduced by 30%
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  decorativeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  decorativeCircle: {
    position: 'absolute',
    borderRadius: 50,
    opacity: 0.1,
  },
  circle1: {
    width: 70, // Reduced by 30%
    height: 70, // Reduced by 30%
    backgroundColor: '#CC9E00', // 20% darker yellow
    top: height * 0.15,
    left: width * 0.1,
  },
  circle2: {
    width: 42, // Reduced by 30%
    height: 42, // Reduced by 30%
    backgroundColor: '#CC4444', // 20% darker red
    top: height * 0.25,
    right: width * 0.15,
  },
  circle3: {
    width: 56, // Reduced by 30%
    height: 56, // Reduced by 30%
    backgroundColor: '#6B4B30', // 20% darker brown
    bottom: height * 0.2,
    left: width * 0.2,
  },
});