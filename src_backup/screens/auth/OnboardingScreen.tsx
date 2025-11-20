import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const OnboardingScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Logo/Emoji Placeholder */}
        <View style={styles.logoContainer}>
          <Ionicons name="cafe" size={80} color="#FF6B35" />
        </View>
        
        <Text style={styles.title}>Kafe & Bilyar Booking</Text>
        <Text style={styles.subtitle}>
          Nikmati pengalaman booking meja kafe dan bilyar dengan gaya bioskop
        </Text>

        {/* Features List */}
        <View style={styles.features}>
          <View style={styles.featureItem}>
            <Ionicons name="film" size={20} color="#FF6B35" />
            <Text style={styles.featureText}>Cinema-style Booking</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="time" size={20} color="#FF6B35" />
            <Text style={styles.featureText}>Booking Real-time</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="restaurant" size={20} color="#FF6B35" />
            <Text style={styles.featureText}>Menu Digital</Text>
          </View>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Login' as never)}
      >
        <Text style={styles.buttonText}>Mulai Sekarang</Text>
        <Ionicons name="arrow-forward" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  features: {
    width: '100%',
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#FF6B35',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 40,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
});

export default OnboardingScreen;