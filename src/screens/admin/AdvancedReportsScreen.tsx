// src/screens/admin/AdvancedReportsScreen.tsx
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

const AdvancedReportsScreen = () => {
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'year'>('month');

  // Mock comprehensive data
  const data = {
    revenue: {
      total: 67500000,
      growth: 15.3,
      vip: 28000000,
      regular: 39500000,
    },
    bookings: {
      total: 356,
      growth: 8.7,
      vip: 98,
      regular: 258,
      avgDuration: 2.3,
    },
    menu: {
      total: 1340,
      revenue: 18500000,
      avgOrderValue: 13805,
      topCategories: [
        { name: 'Drinks', orders: 756, revenue: 7560000 },
        { name: 'Food', orders: 387, revenue: 9675000 },
        { name: 'Snacks', orders: 197, revenue: 1265000 },
      ],
    },
    tables: {
      occupancyRate: 68.5,
      avgSessionTime: 2.8,
      vipUtilization: 72.3,
      regularUtilization: 66.2,
    },
    customers: {
      total: 1248,
      newThisMonth: 87,
      returning: 68,
      churnRate: 12.3,
    },
    peakHours: [
      { hour: '18:00-20:00', bookings: 89, revenue: 15200000 },
      { hour: '20:00-22:00', bookings: 76, revenue: 12800000 },
      { hour: '14:00-16:00', bookings: 52, revenue: 8900000 },
    ],
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
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
        <Text style={styles.headerTitle}>Advanced Reports</Text>
        <Text style={styles.headerSubtitle}>
          Detailed analytics & insights
        </Text>
      </View>

      {/* PERIOD SELECTOR */}
      <View style={styles.periodContainer}>
        {[
          { id: 'today', label: 'Today', icon: 'today' },
          { id: 'week', label: 'Week', icon: 'calendar' },
          { id: 'month', label: 'Month', icon: 'calendar-outline' },
          { id: 'year', label: 'Year', icon: 'calendar-clear' },
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
                size={16} 
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
        {/* REVENUE ANALYTICS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Revenue Analytics</Text>
          
          <View style={styles.bigCard}>
            <View style={styles.bigCardHeader}>
              <View>
                <Text style={styles.bigCardLabel}>Total Revenue</Text>
                <Text style={styles.bigCardValue}>Rp {(data.revenue.total / 1000000).toFixed(1)}M</Text>
              </View>
              <View style={styles.growthBadge}>
                <Ionicons name="trending-up" size={16} color={Colors.status.success} />
                <Text style={styles.growthText}>+{data.revenue.growth}%</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.splitRow}>
              <View style={styles.splitItem}>
                <View style={styles.splitIcon}>
                  <Ionicons name="star" size={20} color={Colors.orange.primary} />
                </View>
                <Text style={styles.splitLabel}>VIP Tables</Text>
                <Text style={styles.splitValue}>Rp {(data.revenue.vip / 1000000).toFixed(1)}M</Text>
              </View>
              <View style={styles.splitSeparator} />
              <View style={styles.splitItem}>
                <View style={styles.splitIcon}>
                  <Ionicons name="cafe" size={20} color={Colors.status.info} />
                </View>
                <Text style={styles.splitLabel}>Regular Tables</Text>
                <Text style={styles.splitValue}>Rp {(data.revenue.regular / 1000000).toFixed(1)}M</Text>
              </View>
            </View>
          </View>
        </View>

        {/* BOOKING ANALYTICS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking Analytics</Text>
          
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <View style={[styles.metricIcon, { backgroundColor: `${Colors.orange.primary}20` }]}>
                <Ionicons name="calendar" size={24} color={Colors.orange.primary} />
              </View>
              <Text style={styles.metricValue}>{data.bookings.total}</Text>
              <Text style={styles.metricLabel}>Total Bookings</Text>
              <View style={styles.metricGrowth}>
                <Ionicons name="arrow-up" size={12} color={Colors.status.success} />
                <Text style={styles.metricGrowthText}>+{data.bookings.growth}%</Text>
              </View>
            </View>

            <View style={styles.metricCard}>
              <View style={[styles.metricIcon, { backgroundColor: `${Colors.status.info}20` }]}>
                <Ionicons name="time" size={24} color={Colors.status.info} />
              </View>
              <Text style={styles.metricValue}>{data.bookings.avgDuration}h</Text>
              <Text style={styles.metricLabel}>Avg Duration</Text>
            </View>

            <View style={styles.metricCard}>
              <View style={[styles.metricIcon, { backgroundColor: `${Colors.status.warning}20` }]}>
                <Ionicons name="star" size={24} color={Colors.status.warning} />
              </View>
              <Text style={styles.metricValue}>{data.bookings.vip}</Text>
              <Text style={styles.metricLabel}>VIP Bookings</Text>
            </View>

            <View style={styles.metricCard}>
              <View style={[styles.metricIcon, { backgroundColor: `${Colors.status.success}20` }]}>
                <Ionicons name="cafe" size={24} color={Colors.status.success} />
              </View>
              <Text style={styles.metricValue}>{data.bookings.regular}</Text>
              <Text style={styles.metricLabel}>Regular Bookings</Text>
            </View>
          </View>
        </View>

        {/* MENU ANALYTICS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Menu Performance</Text>
          
          <View style={styles.menuCard}>
            <View style={styles.menuCardHeader}>
              <View style={styles.menuStat}>
                <Text style={styles.menuStatLabel}>Total Orders</Text>
                <Text style={styles.menuStatValue}>{data.menu.total}</Text>
              </View>
              <View style={styles.menuStat}>
                <Text style={styles.menuStatLabel}>Menu Revenue</Text>
                <Text style={styles.menuStatValue}>Rp {(data.menu.revenue / 1000000).toFixed(1)}M</Text>
              </View>
              <View style={styles.menuStat}>
                <Text style={styles.menuStatLabel}>Avg Order Value</Text>
                <Text style={styles.menuStatValue}>Rp {(data.menu.avgOrderValue / 1000).toFixed(0)}K</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <Text style={styles.subsectionTitle}>Top Categories</Text>
            {data.menu.topCategories.map((cat, index) => (
              <View key={index} style={styles.categoryItem}>
                <View style={styles.categoryRank}>
                  <Text style={styles.categoryRankText}>#{index + 1}</Text>
                </View>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>{cat.name}</Text>
                  <Text style={styles.categoryStats}>
                    {cat.orders} orders • Rp {(cat.revenue / 1000000).toFixed(1)}M
                  </Text>
                </View>
                <View style={styles.categoryBar}>
                  <View 
                    style={[
                      styles.categoryBarFill,
                      { width: `${(cat.revenue / data.menu.revenue) * 100}%` }
                    ]} 
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* TABLE UTILIZATION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Table Utilization</Text>
          
          <View style={styles.utilizationCard}>
            <View style={styles.utilizationHeader}>
              <Text style={styles.utilizationTitle}>Overall Occupancy Rate</Text>
              <Text style={styles.utilizationPercentage}>{data.tables.occupancyRate}%</Text>
            </View>
            <View style={styles.utilizationBar}>
              <View style={[styles.utilizationFill, { width: `${data.tables.occupancyRate}%` }]} />
            </View>

            <View style={styles.utilizationGrid}>
              <View style={styles.utilizationItem}>
                <Ionicons name="star" size={20} color={Colors.orange.primary} />
                <Text style={styles.utilizationLabel}>VIP Tables</Text>
                <Text style={styles.utilizationValue}>{data.tables.vipUtilization}%</Text>
              </View>
              <View style={styles.utilizationItem}>
                <Ionicons name="cafe" size={20} color={Colors.status.info} />
                <Text style={styles.utilizationLabel}>Regular Tables</Text>
                <Text style={styles.utilizationValue}>{data.tables.regularUtilization}%</Text>
              </View>
              <View style={styles.utilizationItem}>
                <Ionicons name="time" size={20} color={Colors.status.success} />
                <Text style={styles.utilizationLabel}>Avg Session</Text>
                <Text style={styles.utilizationValue}>{data.tables.avgSessionTime}h</Text>
              </View>
            </View>
          </View>
        </View>

        {/* CUSTOMER INSIGHTS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Insights</Text>
          
          <View style={styles.insightsGrid}>
            <View style={styles.insightCard}>
              <Ionicons name="people" size={32} color={Colors.orange.primary} />
              <Text style={styles.insightValue}>{data.customers.total}</Text>
              <Text style={styles.insightLabel}>Total Customers</Text>
            </View>
            <View style={styles.insightCard}>
              <Ionicons name="person-add" size={32} color={Colors.status.success} />
              <Text style={styles.insightValue}>+{data.customers.newThisMonth}</Text>
              <Text style={styles.insightLabel}>New This Month</Text>
            </View>
            <View style={styles.insightCard}>
              <Ionicons name="repeat" size={32} color={Colors.status.info} />
              <Text style={styles.insightValue}>{data.customers.returning}%</Text>
              <Text style={styles.insightLabel}>Returning Rate</Text>
            </View>
            <View style={styles.insightCard}>
              <Ionicons name="exit" size={32} color={Colors.status.error} />
              <Text style={styles.insightValue}>{data.customers.churnRate}%</Text>
              <Text style={styles.insightLabel}>Churn Rate</Text>
            </View>
          </View>
        </View>

        {/* PEAK HOURS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Peak Hours Analysis</Text>
          
          {data.peakHours.map((peak, index) => (
            <View key={index} style={styles.peakCard}>
              <View style={styles.peakRank}>
                <Text style={styles.peakRankText}>#{index + 1}</Text>
              </View>
              <View style={styles.peakInfo}>
                <Text style={styles.peakHour}>{peak.hour}</Text>
                <View style={styles.peakStats}>
                  <View style={styles.peakStat}>
                    <Ionicons name="calendar" size={14} color={Colors.text.secondary} />
                    <Text style={styles.peakStatText}>{peak.bookings} bookings</Text>
                  </View>
                  <View style={styles.peakStat}>
                    <Ionicons name="cash" size={14} color={Colors.orange.primary} />
                    <Text style={styles.peakStatText}>Rp {(peak.revenue / 1000000).toFixed(1)}M</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* EXPORT OPTIONS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Export Reports</Text>
          
          <TouchableOpacity style={styles.exportButton} activeOpacity={0.8}>
            <View style={styles.exportIcon}>
              <Ionicons name="document-text" size={24} color={Colors.orange.primary} />
            </View>
            <View style={styles.exportContent}>
              <Text style={styles.exportTitle}>Export as PDF</Text>
              <Text style={styles.exportSubtitle}>Comprehensive report with charts</Text>
            </View>
            <Ionicons name="download" size={24} color={Colors.text.secondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.exportButton} activeOpacity={0.8}>
            <View style={styles.exportIcon}>
              <Ionicons name="grid" size={24} color={Colors.status.success} />
            </View>
            <View style={styles.exportContent}>
              <Text style={styles.exportTitle}>Export as Excel</Text>
              <Text style={styles.exportSubtitle}>Raw data for analysis</Text>
            </View>
            <Ionicons name="download" size={24} color={Colors.text.secondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.exportButton} activeOpacity={0.8}>
            <View style={styles.exportIcon}>
              <Ionicons name="mail" size={24} color={Colors.status.info} />
            </View>
            <View style={styles.exportContent}>
              <Text style={styles.exportTitle}>Email Report</Text>
              <Text style={styles.exportSubtitle}>Send to stakeholders</Text>
            </View>
            <Ionicons name="send" size={24} color={Colors.text.secondary} />
          </TouchableOpacity>
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
  backButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.bg.elevated, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  headerTitle: { fontSize: Typography.sizes.xl, fontWeight: Typography.weights.bold, color: Colors.text.primary, marginBottom: 4 },
  headerSubtitle: { fontSize: Typography.sizes.sm, color: Colors.text.secondary },
  periodContainer: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 16 },
  periodChip: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.bg.secondary, paddingVertical: 10, borderRadius: BorderRadius.md, marginHorizontal: 4, borderWidth: 1, borderColor: Colors.bg.tertiary },
  periodChipSelected: { backgroundColor: Colors.bg.tertiary, borderColor: Colors.orange.primary, borderWidth: 2 },
  periodText: { fontSize: Typography.sizes.xs, fontWeight: Typography.weights.semibold, color: Colors.text.secondary, marginLeft: 4 },
  periodTextSelected: { color: Colors.orange.primary },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: { fontSize: Typography.sizes.lg, fontWeight: Typography.weights.bold, color: Colors.text.primary, marginBottom: 16 },
  subsectionTitle: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.text.primary, marginBottom: 12 },
  bigCard: { backgroundColor: Colors.bg.secondary, borderRadius: BorderRadius.xl, padding: 20, borderWidth: 1, borderColor: Colors.bg.tertiary },
  bigCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bigCardLabel: { fontSize: Typography.sizes.sm, color: Colors.text.secondary, marginBottom: 8 },
  bigCardValue: { fontSize: Typography.sizes.display1, fontWeight: Typography.weights.bold, color: Colors.text.primary },
  growthBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: `${Colors.status.success}20`, paddingHorizontal: 12, paddingVertical: 8, borderRadius: BorderRadius.md },
  growthText: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.status.success, marginLeft: 6 },
  divider: { height: 1, backgroundColor: Colors.bg.tertiary, marginVertical: 16 },
  splitRow: { flexDirection: 'row' },
  splitItem: { flex: 1, alignItems: 'center' },
  splitIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.bg.elevated, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  splitLabel: { fontSize: Typography.sizes.sm, color: Colors.text.secondary, marginBottom: 6 },
  splitValue: { fontSize: Typography.sizes.lg, fontWeight: Typography.weights.bold, color: Colors.text.primary },
  splitSeparator: { width: 1, backgroundColor: Colors.bg.tertiary, marginHorizontal: 16 },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 },
  metricCard: { width: '48%', backgroundColor: Colors.bg.secondary, borderRadius: BorderRadius.lg, padding: 16, marginHorizontal: '1%', marginBottom: 12, borderWidth: 1, borderColor: Colors.bg.tertiary, alignItems: 'center' },
  metricIcon: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  metricValue: { fontSize: Typography.sizes.display1, fontWeight: Typography.weights.bold, color: Colors.text.primary, marginBottom: 4 },
  metricLabel: { fontSize: Typography.sizes.sm, color: Colors.text.secondary, textAlign: 'center' },
  metricGrowth: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  metricGrowthText: { fontSize: Typography.sizes.sm, color: Colors.status.success, marginLeft: 4 },
  menuCard: { backgroundColor: Colors.bg.secondary, borderRadius: BorderRadius.xl, padding: 20, borderWidth: 1, borderColor: Colors.bg.tertiary },
  menuCardHeader: { flexDirection: 'row', justifyContent: 'space-around' },
  menuStat: { alignItems: 'center' },
  menuStatLabel: { fontSize: Typography.sizes.xs, color: Colors.text.secondary, marginBottom: 6 },
  menuStatValue: { fontSize: Typography.sizes.lg, fontWeight: Typography.weights.bold, color: Colors.text.primary },
  categoryItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  categoryRank: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.orange.primary, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  categoryRankText: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.bold, color: Colors.text.inverse },
  categoryInfo: { flex: 1, marginRight: 12 },
  categoryName: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.text.primary, marginBottom: 2 },
  categoryStats: { fontSize: Typography.sizes.xs, color: Colors.text.secondary },
  categoryBar: { width: 60, height: 6, backgroundColor: Colors.bg.elevated, borderRadius: 3, overflow: 'hidden' },
  categoryBarFill: { height: '100%', backgroundColor: Colors.orange.primary, borderRadius: 3 },
  utilizationCard: { backgroundColor: Colors.bg.secondary, borderRadius: BorderRadius.xl, padding: 20, borderWidth: 1, borderColor: Colors.bg.tertiary },
  utilizationHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  utilizationTitle: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.semibold, color: Colors.text.primary },
  utilizationPercentage: { fontSize: Typography.sizes.display1, fontWeight: Typography.weights.bold, color: Colors.orange.primary },
  utilizationBar: { height: 12, backgroundColor: Colors.bg.elevated, borderRadius: 6, overflow: 'hidden', marginBottom: 20 },
  utilizationFill: { height: '100%', backgroundColor: Colors.orange.primary, borderRadius: 6 },
  utilizationGrid: { flexDirection: 'row', justifyContent: 'space-around' },
  utilizationItem: { alignItems: 'center' },
  utilizationLabel: { fontSize: Typography.sizes.xs, color: Colors.text.secondary, marginVertical: 6 },
  utilizationValue: { fontSize: Typography.sizes.lg, fontWeight: Typography.weights.bold, color: Colors.text.primary },
  insightsGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 },
  insightCard: { width: '48%', backgroundColor: Colors.bg.secondary, borderRadius: BorderRadius.lg, padding: 16, marginHorizontal: '1%', marginBottom: 12, alignItems: 'center', borderWidth: 1, borderColor: Colors.bg.tertiary },
  insightValue: { fontSize: Typography.sizes.display1, fontWeight: Typography.weights.bold, color: Colors.text.primary, marginVertical: 8 },
  insightLabel: { fontSize: Typography.sizes.sm, color: Colors.text.secondary, textAlign: 'center' },
  peakCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.bg.secondary, borderRadius: BorderRadius.lg, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: Colors.bg.tertiary },
  peakRank: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.orange.primary, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  peakRankText: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.text.inverse },
  peakInfo: { flex: 1 },
  peakHour: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.text.primary, marginBottom: 6 },
  peakStats: { flexDirection: 'row' },
  peakStat: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
  peakStatText: { fontSize: Typography.sizes.sm, color: Colors.text.secondary, marginLeft: 6 },
  exportButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.bg.secondary, borderRadius: BorderRadius.lg, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: Colors.bg.tertiary },
  exportIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.bg.elevated, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  exportContent: { flex: 1 },
  exportTitle: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.text.primary, marginBottom: 4 },
  exportSubtitle: { fontSize: Typography.sizes.sm, color: Colors.text.secondary },
});

export default AdvancedReportsScreen;
