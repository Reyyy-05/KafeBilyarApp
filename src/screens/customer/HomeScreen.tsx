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
import { RootState } from '../../store';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user } = useSelector((state: RootState) => state.auth);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [refreshing, setRefreshing] = useState(false);

  // Enhanced data dengan real-time status
  const [featuredTables, setFeaturedTables] = useState([
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
    { 
      id: '4', 
      name: 'Meja Tournament', 
      capacity: 4, 
      status: 'available',
      price: 60000,
      features: ['Pro Level', 'Championship'],
      image: 'tournament'
    },
  ]);

  const quickActions = [
    { 
      icon: 'calendar-outline', 
      title: 'Booking', 
      screen: 'Booking',
      color: '#FF6B35',
      description: 'Pesan meja'
    },
    { 
      icon: 'restaurant-outline', 
      title: 'Menu', 
      screen: 'Menu',
      color: '#4CAF50',
      description: 'Lihat menu'
    },
    { 
      icon: 'time-outline', 
      title: 'Riwayat', 
      screen: 'BookingHistory',
      color: '#2196F3',
      description: 'Booking history'
    },
    { 
      icon: 'person-outline', 
      title: 'Profil', 
      screen: 'Profile',
      color: '#9C27B0',
      description: 'Akun saya'
    },
  ];

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate API call to refresh table status
    setTimeout(() => {
      // Update table status randomly for demo
      const updatedTables = featuredTables.map(table => ({
        ...table,
        status: Math.random() > 0.5 ? 'available' : 'occupied'
      }));
      setFeaturedTables(updatedTables);
      setRefreshing(false);
    }, 1500);
  }, []);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  const handleTablePress = (table: any) => {
    if (table.status === 'available') {
      navigation.navigate('Booking' as never, { 
        preSelectedTable: table.id 
      } as never);
    }
  };

  const handleQuickAction = (screen: string) => {
    navigation.navigate(screen as never);
  };

  const getTableIcon = (imageType: string) => {
    switch (imageType) {
      case 'vip': return 'star';
      case 'tournament': return 'trophy';
      case 'family': return 'people';
      default: return 'cafe';
    }
  };

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
            onPress={() => navigation.navigate('Notification' as never)}
          >
            <Ionicons name="notifications-outline" size={24} color="#333" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>2</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Quick Actions Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Akses Cepat</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={action.screen}
                style={styles.quickActionCard}
                onPress={() => handleQuickAction(action.screen)}
                activeOpacity={0.7}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                  <Ionicons name={action.icon as any} size={24} color="#fff" />
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionDescription}>{action.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Featured Tables */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Meja Tersedia</Text>
              <Text style={styles.sectionSubtitle}>Pilih meja favorit Anda</Text>
            </View>
            <TouchableOpacity 
              style={styles.seeAllButton}
              onPress={() => navigation.navigate('Booking' as never)}
            >
              <Text style={styles.seeAllText}>Lihat Semua</Text>
              <Ionicons name="chevron-forward" size={16} color="#FF6B35" />
            </TouchableOpacity>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tablesContainer}
          >
            {featuredTables.map((table) => (
              <TouchableOpacity 
                key={table.id} 
                style={[
                  styles.tableCard,
                  table.status === 'occupied' && styles.tableCardOccupied
                ]}
                onPress={() => handleTablePress(table)}
                activeOpacity={0.8}
                disabled={table.status === 'occupied'}
              >
                <View style={styles.tableHeader}>
                  <View style={[
                    styles.tableImage,
                    table.status === 'occupied' && styles.tableImageOccupied
                  ]}>
                    <Ionicons 
                      name={getTableIcon(table.image) as any} 
                      size={32} 
                      color={table.status === 'occupied' ? '#999' : '#FF6B35'} 
                    />
                  </View>
                  <View style={styles.tableInfo}>
                    <Text style={styles.tableName}>{table.name}</Text>
                    <Text style={styles.tablePrice}>Rp {table.price.toLocaleString()}/jam</Text>
                  </View>
                </View>

                <View style={styles.tableDetails}>
                  <View style={styles.capacityBadge}>
                    <Ionicons name="people" size={12} color="#666" />
                    <Text style={styles.capacityText}>{table.capacity} orang</Text>
                  </View>
                  
                  <View style={styles.features}>
                    {table.features.slice(0, 2).map((feature, idx) => (
                      <Text key={idx} style={styles.featureText}>• {feature}</Text>
                    ))}
                  </View>
                </View>

                <View style={styles.tableFooter}>
                  <View style={[
                    styles.statusBadge,
                    table.status === 'available' ? styles.availableBadge : styles.occupiedBadge
                  ]}>
                    <Ionicons 
                      name={table.status === 'available' ? 'checkmark-circle' : 'close-circle'} 
                      size={14} 
                      color={table.status === 'available' ? '#4CAF50' : '#F44336'} 
                    />
                    <Text style={styles.statusText}>
                      {table.status === 'available' ? 'Tersedia' : 'Terisi'}
                    </Text>
                  </View>
                  
                  {table.status === 'available' && (
                    <View style={styles.bookNowCta}>
                      <Text style={styles.bookNowText}>Booking</Text>
                      <Ionicons name="arrow-forward" size={14} color="#FF6B35" />
                    </View>
                  )}
                </View>

                {table.status === 'occupied' && (
                  <View style={styles.occupiedOverlay}>
                    <Text style={styles.occupiedText}>SEDANG DIPAKAI</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Promo Banner dengan animasi */}
        <TouchableOpacity 
          style={styles.promoBanner}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('Promo' as never)}
        >
          <View style={styles.promoContent}>
            <View style={styles.promoBadge}>
              <Text style={styles.promoBadgeText}>PROMO</Text>
            </View>
            <Text style={styles.promoTitle}>Diskon 20% Weekday</Text>
            <Text style={styles.promoSubtitle}>Senin - Jumat • 10:00 - 16:00 WIB</Text>
            <View style={styles.promoButton}>
              <Text style={styles.promoButtonText}>Klaim Sekarang</Text>
              <Ionicons name="gift" size={16} color="#FF6B35" />
            </View>
          </View>
          <View style={styles.promoIcon}>
            <Ionicons name="sparkles" size={80} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Statistik Anda</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="calendar" size={24} color="#FF6B35" />
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Total Booking</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="time" size={24} color="#4CAF50" />
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Jam Bermain</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="star" size={24} color="#FFC107" />
              <Text style={styles.statNumber}>4.8</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingTop: 60,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
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
    padding: 12,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF3B30',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  seeAllText: {
    color: '#FF6B35',
    fontWeight: '600',
    marginRight: 4,
  },
  // Quick Actions Grid
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  quickActionCard: {
    width: (SCREEN_WIDTH - 60) / 2,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  // Tables Section
  tablesContainer: {
    paddingHorizontal: 4,
  },
  tableCard: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
  },
  tableCardOccupied: {
    opacity: 0.7,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tableImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tableImageOccupied: {
    backgroundColor: '#f0f0f0',
  },
  tableInfo: {
    flex: 1,
  },
  tableName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  tablePrice: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '600',
  },
  tableDetails: {
    marginBottom: 12,
  },
  capacityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  capacityText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  features: {
    marginLeft: 4,
  },
  featureText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  tableFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
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
    color: '#333',
    marginLeft: 4,
  },
  bookNowCta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  bookNowText: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: '600',
    marginRight: 4,
  },
  occupiedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  occupiedText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // Promo Banner
  promoBanner: {
    margin: 20,
    backgroundColor: '#FF6B35',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  promoContent: {
    flex: 1,
  },
  promoBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  promoBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  promoButtonText: {
    color: '#FF6B35',
    fontWeight: '600',
    marginRight: 4,
  },
  promoIcon: {
    opacity: 0.8,
  },
  // Stats Section
  statsSection: {
    padding: 20,
    paddingTop: 0,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default HomeScreen;