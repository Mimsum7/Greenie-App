import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '@/contexts/AppContext';

export default function SplashScreen() {
  const router = useRouter();
  const { state } = useApp();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait for app context to initialize
    if (!state.isLoading) {
      setIsReady(true);
    }
  }, [state.isLoading]);

  useEffect(() => {
    if (isReady) {
      const timer = setTimeout(() => {
        if (!state.isAuthenticated) {
          router.replace('/welcome');
        } else if (!state.onboardingCompleted) {
          router.replace('/onboarding');
        } else {
          router.replace('/(tabs)');
        }
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [isReady, state.isAuthenticated, state.onboardingCompleted]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('@/assets/images/Greenie logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Greenie</Text>
        <Text style={styles.subtitle}>Grow your green habits</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2BAE2B', // Same color as welcome page
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    shadowColor: '#1b3b2f',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF', // White text for better contrast on green background
    marginTop: 24,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF', // White text for better contrast
    textAlign: 'center',
  },
});