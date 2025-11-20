import React, { useRef, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Animated,
  Dimensions,
  RefreshControl 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

// Simple navigation type
type NavigationProps = {
  navigate: (screen: string, params?: any) => void;
};

type TableType = {
  id: string;
  name: string;
  capacity: number;
  status: 'available' | 'occupied';
  price: number;
  features: string[];
  image: string;
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  
  // Simple Redux selector - sementara pakai any
  const user = useSelector((state: any) => state.auth?.user);
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const [refreshing, setRefreshing] = useState(false);

  // Quick Actions
  // Di HomeScreen.tsx - Update navigation section
const handleQuickAction = (screen: string) => {
  // Navigate to the specific tab
  if (screen === 'Booking') navigation.navigate('Booking');
  else if (screen === 'Menu') navigation.navigate('Menu');
  else if (screen === 'History') navigation.navigate('History');
  else if (screen === 'Profile') navigation.navigate('Profile');
};

const handleTablePress = (table: any) => {
  if (table.status === 'available') {
    navigation.navigate('Booking');
  }
};

const handlePromoPress = () => {
  navigation.navigate('Menu');
};

const handleNotificationPress = () => {
  navigation.navigate('History');
};
  const quickActions = [
    { 
      id: '1',
      icon: 'calendar-outline', 
      title: 'Booking', 
      screen: 'Booking',
      color: '#FF6B35',
    },
    { 
      id: '2',
      icon: 'restaurant-outline', 
      title: 'Menu', 
      screen: 'Menu',
      color: '#4CAF50',
    },
    { 
      id: '3',
      icon: 'time-outline', 
      title: 'Riwayat', 
      screen: 'History',
      color: '#2196F3',
    },
    { 
      id: '4',
      icon: 'person-outline', 
      title: 'Profil', 
      screen: 'Profile',
      color: '#9C27B0',
    },
  ];

  // Featured tables
  const featuredTables: TableType[] = [
    { 
      id: '1', 
      name: 'Meja VIP', 
      capacity: 6, 
      status: 'available',
      price: 75000,
      features: ['LED Lighting', 'Premium Cloth'],
      image: 'vip'
    },
    { 
      id: '2', 
      name: 'Meja Bilyar A', 
      capacity: 4, 
      status: 'available',
      price: 50000,
      features: ['Standard', 'Tournament Ready'],
      image: 'standard'
    },
    { 
      id: '3', 
      name: 'Meja Keluarga', 
      capacity: 8, 
      status: 'occupied',
      price: 100000,
      features: ['Large Size', 'Family Package'],
      image: 'family'
    },
  ];

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Halo, {user?.name || 'Tamu'}! 👋</Text>
            <Text style={styles.subtitle}>Mau main bilyar hari ini?</Text>
          </View>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => navigation.navigate('History')}
          >
            <Ionicons name="notifications-outline" size={24} color="#333" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>2</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Akses Cepat</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.quickActionCard}
                onPress={() => navigation.navigate(action.screen)}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                  <Ionicons name={action.icon as any} size={24} color="#fff" />
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Featured Tables */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Meja Tersedia</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Booking')}>
              <Text style={styles.seeAllText}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {featuredTables.map((table) => (
              <TouchableOpacity 
                key={table.id} 
                style={styles.tableCard}
                onPress={() => table.status === 'available' && navigation.navigate('Booking')}
              >
                <View style={styles.tableHeader}>
                  <View style={styles.tableImage}>
                    <Ionicons name="cafe" size={32} color="#FF6B35" />
                  </View>
                  <Text style={styles.tableName}>{table.name}</Text>
                </View>
                <Text style={styles.tableCapacity}>{table.capacity} orang</Text>
                <Text style={styles.tablePrice}>Rp {table.price.toLocaleString()}/jam</Text>
                <View style={[
                  styles.statusBadge,
                  table.status === 'available' ? styles.availableBadge : styles.occupiedBadge
                ]}>
                  <Text style={styles.statusText}>
                    {table.status === 'available' ? 'Tersedia' : 'Terisi'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Promo Banner */}
        <View style={styles.promoBanner}>
          <View style={styles.promoContent}>
            <Text style={styles.promoTitle}>Diskon 20% Weekday</Text>
            <Text style={styles.promoSubtitle}>Senin - Jumat • 10:00 - 16:00 WIB</Text>
            <TouchableOpacity 
              style={styles.promoButton}
              onPress={() => navigation.navigate('Menu')}
            >
              <Text style={styles.promoButtonText}>Klaim Sekarang</Text>
            </TouchableOpacity>
          </View>
          <Ionicons name="gift" size={60} color="#fff" />
        </View>
      </ScrollView>
    </View>
  );
};

// Simplified styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  notificationButton: {
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    color: '#FF6B35',
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: (SCREEN_WIDTH - 60) / 2,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  tableCard: {
    width: 160,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tableImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  tableName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  tableCapacity: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  tablePrice: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '600',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  availableBadge: {
    backgroundColor: '#e8f5e8',
  },
  occupiedBadge: {
    backgroundColor: '#ffeaea',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  promoBanner: {
    margin: 20,
    backgroundColor: '#FF6B35',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  promoContent: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  promoSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 12,
  },
  promoButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  promoButtonText: {
    color: '#FF6B35',
    fontWeight: '600',
  },
});

export default HomeScreen;