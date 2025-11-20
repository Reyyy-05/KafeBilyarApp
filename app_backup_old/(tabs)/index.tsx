import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Halo, Customer! 👋</Text>
        <Text style={styles.subtitle}>Selamat datang di Kafe & Bilyar Booking</Text>
      </View>

      <View style={styles.features}>
        <View style={styles.featureCard}>
          <Ionicons name="time" size={32} color="#FF6B35" />
          <Text style={styles.featureTitle}>Booking Cepat</Text>
          <Text style={styles.featureDesc}>Pilih meja dan waktu dengan mudah</Text>
        </View>

        <View style={styles.featureCard}>
          <Ionicons name="film" size={32} color="#FF6B35" />
          <Text style={styles.featureTitle}>Cinema Style</Text>
          <Text style={styles.featureDesc}>Experience seperti bioskop</Text>
        </View>

        <View style={styles.featureCard}>
          <Ionicons name="cafe" size={32} color="#FF6B35" />
          <Text style={styles.featureTitle}>Menu Lengkap</Text>
          <Text style={styles.featureDesc}>Pesan makanan & minuman</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  features: {
    padding: 20,
    gap: 16,
  },
  featureCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
    color: '#333',
  },
  featureDesc: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});