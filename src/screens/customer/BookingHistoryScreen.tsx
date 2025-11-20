// src/screens/customer/BookingHistoryScreen.tsx - WITH REDUX INTEGRATION
import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Title, Paragraph, Text, Chip, Button, Divider, Appbar } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../../store/slices/cartSlice';
import { addBooking } from '../../store/slices/bookingHistorySlice'; // ✅ NEW
import { RootState } from '../../store';
import { RootStackParamList } from '../../navigation/types';
import { CommonActions } from '@react-navigation/native';

type HistoryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const BookingHistoryScreen = () => {
  const navigation = useNavigation<HistoryScreenNavigationProp>();
  const route = useRoute();
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart);
  
  // ✅ NEW: Get booking history from Redux
  const bookingHistory = useSelector((state: RootState) => state.bookingHistory.bookings);

  const params = route.params as RootStackParamList['History'];

  const handleConfirmBooking = () => {
    Alert.alert(
      'Konfirmasi Booking',
      `Apakah Anda yakin ingin memesan?\n\nMeja: ${params?.tableName}\nWaktu: ${params?.bookingDate} ${params?.bookingTime}\nDurasi: ${params?.duration} jam\nTotal: Rp ${params?.grandTotal?.toLocaleString()}`,
      [
        { text: 'Periksa Kembali', style: 'cancel' },
        { 
          text: 'Konfirmasi Pesanan', 
          onPress: () => {
            // ✅ SAVE BOOKING TO REDUX
            dispatch(addBooking({
              tableId: params?.tableId || '',
              tableName: params?.tableName || '',
              bookingDate: params?.bookingDate || '',
              bookingTime: params?.bookingTime || '',
              duration: params?.duration || 0,
              tablePrice: params?.tablePrice || 0,
              totalTablePrice: params?.totalTablePrice || 0,
              menuItems: params?.cartItems || [],
              menuTotal: params?.cartTotal || 0,
              grandTotal: params?.grandTotal || 0,
            }));

            dispatch(clearCart());
            
            Alert.alert(
              'Booking Berhasil!',
              'Pesanan Anda telah dikonfirmasi dan disimpan di riwayat booking.',
              [
                { 
                  text: 'OK', 
                  onPress: () => {
                    navigation.dispatch(
                      CommonActions.reset({
                        index: 0,
                        routes: [
                          { 
                            name: 'Main',
                            state: {
                              routes: [{ name: 'Home' }]
                            }
                          }
                        ],
                      })
                    );
                  }
                }
              ]
            );
          }
        }
      ]
    );
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Jika dalam mode booking summary
  if (params?.isBookingSummary) {
    return (
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={handleBack} />
          <Appbar.Content title="Ringkasan Pesanan" />
        </Appbar.Header>

        <ScrollView style={styles.scrollView}>
          {/* Booking Details */}
          <Card style={styles.sectionCard}>
            <Card.Content>
              <Title style={styles.sectionTitle}>Detail Booking</Title>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Meja:</Text>
                <Text style={styles.detailValue}>{params?.tableName || '-'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Tanggal:</Text>
                <Text style={styles.detailValue}>{formatDate(params?.bookingDate)}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Waktu:</Text>
                <Text style={styles.detailValue}>{params?.bookingTime || '-'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Durasi:</Text>
                <Text style={styles.detailValue}>{params?.duration || 0} jam</Text>
              </View>
            </Card.Content>
          </Card>

          {/* Menu Items */}
          {params?.cartItems && params.cartItems.length > 0 && (
            <Card style={styles.sectionCard}>
              <Card.Content>
                <Title style={styles.sectionTitle}>Pesanan Menu ({params.cartItems.length})</Title>
                {params.cartItems.map((item) => (
                  <View key={item.id} style={styles.menuItemRow}>
                    <View style={styles.menuItemInfo}>
                      <Text style={styles.menuItemName}>{item.name}</Text>
                      <Text style={styles.menuItemQuantity}>
                        {item.quantity} x Rp {item.price.toLocaleString()}
                      </Text>
                    </View>
                    <Text style={styles.menuItemTotal}>
                      Rp {(item.quantity * item.price).toLocaleString()}
                    </Text>
                  </View>
                ))}
              </Card.Content>
            </Card>
          )}

          {/* Price Summary */}
          <Card style={styles.totalCard}>
            <Card.Content>
              <Title style={styles.totalTitle}>Ringkasan Pembayaran</Title>
              
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Biaya Meja ({params?.duration || 0} jam):</Text>
                <Text style={styles.priceValue}>
                  Rp {(params?.totalTablePrice || 0).toLocaleString()}
                </Text>
              </View>

              {params?.cartItems && params.cartItems.length > 0 && (
                <>
                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Total Menu:</Text>
                    <Text style={styles.priceValue}>
                      Rp {(params?.cartTotal || 0).toLocaleString()}
                    </Text>
                  </View>
                  <Divider style={styles.divider} />
                </>
              )}

              <View style={styles.grandTotalRow}>
                <Text style={styles.grandTotalLabel}>Total Pembayaran:</Text>
                <Text style={styles.grandTotalValue}>
                  Rp {(params?.grandTotal || 0).toLocaleString()}
                </Text>
              </View>
            </Card.Content>
          </Card>

          {/* Additional Info */}
          <Card style={styles.infoCard}>
            <Card.Content>
              <Text style={styles.infoText}>
                • Pembayaran dilakukan di tempat{'\n'}
                • Silakan tunjukkan booking code ke admin{'\n'}
                • Batalkan maksimal 1 jam sebelum booking
              </Text>
            </Card.Content>
          </Card>
        </ScrollView>

        {/* Confirm Button */}
        <View style={styles.footer}>
          <Button 
            mode="contained" 
            onPress={handleConfirmBooking}
            style={styles.confirmButton}
            icon="check-circle"
            contentStyle={styles.confirmButtonContent}
          >
            Konfirmasi Pesanan
          </Button>
        </View>
      </View>
    );
  }

  // ✅ Default mode - display REAL booking history from Redux
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Card style={styles.headerCard}>
          <Card.Content>
            <Title>Riwayat Booking</Title>
            <Paragraph>
              {bookingHistory.length > 0 
                ? `Anda memiliki ${bookingHistory.length} booking` 
                : 'Belum ada riwayat booking'}
            </Paragraph>
          </Card.Content>
        </Card>

        {bookingHistory.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyTitle}>Belum Ada Booking</Text>
              <Text style={styles.emptyText}>
                Booking Anda akan muncul di sini setelah konfirmasi
              </Text>
            </Card.Content>
          </Card>
        ) : (
          bookingHistory.map((booking) => (
            <Card key={booking.id} style={styles.bookingCard}>
              <Card.Content>
                <View style={styles.bookingHeader}>
                  <Title style={styles.tableName}>{booking.tableName}</Title>
                  <Chip 
                    mode="outlined"
                    textStyle={styles.chipText}
                    style={[
                      styles.statusChip, 
                      { backgroundColor: getStatusColor(booking.status) }
                    ]}
                  >
                    {getStatusText(booking.status)}
                  </Chip>
                </View>
                
                <View style={styles.bookingDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Tanggal:</Text>
                    <Text style={styles.detailValue}>{formatDate(booking.bookingDate)}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Waktu:</Text>
                    <Text style={styles.detailValue}>{booking.bookingTime}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Durasi:</Text>
                    <Text style={styles.detailValue}>{booking.duration} jam</Text>
                  </View>
                  {booking.menuItems.length > 0 && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Menu:</Text>
                      <Text style={styles.detailValue}>{booking.menuItems.length} items</Text>
                    </View>
                  )}
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Total:</Text>
                    <Text style={styles.totalPrice}>Rp {booking.grandTotal.toLocaleString()}</Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  );
};

// Helper functions
const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return '#4CAF50';
    case 'upcoming': return '#2196F3';
    case 'cancelled': return '#F44336';
    default: return '#757575';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'completed': return 'Selesai';
    case 'upcoming': return 'Akan Datang';
    case 'cancelled': return 'Dibatalkan';
    default: return status;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  sectionCard: {
    margin: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#757575',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#212121',
    fontWeight: '500',
  },
  menuItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 4,
  },
  menuItemInfo: {
    flex: 1,
  },
  menuItemName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  menuItemQuantity: {
    fontSize: 12,
    color: '#757575',
  },
  menuItemTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  totalCard: {
    margin: 16,
    marginBottom: 8,
    backgroundColor: '#E8F5E8',
  },
  totalTitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    marginVertical: 8,
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  infoCard: {
    margin: 16,
    marginTop: 8,
    backgroundColor: '#FFF3E0',
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  footer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  confirmButton: {
    borderRadius: 8,
  },
  confirmButtonContent: {
    paddingVertical: 8,
  },
  headerCard: {
    margin: 16,
    marginBottom: 8,
  },
  emptyCard: {
    margin: 16,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  bookingCard: {
    margin: 16,
    marginBottom: 8,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tableName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  statusChip: {
    height: 32,
  },
  chipText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bookingDetails: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 12,
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
});

export default BookingHistoryScreen;
