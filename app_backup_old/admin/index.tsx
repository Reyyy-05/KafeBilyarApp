import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function AdminScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <Text style={styles.subtitle}>Panel Admin Kafe & Bilyar</Text>
      
      <Link href="/(auth)/onboarding" asChild>
        <Text style={styles.backLink}>← Kembali ke Onboarding</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  backLink: {
    color: '#FF6B35',
    fontSize: 16,
    fontWeight: '600',
  },
});