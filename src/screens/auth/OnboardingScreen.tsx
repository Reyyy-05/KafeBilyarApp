// src/screens/auth/OnboardingScreen.tsx
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors, Typography, Spacing, BorderRadius } from '../../theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Slide {
  id: number;
  icon: string;
  title: string;
  description: string;
  color: string;
}

const OnboardingScreen = () => {
  const navigation = useNavigation<any>();
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides: Slide[] = [
    {
      id: 1,
      icon: 'calendar',
      title: 'Book Your Table',
      description: 'Pesan meja bilyar favorit Anda dengan mudah dan cepat',
      color: Colors.orange.primary,
    },
    {
      id: 2,
      icon: 'restaurant',
      title: 'Order Food & Drinks',
      description: 'Nikmati menu makanan dan minuman favorit Anda sambil bermain',
      color: Colors.status.success,
    },
    {
      id: 3,
      icon: 'time',
      title: 'Track Your Bookings',
      description: 'Pantau riwayat booking dan status pesanan Anda dengan mudah',
      color: Colors.status.info,
    },
  ];

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(offsetX / SCREEN_WIDTH);
        setCurrentIndex(index);
      },
    }
  );

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      scrollViewRef.current?.scrollTo({
        x: (currentIndex + 1) * SCREEN_WIDTH,
        animated: true,
      });
    } else {
      navigation.navigate('Login');
    }
  };

  const handleSkip = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      {/* BACKGROUND GLOW */}
      <View style={styles.backgroundGlow} />
      <View style={[styles.backgroundGlow, styles.backgroundGlow2]} />

      {/* SKIP BUTTON */}
      <TouchableOpacity 
        style={styles.skipButton}
        onPress={handleSkip}
        activeOpacity={0.7}
      >
        <Text style={styles.skipText}>Skip</Text>
        <Ionicons name="arrow-forward" size={16} color={Colors.text.secondary} />
      </TouchableOpacity>

      {/* SLIDES */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {slides.map((slide, index) => (
          <View key={slide.id} style={styles.slide}>
            {/* ICON CONTAINER */}
            <View style={styles.iconContainer}>
              <View style={[
                styles.iconCircle,
                { backgroundColor: `${slide.color}20` }
              ]}>
                <View style={[
                  styles.iconInner,
                  { backgroundColor: slide.color }
                ]}>
                  <Ionicons 
                    name={slide.icon as any} 
                    size={64} 
                    color="#000" 
                  />
                </View>
              </View>
            </View>

            {/* TEXT CONTENT */}
            <View style={styles.content}>
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.description}>{slide.description}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* PAGINATION DOTS */}
      <View style={styles.pagination}>
        {slides.map((_, index) => {
          const inputRange = [
            (index - 1) * SCREEN_WIDTH,
            index * SCREEN_WIDTH,
            (index + 1) * SCREEN_WIDTH,
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 24, 8],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  opacity,
                  backgroundColor: index === currentIndex 
                    ? Colors.orange.primary 
                    : Colors.text.tertiary,
                },
              ]}
            />
          );
        })}
      </View>

      {/* BOTTOM BUTTONS */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>
            {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <Ionicons name="arrow-forward" size={20} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.7}
        >
          <Text style={styles.loginLinkText}>
            Already have an account? <Text style={styles.loginLinkBold}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
  },

  // BACKGROUND
  backgroundGlow: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    backgroundColor: Colors.orange.glow,
    borderRadius: 150,
    opacity: 0.3,
  },
  backgroundGlow2: {
    top: undefined,
    right: undefined,
    bottom: -150,
    left: -100,
    backgroundColor: Colors.status.info + '30',
  },

  // SKIP BUTTON
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.bg.secondary,
    borderRadius: 20,
    zIndex: 10,
  },
  skipText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.secondary,
    marginRight: 4,
  },

  // SLIDES
  scrollView: {
    flex: 1,
  },
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },

  // ICON
  iconContainer: {
    marginBottom: 60,
  },
  iconCircle: {
    width: 240,
    height: 240,
    borderRadius: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconInner: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // CONTENT
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: Typography.sizes.display2,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: Typography.sizes.lg,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: Typography.sizes.lg * 1.5,
    maxWidth: 320,
  },

  // PAGINATION
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },

  // BOTTOM
  bottomContainer: {
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.orange.primary,
    paddingVertical: 16,
    borderRadius: BorderRadius.lg,
    marginBottom: 20,
  },
  nextButtonText: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.text.inverse,
    marginRight: 8,
  },
  loginLink: {
    alignItems: 'center',
  },
  loginLinkText: {
    fontSize: Typography.sizes.base,
    color: Colors.text.secondary,
  },
  loginLinkBold: {
    fontWeight: Typography.weights.bold,
    color: Colors.orange.primary,
  },
});

export default OnboardingScreen;
