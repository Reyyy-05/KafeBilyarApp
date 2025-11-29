// src/screens/admin/AttendanceScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Colors, Typography, BorderRadius } from '../../theme';

interface AttendanceRecord {
  id: string;
  date: string;
  clockIn: string | null;
  clockOut: string | null;
  workHours: number | null;
  status: 'present' | 'absent' | 'late' | 'early-leave';
  location?: string;
}

const AttendanceScreen = () => {
  const navigation = useNavigation<any>();
  const admin = useSelector((state: RootState) => state.adminAuth.admin);
  const [refreshing, setRefreshing] = useState(false);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [currentClockIn, setCurrentClockIn] = useState<string | null>(null);

  // Mock attendance history
  const [attendanceHistory] = useState<AttendanceRecord[]>([
    {
      id: '1',
      date: '2025-11-29',
      clockIn: '09:00',
      clockOut: null,
      workHours: null,
      status: 'present',
      location: 'Kafe Bilyar',
    },
    {
      id: '2',
      date: '2025-11-28',
      clockIn: '09:15',
      clockOut: '18:00',
      workHours: 8.75,
      status: 'late',
      location: 'Kafe Bilyar',
    },
    {
      id: '3',
      date: '2025-11-27',
      clockIn: '09:00',
      clockOut: '18:00',
      workHours: 9,
      status: 'present',
      location: 'Kafe Bilyar',
    },
    {
      id: '4',
      date: '2025-11-26',
      clockIn: '09:05',
      clockOut: '17:00',
      workHours: 7.92,
      status: 'early-leave',
      location: 'Kafe Bilyar',
    },
    {
      id: '5',
      date: '2025-11-25',
      clockIn: null,
      clockOut: null,
      workHours: null,
      status: 'absent',
      location: null,
    },
  ]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return Colors.status.success;
      case 'late': return Colors.status.warning;
      case 'early-leave': return Colors.status.info;
      case 'absent': return Colors.status.error;
      default: return Colors.text.secondary;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'present': return 'Present';
      case 'late': return 'Late';
      case 'early-leave': return 'Early Leave';
      case 'absent': return 'Absent';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return 'checkmark-circle';
      case 'late': return 'time';
      case 'early-leave': return 'exit';
      case 'absent': return 'close-circle';
      default: return 'help-circle';
    }
  };

  const handleClockIn = () => {
    Alert.alert(
      'Clock In',
      'Are you sure you want to clock in now?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clock In',
          onPress: () => {
            const now = new Date();
            const time = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
            setCurrentClockIn(time);
            setIsClockedIn(true);
            Alert.alert('Success', `Clocked in at ${time}`);
          },
        },
      ]
    );
  };

  const handleClockOut = () => {
    Alert.alert(
      'Clock Out',
      'Are you sure you want to clock out now?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clock Out',
          onPress: () => {
            const now = new Date();
            const time = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
            setIsClockedIn(false);
            Alert.alert('Success', `Clocked out at ${time}`);
          },
        },
      ]
    );
  };

  // Calculate stats
  const thisMonthStats = {
    totalDays: attendanceHistory.length,
    present: attendanceHistory.filter(a => a.status === 'present').length,
    late: attendanceHistory.filter(a => a.status === 'late').length,
    absent: attendanceHistory.filter(a => a.status === 'absent').length,
    totalHours: attendanceHistory.reduce((sum, a) => sum + (a.workHours || 0), 0),
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerGlow} />
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Attendance</Text>
        <Text style={styles.headerSubtitle}>
          Track your working hours
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.orange.primary} />
        }
      >
        {/* CURRENT STATUS */}
        <View style={styles.statusContainer}>
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <View>
                <Text style={styles.statusGreeting}>Hello, {admin?.name || 'Admin'}!</Text>
                <Text style={styles.statusDate}>
                  {new Date().toLocaleDateString('id-ID', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </Text>
              </View>
              <View style={[
                styles.statusBadge,
                { backgroundColor: isClockedIn ? `${Colors.status.success}20` : `${Colors.status.error}20` }
              ]}>
                <View style={[
                  styles.statusDot,
                  { backgroundColor: isClockedIn ? Colors.status.success : Colors.status.error }
                ]} />
                <Text style={[
                  styles.statusBadgeText,
                  { color: isClockedIn ? Colors.status.success : Colors.status.error }
                ]}>
                  {isClockedIn ? 'Clocked In' : 'Clocked Out'}
                </Text>
              </View>
            </View>

            {isClockedIn && currentClockIn && (
              <View style={styles.currentTime}>
                <Ionicons name="time" size={20} color={Colors.orange.primary} />
                <Text style={styles.currentTimeText}>
                  Working since {currentClockIn}
                </Text>
              </View>
            )}

            {/* CLOCK IN/OUT BUTTON */}
            <TouchableOpacity
              style={[
                styles.clockButton,
                isClockedIn ? styles.clockButtonOut : styles.clockButtonIn
              ]}
              onPress={isClockedIn ? handleClockOut : handleClockIn}
              activeOpacity={0.8}
            >
              <View style={styles.clockButtonIcon}>
                <Ionicons 
                  name={isClockedIn ? 'log-out' : 'log-in'} 
                  size={32} 
                  color={isClockedIn ? Colors.status.error : Colors.status.success} 
                />
              </View>
              <View style={styles.clockButtonContent}>
                <Text style={styles.clockButtonTitle}>
                  {isClockedIn ? 'Clock Out' : 'Clock In'}
                </Text>
                <Text style={styles.clockButtonSubtitle}>
                  {isClockedIn ? 'End your work day' : 'Start your work day'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={Colors.text.secondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* MONTHLY STATS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Month Summary</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: `${Colors.status.success}20` }]}>
                <Ionicons name="checkmark-circle" size={24} color={Colors.status.success} />
              </View>
              <Text style={styles.statValue}>{thisMonthStats.present}</Text>
              <Text style={styles.statLabel}>Present Days</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: `${Colors.status.warning}20` }]}>
                <Ionicons name="time" size={24} color={Colors.status.warning} />
              </View>
              <Text style={styles.statValue}>{thisMonthStats.late}</Text>
              <Text style={styles.statLabel}>Late Days</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: `${Colors.status.error}20` }]}>
                <Ionicons name="close-circle" size={24} color={Colors.status.error} />
              </View>
              <Text style={styles.statValue}>{thisMonthStats.absent}</Text>
              <Text style={styles.statLabel}>Absent Days</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: `${Colors.orange.primary}20` }]}>
                <Ionicons name="hourglass" size={24} color={Colors.orange.primary} />
              </View>
              <Text style={styles.statValue}>{thisMonthStats.totalHours.toFixed(1)}h</Text>
              <Text style={styles.statLabel}>Total Hours</Text>
            </View>
          </View>
        </View>

        {/* ATTENDANCE HISTORY */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Attendance History</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {attendanceHistory.map((record) => (
            <View key={record.id} style={styles.historyCard}>
              <View style={styles.historyDate}>
                <Text style={styles.historyDateDay}>
                  {new Date(record.date).toLocaleDateString('id-ID', { day: 'numeric' })}
                </Text>
                <Text style={styles.historyDateMonth}>
                  {new Date(record.date).toLocaleDateString('id-ID', { month: 'short' })}
                </Text>
              </View>

              <View style={styles.historyContent}>
                <View style={styles.historyHeader}>
                  <Text style={styles.historyTitle}>
                    {new Date(record.date).toLocaleDateString('id-ID', { weekday: 'long' })}
                  </Text>
                  <View style={[
                    styles.historyStatus,
                    { backgroundColor: `${getStatusColor(record.status)}20` }
                  ]}>
                    <Ionicons 
                      name={getStatusIcon(record.status) as any} 
                      size={12} 
                      color={getStatusColor(record.status)} 
                    />
                    <Text style={[
                      styles.historyStatusText,
                      { color: getStatusColor(record.status) }
                    ]}>
                      {getStatusLabel(record.status)}
                    </Text>
                  </View>
                </View>

                {record.clockIn && (
                  <View style={styles.historyTime}>
                    <View style={styles.historyTimeItem}>
                      <Ionicons name="log-in" size={14} color={Colors.status.success} />
                      <Text style={styles.historyTimeText}>In: {record.clockIn}</Text>
                    </View>
                    {record.clockOut && (
                      <>
                        <View style={styles.historyTimeSeparator} />
                        <View style={styles.historyTimeItem}>
                          <Ionicons name="log-out" size={14} color={Colors.status.error} />
                          <Text style={styles.historyTimeText}>Out: {record.clockOut}</Text>
                        </View>
                      </>
                    )}
                  </View>
                )}

                {record.workHours && (
                  <View style={styles.historyFooter}>
                    <Ionicons name="hourglass" size={14} color={Colors.orange.primary} />
                    <Text style={styles.historyHours}>
                      {record.workHours.toFixed(2)} hours worked
                    </Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
  },
  scrollView: {
    flex: 1,
  },

  // HEADER
  header: {
    backgroundColor: Colors.bg.secondary,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  headerGlow: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 160,
    height: 160,
    backgroundColor: Colors.orange.glow,
    borderRadius: 80,
    opacity: 0.3,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.bg.elevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
  },

  // CURRENT STATUS
  statusContainer: {
    padding: 20,
  },
  statusCard: {
    backgroundColor: Colors.bg.secondary,
    borderRadius: BorderRadius.xl,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.bg.tertiary,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  statusGreeting: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  statusDate: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusBadgeText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
  },
  currentTime: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg.elevated,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    marginBottom: 16,
  },
  currentTimeText: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.primary,
    marginLeft: 8,
  },
  clockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg.elevated,
    borderRadius: BorderRadius.lg,
    padding: 16,
    borderWidth: 2,
  },
  clockButtonIn: {
    borderColor: Colors.status.success,
  },
  clockButtonOut: {
    borderColor: Colors.status.error,
  },
  clockButtonIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.bg.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  clockButtonContent: {
    flex: 1,
  },
  clockButtonTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  clockButtonSubtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
  },

  // SECTION
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.orange.primary,
  },

  // STATS
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  statCard: {
    width: '48%',
    backgroundColor: Colors.bg.secondary,
    borderRadius: BorderRadius.lg,
    padding: 16,
    marginHorizontal: '1%',
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.bg.tertiary,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: Typography.sizes.display1,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.secondary,
    textAlign: 'center',
  },

  // HISTORY
  historyCard: {
    flexDirection: 'row',
    backgroundColor: Colors.bg.secondary,
    borderRadius: BorderRadius.lg,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.bg.tertiary,
  },
  historyDate: {
    width: 50,
    height: 50,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.orange.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  historyDateDay: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.text.inverse,
  },
  historyDateMonth: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.inverse,
    textTransform: 'uppercase',
  },
  historyContent: {
    flex: 1,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
  },
  historyStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  historyStatusText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    marginLeft: 4,
  },
  historyTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyTimeItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyTimeText: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  historyTimeSeparator: {
    width: 1,
    height: 12,
    backgroundColor: Colors.bg.tertiary,
    marginHorizontal: 12,
  },
  historyFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyHours: {
    fontSize: Typography.sizes.xs,
    color: Colors.orange.primary,
    marginLeft: 6,
  },
});

export default AttendanceScreen;
