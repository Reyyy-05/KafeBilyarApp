// src/screens/customer/BookingHistoryScreen.tsx
import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Title, Paragraph, Text, Chip, Button, Divider, Appbar } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../../store/slices/cartSlice';
import { RootState } from '../../store';
import { RootStackParamList } from '../../navigation/types';
import { CommonActions } from '@react-navigation/native';

type HistoryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
interface CartItem 
{
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface SummaryParams {
  isBookingSummary?: boolean;
  tableId?: string;
  tableName?: string;
  duration?: number;
  bookingDate?: string;
  bookingTime?: string;
  tablePrice?: number;
  totalTablePrice?: number;
  cartItems?: CartItem[];
  cartTotal?: number;
  grandTotal?: number;
}

const BookingHistoryScreen = () => {
  const navigation = useNavigation<HistoryScreenNavigationProp>();
  const route = useRoute();
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart);

  // ✅ PERBAIKAN: Definisikan params dengan benar
  const params = route.params as RootStackParamList['History'];

  // Data booking history (untuk mode normal)
  const bookingHistory = [
    {
      id: '1',
      tableNumber: 'Bilyar A1',
      date: '2024-01-15',
      time: '14:00 - 16:00',
      duration: 2,
      totalPrice: 120000,
      status: 'completed'
    },
    {
      id: '2',
      tableNumber: 'Bilyar B2',
      date: '2024-01-20',
      time: '19:00 - 21:00',
      duration: 2,
      totalPrice: 120000,
      status: 'upcoming'
    },
    {
      id: '3',
      tableNumber: 'Kafe Table 5',
      date: '2024-01-10',
      time: '16:00 - 18:00',
      duration: 2,
      totalPrice: 80000,
      status: 'completed'
    }
  ];

  const handleConfirmBooking = () => {
    // ✅ PERBAIKAN: Gunakan params dengan safe access
    Alert.alert(
      'Konfirmasi Booking',
      `Apakah Anda yakin ingin memesan?\n\nMeja: ${params?.tableName}\nWaktu: ${params?.bookingDate} ${params?.bookingTime}\nDurasi: ${params?.duration} jam\nTotal: Rp ${params?.grandTotal?.toLocaleString()}`,
      [
        { text: 'Periksa Kembali', style: 'cancel' },
        { 
          text: 'Konfirmasi Pesanan', 
          onPress: () => {
            dispatch(clearCart());
            Alert.alert(
              'Booking Berhasil!',
              'Pesanan Anda telah dikonfirmasi dan akan diproses oleh admin.',
              [
                { 
                  text: 'OK', 
                  onPress: () => {
                    // ✅ PERBAIKAN: Reset navigation ke Home tab
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

  // Jika dalam mode booking summary, tampilkan summary
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
                {params.cartItems.map((item, index) => (
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

  // Default mode - menampilkan booking history
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Card style={styles.headerCard}>
          <Card.Content>
            <Title>Riwayat Booking</Title>
            <Paragraph>Lihat history booking meja bilyar Anda</Paragraph>
          </Card.Content>
        </Card>

        {bookingHistory.map((booking) => (
          <Card key={booking.id} style={styles.bookingCard}>
            <Card.Content>
              <View style={styles.bookingHeader}>
                <Title style={styles.tableName}>{booking.tableNumber}</Title>
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
                  <Text style={styles.detailValue}>{booking.date}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Waktu:</Text>
                  <Text style={styles.detailValue}>{booking.time}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Durasi:</Text>
                  <Text style={styles.detailValue}>{booking.duration} jam</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Total:</Text>
                  <Text style={styles.totalPrice}>Rp {booking.totalPrice.toLocaleString()}</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

// Helper functions untuk history mode
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
  // Styles untuk summary mode
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
  // Styles untuk history mode (existing)
  headerCard: {
    margin: 16,
    marginBottom: 8,
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