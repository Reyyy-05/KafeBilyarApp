// src/screens/customer/MenuScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { addItem, removeItem, increaseQuantity, decreaseQuantity } from '../../store/slices/cartSlice';
import { BlurView } from 'expo-blur';

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
};

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'drinks' | 'food' | 'dessert';
  image: string;
  emoji: string;
}

const MenuScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartTotal = useSelector((state: RootState) => state.cart.total);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const bookingData = route.params?.bookingData;

  const menuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Espresso',
      description: 'Kopi espresso premium dengan crema tebal',
      price: 25000,
      category: 'drinks',
      image: 'coffee',
      emoji: '☕',
    },
    {
      id: '2',
      name: 'Cappuccino',
      description: 'Espresso dengan steamed milk dan foam',
      price: 30000,
      category: 'drinks',
      image: 'coffee',
      emoji: '☕',
    },
    {
      id: '3',
      name: 'Latte',
      description: 'Espresso dengan susu hangat',
      price: 32000,
      category: 'drinks',
      image: 'coffee',
      emoji: '🥛',
    },
    {
      id: '4',
      name: 'Iced Tea',
      description: 'Teh dingin segar dengan lemon',
      price: 15000,
      category: 'drinks',
      image: 'tea',
      emoji: '🍹',
    },
    {
      id: '5',
      name: 'Orange Juice',
      description: 'Jus jeruk segar tanpa gula',
      price: 20000,
      category: 'drinks',
      image: 'juice',
      emoji: '🍊',
    },
    {
      id: '6',
      name: 'Nasi Goreng',
      description: 'Nasi goreng spesial dengan telur',
      price: 35000,
      category: 'food',
      image: 'food',
      emoji: '🍛',
    },
    {
      id: '7',
      name: 'Mie Goreng',
      description: 'Mie goreng dengan sayuran',
      price: 30000,
      category: 'food',
      image: 'food',
      emoji: '🍜',
    },
    {
      id: '8',
      name: 'Club Sandwich',
      description: 'Sandwich dengan ayam dan sayuran',
      price: 40000,
      category: 'food',
      image: 'food',
      emoji: '🥪',
    },
    {
      id: '9',
      name: 'French Fries',
      description: 'Kentang goreng crispy dengan saus',
      price: 25000,
      category: 'food',
      image: 'food',
      emoji: '🍟',
    },
    {
      id: '10',
      name: 'Chocolate Cake',
      description: 'Kue coklat lembut dengan topping',
      price: 35000,
      category: 'dessert',
      image: 'dessert',
      emoji: '🍰',
    },
    {
      id: '11',
      name: 'Ice Cream',
      description: 'Es krim vanilla dengan topping',
      price: 20000,
      category: 'dessert',
      image: 'dessert',
      emoji: '🍨',
    },
    {
      id: '12',
      name: 'Brownie',
      description: 'Brownies coklat hangat',
      price: 28000,
      category: 'dessert',
      image: 'dessert',
      emoji: '🍫',
    },
  ];

  const categories = [
    { id: 'all', label: 'Semua', icon: 'apps' },
    { id: 'drinks', label: 'Minuman', icon: 'cafe' },
    { id: 'food', label: 'Makanan', icon: 'restaurant' },
    { id: 'dessert', label: 'Dessert', icon: 'ice-cream' },
  ];

  const filteredMenu = menuItems.filter(item => {
    const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleAddToCart = (item: MenuItem) => {
    dispatch(addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.emoji,
    }));
  };

  const handleIncreaseQuantity = (itemId: string) => {
    dispatch(increaseQuantity(itemId));
  };

  const handleDecreaseQuantity = (itemId: string) => {
    dispatch(decreaseQuantity(itemId));
  };

  const handleRemoveItem = (itemId: string) => {
    dispatch(removeItem(itemId));
  };

  const getItemQuantity = (itemId: string): number => {
    const item = cartItems.find(i => i.id === itemId);
    return item ? item.quantity : 0;
  };

  const handleProceed = () => {
    if (cartItems.length === 0) {
      alert('Keranjang masih kosong. Tambahkan menu terlebih dahulu.');
      return;
    }

    navigation.navigate('History', {
      bookingWithMenu: {
        ...bookingData,
        menuItems: cartItems,
        menuTotal: cartTotal,
        grandTotal: (bookingData?.table?.pricePerHour || 0) * (bookingData?.duration || 0) + cartTotal,
      }
    });
  };

  return (
    <View style={styles.container}>
      {/* 🌟 HEADER */}
      <View style={styles.header}>
        <View style={styles.headerGlow} />
        {bookingData && (
          <View style={styles.bookingInfoBanner}>
            <View style={styles.bookingInfoContent}>
              <View style={styles.bookingInfoRow}>
                <Ionicons name="calendar" size={14} color={COLORS.orange.primary} />
                <Text style={styles.bookingInfoText}>
                  {bookingData.table?.name} • {bookingData.date} • {bookingData.time}
                </Text>
              </View>
              <Text style={styles.bookingInfoSubtext}>
                Durasi: {bookingData.duration} jam
              </Text>
            </View>
          </View>
        )}
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text.primary} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Menu</Text>
            <Text style={styles.headerSubtitle}>Pilih makanan & minuman</Text>
          </View>
          <View style={{ width: 44 }} />
        </View>
      </View>

      {/* 🔍 SEARCH BAR */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={COLORS.text.secondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari menu..."
            placeholderTextColor={COLORS.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={COLORS.text.secondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 🏷️ CATEGORY CHIPS - FIXED SCROLLABLE & COMPACT */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
        style={styles.categoriesScrollView}
      >
        {categories.map(cat => {
          const isSelected = selectedCategory === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryChip,
                isSelected && styles.categoryChipSelected,
              ]}
              onPress={() => setSelectedCategory(cat.id)}
              activeOpacity={0.7}
            >
              {isSelected && <View style={styles.categoryChipGlow} />}
              <Ionicons 
                name={cat.icon as any} 
                size={16} 
                color={isSelected ? COLORS.orange.primary : COLORS.text.secondary} 
              />
              <Text style={[
                styles.categoryText,
                isSelected && styles.categoryTextSelected
              ]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* 🍽️ MENU ITEMS */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.menuList}
      >
        {filteredMenu.map((item) => {
          const quantity = getItemQuantity(item.id);
          const isInCart = quantity > 0;

          return (
            <View key={item.id} style={styles.menuCard}>
              {isInCart && <View style={styles.menuCardGlow} />}
              
              <View style={styles.menuCardContent}>
                <View style={styles.menuIcon}>
                  <Text style={styles.menuEmoji}>{item.emoji}</Text>
                </View>

                <View style={styles.menuInfo}>
                  <Text style={styles.menuName}>{item.name}</Text>
                  <Text style={styles.menuDescription} numberOfLines={2}>
                    {item.description}
                  </Text>
                  <Text style={styles.menuPrice}>
                    Rp {item.price.toLocaleString()}
                  </Text>
                </View>

                {isInCart ? (
                  <View style={styles.quantityControls}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => {
                        if (quantity === 1) {
                          handleRemoveItem(item.id);
                        } else {
                          handleDecreaseQuantity(item.id);
                        }
                      }}
                    >
                      <Ionicons 
                        name={quantity === 1 ? "trash" : "remove"} 
                        size={18} 
                        color={COLORS.text.primary} 
                      />
                    </TouchableOpacity>
                    
                    <Text style={styles.quantityText}>{quantity}</Text>
                    
                    <TouchableOpacity
                      style={[styles.quantityButton, styles.quantityButtonAdd]}
                      onPress={() => handleIncreaseQuantity(item.id)}
                    >
                      <Ionicons name="add" size={18} color="#000" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => handleAddToCart(item)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="add" size={20} color="#000" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}

        <View style={{ height: 160 }} />
      </ScrollView>

      {/* 🛒 CART SUMMARY - GLASSMORPHISM */}
      {cartItems.length > 0 && (
        <BlurView intensity={80} tint="dark" style={styles.cartSummaryBlur}>
          <View style={styles.cartSummaryOverlay} />
          <View style={styles.cartSummaryContent}>
            <View style={styles.cartInfo}>
              <View style={styles.cartBadge}>
                <Ionicons name="cart" size={18} color={COLORS.orange.primary} />
                <View style={styles.cartCount}>
                  <Text style={styles.cartCountText}>{cartItems.length}</Text>
                </View>
              </View>
              <View style={styles.cartTextInfo}>
                <Text style={styles.cartLabel}>
                  {cartItems.length} items
                </Text>
                <Text style={styles.cartTotal}>
                  Rp {cartTotal.toLocaleString()}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.proceedButton}
              onPress={handleProceed}
              activeOpacity={0.8}
            >
              <Text style={styles.proceedButtonText}>Lanjut</Text>
              <Ionicons name="arrow-forward" size={18} color="#000" />
            </TouchableOpacity>
          </View>
        </BlurView>
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
    paddingBottom: 16,
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
  bookingInfoBanner: {
    backgroundColor: COLORS.bg.tertiary,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.orange.primary,
  },
  bookingInfoContent: {},
  bookingInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  bookingInfoText: {
    fontSize: 13,
    color: COLORS.text.primary,
    fontWeight: '600',
    marginLeft: 6,
  },
  bookingInfoSubtext: {
    fontSize: 11,
    color: COLORS.text.secondary,
    marginLeft: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
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

  // SEARCH
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bg.secondary,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.bg.tertiary,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: COLORS.text.primary,
  },

  // CATEGORIES - FIXED SCROLLABLE & COMPACT
  categoriesScrollView: {
    maxHeight: 50,
    flexGrow: 0,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bg.secondary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.bg.tertiary,
    position: 'relative',
    overflow: 'hidden',
  },
  categoryChipSelected: {
    backgroundColor: COLORS.bg.tertiary,
    borderColor: COLORS.orange.primary,
    borderWidth: 2,
  },
  categoryChipGlow: {
    position: 'absolute',
    top: -15,
    left: -15,
    width: 30,
    height: 30,
    backgroundColor: COLORS.orange.glow,
    borderRadius: 15,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text.secondary,
    marginLeft: 6,
  },
  categoryTextSelected: {
    color: COLORS.orange.primary,
  },

  // MENU ITEMS
  menuList: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  menuCard: {
    backgroundColor: COLORS.bg.secondary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.bg.tertiary,
    position: 'relative',
    overflow: 'hidden',
  },
  menuCardGlow: {
    position: 'absolute',
    top: -30,
    left: -30,
    width: 60,
    height: 60,
    backgroundColor: COLORS.orange.glow,
    borderRadius: 30,
  },
  menuCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.bg.elevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuEmoji: {
    fontSize: 32,
  },
  menuInfo: {
    flex: 1,
  },
  menuName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 12,
    color: COLORS.text.secondary,
    marginBottom: 6,
  },
  menuPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.orange.primary,
  },

  // QUANTITY CONTROLS
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bg.elevated,
    borderRadius: 20,
    padding: 4,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.bg.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonAdd: {
    backgroundColor: COLORS.orange.primary,
  },
  quantityText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginHorizontal: 14,
    minWidth: 20,
    textAlign: 'center',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.orange.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // CART SUMMARY - GLASSMORPHISM
  cartSummaryBlur: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  cartSummaryOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26, 26, 26, 0.7)',
  },
  cartSummaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 24,
  },
  cartInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cartBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(53, 53, 53, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cartCount: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.orange.primary,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.bg.secondary,
  },
  cartCountText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
  },
  cartTextInfo: {},
  cartLabel: {
    fontSize: 12,
    color: COLORS.text.secondary,
    marginBottom: 2,
  },
  cartTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.orange.primary,
  },
  proceedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.orange.primary,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: COLORS.orange.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  proceedButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 8,
  },
});

export default MenuScreen;
