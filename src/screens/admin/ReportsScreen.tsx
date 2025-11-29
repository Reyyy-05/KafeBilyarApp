// src/screens/admin/ReportsScreen.tsx
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
import { Colors, Typography, BorderRadius } from '../../theme';

const ReportsScreen = () => {
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');

  // Mock data
  const todayData = {
    revenue: 2450000,
    bookings: 12,
    menuOrders: 45,
    tables: { vip: 3, regular: 9 },
    popularItems: [
      { name: 'Es Teh Manis', orders: 25, revenue: 125000 },
      { name: 'Nasi Goreng', orders: 12, revenue: 300000 },
      { name: 'Kopi Hitam', orders: 15, revenue: 150000 },
    ],
    hourlyRevenue: [
      { hour: '10:00', amount: 150000 },
      { hour: '12:00', amount: 300000 },
      { hour: '14:00', amount: 450000 },
      { hour: '16:00', amount: 600000 },
      { hour: '18:00', amount: 950000 },
      { hour: '20:00', amount: 2450000 },
    ],
  };

  const weekData = {
    revenue: 15680000,
    bookings: 84,
    menuOrders: 312,
    tables: { vip: 21, regular: 63 },
    popularItems: [
      { name: 'Es Teh Manis', orders: 178, revenue: 890000 },
      { name: 'Nasi Goreng', orders: 89, revenue: 2225000 },
      { name: 'Mie Goreng', orders: 76, revenue: 1520000 },
    ],
    dailyRevenue: [
      { day: 'Mon', amount: 1850000 },
      { day: 'Tue', amount: 2100000 },
      { day: 'Wed', amount: 2350000 },
      { day: 'Thu', amount: 2200000 },
      { day: 'Fri', amount: 2680000 },
      { day: 'Sat', amount: 2500000 },
      { day: 'Sun', amount: 2000000 },
    ],
  };

  const monthData = {
    revenue: 67500000,
    bookings: 356,
    menuOrders: 1340,
    tables: { vip: 98, regular: 258 },
    popularItems: [
      { name: 'Es Teh Manis', orders: 756, revenue: 3780000 },
      { name: 'Nasi Goreng', orders: 387, revenue: 9675000 },
      { name: 'Mie Goreng', orders: 298, revenue: 5960000 },
    ],
    weeklyRevenue: [
      { week: 'Week 1', amount: 15680000 },
      { week: 'Week 2', amount: 17230000 },
      { week: 'Week 3', amount: 16890000 },
      { week: 'Week 4', amount: 17700000 },
    ],
  };

  const currentData = 
    selectedPeriod === 'today' ? todayData :
    selectedPeriod === 'week' ? weekData : monthData;

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const getMaxRevenue = () => {
    if (selectedPeriod === 'today') {
      return Math.max(...todayData.hourlyRevenue.map(h => h.amount));
    } else if (selectedPeriod === 'week') {
      return Math.max(...weekData.dailyRevenue.map(d => d.amount));
    } else {
      return Math.max(...monthData.weeklyRevenue.map(w => w.amount));
    }
  };

  const maxRevenue = getMaxRevenue();

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
        <Text style={styles.headerTitle}>Reports & Analytics</Text>
        <Text style={styles.headerSubtitle}>
          Business performance overview
        </Text>
      </View>

      {/* PERIOD SELECTOR */}
      <View style={styles.periodContainer}>
        {[
          { id: 'today', label: 'Today', icon: 'today' },
          { id: 'week', label: 'This Week', icon: 'calendar' },
          { id: 'month', label: 'This Month', icon: 'calendar-outline' },
        ].map(period => {
          const isSelected = selectedPeriod === period.id;
          return (
            <TouchableOpacity
              key={period.id}
              style={[styles.periodChip, isSelected && styles.periodChipSelected]}
              onPress={() => setSelectedPeriod(period.id as any)}
              activeOpacity={0.7}
            >
              <Ionicons 
                name={period.icon as any} 
                size={18} 
                color={isSelected ? Colors.orange.primary : Colors.text.secondary} 
              />
              <Text style={[styles.periodText, isSelected && styles.periodTextSelected]}>
                {period.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.orange.primary} />
        }
      >
        {/* KEY METRICS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Metrics</Text>
          
          <View style={styles.metricsGrid}>
            {/* Revenue Card */}
            <View style={[styles.metricCard, styles.metricCardLarge]}>
              <View style={styles.metricIconContainer}>
                <Ionicons name="cash" size={32} color={Colors.orange.primary} />
              </View>
              <Text style={styles.metricValue}>
                Rp {(currentData.revenue / 1000000).toFixed(1)}M
              </Text>
              <Text style={styles.metricLabel}>Total Revenue</Text>
              <View style={styles.metricChange}>
                <Ionicons name="trending-up" size={14} color={Colors.status.success} />
                <Text style={styles.metricChangeText}>+15.3%</Text>
              </View>
            </View>

            {/* Bookings Card */}
            <View style={styles.metricCard}>
              <View style={[styles.metricIconContainer, { backgroundColor: `${Colors.status.info}20` }]}>
                <Ionicons name="calendar" size={24} color={Colors.status.info} />
              </View>
              <Text style={styles.metricValue}>{currentData.bookings}</Text>
              <Text style={styles.metricLabel}>Bookings</Text>
            </View>

            {/* Menu Orders Card */}
            <View style={styles.metricCard}>
              <View style={[styles.metricIconContainer, { backgroundColor: `${Colors.status.success}20` }]}>
                <Ionicons name="restaurant" size={24} color={Colors.status.success} />
              </View>
              <Text style={styles.metricValue}>{currentData.menuOrders}</Text>
              <Text style={styles.metricLabel}>Menu Orders</Text>
            </View>

            {/* VIP Tables */}
            <View style={styles.metricCard}>
              <View style={[styles.metricIconContainer, { backgroundColor: `${Colors.status.warning}20` }]}>
                <Ionicons name="star" size={24} color={Colors.status.warning} />
              </View>
              <Text style={styles.metricValue}>{currentData.tables.vip}</Text>
              <Text style={styles.metricLabel}>VIP Tables</Text>
            </View>

            {/* Regular Tables */}
            <View style={styles.metricCard}>
              <View style={[styles.metricIconContainer, { backgroundColor: `${Colors.text.secondary}20` }]}>
                <Ionicons name="cafe" size={24} color={Colors.text.secondary} />
              </View>
              <Text style={styles.metricValue}>{currentData.tables.regular}</Text>
              <Text style={styles.metricLabel}>Regular Tables</Text>
            </View>
          </View>
        </View>

        {/* REVENUE CHART */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {selectedPeriod === 'today' ? 'Hourly Revenue' :
             selectedPeriod === 'week' ? 'Daily Revenue' : 'Weekly Revenue'}
          </Text>
          
          <View style={styles.chartContainer}>
            {selectedPeriod === 'today' && todayData.hourlyRevenue.map((item, index) => {
              const heightPercent = (item.amount / maxRevenue) * 100;
              return (
                <View key={index} style={styles.chartItem}>
                  <View style={styles.chartBarContainer}>
                    <View style={[styles.chartBar, { height: `${heightPercent}%` }]}>
                      <Text style={styles.chartBarValue}>
                        {(item.amount / 1000).toFixed(0)}K
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.chartLabel}>{item.hour}</Text>
                </View>
              );
            })}
            {selectedPeriod === 'week' && weekData.dailyRevenue.map((item, index) => {
              const heightPercent = (item.amount / maxRevenue) * 100;
              return (
                <View key={index} style={styles.chartItem}>
                  <View style={styles.chartBarContainer}>
                    <View style={[styles.chartBar, { height: `${heightPercent}%` }]}>
                      <Text style={styles.chartBarValue}>
                        {(item.amount / 1000).toFixed(0)}K
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.chartLabel}>{item.day}</Text>
                </View>
              );
            })}
            {selectedPeriod === 'month' && monthData.weeklyRevenue.map((item, index) => {
              const heightPercent = (item.amount / maxRevenue) * 100;
              return (
                <View key={index} style={styles.chartItem}>
                  <View style={styles.chartBarContainer}>
                    <View style={[styles.chartBar, { height: `${heightPercent}%` }]}>
                      <Text style={styles.chartBarValue}>
                        {(item.amount / 1000).toFixed(0)}K
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.chartLabel}>{item.week}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* POPULAR ITEMS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Selling Items</Text>
          
          {currentData.popularItems.map((item, index) => (
            <View key={index} style={styles.popularItem}>
              <View style={styles.popularRank}>
                <Text style={styles.popularRankText}>#{index + 1}</Text>
              </View>
              <View style={styles.popularInfo}>
                <Text style={styles.popularName}>{item.name}</Text>
                <Text style={styles.popularStats}>
                  {item.orders} orders • Rp {item.revenue.toLocaleString()}
                </Text>
              </View>
              <View style={styles.popularBar}>
                <View 
                  style={[
                    styles.popularBarFill,
                    { width: `${(item.orders / currentData.popularItems[0].orders) * 100}%` }
                  ]} 
                />
              </View>
            </View>
          ))}
        </View>

        {/* EXPORT & DOWNLOAD */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
            <View style={styles.actionIcon}>
              <Ionicons name="download" size={24} color={Colors.orange.primary} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Download Report</Text>
              <Text style={styles.actionSubtitle}>Export as PDF or Excel</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.text.secondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
            <View style={styles.actionIcon}>
              <Ionicons name="share-social" size={24} color={Colors.status.info} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Share Report</Text>
              <Text style={styles.actionSubtitle}>Send via email or WhatsApp</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.text.secondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
            <View style={styles.actionIcon}>
              <Ionicons name="calendar" size={24} color={Colors.status.success} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Custom Date Range</Text>
              <Text style={styles.actionSubtitle}>Select specific period</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.text.secondary} />
          </TouchableOpacity>
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

  // PERIOD SELECTOR
  periodContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  periodChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bg.secondary,
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: Colors.bg.tertiary,
  },
  periodChipSelected: {
    backgroundColor: Colors.bg.tertiary,
    borderColor: Colors.orange.primary,
    borderWidth: 2,
  },
  periodText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.secondary,
    marginLeft: 6,
  },
  periodTextSelected: {
    color: Colors.orange.primary,
  },

  // SECTION
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginBottom: 16,
  },

  // METRICS
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  metricCard: {
    width: '48%',
    backgroundColor: Colors.bg.secondary,
    borderRadius: BorderRadius.lg,
    padding: 16,
    marginHorizontal: '1%',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.bg.tertiary,
    alignItems: 'center',
  },
  metricCardLarge: {
    width: '98%',
  },
  metricIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: `${Colors.orange.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricValue: {
    fontSize: Typography.sizes.display1,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
  },
  metricChange: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  metricChangeText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.status.success,
    marginLeft: 4,
  },

  // CHART
  chartContainer: {
    backgroundColor: Colors.bg.secondary,
    borderRadius: BorderRadius.lg,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 200,
    borderWidth: 1,
    borderColor: Colors.bg.tertiary,
  },
  chartItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },
  chartBarContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  chartBar: {
    width: '100%',
    backgroundColor: Colors.orange.primary,
    borderTopLeftRadius: BorderRadius.sm,
    borderTopRightRadius: BorderRadius.sm,
    minHeight: 20,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 4,
  },
  chartBarValue: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.text.inverse,
  },
  chartLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.secondary,
    marginTop: 8,
    textAlign: 'center',
  },

  // POPULAR ITEMS
  popularItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg.secondary,
    borderRadius: BorderRadius.lg,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.bg.tertiary,
  },
  popularRank: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.orange.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  popularRankText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.text.inverse,
  },
  popularInfo: {
    flex: 1,
    marginRight: 12,
  },
  popularName: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  popularStats: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.secondary,
  },
  popularBar: {
    width: 80,
    height: 6,
    backgroundColor: Colors.bg.elevated,
    borderRadius: 3,
    overflow: 'hidden',
  },
  popularBarFill: {
    height: '100%',
    backgroundColor: Colors.orange.primary,
    borderRadius: 3,
  },

  // ACTION BUTTONS
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg.secondary,
    borderRadius: BorderRadius.lg,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.bg.tertiary,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.bg.elevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
  },
});

export default ReportsScreen;
