// src/screens/customer/BookingScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 🎨 DARK ORANGE DESIGN SYSTEM (Same as HomeScreen)
const COLORS = {
  bg: {
    primary: '#0F0F0F',
    secondary: '#1A1A1A',
    tertiary: '#2D2D2D',
    elevated: '#353535',
  },
  orange: {
    primary: '#FF6B35',
    light: '#FF8C61',
    dark: '#E85A28',
    glow: 'rgba(255, 107, 53, 0.2)',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#B0B0B0',
    tertiary: '#6B6B6B',
  },
  status: {
    success: '#4CAF50',
    error: '#F44336',
  }
};

interface Table {
  id: string;
  name: string;
  capacity: number;
  pricePerHour: number;
  type: string;
  status: string;
}

const BookingScreen = () => {
  const navigation = useNavigation<any>(); // ✅ FIX: Gunakan <any>
  
  // Get dates for the next 7 days
  const getDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        day: date.toLocaleDateString('id-ID', { weekday: 'short' }),
        date: date.getDate(),
        month: date.toLocaleDateString('id-ID', { month: 'short' }),
        fullDate: date,
      });
    }
    return dates;
  };

  const [selectedDate, setSelectedDate] = useState(getDates()[0]);
  const [selectedTime, setSelectedTime] = useState('14:00');
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [duration, setDuration] = useState(2);

  const dates = getDates();
  const timeSlots = ['10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];
  const durationOptions = [1, 2, 3, 4, 5];

  const tables: Table[] = [
    {
      id: '1',
      name: 'Meja VIP A1',
      capacity: 6,
      pricePerHour: 50000,
      type: 'vip',
      status: 'available',
    },
    {
      id: '2',
      name: 'Meja VIP A2',
      capacity: 6,
      pricePerHour: 50000,
      type: 'vip',
      status: 'available',
    },
    {
      id: '3',
      name: 'Meja Bilyar A',
      capacity: 4,
      pricePerHour: 50000,
      type: 'regular',
      status: 'available',
    },
    {
      id: '4',
      name: 'Meja Keluarga C1',
      capacity: 8,
      pricePerHour: 75000,
      type: 'family',
      status: 'occupied',
    },
    {
      id: '5',
      name: 'Meja Tournament',
      capacity: 4,
      pricePerHour: 60000,
      type: 'tournament',
      status: 'available',
    },
  ];

  const handleBookingOnly = () => {
  if (!selectedTable) {
    alert('Silakan pilih meja terlebih dahulu');
    return;
  }

  const bookingData = {
    id: Date.now().toString(),
    table: selectedTable,
    date: selectedDate.fullDate.toLocaleDateString('id-ID'),
    time: selectedTime,
    duration: duration,
    totalPrice: selectedTable.pricePerHour * duration,
    status: 'pending',
    bookingCode: `BK${Date.now().toString().slice(-6)}`,
    createdAt: new Date().toISOString(),
  };

  navigation.navigate('History', { 
    newBooking: bookingData 
  });
};



  const handleBookingWithMenu = () => {
    if (!selectedTable) {
      alert('Silakan pilih meja terlebih dahulu');
      return;
    }

    navigation.navigate('Menu', {
      bookingData: {
        table: selectedTable,
        date: selectedDate.fullDate.toLocaleDateString('id-ID'),
        time: selectedTime,
        duration: duration,
      }
    });
  };

  const getTableIcon = (type: string) => {
    switch (type) {
      case 'vip': return 'star';
      case 'tournament': return 'trophy';
      case 'family': return 'people';
      default: return 'cafe';
    }
  };

  return (
    <View style={styles.container}>
      {/* 🌟 HEADER */}
      <View style={styles.header}>
        <View style={styles.headerGlow} />
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text.primary} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Book a Table</Text>
          <Text style={styles.headerSubtitle}>Choose your perfect spot</Text>
        </View>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* 📅 DATE SELECTION */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pilih Tanggal</Text>
            <View style={styles.titleUnderline} />
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dateScrollContainer}
          >
            {dates.map((date, index) => {
              const isSelected = selectedDate.date === date.date && 
                                selectedDate.month === date.month;
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dateCard,
                    isSelected && styles.dateCardSelected,
                  ]}
                  onPress={() => setSelectedDate(date)}
                  activeOpacity={0.7}
                >
                  {isSelected && <View style={styles.dateCardGlow} />}
                  <Text style={[
                    styles.dateDay,
                    isSelected && styles.dateDaySelected
                  ]}>
                    {date.day}
                  </Text>
                  <Text style={[
                    styles.dateNumber,
                    isSelected && styles.dateNumberSelected
                  ]}>
                    {date.date}
                  </Text>
                  <Text style={[
                    styles.dateMonth,
                    isSelected && styles.dateMonthSelected
                  ]}>
                    {date.month}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <Text style={styles.selectedInfo}>
            Tanggal dipilih: {selectedDate.fullDate.toLocaleDateString('id-ID', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Text>
        </View>

        {/* ⏰ TIME SELECTION */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pilih Waktu</Text>
            <View style={styles.titleUnderline} />
          </View>

          <View style={styles.timeGrid}>
            {timeSlots.map((time) => {
              const isSelected = selectedTime === time;
              return (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeCard,
                    isSelected && styles.timeCardSelected,
                  ]}
                  onPress={() => setSelectedTime(time)}
                  activeOpacity={0.7}
                >
                  {isSelected && <View style={styles.timeCardGlow} />}
                  <Ionicons 
                    name="time-outline" 
                    size={20} 
                    color={isSelected ? COLORS.orange.primary : COLORS.text.secondary} 
                  />
                  <Text style={[
                    styles.timeText,
                    isSelected && styles.timeTextSelected
                  ]}>
                    {time}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.selectedInfo}>
            Waktu dipilih: {selectedTime}
          </Text>
        </View>

        {/* ⏱️ DURATION SELECTION */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Durasi</Text>
            <View style={styles.titleUnderline} />
          </View>

          <View style={styles.durationGrid}>
            {durationOptions.map((dur) => {
              const isSelected = duration === dur;
              return (
                <TouchableOpacity
                  key={dur}
                  style={[
                    styles.durationCard,
                    isSelected && styles.durationCardSelected,
                  ]}
                  onPress={() => setDuration(dur)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.durationNumber,
                    isSelected && styles.durationNumberSelected
                  ]}>
                    {dur}
                  </Text>
                  <Text style={[
                    styles.durationLabel,
                    isSelected && styles.durationLabelSelected
                  ]}>
                    jam
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 🎱 TABLE SELECTION */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pilih Meja</Text>
            <View style={styles.titleUnderline} />
          </View>

          {tables.map((table) => {
            const isSelected = selectedTable?.id === table.id;
            const isAvailable = table.status === 'available';
            
            return (
              <TouchableOpacity
                key={table.id}
                style={[
                  styles.tableCard,
                  isSelected && styles.tableCardSelected,
                  !isAvailable && styles.tableCardDisabled,
                ]}
                onPress={() => isAvailable && setSelectedTable(table)}
                disabled={!isAvailable}
                activeOpacity={0.7}
              >
                {isSelected && <View style={styles.tableCardGlow} />}
                
                <View style={styles.tableCardContent}>
                  <View style={[
                    styles.tableIcon,
                    !isAvailable && styles.tableIconDisabled
                  ]}>
                    <Ionicons 
                      name={getTableIcon(table.type) as any}
                      size={28} 
                      color={isAvailable ? (isSelected ? COLORS.orange.primary : COLORS.text.secondary) : COLORS.text.tertiary} 
                    />
                  </View>

                  <View style={styles.tableInfo}>
                    <Text style={[
                      styles.tableName,
                      !isAvailable && styles.tableNameDisabled
                    ]}>
                      {table.name}
                    </Text>
                    <View style={styles.tableDetails}>
                      <View style={styles.capacityRow}>
                        <Ionicons 
                          name="people" 
                          size={14} 
                          color={COLORS.text.secondary} 
                        />
                        <Text style={styles.capacityText}>
                          {table.capacity} orang
                        </Text>
                      </View>
                      <View style={styles.priceRow}>
                        <Text style={styles.price}>
                          Rp {table.pricePerHour.toLocaleString()}
                        </Text>
                        <Text style={styles.priceUnit}>/jam</Text>
                      </View>
                    </View>
                  </View>

                  <View style={[
                    styles.statusBadge,
                    isAvailable ? styles.availableBadge : styles.occupiedBadge
                  ]}>
                    <View style={[
                      styles.statusDot,
                      { backgroundColor: isAvailable ? COLORS.status.success : COLORS.status.error }
                    ]} />
                    <Text style={styles.statusText}>
                      {isAvailable ? 'Tersedia' : 'Terisi'}
                    </Text>
                  </View>
                </View>

                {isSelected && (
                  <View style={styles.selectedCheckmark}>
                    <Ionicons name="checkmark-circle" size={24} color={COLORS.orange.primary} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 💰 PRICE SUMMARY */}
        {selectedTable && (
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Meja:</Text>
              <Text style={styles.summaryValue}>{selectedTable.name}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Durasi:</Text>
              <Text style={styles.summaryValue}>{duration} jam</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryTotalLabel}>Total Biaya:</Text>
              <Text style={styles.summaryTotalValue}>
                Rp {(selectedTable.pricePerHour * duration).toLocaleString()}
              </Text>
            </View>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* 🔥 BOTTOM CTA BUTTONS */}
      {selectedTable && (
        <View style={styles.bottomButtons}>
          <TouchableOpacity
            style={styles.buttonSecondary}
            onPress={handleBookingOnly}
            activeOpacity={0.8}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.orange.primary} />
            <Text style={styles.buttonSecondaryText}>Booking Meja Saja</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonPrimary}
            onPress={handleBookingWithMenu}
            activeOpacity={0.8}
          >
            <Ionicons name="restaurant" size={20} color="#000" />
            <Text style={styles.buttonPrimaryText}>+ Tambah Menu</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg.primary,
  },
  scrollView: {
    flex: 1,
  },

  // HEADER
  header: {
    backgroundColor: COLORS.bg.secondary,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
  },
  headerGlow: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 160,
    height: 160,
    backgroundColor: COLORS.orange.glow,
    borderRadius: 80,
    opacity: 0.3,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.bg.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.text.secondary,
    marginTop: 2,
  },

  // SECTION
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: 6,
  },
  titleUnderline: {
    width: 32,
    height: 3,
    backgroundColor: COLORS.orange.primary,
    borderRadius: 2,
  },
  selectedInfo: {
    fontSize: 13,
    color: COLORS.text.secondary,
    marginTop: 12,
    fontWeight: '500',
  },

  // DATE CARDS
  dateScrollContainer: {
    paddingRight: 20,
  },
  dateCard: {
    width: 70,
    backgroundColor: COLORS.bg.secondary,
    borderRadius: 16,
    padding: 12,
    marginRight: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.bg.tertiary,
    position: 'relative',
    overflow: 'hidden',
  },
  dateCardSelected: {
    backgroundColor: COLORS.bg.tertiary,
    borderColor: COLORS.orange.primary,
    borderWidth: 2,
  },
  dateCardGlow: {
    position: 'absolute',
    top: -30,
    left: -30,
    width: 60,
    height: 60,
    backgroundColor: COLORS.orange.glow,
    borderRadius: 30,
  },
  dateDay: {
    fontSize: 12,
    color: COLORS.text.secondary,
    fontWeight: '600',
    marginBottom: 6,
  },
  dateDaySelected: {
    color: COLORS.orange.primary,
  },
  dateNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  dateNumberSelected: {
    color: COLORS.orange.primary,
  },
  dateMonth: {
    fontSize: 11,
    color: COLORS.text.secondary,
  },
  dateMonthSelected: {
    color: COLORS.orange.primary,
  },

  // TIME CARDS
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeCard: {
    width: (SCREEN_WIDTH - 52) / 3,
    backgroundColor: COLORS.bg.secondary,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.bg.tertiary,
    position: 'relative',
    overflow: 'hidden',
  },
  timeCardSelected: {
    backgroundColor: COLORS.bg.tertiary,
    borderColor: COLORS.orange.primary,
    borderWidth: 2,
  },
  timeCardGlow: {
    position: 'absolute',
    top: -20,
    left: -20,
    width: 40,
    height: 40,
    backgroundColor: COLORS.orange.glow,
    borderRadius: 20,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.secondary,
    marginTop: 6,
  },
  timeTextSelected: {
    color: COLORS.orange.primary,
    fontWeight: 'bold',
  },

  // DURATION CARDS
  durationGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  durationCard: {
    flex: 1,
    backgroundColor: COLORS.bg.secondary,
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.bg.tertiary,
  },
  durationCardSelected: {
    backgroundColor: COLORS.bg.tertiary,
    borderColor: COLORS.orange.primary,
    borderWidth: 2,
  },
  durationNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  durationNumberSelected: {
    color: COLORS.orange.primary,
  },
  durationLabel: {
    fontSize: 12,
    color: COLORS.text.secondary,
    marginTop: 4,
  },
  durationLabelSelected: {
    color: COLORS.orange.primary,
  },

  // TABLE CARDS
  tableCard: {
    backgroundColor: COLORS.bg.secondary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.bg.tertiary,
    position: 'relative',
    overflow: 'hidden',
  },
  tableCardSelected: {
    backgroundColor: COLORS.bg.tertiary,
    borderColor: COLORS.orange.primary,
    borderWidth: 2,
  },
  tableCardDisabled: {
    opacity: 0.5,
  },
  tableCardGlow: {
    position: 'absolute',
    top: -40,
    left: -40,
    width: 80,
    height: 80,
    backgroundColor: COLORS.orange.glow,
    borderRadius: 40,
  },
  tableCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tableIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.bg.elevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  tableIconDisabled: {
    opacity: 0.5,
  },
  tableInfo: {
    flex: 1,
  },
  tableName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: 6,
  },
  tableNameDisabled: {
    color: COLORS.text.tertiary,
  },
  tableDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  capacityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  capacityText: {
    fontSize: 12,
    color: COLORS.text.secondary,
    marginLeft: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.orange.primary,
  },
  priceUnit: {
    fontSize: 11,
    color: COLORS.text.secondary,
    marginLeft: 2,
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
  },
  availableBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
  },
  occupiedBadge: {
    backgroundColor: 'rgba(244, 67, 54, 0.2)',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  selectedCheckmark: {
    position: 'absolute',
    bottom: 12,
    right: 12,
  },

  // SUMMARY
  summaryCard: {
    backgroundColor: COLORS.bg.secondary,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 24,
    borderWidth: 1,
    borderColor: COLORS.orange.primary,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: COLORS.bg.tertiary,
    marginVertical: 12,
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  summaryTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.orange.primary,
  },

  // BOTTOM BUTTONS
  bottomButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.bg.secondary,
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.bg.tertiary,
  },
  buttonSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.orange.primary,
    borderRadius: 14,
    paddingVertical: 14,
    marginRight: 8,
  },
  buttonSecondaryText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.orange.primary,
    marginLeft: 8,
  },
  buttonPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.orange.primary,
    borderRadius: 14,
    paddingVertical: 14,
    marginLeft: 8,
  },
  buttonPrimaryText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 8,
  },
});

export default BookingScreen;