import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withRepeat, 
  withSequence,
  interpolate
} from 'react-native-reanimated';
import { useEffect } from 'react';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const logoScale = useSharedValue(0);
  const buttonScale = useSharedValue(1);
  const floatingAnimation = useSharedValue(0);

  useEffect(() => {
    // Logo entrance animation
    logoScale.value = withSpring(1, {
      damping: 8,
      stiffness: 100,
    });

    // Floating animation for logo
    floatingAnimation.value = withRepeat(
      withSequence(
        withSpring(1, { duration: 2000 }),
        withSpring(0, { duration: 2000 })
      ),
      -1,
      true
    );
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(floatingAnimation.value, [0, 1], [0, -10]);
    
    return {
      transform: [
        { scale: logoScale.value },
        { translateY }
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
      router.push('/auth');
    }, 200);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#f2f5f0', '#a8d5ba', '#228b22']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
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
            <Text style={styles.welcomeTitle}>Welcome to Greenie</Text>
            <Text style={styles.subtitle}>Your carbon coach</Text>
            <Text style={styles.description}>
              Track your carbon footprint, build sustainable habits, and watch your virtual plant grow as you make eco-friendly choices every day.
            </Text>
          </View>

          {/* Get Started Button */}
          <Animated.View style={[styles.buttonContainer, buttonAnimatedStyle]}>
            <TouchableOpacity
              style={styles.getStartedButton}
              onPress={handleGetStarted}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#1b3b2f', '#228b22']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.buttonText}>Get Started</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Decorative Elements */}
          <View style={styles.decorativeContainer}>
            <View style={[styles.decorativeCircle, styles.circle1]} />
            <View style={[styles.decorativeCircle, styles.circle2]} />
            <View style={[styles.decorativeCircle, styles.circle3]} />
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    position: 'relative',
  },
  logoContainer: {
    marginBottom: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 180,
    height: 180,
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
    marginBottom: 64,
    maxWidth: width * 0.85,
  },
  welcomeTitle: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    color: '#1b3b2f',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#8b5e3c',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1b3b2f',
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.8,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 280,
    marginBottom: 48,
  },
  getStartedButton: {
    borderRadius: 28,
    shadowColor: '#1b3b2f',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
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
    width: 100,
    height: 100,
    backgroundColor: '#ffd93b',
    top: height * 0.15,
    left: width * 0.1,
  },
  circle2: {
    width: 60,
    height: 60,
    backgroundColor: '#ff6b6b',
    top: height * 0.25,
    right: width * 0.15,
  },
  circle3: {
    width: 80,
    height: 80,
    backgroundColor: '#8b5e3c',
    bottom: height * 0.2,
    left: width * 0.2,
  },
});