// src/screens/customer/HomeScreen.tsx
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

// 🎨 DARK ORANGE DESIGN SYSTEM
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
    warning: '#FFC107',
    info: '#2196F3',
  }
};

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user } = useSelector((state: RootState) => state.auth);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [refreshing, setRefreshing] = useState(false);

  const [featuredTables, setFeaturedTables] = useState([
    { 
      id: '1', 
      name: 'VIP Table', 
      capacity: 6, 
      status: 'available',
      price: 75000,
      features: ['LED Lighting', 'Premium Cloth'],
      image: 'vip'
    },
    { 
      id: '2', 
      name: 'Table A', 
      capacity: 4, 
      status: 'available',
      price: 50000,
      features: ['Standard', 'Tournament Ready'],
      image: 'standard'
    },
    { 
      id: '3', 
      name: 'Family Table', 
      capacity: 8, 
      status: 'occupied',
      price: 100000,
      features: ['Large Size', 'Family Package'],
      image: 'family'
    },
    { 
      id: '4', 
      name: 'Tournament Pro', 
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
      title: 'Book Now', 
      screen: 'Booking',
      description: 'Reserve table'
    },
    { 
      icon: 'restaurant-outline', 
      title: 'Menu', 
      screen: 'Menu',
      description: 'View menu'
    },
    { 
      icon: 'time-outline', 
      title: 'History', 
      screen: 'BookingHistory',
      description: 'Your bookings'
    },
    { 
      icon: 'person-outline', 
      title: 'Profile', 
      screen: 'Profile',
      description: 'My account'
    },
  ];

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      const updatedTables = featuredTables.map(table => ({
        ...table,
        status: Math.random() > 0.5 ? 'available' : 'occupied'
      }));
      setFeaturedTables(updatedTables);
      setRefreshing(false);
    }, 1500);
  }, []);

  const headerScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.95],
    extrapolate: 'clamp',
  });

  const handleTablePress = (table: any) => {
    if (table.status === 'available') {
      navigation.navigate('Booking', { preSelectedTable: table.id 
      });
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
      {/* 🌟 HEADER */}
      <Animated.View style={[styles.header, { transform: [{ scale: headerScale }] }]}>
        <View style={styles.headerGlow} />
        <View style={styles.headerContent}>
          <View style={styles.userInfo}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={24} color={COLORS.orange.primary} />
              </View>
              <View style={styles.onlineIndicator} />
            </View>
            <View style={styles.greetingContainer}>
              <Text style={styles.greeting}>Welcome back,</Text>
              <Text style={styles.userName}>{user?.name || 'Guest'} 👋</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => navigation.navigate('Notification' as never)}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={24} color={COLORS.text.primary} />
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
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={COLORS.orange.primary}
            colors={[COLORS.orange.primary]}
          />
        }
      >
        {/* 🎯 QUICK ACTIONS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Quick Access</Text>
              <View style={styles.titleUnderline} />
            </View>
          </View>
          
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={action.screen}
                style={[
                  styles.quickActionCard,
                  index === 0 && styles.quickActionCardPrimary
                ]}
                onPress={() => handleQuickAction(action.screen)}
                activeOpacity={0.8}
              >
                {index === 0 && <View style={styles.cardGlow} />}
                <View style={[
                  styles.actionIconContainer,
                  index === 0 ? styles.actionIconPrimary : styles.actionIconSecondary
                ]}>
                  <Ionicons 
                    name={action.icon as any} 
                    size={24} 
                    color={index === 0 ? '#000' : COLORS.orange.primary} 
                  />
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionDescription}>{action.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 🎱 FEATURED TABLES */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Available Tables</Text>
              <View style={styles.titleUnderline} />
            </View>
            <TouchableOpacity 
              style={styles.seeAllButton}
              onPress={() => navigation.navigate('Booking' as never)}
            >
              <Text style={styles.seeAllText}>View All</Text>
              <Ionicons name="arrow-forward" size={16} color={COLORS.orange.primary} />
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
                style={styles.tableCard}
                onPress={() => handleTablePress(table)}
                activeOpacity={0.9}
                disabled={table.status === 'occupied'}
              >
                {table.status === 'available' && (
                  <View style={styles.tableCardGlow} />
                )}
                
                <View style={styles.tableCardInner}>
                  <View style={styles.tableIconWrapper}>
                    <View style={[
                      styles.tableIcon,
                      table.status === 'occupied' && styles.tableIconOccupied
                    ]}>
                      <Ionicons 
                        name={getTableIcon(table.image) as any} 
                        size={40} 
                        color={table.status === 'occupied' ? COLORS.text.tertiary : COLORS.orange.primary} 
                      />
                    </View>
                    
                    <View style={[
                      styles.statusBadge,
                      table.status === 'available' ? styles.availableBadge : styles.occupiedBadge
                    ]}>
                      <View style={[
                        styles.statusDot,
                        { backgroundColor: table.status === 'available' ? COLORS.status.success : COLORS.status.error }
                      ]} />
                      <Text style={styles.statusText}>
                        {table.status === 'available' ? 'Available' : 'Occupied'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.tableInfo}>
                    <Text style={styles.tableName}>{table.name}</Text>
                    <View style={styles.capacityRow}>
                      <Ionicons name="people" size={14} color={COLORS.text.secondary} />
                      <Text style={styles.capacityText}>{table.capacity} people</Text>
                    </View>
                  </View>

                  <View style={styles.featuresContainer}>
                    {table.features.map((feature, idx) => (
                      <View key={idx} style={styles.featurePill}>
                        <Text style={styles.featureText}>{feature}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.tableFooter}>
                    <View style={styles.priceContainer}>
                      <Text style={styles.priceLabel}>Starting from</Text>
                      <Text style={styles.price}>Rp {table.price.toLocaleString()}</Text>
                      <Text style={styles.priceUnit}>/hour</Text>
                    </View>
                    
                    {table.status === 'available' ? (
                      <TouchableOpacity style={styles.bookButton}>
                        <Text style={styles.bookButtonText}>Book</Text>
                        <Ionicons name="arrow-forward" size={16} color="#000" />
                      </TouchableOpacity>
                    ) : (
                      <View style={styles.occupiedButton}>
                        <Ionicons name="lock-closed" size={14} color={COLORS.text.tertiary} />
                        <Text style={styles.occupiedButtonText}>Busy</Text>
                      </View>
                    )}
                  </View>
                </View>

                {table.status === 'occupied' && (
                  <View style={styles.occupiedOverlay} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 🔥 PROMO BANNER */}
        <TouchableOpacity 
          style={styles.promoBanner}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('Promo' as never)}
        >
          <View style={styles.promoGradient} />
          <View style={styles.promoContent}>
            <View style={styles.promoBadge}>
              <Ionicons name="flame" size={12} color="#000" />
              <Text style={styles.promoBadgeText}>HOT DEAL</Text>
            </View>
            <Text style={styles.promoTitle}>20% OFF Weekdays</Text>
            <Text style={styles.promoSubtitle}>Monday - Friday • 10:00 - 16:00</Text>
            <View style={styles.promoButtonRow}>
              <View style={styles.promoButton}>
                <Text style={styles.promoButtonText}>Claim Now</Text>
                <Ionicons name="arrow-forward" size={14} color="#000" />
              </View>
              <View style={styles.promoTimer}>
                <Ionicons name="time-outline" size={14} color="#000" />
                <Text style={styles.promoTimerText}>2 days left</Text>
              </View>
            </View>
          </View>
          <View style={styles.promoIconContainer}>
            <Ionicons name="ticket" size={80} color="rgba(0,0,0,0.1)" />
          </View>
        </TouchableOpacity>

        {/* 📊 STATS */}
        <View style={styles.statsSection}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Your Statistics</Text>
              <View style={styles.titleUnderline} />
            </View>
          </View>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Ionicons name="calendar" size={24} color={COLORS.orange.primary} />
              </View>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Total Bookings</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Ionicons name="time" size={24} color={COLORS.status.success} />
              </View>
              <Text style={styles.statNumber}>48</Text>
              <Text style={styles.statLabel}>Hours Played</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Ionicons name="star" size={24} color={COLORS.status.warning} />
              </View>
              <Text style={styles.statNumber}>4.8</Text>
              <Text style={styles.statLabel}>Your Rating</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
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
    paddingBottom: 24,
    paddingHorizontal: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  headerGlow: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 200,
    height: 200,
    backgroundColor: COLORS.orange.glow,
    borderRadius: 100,
    opacity: 0.3,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.bg.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.orange.primary,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.status.success,
    borderWidth: 2,
    borderColor: COLORS.bg.secondary,
  },
  greetingContainer: {
    justifyContent: 'center',
  },
  greeting: {
    fontSize: 13,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginTop: 2,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.bg.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: COLORS.orange.primary,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#000',
    fontSize: 10,
    fontWeight: 'bold',
  },

  // SECTION
  section: {
    paddingHorizontal: 20,
    marginTop: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: 6,
  },
  titleUnderline: {
    width: 40,
    height: 3,
    backgroundColor: COLORS.orange.primary,
    borderRadius: 2,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bg.tertiary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  seeAllText: {
    color: COLORS.orange.primary,
    fontWeight: '600',
    marginRight: 4,
    fontSize: 13,
  },

  // QUICK ACTIONS
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: (SCREEN_WIDTH - 52) / 2,
    backgroundColor: COLORS.bg.secondary,
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.bg.tertiary,
  },
  quickActionCardPrimary: {
    backgroundColor: COLORS.bg.tertiary,
    borderColor: COLORS.orange.primary,
    borderWidth: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  cardGlow: {
    position: 'absolute',
    top: -50,
    left: -50,
    width: 100,
    height: 100,
    backgroundColor: COLORS.orange.glow,
    borderRadius: 50,
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionIconPrimary: {
    backgroundColor: COLORS.orange.primary,
  },
  actionIconSecondary: {
    backgroundColor: COLORS.bg.elevated,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 12,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },

  // TABLE CARDS
  tablesContainer: {
    paddingRight: 20,
  },
  tableCard: {
    width: 300,
    marginRight: 16,
    position: 'relative',
  },
  tableCardGlow: {
    position: 'absolute',
    top: -20,
    left: -20,
    right: -20,
    bottom: -20,
    backgroundColor: COLORS.orange.glow,
    borderRadius: 30,
    opacity: 0.3,
  },
  tableCardInner: {
    backgroundColor: COLORS.bg.secondary,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.bg.tertiary,
  },
  tableIconWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  tableIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.bg.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.orange.primary,
  },
  tableIconOccupied: {
    borderColor: COLORS.bg.elevated,
    opacity: 0.5,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
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
    marginRight: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  tableInfo: {
    marginBottom: 12,
  },
  tableName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: 6,
  },
  capacityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  capacityText: {
    fontSize: 13,
    color: COLORS.text.secondary,
    marginLeft: 6,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  featurePill: {
    backgroundColor: COLORS.bg.elevated,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  featureText: {
    fontSize: 11,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  tableFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.bg.tertiary,
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 11,
    color: COLORS.text.secondary,
    marginBottom: 2,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.orange.primary,
  },
  priceUnit: {
    fontSize: 12,
    color: COLORS.text.secondary,
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.orange.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  bookButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 6,
  },
  occupiedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bg.elevated,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  occupiedButtonText: {
    fontSize: 13,
    color: COLORS.text.tertiary,
    marginLeft: 6,
    fontWeight: '600',
  },
  occupiedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 24,
  },

  // PROMO BANNER
  promoBanner: {
    marginHorizontal: 20,
    marginTop: 28,
    backgroundColor: COLORS.orange.primary,
    borderRadius: 24,
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
    minHeight: 160,
  },
  promoGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  promoContent: {
    flex: 1,
    zIndex: 1,
  },
  promoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  promoBadgeText: {
    color: COLORS.orange.primary,
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  promoTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 6,
  },
  promoSubtitle: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.7)',
    marginBottom: 16,
    fontWeight: '500',
  },
  promoButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  promoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
  },
  promoButtonText: {
    color: COLORS.orange.primary,
    fontWeight: 'bold',
    marginRight: 6,
    fontSize: 13,
  },
  promoTimer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  promoTimerText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  promoIconContainer: {
    position: 'absolute',
    right: -20,
    bottom: -20,
    opacity: 0.3,
  },

  // STATS
  statsSection: {
    paddingHorizontal: 20,
    marginTop: 28,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.bg.secondary,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: COLORS.bg.tertiary,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.bg.elevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
});

export default HomeScreen;
