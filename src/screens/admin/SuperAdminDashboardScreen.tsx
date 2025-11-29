// src/screens/admin/SuperAdminDashboardScreen.tsx
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

const SuperAdminDashboardScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const admin = useSelector((state: RootState) => state.adminAuth.admin);
  
  const [refreshing, setRefreshing] = useState(false);

  // Mock comprehensive stats
  const stats = {
    // Financial
    todayRevenue: 2450000,
    monthlyRevenue: 67500000,
    yearlyRevenue: 780000000,
    
    // Operations
    activeBookings: 8,
    totalBookings: 356,
    activeAdmins: 5,
    totalAdmins: 8,
    
    // Tables
    availableTables: 3,
    totalTables: 8,
    vipTables: 3,
    regularTables: 5,
    
    // Menu
    totalMenuItems: 45,
    outOfStock: 3,
    popularItems: 12,
    
    // Users
    totalCustomers: 1248,
    activeToday: 45,
    newThisMonth: 87,
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

  const systemActions = [
    { id: 1, icon: 'people', label: 'Admin Management', color: Colors.orange.primary, screen: 'AdminManagement', description: 'Manage admin accounts' },
    { id: 2, icon: 'cafe', label: 'Table CRUD', color: Colors.status.info, screen: 'TableCRUD', description: 'Add/Edit/Delete tables' },
    { id: 3, icon: 'restaurant', label: 'Menu CRUD', color: Colors.status.success, screen: 'MenuCRUD', description: 'Manage menu items' },
    { id: 4, icon: 'person', label: 'User Management', color: Colors.status.warning, screen: 'UserManagement', description: 'View customers' },
    { id: 5, icon: 'bar-chart', label: 'Advanced Reports', color: Colors.status.error, screen: 'AdvancedReports', description: 'Analytics & insights' },
    { id: 6, icon: 'settings', label: 'System Settings', color: Colors.text.secondary, screen: 'SystemSettings', description: 'App configuration' },
  ];

  const quickStats = [
    { label: 'Today Revenue', value: `Rp ${(stats.todayRevenue / 1000).toFixed(0)}K`, icon: 'cash', color: Colors.orange.primary },
    { label: 'Active Bookings', value: stats.activeBookings, icon: 'calendar', color: Colors.status.info },
    { label: 'Active Admins', value: `${stats.activeAdmins}/${stats.totalAdmins}`, icon: 'shield', color: Colors.status.success },
    { label: 'Available Tables', value: `${stats.availableTables}/${stats.totalTables}`, icon: 'cafe', color: Colors.status.warning },
  ];

  const recentActivity = [
    { id: 1, icon: 'person-add', text: 'New admin registered: John Doe', time: '5 min ago', color: Colors.status.success },
    { id: 2, icon: 'create', text: 'Menu item "Kopi Susu" updated', time: '12 min ago', color: Colors.status.info },
    { id: 3, icon: 'trash', text: 'Table "Meja 10" deleted', time: '25 min ago', color: Colors.status.error },
    { id: 4, icon: 'checkmark-circle', text: 'System backup completed', time: '1 hour ago', color: Colors.status.success },
  ];

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerGlow} />
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Super Admin Panel</Text>
            <Text style={styles.adminName}>{admin?.name || 'Super Admin'} 👑</Text>
          </View>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={24} color={Colors.status.error} />
          </TouchableOpacity>
        </View>
        <View style={styles.headerBadge}>
          <Ionicons name="shield-checkmark" size={16} color={Colors.orange.primary} />
          <Text style={styles.headerRole}>Full System Access</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.orange.primary}
          />
        }
      >
        {/* QUICK STATS */}
        <View style={styles.quickStatsContainer}>
          {quickStats.map((stat, index) => (
            <View key={index} style={styles.quickStatCard}>
              <View style={[styles.quickStatIcon, { backgroundColor: `${stat.color}20` }]}>
                <Ionicons name={stat.icon as any} size={20} color={stat.color} />
              </View>
              <Text style={styles.quickStatValue}>{stat.value}</Text>
              <Text style={styles.quickStatLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* FINANCIAL OVERVIEW */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Financial Overview</Text>
          
          <View style={styles.financialCard}>
            <View style={styles.financialItem}>
              <View style={styles.financialIconContainer}>
                <Ionicons name="today" size={24} color={Colors.orange.primary} />
              </View>
              <View style={styles.financialInfo}>
                <Text style={styles.financialLabel}>Today</Text>
                <Text style={styles.financialValue}>Rp {stats.todayRevenue.toLocaleString()}</Text>
              </View>
              <View style={styles.financialChange}>
                <Ionicons name="trending-up" size={16} color={Colors.status.success} />
                <Text style={styles.financialChangeText}>+12%</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.financialItem}>
              <View style={styles.financialIconContainer}>
                <Ionicons name="calendar" size={24} color={Colors.status.info} />
              </View>
              <View style={styles.financialInfo}>
                <Text style={styles.financialLabel}>This Month</Text>
                <Text style={styles.financialValue}>Rp {(stats.monthlyRevenue / 1000000).toFixed(1)}M</Text>
              </View>
              <View style={styles.financialChange}>
                <Ionicons name="trending-up" size={16} color={Colors.status.success} />
                <Text style={styles.financialChangeText}>+8.5%</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.financialItem}>
              <View style={styles.financialIconContainer}>
                <Ionicons name="calendar-outline" size={24} color={Colors.status.success} />
              </View>
              <View style={styles.financialInfo}>
                <Text style={styles.financialLabel}>This Year</Text>
                <Text style={styles.financialValue}>Rp {(stats.yearlyRevenue / 1000000).toFixed(0)}M</Text>
              </View>
              <View style={styles.financialChange}>
                <Ionicons name="trending-up" size={16} color={Colors.status.success} />
                <Text style={styles.financialChangeText}>+23%</Text>
              </View>
            </View>
          </View>
        </View>

        {/* SYSTEM MANAGEMENT */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Management</Text>
          
          <View style={styles.actionsGrid}>
            {systemActions.map(action => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionCard}
                onPress={() => navigation.navigate(action.screen)}
                activeOpacity={0.8}
              >
                <View style={[styles.actionIconContainer, { backgroundColor: `${action.color}20` }]}>
                  <Ionicons name={action.icon as any} size={32} color={action.color} />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
                <Text style={styles.actionDescription}>{action.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* SYSTEM STATS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Statistics</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statItemValue}>{stats.totalCustomers}</Text>
              <Text style={styles.statItemLabel}>Total Customers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statItemValue}>{stats.totalBookings}</Text>
              <Text style={styles.statItemLabel}>Total Bookings</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statItemValue}>{stats.totalMenuItems}</Text>
              <Text style={styles.statItemLabel}>Menu Items</Text>
            </View>
          </View>
        </View>

        {/* RECENT ACTIVITY */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent System Activity</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {recentActivity.map(activity => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: `${activity.color}20` }]}>
                <Ionicons name={activity.icon as any} size={20} color={activity.color} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>{activity.text}</Text>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* SYSTEM HEALTH */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Health</Text>
          
          <View style={styles.healthCard}>
            <View style={styles.healthItem}>
              <View style={styles.healthLabel}>
                <Ionicons name="server" size={16} color={Colors.text.secondary} />
                <Text style={styles.healthLabelText}>Server Status</Text>
              </View>
              <View style={styles.healthStatus}>
                <View style={[styles.healthDot, { backgroundColor: Colors.status.success }]} />
                <Text style={[styles.healthStatusText, { color: Colors.status.success }]}>Online</Text>
              </View>
            </View>

            <View style={styles.healthItem}>
              <View style={styles.healthLabel}>
                <Ionicons name="cloud" size={16} color={Colors.text.secondary} />
                <Text style={styles.healthLabelText}>Database</Text>
              </View>
              <View style={styles.healthStatus}>
                <View style={[styles.healthDot, { backgroundColor: Colors.status.success }]} />
                <Text style={[styles.healthStatusText, { color: Colors.status.success }]}>Connected</Text>
              </View>
            </View>

            <View style={styles.healthItem}>
              <View style={styles.healthLabel}>
                <Ionicons name="shield" size={16} color={Colors.text.secondary} />
                <Text style={styles.healthLabelText}>Security</Text>
              </View>
              <View style={styles.healthStatus}>
                <View style={[styles.healthDot, { backgroundColor: Colors.status.success }]} />
                <Text style={[styles.healthStatusText, { color: Colors.status.success }]}>Secure</Text>
              </View>
            </View>

            <View style={styles.healthItem}>
              <View style={styles.healthLabel}>
                <Ionicons name="sync" size={16} color={Colors.text.secondary} />
                <Text style={styles.healthLabelText}>Last Backup</Text>
              </View>
              <View style={styles.healthStatus}>
                <Text style={styles.healthStatusText}>1 hour ago</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg.primary },
  scrollView: { flex: 1 },
  header: { backgroundColor: Colors.bg.secondary, paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, position: 'relative', overflow: 'hidden' },
  headerGlow: { position: 'absolute', top: -80, right: -80, width: 160, height: 160, backgroundColor: Colors.orange.glow, borderRadius: 80, opacity: 0.3 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  greeting: { fontSize: Typography.sizes.sm, color: Colors.text.secondary, marginBottom: 4 },
  adminName: { fontSize: Typography.sizes.xl, fontWeight: Typography.weights.bold, color: Colors.text.primary },
  logoutButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.bg.elevated, justifyContent: 'center', alignItems: 'center' },
  headerBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.bg.elevated, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, alignSelf: 'flex-start' },
  headerRole: { fontSize: Typography.sizes.xs, fontWeight: Typography.weights.semibold, color: Colors.orange.primary, marginLeft: 6 },
  quickStatsContainer: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 16 },
  quickStatCard: { flex: 1, backgroundColor: Colors.bg.secondary, borderRadius: BorderRadius.md, padding: 12, marginHorizontal: 4, alignItems: 'center', borderWidth: 1, borderColor: Colors.bg.tertiary },
  quickStatIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  quickStatValue: { fontSize: Typography.sizes.lg, fontWeight: Typography.weights.bold, color: Colors.text.primary, marginBottom: 2 },
  quickStatLabel: { fontSize: Typography.sizes.xs, color: Colors.text.secondary, textAlign: 'center' },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: Typography.sizes.lg, fontWeight: Typography.weights.bold, color: Colors.text.primary, marginBottom: 16 },
  seeAllText: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.semibold, color: Colors.orange.primary },
  financialCard: { backgroundColor: Colors.bg.secondary, borderRadius: BorderRadius.xl, padding: 16, borderWidth: 1, borderColor: Colors.bg.tertiary },
  financialItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  financialIconContainer: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.bg.elevated, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  financialInfo: { flex: 1 },
  financialLabel: { fontSize: Typography.sizes.sm, color: Colors.text.secondary, marginBottom: 4 },
  financialValue: { fontSize: Typography.sizes.lg, fontWeight: Typography.weights.bold, color: Colors.text.primary },
  financialChange: { flexDirection: 'row', alignItems: 'center', backgroundColor: `${Colors.status.success}20`, paddingHorizontal: 8, paddingVertical: 4, borderRadius: BorderRadius.sm },
  financialChangeText: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.semibold, color: Colors.status.success, marginLeft: 4 },
  divider: { height: 1, backgroundColor: Colors.bg.tertiary },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 },
  actionCard: { width: '48%', backgroundColor: Colors.bg.secondary, borderRadius: BorderRadius.lg, padding: 16, marginHorizontal: '1%', marginBottom: 12, borderWidth: 1, borderColor: Colors.bg.tertiary },
  actionIconContainer: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  actionLabel: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.text.primary, marginBottom: 4 },
  actionDescription: { fontSize: Typography.sizes.xs, color: Colors.text.secondary },
  statsRow: { flexDirection: 'row', backgroundColor: Colors.bg.secondary, borderRadius: BorderRadius.lg, padding: 16, borderWidth: 1, borderColor: Colors.bg.tertiary },
  statItem: { flex: 1, alignItems: 'center' },
  statItemValue: { fontSize: Typography.sizes.display1, fontWeight: Typography.weights.bold, color: Colors.orange.primary, marginBottom: 4 },
  statItemLabel: { fontSize: Typography.sizes.xs, color: Colors.text.secondary, textAlign: 'center' },
  activityItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.bg.secondary, borderRadius: BorderRadius.md, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: Colors.bg.tertiary },
  activityIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  activityContent: { flex: 1 },
  activityText: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.semibold, color: Colors.text.primary, marginBottom: 2 },
  activityTime: { fontSize: Typography.sizes.xs, color: Colors.text.tertiary },
  healthCard: { backgroundColor: Colors.bg.secondary, borderRadius: BorderRadius.lg, padding: 16, borderWidth: 1, borderColor: Colors.bg.tertiary },
  healthItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.bg.tertiary },
  healthLabel: { flexDirection: 'row', alignItems: 'center' },
  healthLabelText: { fontSize: Typography.sizes.sm, color: Colors.text.secondary, marginLeft: 8 },
  healthStatus: { flexDirection: 'row', alignItems: 'center' },
  healthDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  healthStatusText: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.semibold, color: Colors.text.primary },
});

export default SuperAdminDashboardScreen;
