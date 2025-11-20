// src/screens/admin/AdminDashboardScreen.tsx - ADD LOGOUT
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { Card, Title } from 'react-native-paper';
import type { RootState } from '../../store';
import { adminLogout } from '../../store/slices/adminAuthSlice';
import { persistor } from '../../store'; // ✅ ADD

const AdminDashboardScreen = () => {
  const dispatch = useDispatch();
  const { admin } = useSelector((state: RootState) => state.adminAuth);
  const attendance = useSelector((state: RootState) => state.attendance);

  // ✅ ADD LOGOUT HANDLER
  const handleLogout = async () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Apakah Anda yakin ingin logout?');
      
      if (confirmed) {
        dispatch(adminLogout());
        await persistor.purge();
        window.location.href = '/';
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Halo, {admin?.name}! 👋</Text>
          <Text style={styles.role}>
            {admin?.role === 'super_admin' ? 'Super Admin' : 
             admin?.role === 'admin' ? 'Admin' : 'Kasir'}
          </Text>
        </View>
        {/* ✅ FIX: Make it clickable */}
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={28} color="#FF6B35" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Attendance Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>✅ Absensi Hari Ini</Title>
            {attendance.currentSession ? (
              <View>
                <Text style={styles.infoText}>
                  Check-in: {new Date(attendance.currentSession.checkInTime).toLocaleTimeString('id-ID')}
                </Text>
                <Text style={styles.successText}>Status: Aktif</Text>
              </View>
            ) : (
              <Text style={styles.warningText}>Belum check-in</Text>
            )}
          </Card.Content>
        </Card>

        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Card.Content>
              <Ionicons name="calendar" size={32} color="#FF6B35" />
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Booking Hari Ini</Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content>
              <Ionicons name="checkmark-circle" size={32} color="#4CAF50" />
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Meja Tersedia</Text>
            </Card.Content>
          </Card>
        </View>

        {/* Quick Actions */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Menu Admin</Title>
            <Text style={styles.comingSoon}>
              🚧 Fitur admin lainnya sedang dalam pengembangan:
              {'\n'}• Manajemen Meja
              {'\n'}• Manajemen Booking
              {'\n'}• Manajemen Menu
              {'\n'}• Laporan & Statistik
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

// Styles sama seperti sebelumnya
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  role: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '600',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  successText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  warningText: {
    fontSize: 14,
    color: '#FF9800',
    fontWeight: 'bold',
  },
  comingSoon: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginTop: 12,
  },
});

export default AdminDashboardScreen;
