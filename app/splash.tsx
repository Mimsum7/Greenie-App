import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { PlantGraphic } from '@/components/PlantGraphic';
import { plantStages } from '@/utils/plantStages';
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
    <LinearGradient
      colors={['#DCFCE7', '#BBF7D0', '#86EFAC']}
      style={styles.container}
    >
      <View style={styles.content}>
        <PlantGraphic stage={plantStages[1]} size={100} />
        <Text style={styles.title}>Greenie</Text>
        <Text style={styles.subtitle}>Grow your green habits</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    color: '#166534',
    marginTop: 24,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    color: '#15803D',
    textAlign: 'center',
  },
});