// src/screens/admin/BookingManagementScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors, Typography, BorderRadius } from '../../theme';

interface Booking {
  id: string;
  bookingCode: string;
  customerName: string;
  table: string;
  date: string;
  time: string;
  duration: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  menuItems?: number;
}

const BookingManagementScreen = () => {
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Mock bookings data
  const [bookings] = useState<Booking[]>([
    {
      id: '1',
      bookingCode: 'BK001234',
      customerName: 'John Doe',
      table: 'Meja VIP 1',
      date: '2025-11-29',
      time: '14:00',
      duration: 2,
      totalPrice: 150000,
      status: 'pending',
      menuItems: 3,
    },
    {
      id: '2',
      bookingCode: 'BK001235',
      customerName: 'Jane Smith',
      table: 'Meja Reguler 3',
      date: '2025-11-29',
      time: '15:30',
      duration: 3,
      totalPrice: 225000,
      status: 'confirmed',
      menuItems: 5,
    },
    {
      id: '3',
      bookingCode: 'BK001236',
      customerName: 'Bob Johnson',
      table: 'Meja VIP 2',
      date: '2025-11-29',
      time: '18:00',
      duration: 1,
      totalPrice: 100000,
      status: 'pending',
      menuItems: 0,
    },
    {
      id: '4',
      bookingCode: 'BK001237',
      customerName: 'Alice Brown',
      table: 'Meja Reguler 5',
      date: '2025-11-28',
      time: '20:00',
      duration: 2,
      totalPrice: 180000,
      status: 'completed',
      menuItems: 4,
    },
  ]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return Colors.status.success;
      case 'pending': return Colors.status.warning;
      case 'completed': return Colors.status.info;
      case 'cancelled': return Colors.status.error;
      default: return Colors.text.secondary;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Dikonfirmasi';
      case 'pending': return 'Menunggu';
      case 'completed': return 'Selesai';
      case 'cancelled': return 'Dibatalkan';
      default: return status;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesFilter = filter === 'all' || booking.status === filter;
    const matchesSearch = 
      booking.bookingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.table.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleBookingPress = (booking: Booking) => {
    setSelectedBooking(booking);
    setModalVisible(true);
  };

  const handleUpdateStatus = (newStatus: 'confirmed' | 'completed' | 'cancelled') => {
    console.log('Update booking', selectedBooking?.id, 'to', newStatus);
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
        <Text style={styles.headerTitle}>Booking Management</Text>
        <Text style={styles.headerSubtitle}>
          {filteredBookings.length} bookings found
        </Text>
      </View>

      {/* SEARCH BAR */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={Colors.text.secondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by code, name, or table..."
            placeholderTextColor={Colors.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={Colors.text.secondary} />
            </TouchableOpacity>
          )}
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
            { id: 'all', label: 'All', icon: 'apps' },
            { id: 'pending', label: 'Pending', icon: 'time' },
            { id: 'confirmed', label: 'Confirmed', icon: 'checkmark-circle' },
            { id: 'completed', label: 'Completed', icon: 'checkmark-done' },
          ].map(item => {
            const isSelected = filter === item.id;
            const count = bookings.filter(b => item.id === 'all' || b.status === item.id).length;
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
                <Ionicons 
                  name={item.icon as any} 
                  size={18} 
                  color={isSelected ? Colors.orange.primary : Colors.text.secondary} 
                />
                <Text style={[
                  styles.filterText,
                  isSelected && styles.filterTextSelected
                ]}>
                  {item.label} ({count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* BOOKINGS LIST */}
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
        {filteredBookings.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color={Colors.text.tertiary} />
            <Text style={styles.emptyTitle}>No bookings found</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery ? 'Try different search terms' : 'No bookings in this category'}
            </Text>
          </View>
        ) : (
          <View style={styles.bookingsList}>
            {filteredBookings.map(booking => (
              <TouchableOpacity
                key={booking.id}
                style={styles.bookingCard}
                onPress={() => handleBookingPress(booking)}
                activeOpacity={0.8}
              >
                {/* Header */}
                <View style={styles.bookingHeader}>
                  <View style={styles.bookingCodeContainer}>
                    <Ionicons name="qr-code" size={16} color={Colors.orange.primary} />
                    <Text style={styles.bookingCode}>{booking.bookingCode}</Text>
                  </View>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: `${getStatusColor(booking.status)}20` }
                  ]}>
                    <View style={[
                      styles.statusDot,
                      { backgroundColor: getStatusColor(booking.status) }
                    ]} />
                    <Text style={[
                      styles.statusText,
                      { color: getStatusColor(booking.status) }
                    ]}>
                      {getStatusLabel(booking.status)}
                    </Text>
                  </View>
                </View>

                {/* Customer Info */}
                <View style={styles.bookingInfo}>
                  <View style={styles.infoRow}>
                    <Ionicons name="person" size={16} color={Colors.text.secondary} />
                    <Text style={styles.infoText}>{booking.customerName}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Ionicons name="cafe" size={16} color={Colors.text.secondary} />
                    <Text style={styles.infoText}>{booking.table}</Text>
                  </View>
                </View>

                {/* Date & Time */}
                <View style={styles.bookingDetails}>
                  <View style={styles.detailItem}>
                    <Ionicons name="calendar" size={16} color={Colors.status.info} />
                    <Text style={styles.detailText}>{booking.date}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="time" size={16} color={Colors.status.success} />
                    <Text style={styles.detailText}>{booking.time} ({booking.duration}h)</Text>
                  </View>
                </View>

                {/* Footer */}
                <View style={styles.bookingFooter}>
                  <View style={styles.priceContainer}>
                    <Text style={styles.priceLabel}>Total:</Text>
                    <Text style={styles.priceValue}>Rp {booking.totalPrice.toLocaleString()}</Text>
                  </View>
                  {booking.menuItems && booking.menuItems > 0 && (
                    <View style={styles.menuBadge}>
                      <Ionicons name="restaurant" size={12} color={Colors.orange.primary} />
                      <Text style={styles.menuText}>{booking.menuItems} items</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

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
              <Text style={styles.modalTitle}>Booking Details</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.text.primary} />
              </TouchableOpacity>
            </View>

            {selectedBooking && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Booking Code</Text>
                  <Text style={styles.modalValue}>{selectedBooking.bookingCode}</Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Customer</Text>
                  <Text style={styles.modalValue}>{selectedBooking.customerName}</Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Table</Text>
                  <Text style={styles.modalValue}>{selectedBooking.table}</Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Date & Time</Text>
                  <Text style={styles.modalValue}>{selectedBooking.date} at {selectedBooking.time}</Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Duration</Text>
                  <Text style={styles.modalValue}>{selectedBooking.duration} hours</Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Total Price</Text>
                  <Text style={styles.modalValue}>Rp {selectedBooking.totalPrice.toLocaleString()}</Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Status</Text>
                  <Text style={[styles.modalValue, { color: getStatusColor(selectedBooking.status) }]}>
                    {getStatusLabel(selectedBooking.status)}
                  </Text>
                </View>

                {/* Action Buttons */}
                {selectedBooking.status === 'pending' && (
                  <View style={styles.modalActions}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.confirmButton]}
                      onPress={() => handleUpdateStatus('confirmed')}
                    >
                      <Ionicons name="checkmark-circle" size={20} color="#fff" />
                      <Text style={styles.actionButtonText}>Confirm</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.cancelButton]}
                      onPress={() => handleUpdateStatus('cancelled')}
                    >
                      <Ionicons name="close-circle" size={20} color="#fff" />
                      <Text style={styles.actionButtonText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {selectedBooking.status === 'confirmed' && (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.completeButton]}
                    onPress={() => handleUpdateStatus('completed')}
                  >
                    <Ionicons name="checkmark-done" size={20} color="#fff" />
                    <Text style={styles.actionButtonText}>Mark as Completed</Text>
                  </TouchableOpacity>
                )}
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

  // SEARCH
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg.secondary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.bg.tertiary,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: Typography.sizes.base,
    color: Colors.text.primary,
  },

  // FILTER
  filterContainer: {
    paddingBottom: 16,
  },
  filterScroll: {
    paddingHorizontal: 20,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg.secondary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: Colors.bg.tertiary,
  },
  filterChipSelected: {
    backgroundColor: Colors.bg.tertiary,
    borderColor: Colors.orange.primary,
    borderWidth: 2,
  },
  filterText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.secondary,
    marginLeft: 6,
  },
  filterTextSelected: {
    color: Colors.orange.primary,
  },

  // EMPTY STATE
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: Typography.sizes.base,
    color: Colors.text.secondary,
    textAlign: 'center',
  },

  // BOOKINGS LIST
  bookingsList: {
    paddingHorizontal: 20,
  },
  bookingCard: {
    backgroundColor: Colors.bg.secondary,
    borderRadius: BorderRadius.lg,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.bg.tertiary,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.bg.tertiary,
  },
  bookingCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookingCode: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.orange.primary,
    marginLeft: 6,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.md,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
  },
  bookingInfo: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoText: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.primary,
    marginLeft: 8,
  },
  bookingDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.secondary,
    marginLeft: 6,
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.bg.tertiary,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    marginRight: 6,
  },
  priceValue: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.orange.primary,
  },
  menuBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg.elevated,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  menuText: {
    fontSize: Typography.sizes.xs,
    color: Colors.orange.primary,
    marginLeft: 4,
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
  modalActions: {
    flexDirection: 'row',
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    marginHorizontal: 4,
  },
  confirmButton: {
    backgroundColor: Colors.status.success,
  },
  cancelButton: {
    backgroundColor: Colors.status.error,
  },
  completeButton: {
    backgroundColor: Colors.status.info,
    marginTop: 20,
  },
  actionButtonText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: '#fff',
    marginLeft: 8,
  },
});

export default BookingManagementScreen;
