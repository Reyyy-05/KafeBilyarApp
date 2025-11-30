// src/screens/admin/AdminDashboardScreen.tsx - FIXED VERSION
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { adminLogout } from '../../store/slices/adminAuthSlice';
import { Colors, Typography, BorderRadius } from '../../theme';

const AdminDashboardScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const admin = useSelector((state: RootState) => state.adminAuth.admin);
  
  const [refreshing, setRefreshing] = useState(false);

  // Mock stats data
  const stats = {
    todayBookings: 12,
    todayRevenue: 2450000,
    activeTables: 5,
    totalTables: 8,
    pendingOrders: 8,
    completedToday: 15,
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const handleLogout = () => {
    dispatch(adminLogout());
    navigation.reset({
      index: 0,
      routes: [{ name: 'Onboarding' }],
    });
  };

  const quickActions = [
    { id: 1, icon: 'calendar', label: 'Bookings', color: Colors.orange.primary, screen: 'BookingManagement' },
    { id: 2, icon: 'cafe', label: 'Tables', color: Colors.status.info, screen: 'TableManagement' },
    { id: 3, icon: 'restaurant', label: 'Menu', color: Colors.status.success, screen: 'MenuManagement' },
    { id: 4, icon: 'bar-chart', label: 'Reports', color: Colors.status.warning, screen: 'Reports' },
    { id: 5, icon: 'time', label: 'Attendance', color: Colors.status.error, screen: 'Attendance' },
    { id: 6, icon: 'settings', label: 'Settings', color: Colors.text.secondary, screen: 'SystemSettings' }, // ✅ FIXED
  ];

  return (
  <View style={styles.container}>
    {/* HEADER */}
    <View style={styles.header} pointerEvents="box-none">
      <View style={styles.headerGlow} pointerEvents="none" />
      <View style={styles.headerTop} pointerEvents="box-none">
        <View pointerEvents="box-none">
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.adminName}>{admin?.name || 'Admin'} 👨‍💼</Text>
        </View>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={24} color={Colors.status.error} />
        </TouchableOpacity>
      </View>
      <View style={styles.headerBadge} pointerEvents="none">
        <Ionicons name="shield-checkmark" size={16} color={Colors.orange.primary} />
        <Text style={styles.headerRole}>{admin?.role === 'super_admin' ? 'Super Admin' : 'Admin'}</Text>
      </View>
    </View>

    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={Colors.orange.primary}
        />
      }
    >
      {/* STATS GRID */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Today's Overview</Text>
        
        <View style={styles.statsGrid}>
          {/* Stat Card 1 */}
          <View style={[styles.statCard, styles.statCardPrimary]}>
            <View style={styles.statIconContainer}>
              <Ionicons name="calendar" size={24} color={Colors.orange.primary} />
            </View>
            <Text style={styles.statValue}>{stats.todayBookings}</Text>
            <Text style={styles.statLabel}>Bookings Today</Text>
          </View>

          {/* Stat Card 2 */}
          <View style={[styles.statCard, styles.statCardSuccess]}>
            <View style={styles.statIconContainer}>
              <Ionicons name="cash" size={24} color={Colors.status.success} />
            </View>
            <Text style={styles.statValue}>
              {(stats.todayRevenue / 1000).toFixed(0)}K
            </Text>
            <Text style={styles.statLabel}>Revenue Today</Text>
          </View>

          {/* Stat Card 3 */}
          <View style={[styles.statCard, styles.statCardInfo]}>
            <View style={styles.statIconContainer}>
              <Ionicons name="cafe" size={24} color={Colors.status.info} />
            </View>
            <Text style={styles.statValue}>{stats.activeTables}/{stats.totalTables}</Text>
            <Text style={styles.statLabel}>Active Tables</Text>
          </View>

          {/* Stat Card 4 */}
          <View style={[styles.statCard, styles.statCardWarning]}>
            <View style={styles.statIconContainer}>
              <Ionicons name="time" size={24} color={Colors.status.warning} />
            </View>
            <Text style={styles.statValue}>{stats.pendingOrders}</Text>
            <Text style={styles.statLabel}>Pending Orders</Text>
          </View>
        </View>
      </View>

      {/* QUICK ACTIONS */}
      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <View style={styles.actionsGrid}>
          {quickActions.map(action => (
            <TouchableOpacity
              key={action.id}
              style={styles.actionCard}
              onPress={() => {
                console.log('Navigating to:', action.screen);
                navigation.navigate(action.screen);
              }}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIcon, { backgroundColor: `${action.color}20` }]}>
                <Ionicons name={action.icon as any} size={28} color={action.color} />
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* RECENT ACTIVITY */}
      <View style={styles.activityContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {[1, 2, 3, 4].map(i => (
          <View key={i} style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.status.success} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Booking #BK00{123 + i} confirmed</Text>
              <Text style={styles.activityTime}>{i * 5} minutes ago</Text>
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
  scrollContent: {
    flexGrow: 1, // ✅ TAMBAHKAN INI
  },
  // HEADER - ✅ FIXED WITH ZINDEX
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
  zIndex: -1,
  // ✅ pointerEvents="none" ditambahkan di component
},

  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    zIndex: 10,
  },
  greeting: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  adminName: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
  },
  logoutButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.bg.elevated,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg.elevated,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    zIndex: 10,
  },
  headerRole: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.orange.primary,
    marginLeft: 6,
  },

  // STATS
  statsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginBottom: 16,
  },
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
    borderWidth: 1,
  },
  statCardPrimary: {
    borderColor: Colors.orange.primary,
    backgroundColor: `${Colors.orange.primary}10`,
  },
  statCardSuccess: {
    borderColor: Colors.status.success,
    backgroundColor: `${Colors.status.success}10`,
  },
  statCardInfo: {
    borderColor: Colors.status.info,
    backgroundColor: `${Colors.status.info}10`,
  },
  statCardWarning: {
    borderColor: Colors.status.warning,
    backgroundColor: `${Colors.status.warning}10`,
  },
  statIconContainer: {
    marginBottom: 8,
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
  },

  // QUICK ACTIONS
  quickActionsContainer: {
    padding: 20,
    paddingTop: 0,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  actionCard: {
    width: '31%',
    backgroundColor: Colors.bg.secondary,
    borderRadius: BorderRadius.lg,
    padding: 16,
    marginHorizontal: '1%',
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.bg.tertiary,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
    textAlign: 'center',
  },

  // ACTIVITY
  activityContainer: {
    padding: 20,
    paddingTop: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.orange.primary,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg.secondary,
    borderRadius: BorderRadius.md,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.bg.tertiary,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.bg.elevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.tertiary,
  },
});

export default AdminDashboardScreen;
