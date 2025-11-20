// src/screens/customer/BookingScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Title, Button, Chip, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';

type BookingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Menu'>;

const BookingScreen = () => {
  const navigation = useNavigation<BookingScreenNavigationProp>();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedTable, setSelectedTable] = useState('');
  const [duration, setDuration] = useState('2'); // jam

  // Mock data - nanti bisa dari API
  const timeSlots = ['10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];
  const tables = [
    { id: 'A1', name: 'Meja VIP A1', capacity: 6, price: 50000, status: 'available' },
    { id: 'A2', name: 'Meja VIP A2', capacity: 6, price: 50000, status: 'available' },
    { id: 'B1', name: 'Meja Reguler B1', capacity: 4, price: 35000, status: 'available' },
    { id: 'B2', name: 'Meja Reguler B2', capacity: 4, price: 35000, status: 'occupied' },
    { id: 'C1', name: 'Meja Keluarga C1', capacity: 8, price: 75000, status: 'available' },
  ];

  const handleTableSelect = (tableId: string) => {
    const table = tables.find(t => t.id === tableId);
    if (table?.status === 'occupied') {
      Alert.alert('Meja Tidak Tersedia', 'Meja ini sedang digunakan');
      return;
    }
    setSelectedTable(tableId);
  };

  const handleContinueToMenu = () => {
    if (!selectedDate || !selectedTime || !selectedTable) {
      Alert.alert('Peringatan', 'Harap pilih tanggal, waktu, dan meja terlebih dahulu');
      return;
    }

    const table = tables.find(t => t.id === selectedTable);
    const totalPrice = parseInt(duration) * (table?.price || 0);

    // Navigate to MenuScreen dengan parameters booking - TYPE SAFE
    navigation.navigate('Menu', { 
      fromBooking: true,
      tableId: selectedTable,
      tableName: table?.name,
      duration: parseInt(duration),
      bookingDate: selectedDate,
      bookingTime: selectedTime,
      tablePrice: table?.price,
      totalTablePrice: totalPrice
    });
  };

  // Di BookingScreen.tsx - update handleDirectBooking
const handleDirectBooking = () => {
  if (!selectedDate || !selectedTime || !selectedTable) {
    Alert.alert('Peringatan', 'Harap pilih tanggal, waktu, dan meja');
    return;
  }

  const table = tables.find(t => t.id === selectedTable);
  const totalPrice = parseInt(duration) * (table?.price || 0);

  Alert.alert(
    'Konfirmasi Booking',
    `Anda akan booking:\nMeja: ${table?.name}\nTanggal: ${selectedDate}\nWaktu: ${selectedTime}\nDurasi: ${duration} jam\nTotal: Rp ${totalPrice.toLocaleString()}`,
    [
      { text: 'Batal', style: 'cancel' },
      { 
        text: 'Booking', 
        onPress: () => {
          Alert.alert('Success', 'Booking berhasil!');
          // ✅ PERBAIKAN: Kembali ke Main tab setelah booking
          navigation.reset({
            index: 0,
            routes: [{ name: 'Main' }],
          });
        }
      }
    ]
  );
};

  // Generate dates for next 7 days
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        label: date.toLocaleDateString('id-ID', { weekday: 'short' }),
        date: date.toISOString().split('T')[0],
        day: date.getDate(),
        month: date.toLocaleDateString('id-ID', { month: 'short' }),
        fullDate: date.toLocaleDateString('id-ID', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        })
      });
    }
    return dates;
  };

  const dates = generateDates();

  const getTablePrice = () => {
    const table = tables.find(t => t.id === selectedTable);
    return table ? table.price : 0;
  };

  const calculateTableTotal = () => {
    return parseInt(duration) * getTablePrice();
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Date Selection */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Pilih Tanggal</Title>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.datesContainer}>
                {dates.map((item) => (
                  <Button
                    key={item.date}
                    mode={selectedDate === item.date ? "contained" : "outlined"}
                    onPress={() => setSelectedDate(item.date)}
                    style={styles.dateButton}
                    contentStyle={styles.dateButtonContent}
                  >
                    <View style={styles.dateContent}>
                      <Text style={styles.dateDay}>{item.day}</Text>
                      <Text style={styles.dateMonth}>{item.month}</Text>
                      <Text style={styles.dateLabel}>{item.label}</Text>
                    </View>
                  </Button>
                ))}
              </View>
            </ScrollView>
            {selectedDate && (
              <Text style={styles.selectedDateText}>
                Tanggal dipilih: {dates.find(d => d.date === selectedDate)?.fullDate}
              </Text>
            )}
          </Card.Content>
        </Card>

        {/* Time Selection */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Pilih Waktu</Title>
            <View style={styles.timeContainer}>
              {timeSlots.map((time) => (
                <Chip
                  key={time}
                  selected={selectedTime === time}
                  onPress={() => setSelectedTime(time)}
                  style={styles.timeChip}
                  showSelectedOverlay
                >
                  {time}
                </Chip>
              ))}
            </View>
            {selectedTime && (
              <Text style={styles.selectedTimeText}>
                Waktu dipilih: {selectedTime}
              </Text>
            )}
          </Card.Content>
        </Card>

        {/* Table Selection */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Pilih Meja</Title>
            <View style={styles.tablesContainer}>
              {tables.map((table) => (
                <Card
                  key={table.id}
                  style={[
                    styles.tableCard,
                    selectedTable === table.id && styles.selectedTableCard,
                    table.status === 'occupied' && styles.occupiedTableCard
                  ]}
                  onPress={() => handleTableSelect(table.id)}
                  disabled={table.status === 'occupied'}
                >
                  <Card.Content style={styles.tableContent}>
                    <View style={styles.tableHeader}>
                      <Text style={styles.tableName}>{table.name}</Text>
                      {table.status === 'occupied' && (
                        <Chip mode="outlined" style={styles.occupiedChip}>Terpakai</Chip>
                      )}
                    </View>
                    <Text style={styles.tableCapacity}>Kapasitas: {table.capacity} orang</Text>
                    <Text style={styles.tablePrice}>Rp {table.price.toLocaleString()}/jam</Text>
                    {selectedTable === table.id && (
                      <View style={styles.selectedIndicator}>
                        <Text style={styles.selectedText}>✓ Dipilih</Text>
                      </View>
                    )}
                  </Card.Content>
                </Card>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Duration Selection */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Durasi Booking (jam)</Title>
            <View style={styles.durationContainer}>
              {['1', '2', '3', '4'].map((hours) => (
                <Chip
                  key={hours}
                  selected={duration === hours}
                  onPress={() => setDuration(hours)}
                  style={styles.durationChip}
                  showSelectedOverlay
                >
                  {hours} jam
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Booking Summary */}
        {(selectedDate || selectedTime || selectedTable) && (
          <Card style={styles.summaryCard}>
            <Card.Content>
              <Title style={styles.summaryTitle}>Ringkasan Booking Meja</Title>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tanggal:</Text>
                <Text style={styles.summaryValue}>
                  {selectedDate ? dates.find(d => d.date === selectedDate)?.fullDate : '-'}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Waktu:</Text>
                <Text style={styles.summaryValue}>{selectedTime || '-'}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Meja:</Text>
                <Text style={styles.summaryValue}>
                  {selectedTable ? tables.find(t => t.id === selectedTable)?.name : '-'}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Durasi:</Text>
                <Text style={styles.summaryValue}>{duration} jam</Text>
              </View>
              <Divider style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total Meja:</Text>
                <Text style={styles.totalValue}>
                  Rp {calculateTableTotal().toLocaleString()}
                </Text>
              </View>
              <Text style={styles.noteText}>
                * Anda bisa menambahkan makanan & minuman di langkah berikutnya
              </Text>
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.footer}>
        {selectedTable ? (
          <View style={styles.buttonGroup}>
            <Button 
              mode="outlined" 
              onPress={handleDirectBooking}
              style={[styles.button, styles.secondaryButton]}
              icon="check"
            >
              Booking Meja Saja
            </Button>
            <Button 
              mode="contained" 
              onPress={handleContinueToMenu}
              style={styles.button}
              icon="silverware-fork-knife"
            >
              + Tambah Menu
            </Button>
          </View>
        ) : (
          <Button 
            mode="contained" 
            onPress={() => Alert.alert('Info', 'Pilih meja terlebih dahulu')}
            style={styles.button}
            disabled
          >
            Pilih Meja untuk Melanjutkan
          </Button>
        )}
      </View>
    </View>
  );
};

// Styles tetap sama seperti sebelumnya
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  datesContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  dateButton: {
    marginRight: 8,
    height: 80,
  },
  dateButtonContent: {
    height: '100%',
  },
  dateContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateDay: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  dateMonth: {
    fontSize: 12,
    color: '#666',
  },
  dateLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  selectedDateText: {
    marginTop: 12,
    fontStyle: 'italic',
    color: '#2196F3',
  },
  timeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeChip: {
    marginBottom: 8,
  },
  selectedTimeText: {
    marginTop: 12,
    fontStyle: 'italic',
    color: '#2196F3',
  },
  tablesContainer: {
    gap: 12,
  },
  tableCard: {
    elevation: 2,
  },
  selectedTableCard: {
    borderColor: '#2196F3',
    borderWidth: 2,
    backgroundColor: '#E3F2FD',
  },
  occupiedTableCard: {
    backgroundColor: '#F5F5F5',
    opacity: 0.7,
  },
  tableContent: {
    paddingVertical: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tableName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  occupiedChip: {
    backgroundColor: '#FFEBEE',
  },
  tableCapacity: {
    color: '#666',
    marginBottom: 4,
  },
  tablePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  selectedText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  durationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  durationChip: {
    marginBottom: 8,
  },
  summaryCard: {
    margin: 16,
    marginTop: 8,
    backgroundColor: '#E8F5E8',
  },
  summaryTitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    color: '#666',
  },
  summaryValue: {
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  noteText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 8,
  },
  footer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 8,
  },
  secondaryButton: {
    borderColor: '#2196F3',
  },
});

export default BookingScreen;