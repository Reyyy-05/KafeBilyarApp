// src/screens/admin/TableManagementScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors, Typography, BorderRadius } from '../../theme';

interface Table {
  id: string;
  name: string;
  type: 'VIP' | 'Regular';
  capacity: number;
  pricePerHour: number;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  currentBooking?: {
    customerName: string;
    startTime: string;
    endTime: string;
    bookingCode: string;
  };
}

const TableManagementScreen = () => {
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'available' | 'occupied' | 'reserved'>('all');
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Mock tables data
  const [tables] = useState<Table[]>([
    {
      id: '1',
      name: 'Meja VIP 1',
      type: 'VIP',
      capacity: 4,
      pricePerHour: 75000,
      status: 'occupied',
      currentBooking: {
        customerName: 'John Doe',
        startTime: '14:00',
        endTime: '16:00',
        bookingCode: 'BK001234',
      },
    },
    {
      id: '2',
      name: 'Meja VIP 2',
      type: 'VIP',
      capacity: 4,
      pricePerHour: 75000,
      status: 'available',
    },
    {
      id: '3',
      name: 'Meja Reguler 1',
      type: 'Regular',
      capacity: 2,
      pricePerHour: 50000,
      status: 'reserved',
      currentBooking: {
        customerName: 'Jane Smith',
        startTime: '18:00',
        endTime: '20:00',
        bookingCode: 'BK001235',
      },
    },
    {
      id: '4',
      name: 'Meja Reguler 2',
      type: 'Regular',
      capacity: 2,
      pricePerHour: 50000,
      status: 'available',
    },
    {
      id: '5',
      name: 'Meja Reguler 3',
      type: 'Regular',
      capacity: 2,
      pricePerHour: 50000,
      status: 'occupied',
      currentBooking: {
        customerName: 'Bob Johnson',
        startTime: '15:00',
        endTime: '18:00',
        bookingCode: 'BK001236',
      },
    },
    {
      id: '6',
      name: 'Meja Reguler 4',
      type: 'Regular',
      capacity: 2,
      pricePerHour: 50000,
      status: 'available',
    },
    {
      id: '7',
      name: 'Meja Reguler 5',
      type: 'Regular',
      capacity: 2,
      pricePerHour: 50000,
      status: 'maintenance',
    },
    {
      id: '8',
      name: 'Meja VIP 3',
      type: 'VIP',
      capacity: 6,
      pricePerHour: 100000,
      status: 'available',
    },
  ]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return Colors.status.success;
      case 'occupied': return Colors.status.error;
      case 'reserved': return Colors.status.warning;
      case 'maintenance': return Colors.text.tertiary;
      default: return Colors.text.secondary;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available': return 'Available';
      case 'occupied': return 'Occupied';
      case 'reserved': return 'Reserved';
      case 'maintenance': return 'Maintenance';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return 'checkmark-circle';
      case 'occupied': return 'radio-button-on';
      case 'reserved': return 'time';
      case 'maintenance': return 'construct';
      default: return 'ellipse';
    }
  };

  const filteredTables = tables.filter(table => {
    if (filter === 'all') return true;
    return table.status === filter;
  });

  const stats = {
    total: tables.length,
    available: tables.filter(t => t.status === 'available').length,
    occupied: tables.filter(t => t.status === 'occupied').length,
    reserved: tables.filter(t => t.status === 'reserved').length,
  };

  const handleTablePress = (table: Table) => {
    setSelectedTable(table);
    setModalVisible(true);
  };

  const handleStatusChange = (newStatus: 'available' | 'occupied' | 'maintenance') => {
    console.log('Change table', selectedTable?.id, 'to', newStatus);
    setModalVisible(false);
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
        <Text style={styles.headerTitle}>Table Management</Text>
        <Text style={styles.headerSubtitle}>
          {stats.available} of {stats.total} tables available
        </Text>
      </View>

      {/* STATS */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={[styles.statDot, { backgroundColor: Colors.status.success }]} />
          <Text style={styles.statValue}>{stats.available}</Text>
          <Text style={styles.statLabel}>Available</Text>
        </View>
        <View style={styles.statCard}>
          <View style={[styles.statDot, { backgroundColor: Colors.status.error }]} />
          <Text style={styles.statValue}>{stats.occupied}</Text>
          <Text style={styles.statLabel}>Occupied</Text>
        </View>
        <View style={styles.statCard}>
          <View style={[styles.statDot, { backgroundColor: Colors.status.warning }]} />
          <Text style={styles.statValue}>{stats.reserved}</Text>
          <Text style={styles.statLabel}>Reserved</Text>
        </View>
      </View>

      {/* FILTER CHIPS */}
      <View style={styles.filterContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {[
            { id: 'all', label: 'All Tables' },
            { id: 'available', label: 'Available' },
            { id: 'occupied', label: 'Occupied' },
            { id: 'reserved', label: 'Reserved' },
          ].map(item => {
            const isSelected = filter === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.filterChip,
                  isSelected && styles.filterChipSelected,
                ]}
                onPress={() => setFilter(item.id as any)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.filterText,
                  isSelected && styles.filterTextSelected
                ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* TABLES GRID */}
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
        <View style={styles.tablesGrid}>
          {filteredTables.map(table => (
            <TouchableOpacity
              key={table.id}
              style={[
                styles.tableCard,
                table.status === 'occupied' && styles.tableCardOccupied,
                table.status === 'reserved' && styles.tableCardReserved,
                table.status === 'maintenance' && styles.tableCardMaintenance,
              ]}
              onPress={() => handleTablePress(table)}
              activeOpacity={0.8}
            >
              {/* Type Badge */}
              <View style={[
                styles.typeBadge,
                table.type === 'VIP' ? styles.typeBadgeVIP : styles.typeBadgeRegular
              ]}>
                <Ionicons 
                  name={table.type === 'VIP' ? 'star' : 'cafe'} 
                  size={12} 
                  color={table.type === 'VIP' ? Colors.orange.primary : Colors.text.secondary} 
                />
                <Text style={[
                  styles.typeText,
                  table.type === 'VIP' && styles.typeTextVIP
                ]}>
                  {table.type}
                </Text>
              </View>

              {/* Table Icon */}
              <View style={styles.tableIconContainer}>
                <Ionicons 
                  name="cafe" 
                  size={40} 
                  color={getStatusColor(table.status)} 
                />
              </View>

              {/* Table Info */}
              <Text style={styles.tableName}>{table.name}</Text>
              
              <View style={styles.tableDetails}>
                <View style={styles.detailItem}>
                  <Ionicons name="people" size={14} color={Colors.text.secondary} />
                  <Text style={styles.detailText}>{table.capacity} pax</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="cash" size={14} color={Colors.text.secondary} />
                  <Text style={styles.detailText}>{(table.pricePerHour / 1000).toFixed(0)}K/h</Text>
                </View>
              </View>

              {/* Status Badge */}
              <View style={[
                styles.statusBadge,
                { backgroundColor: `${getStatusColor(table.status)}20` }
              ]}>
                <Ionicons 
                  name={getStatusIcon(table.status) as any} 
                  size={12} 
                  color={getStatusColor(table.status)} 
                />
                <Text style={[
                  styles.statusText,
                  { color: getStatusColor(table.status) }
                ]}>
                  {getStatusLabel(table.status)}
                </Text>
              </View>

              {/* Current Booking Info */}
              {table.currentBooking && (
                <View style={styles.bookingInfo}>
                  <Text style={styles.bookingCustomer} numberOfLines={1}>
                    {table.currentBooking.customerName}
                  </Text>
                  <Text style={styles.bookingTime}>
                    {table.currentBooking.startTime} - {table.currentBooking.endTime}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* DETAIL MODAL */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Table Details</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.text.primary} />
              </TouchableOpacity>
            </View>

            {selectedTable && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Table Name</Text>
                  <Text style={styles.modalValue}>{selectedTable.name}</Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Type</Text>
                  <Text style={styles.modalValue}>{selectedTable.type}</Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Capacity</Text>
                  <Text style={styles.modalValue}>{selectedTable.capacity} people</Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Price</Text>
                  <Text style={styles.modalValue}>Rp {selectedTable.pricePerHour.toLocaleString()}/hour</Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Current Status</Text>
                  <Text style={[
                    styles.modalValue, 
                    { color: getStatusColor(selectedTable.status) }
                  ]}>
                    {getStatusLabel(selectedTable.status)}
                  </Text>
                </View>

                {/* Current Booking Details */}
                {selectedTable.currentBooking && (
                  <>
                    <View style={styles.divider} />
                    <Text style={styles.modalSectionTitle}>Current Booking</Text>
                    <View style={styles.modalSection}>
                      <Text style={styles.modalLabel}>Customer</Text>
                      <Text style={styles.modalValue}>{selectedTable.currentBooking.customerName}</Text>
                    </View>
                    <View style={styles.modalSection}>
                      <Text style={styles.modalLabel}>Booking Code</Text>
                      <Text style={styles.modalValue}>{selectedTable.currentBooking.bookingCode}</Text>
                    </View>
                    <View style={styles.modalSection}>
                      <Text style={styles.modalLabel}>Time</Text>
                      <Text style={styles.modalValue}>
                        {selectedTable.currentBooking.startTime} - {selectedTable.currentBooking.endTime}
                      </Text>
                    </View>
                  </>
                )}

                {/* Action Buttons */}
                <View style={styles.modalActions}>
                  {selectedTable.status === 'occupied' && (
                    <TouchableOpacity
                      style={[styles.actionButton, styles.availableButton]}
                      onPress={() => handleStatusChange('available')}
                    >
                      <Ionicons name="checkmark-circle" size={20} color="#fff" />
                      <Text style={styles.actionButtonText}>Set Available</Text>
                    </TouchableOpacity>
                  )}
                  {selectedTable.status === 'available' && (
                    <>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.occupiedButton]}
                        onPress={() => handleStatusChange('occupied')}
                      >
                        <Ionicons name="radio-button-on" size={20} color="#fff" />
                        <Text style={styles.actionButtonText}>Set Occupied</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.maintenanceButton]}
                        onPress={() => handleStatusChange('maintenance')}
                      >
                        <Ionicons name="construct" size={20} color="#fff" />
                        <Text style={styles.actionButtonText}>Maintenance</Text>
                      </TouchableOpacity>
                    </>
                  )}
                  {selectedTable.status === 'maintenance' && (
                    <TouchableOpacity
                      style={[styles.actionButton, styles.availableButton]}
                      onPress={() => handleStatusChange('available')}
                    >
                      <Ionicons name="checkmark-circle" size={20} color="#fff" />
                      <Text style={styles.actionButtonText}>Set Available</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
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

  // STATS
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.bg.secondary,
    borderRadius: BorderRadius.md,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.bg.tertiary,
  },
  statDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  statValue: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.secondary,
  },

  // FILTER
  filterContainer: {
    paddingBottom: 16,
  },
  filterScroll: {
    paddingHorizontal: 20,
  },
  filterChip: {
    backgroundColor: Colors.bg.secondary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: Colors.bg.tertiary,
  },
  filterChipSelected: {
    backgroundColor: Colors.orange.primary,
    borderColor: Colors.orange.primary,
  },
  filterText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.secondary,
  },
  filterTextSelected: {
    color: Colors.text.inverse,
  },

  // TABLES GRID
  tablesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
  },
  tableCard: {
    width: '48%',
    backgroundColor: Colors.bg.secondary,
    borderRadius: BorderRadius.lg,
    padding: 12,
    marginHorizontal: '1%',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: Colors.status.success,
    position: 'relative',
  },
  tableCardOccupied: {
    borderColor: Colors.status.error,
  },
  tableCardReserved: {
    borderColor: Colors.status.warning,
  },
  tableCardMaintenance: {
    borderColor: Colors.text.tertiary,
    opacity: 0.7,
  },
  typeBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg.elevated,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeBadgeVIP: {
    backgroundColor: `${Colors.orange.primary}20`,
  },
  typeBadgeRegular: {
    backgroundColor: Colors.bg.elevated,
  },
  typeText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  typeTextVIP: {
    color: Colors.orange.primary,
  },
  tableIconContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  tableName: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  tableDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
    marginBottom: 8,
  },
  statusText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    marginLeft: 4,
  },
  bookingInfo: {
    backgroundColor: Colors.bg.elevated,
    borderRadius: BorderRadius.sm,
    padding: 8,
  },
  bookingCustomer: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  bookingTime: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.tertiary,
  },

  // MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.bg.primary,
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.bg.tertiary,
  },
  modalTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
  },
  modalBody: {
    padding: 20,
  },
  modalSection: {
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  modalValue: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.bg.tertiary,
    marginVertical: 16,
  },
  modalSectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginBottom: 12,
  },
  modalActions: {
    marginTop: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    marginBottom: 10,
  },
  availableButton: {
    backgroundColor: Colors.status.success,
  },
  occupiedButton: {
    backgroundColor: Colors.status.error,
  },
  maintenanceButton: {
    backgroundColor: Colors.text.tertiary,
  },
  actionButtonText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: '#fff',
    marginLeft: 8,
  },
});

export default TableManagementScreen;
