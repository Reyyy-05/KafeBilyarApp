// src/screens/customer/BookingHistoryScreen.tsx - SUPER SAFE VERSION
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { addBooking } from '../../store/slices/bookingHistorySlice';
import { Colors, Typography, Spacing, BorderRadius } from '../../theme';

const BookingHistoryScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const dispatch = useDispatch();
  const bookings = useSelector((state: RootState) => state.bookingHistory.bookings) || [];
  
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  // Handle new booking - SUPER SAFE VERSION
  useEffect(() => {
    try {
      const params = route.params;
      
      if (params?.newBooking) {
        dispatch(addBooking(params.newBooking));
        navigation.setParams({ newBooking: undefined });
      }

      if (params?.bookingWithMenu) {
        dispatch(addBooking(params.bookingWithMenu));
        navigation.setParams({ bookingWithMenu: undefined });
      }

      if (params?.menuOnlyOrder) {
        const menuOrder = {
          id: Date.now().toString(),
          date: params.menuOnlyOrder.orderDate || new Date().toLocaleDateString('id-ID'),
          time: params.menuOnlyOrder.orderTime || new Date().toLocaleTimeString('id-ID'),
          totalPrice: params.menuOnlyOrder.menuTotal || 0,
          status: 'pending' as const,
          menuItems: params.menuOnlyOrder.menuItems || [],
          menuTotal: params.menuOnlyOrder.menuTotal || 0,
          grandTotal: params.menuOnlyOrder.grandTotal || params.menuOnlyOrder.menuTotal || 0,
          bookingCode: `MO${Date.now().toString().slice(-6)}`,
          createdAt: new Date().toISOString(),
        };
        dispatch(addBooking(menuOrder as any));
        navigation.setParams({ menuOnlyOrder: undefined });
      }
    } catch (error) {
      console.error('Error adding booking:', error);
    }
  }, [route.params?.newBooking, route.params?.bookingWithMenu, route.params?.menuOnlyOrder]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
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
    if (filter === 'all') return true;
    if (filter === 'upcoming') return ['pending', 'confirmed'].includes(booking.status);
    if (filter === 'past') return ['completed', 'cancelled'].includes(booking.status);
    return true;
  });

  // SAFE VALUE GETTER
  const safeValue = (value: any, defaultValue: any = 0) => {
    return value !== undefined && value !== null ? value : defaultValue;
  };

  const safePrice = (value: any) => {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerGlow} />
        <Text style={styles.headerTitle}>Riwayat Booking</Text>
        <Text style={styles.headerSubtitle}>
          {filteredBookings.length} booking ditemukan
        </Text>
      </View>

      {/* FILTER CHIPS */}
      <View style={styles.filterContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {[
            { id: 'all', label: 'Semua', icon: 'apps' },
            { id: 'upcoming', label: 'Akan Datang', icon: 'time' },
            { id: 'past', label: 'Riwayat', icon: 'checkmark-done' },
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
                {isSelected && <View style={styles.filterChipGlow} />}
                <Ionicons 
                  name={item.icon as any} 
                  size={18} 
                  color={isSelected ? Colors.orange.primary : Colors.text.secondary} 
                />
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

      {/* BOOKING LIST */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.orange.primary}
            colors={[Colors.orange.primary]}
          />
        }
      >
        {filteredBookings.length === 0 ? (
          // EMPTY STATE
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="calendar-outline" size={64} color={Colors.text.tertiary} />
            </View>
            <Text style={styles.emptyTitle}>Belum Ada Booking</Text>
            <Text style={styles.emptySubtitle}>
              Booking Anda akan muncul di sini
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => navigation.navigate('Booking')}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={20} color="#000" />
              <Text style={styles.emptyButtonText}>Booking Sekarang</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // BOOKING CARDS
          <View style={styles.bookingList}>
            {filteredBookings.map((booking: any) => {
              // SAFE VALUES
              const hasTable = booking.table && typeof booking.table === 'object';
              const tableName = hasTable ? (booking.table.name || 'Meja') : 'Menu Only';
              const bookingDate = safeValue(booking.date, '-');
              const bookingTime = safeValue(booking.time, '-');
              const bookingDuration = safeValue(booking.duration, null);
              const tablePrice = safePrice(booking.totalPrice);
              const menuTotal = safePrice(booking.menuTotal);
              const grandTotal = safePrice(booking.grandTotal || booking.totalPrice);
              const menuItems = Array.isArray(booking.menuItems) ? booking.menuItems : [];

              return (
                <TouchableOpacity
                  key={booking.id}
                  style={styles.bookingCard}
                  onPress={() => console.log('Booking:', booking.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.bookingCardHeader}>
                    <View style={styles.bookingCodeContainer}>
                      <Ionicons name="qr-code" size={16} color={Colors.orange.primary} />
                      <Text style={styles.bookingCode}>
                        {booking.bookingCode || 'BK000000'}
                      </Text>
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

                  <View style={styles.bookingCardContent}>
                    {/* TABLE INFO */}
                    {hasTable && (
                      <View style={styles.infoRow}>
                        <View style={styles.iconContainer}>
                          <Ionicons name="cafe" size={20} color={Colors.orange.primary} />
                        </View>
                        <View style={styles.infoContent}>
                          <Text style={styles.infoLabel}>Meja</Text>
                          <Text style={styles.infoValue}>{tableName}</Text>
                        </View>
                      </View>
                    )}

                    {/* DATE & TIME */}
                    <View style={styles.infoRow}>
                      <View style={styles.iconContainer}>
                        <Ionicons name="calendar" size={20} color={Colors.status.info} />
                      </View>
                      <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Tanggal & Waktu</Text>
                        <Text style={styles.infoValue}>
                          {bookingDate} • {bookingTime}
                        </Text>
                      </View>
                    </View>

                    {/* DURATION */}
                    {bookingDuration && (
                      <View style={styles.infoRow}>
                        <View style={styles.iconContainer}>
                          <Ionicons name="time" size={20} color={Colors.status.success} />
                        </View>
                        <View style={styles.infoContent}>
                          <Text style={styles.infoLabel}>Durasi</Text>
                          <Text style={styles.infoValue}>{bookingDuration} jam</Text>
                        </View>
                      </View>
                    )}

                    {/* MENU ITEMS */}
                    {menuItems.length > 0 && (
                      <View style={styles.menuSection}>
                        <View style={styles.menuHeader}>
                          <Ionicons name="restaurant" size={16} color={Colors.text.secondary} />
                          <Text style={styles.menuHeaderText}>
                            Pesanan Menu ({menuItems.length} item)
                          </Text>
                        </View>
                        {menuItems.slice(0, 2).map((item: any, index: number) => (
                          <View key={index} style={styles.menuItem}>
                            <Text style={styles.menuItemName}>
                              {safeValue(item.quantity, 1)}x {safeValue(item.name, 'Item')}
                            </Text>
                            <Text style={styles.menuItemPrice}>
                              Rp {(safePrice(item.price) * safeValue(item.quantity, 1)).toLocaleString()}
                            </Text>
                          </View>
                        ))}
                        {menuItems.length > 2 && (
                          <Text style={styles.menuMore}>
                            +{menuItems.length - 2} item lainnya
                          </Text>
                        )}
                      </View>
                    )}

                    {/* PRICE */}
                    <View style={styles.priceSection}>
                      {hasTable && tablePrice > 0 && (
                        <View style={styles.priceRow}>
                          <Text style={styles.priceLabel}>Biaya Meja:</Text>
                          <Text style={styles.priceValue}>
                            Rp {tablePrice.toLocaleString()}
                          </Text>
                        </View>
                      )}
                      {menuTotal > 0 && (
                        <View style={styles.priceRow}>
                          <Text style={styles.priceLabel}>Biaya Menu:</Text>
                          <Text style={styles.priceValue}>
                            Rp {menuTotal.toLocaleString()}
                          </Text>
                        </View>
                      )}
                      <View style={styles.divider} />
                      <View style={styles.priceRow}>
                        <Text style={styles.priceTotalLabel}>Total:</Text>
                        <Text style={styles.priceTotalValue}>
                          Rp {grandTotal.toLocaleString()}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* ACTION BUTTON */}
                  {booking.status === 'pending' && (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => console.log('Confirm:', booking.id)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.actionButtonText}>Konfirmasi Pembayaran</Text>
                      <Ionicons name="arrow-forward" size={16} color="#000" />
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}

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
  headerTitle: { fontSize: Typography.sizes.xl, fontWeight: Typography.weights.bold, color: Colors.text.primary, textAlign: 'center', marginBottom: 4 },
  headerSubtitle: { fontSize: Typography.sizes.sm, color: Colors.text.secondary, textAlign: 'center' },
  filterContainer: { paddingVertical: 16 },
  filterScroll: { paddingHorizontal: 20 },
  filterChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.bg.secondary, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: Colors.bg.tertiary, position: 'relative', overflow: 'hidden' },
  filterChipSelected: { backgroundColor: Colors.bg.tertiary, borderColor: Colors.orange.primary, borderWidth: 2 },
  filterChipGlow: { position: 'absolute', top: -20, left: -20, width: 40, height: 40, backgroundColor: Colors.orange.glow, borderRadius: 20 },
  filterText: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.semibold, color: Colors.text.secondary, marginLeft: 6 },
  filterTextSelected: { color: Colors.orange.primary },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 80, paddingHorizontal: 40 },
  emptyIcon: { width: 120, height: 120, borderRadius: 60, backgroundColor: Colors.bg.secondary, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  emptyTitle: { fontSize: Typography.sizes.xl, fontWeight: Typography.weights.bold, color: Colors.text.primary, marginBottom: 8 },
  emptySubtitle: { fontSize: Typography.sizes.base, color: Colors.text.secondary, textAlign: 'center', marginBottom: 24 },
  emptyButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.orange.primary, paddingHorizontal: 24, paddingVertical: 14, borderRadius: BorderRadius.md },
  emptyButtonText: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.text.inverse, marginLeft: 8 },
  bookingList: { paddingHorizontal: 20 },
  bookingCard: { backgroundColor: Colors.bg.secondary, borderRadius: BorderRadius.xl, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: Colors.bg.tertiary },
  bookingCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: Colors.bg.tertiary },
  bookingCodeContainer: { flexDirection: 'row', alignItems: 'center' },
  bookingCode: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.bold, color: Colors.orange.primary, marginLeft: 6 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: BorderRadius.md },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  statusText: { fontSize: Typography.sizes.xs, fontWeight: Typography.weights.semibold },
  bookingCardContent: {},
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  iconContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.bg.elevated, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: Typography.sizes.xs, color: Colors.text.secondary, marginBottom: 2 },
  infoValue: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.semibold, color: Colors.text.primary },
  menuSection: { backgroundColor: Colors.bg.elevated, borderRadius: BorderRadius.md, padding: 12, marginTop: 8, marginBottom: 12 },
  menuHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  menuHeaderText: { fontSize: Typography.sizes.xs, fontWeight: Typography.weights.semibold, color: Colors.text.secondary, marginLeft: 6 },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  menuItemName: { fontSize: Typography.sizes.sm, color: Colors.text.primary },
  menuItemPrice: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.semibold, color: Colors.orange.primary },
  menuMore: { fontSize: Typography.sizes.xs, color: Colors.text.tertiary, fontStyle: 'italic', marginTop: 4 },
  priceSection: { backgroundColor: Colors.bg.elevated, borderRadius: BorderRadius.md, padding: 12, marginTop: 8 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  priceLabel: { fontSize: Typography.sizes.sm, color: Colors.text.secondary },
  priceValue: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.semibold, color: Colors.text.primary },
  divider: { height: 1, backgroundColor: Colors.bg.tertiary, marginVertical: 8 },
  priceTotalLabel: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.text.primary },
  priceTotalValue: { fontSize: Typography.sizes.lg, fontWeight: Typography.weights.bold, color: Colors.orange.primary },
  actionButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.orange.primary, paddingVertical: 12, borderRadius: BorderRadius.md, marginTop: 12 },
  actionButtonText: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.text.inverse, marginRight: 8 },
});

export default BookingHistoryScreen;
