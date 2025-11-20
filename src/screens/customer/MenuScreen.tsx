// src/screens/customer/MenuScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, FlatList, ScrollView, Alert } from 'react-native';
import { 
  Searchbar, 
  Card, 
  Title, 
  Paragraph, 
  Chip, 
  Button, 
  Text, 
  Appbar, 
  Divider,
  IconButton  // ✅ Added for quantity controls
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// ✅ SINGLE import cartSlice actions
import { 
  addToCart, 
  decreaseQuantity, 
  removeFromCart, 
  clearCart 
} from '../../store/slices/cartSlice';

import { RootState } from '../../store';
import { RootStackParamList } from '../../navigation/types';

type MenuScreenNavigationProp = StackNavigationProp<RootStackParamList, 'History'>;

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

  const MenuScreen = () => { 
  const navigation = useNavigation<MenuScreenNavigationProp>();
  const route = useRoute();
  const dispatch = useDispatch();
  
  const cart = useSelector((state: RootState) => state.cart);
  
  // Parameters dari booking flow - TYPE SAFE
  const params = route.params as RootStackParamList['Menu'];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const menuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Espresso',
      description: 'Kopi espresso premium dengan crema tebal',
      price: 25000,
      category: 'drinks',
      image: '☕'
    },
    {
      id: '2',
      name: 'Cappuccino',
      description: 'Espresso dengan steamed milk dan foam',
      price: 30000,
      category: 'drinks',
      image: '🥛'
    },
    {
      id: '3',
      name: 'Latte',
      description: 'Espresso dengan steamed milk yang creamy',
      price: 32000,
      category: 'drinks',
      image: '☕'
    },
    {
      id: '4',
      name: 'Ice Lemon Tea',
      description: 'Teh lemon es segar',
      price: 20000,
      category: 'drinks',
      image: '🍹'
    },
    {
      id: '5',
      name: 'French Fries',
      description: 'Kentang goreng renyah dengan seasoning special',
      price: 35000,
      category: 'food',
      image: '🍟'
    },
    {
      id: '6',
      name: 'Chicken Wings',
      description: 'Sayap ayam crispy dengan saus special',
      price: 55000,
      category: 'food',
      image: '🍗'
    },
    {
      id: '7',
      name: 'Beef Burger',
      description: 'Burger dengan daging sapi premium dan sayuran segar',
      price: 65000,
      category: 'food',
      image: '🍔'
    },
    {
      id: '8',
      name: 'Chocolate Cake',
      description: 'Kue coklat lembut dengan ganache',
      price: 45000,
      category: 'dessert',
      image: '🍰'
    },
    {
      id: '9',
      name: 'Ice Cream',
      description: 'Es krim vanilla dengan topping coklat',
      price: 25000,
      category: 'dessert',
      image: '🍨'
    },
    {
      id: '10',
      name: 'Mineral Water',
      description: 'Air mineral botol 600ml',
      price: 15000,
      category: 'drinks',
      image: '💧'
    }
  ];

  const categories = [
    { id: 'all', name: 'Semua Menu' },
    { id: 'drinks', name: 'Minuman' },
    { id: 'food', name: 'Makanan' },
    { id: 'dessert', name: 'Dessert' }
  ];

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (item: MenuItem) => {
    dispatch(addToCart({
      ...item,
      quantity: 1
    }));
  };
  const handleDecreaseQuantity = (itemId: string) => {
  dispatch(decreaseQuantity(itemId));
};

const handleRemoveItem = (itemId: string) => {
  dispatch(removeFromCart(itemId));
};

  const handleContinueToSummary = () => {
    if (params?.fromBooking && params.tableId && params.duration) {
      // ✅ PERBAIKAN: Langsung pass properties, bukan summaryData object
      navigation.navigate('History', {
        isBookingSummary: true,
        tableId: params.tableId,
        tableName: params.tableName,
        duration: params.duration,
        bookingDate: params.bookingDate,
        bookingTime: params.bookingTime,
        tablePrice: params.tablePrice,
        totalTablePrice: params.totalTablePrice,
        cartItems: cart.items,
        cartTotal: cart.total,
        grandTotal: calculateGrandTotal()
      });
    }
  };

  const handleBack = () => {
    if (params?.fromBooking) {
      dispatch(clearCart());
      navigation.goBack();
    }
  };

  // Di MenuScreen.tsx - update handleCancelBooking
const handleCancelBooking = () => {
  Alert.alert(
    'Batalkan Pesanan',
    'Apakah Anda yakin ingin membatalkan pesanan? Item di keranjang akan dihapus.',
    [
      { text: 'Lanjutkan Pesanan', style: 'cancel' },
      { 
        text: 'Batalkan', 
        style: 'destructive',
        onPress: () => {
          dispatch(clearCart());
          // ✅ PERBAIKAN: Kembali ke Main tab, bukan Booking screen
          navigation.reset({
            index: 0,
            routes: [{ name: 'Main' }],
          });
        }
      }
    ]
  );
};

  const getCartQuantity = (itemId: string) => {
    const item = cart.items.find(item => item.id === itemId);
    return item ? item.quantity : 0;
  };

  const calculateGrandTotal = () => {
    const tableTotal = params?.totalTablePrice || 0;
    return tableTotal + cart.total;
  };

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
  <Card style={styles.menuCard}>
    <Card.Content>
      <View style={styles.menuItemHeader}>
        <Text style={styles.menuEmoji}>{item.image}</Text>
        <View style={styles.menuItemInfo}>
          <Title style={styles.menuItemName}>{item.name}</Title>
          <Paragraph style={styles.menuItemDescription}>
            {item.description}
          </Paragraph>
          <Text style={styles.menuItemPrice}>Rp {item.price.toLocaleString()}</Text>
        </View>
      </View>
    </Card.Content>
    <Card.Actions>
      <View style={styles.quantityContainer}>
        <Text style={[
          styles.quantityText,
          getCartQuantity(item.id) > 0 && styles.quantityTextActive
        ]}>
          {getCartQuantity(item.id) > 0 
            ? `${getCartQuantity(item.id)}x di keranjang` 
            : 'Belum dipesan'
          }
        </Text>
      </View>
      
      {/* ✅ NEW: Quantity controls atau Add button */}
      {getCartQuantity(item.id) > 0 ? (
        <View style={styles.quantityControls}>
          <IconButton 
            icon="minus-circle" 
            size={24} 
            iconColor="#FF6B35"
            onPress={() => handleDecreaseQuantity(item.id)}
          />
          <Text style={styles.quantityNumber}>{getCartQuantity(item.id)}</Text>
          <IconButton 
            icon="plus-circle" 
            size={24} 
            iconColor="#FF6B35"
            onPress={() => handleAddToCart(item)}
          />
          <IconButton 
            icon="delete" 
            size={24} 
            iconColor="#F44336"
            onPress={() => handleRemoveItem(item.id)}
          />
        </View>
      ) : (
        <Button 
          mode="contained" 
          onPress={() => handleAddToCart(item)}
          style={styles.addButton}
          compact
        >
          + Tambah
        </Button>
      )}
    </Card.Actions>
  </Card>
);

  // Jika dari booking flow, tampilkan layout khusus
  if (params?.fromBooking) {
    return (
      <View style={styles.container}>
        {/* Custom Header untuk Booking Flow */}
        <Appbar.Header>
          <Appbar.BackAction onPress={handleBack} />
          <Appbar.Content 
            title={`Pesan untuk ${params.tableName}`}
            subtitle={`${params.duration} jam • ${params.bookingTime}`}
          />
          <Appbar.Action icon="close" onPress={handleCancelBooking} />
        </Appbar.Header>

        <ScrollView style={styles.scrollViewWithHeader}>
          {/* Booking Info Banner */}
          <Card style={styles.bookingInfoCard}>
            <Card.Content>
              <View style={styles.bookingInfo}>
                <View style={styles.bookingDetails}>
                  <Text style={styles.bookingTitle}>Booking {params.tableName}</Text>
                  <Text style={styles.bookingSubtitle}>
                    {params.bookingDate} • {params.bookingTime} • {params.duration} jam
                  </Text>
                  <Text style={styles.tablePrice}>
                    Meja: Rp {(params.tablePrice || 0).toLocaleString()}/jam
                  </Text>
                </View>
                <View style={styles.cartSummary}>
                  <Text style={styles.cartCount}>{cart.items.length} items</Text>
                  <Text style={styles.cartTotal}>+ Rp {cart.total.toLocaleString()}</Text>
                  <Divider style={styles.cartDivider} />
                  <Text style={styles.grandTotal}>
                    Total: Rp {calculateGrandTotal().toLocaleString()}
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>

          {/* Menu Content */}
          <Card style={styles.menuContent}>
            <Card.Content>
              <Title style={styles.sectionTitle}>Pilih Makanan & Minuman</Title>
              <Text style={styles.sectionSubtitle}>
                Pesan untuk dinikmati selama booking berlangsung
              </Text>
              
              <Searchbar
                placeholder="Cari menu..."
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.searchBar}
              />
              
              <View style={styles.categoriesContainer}>
                {categories.map(category => (
                  <Chip
                    key={category.id}
                    selected={selectedCategory === category.id}
                    onPress={() => setSelectedCategory(category.id)}
                    style={styles.chip}
                    showSelectedOverlay
                  >
                    {category.name}
                  </Chip>
                ))}
              </View>

              <FlatList
                data={filteredItems}
                renderItem={renderMenuItem}
                keyExtractor={item => item.id}
                scrollEnabled={false}
                contentContainerStyle={styles.menuList}
                showsVerticalScrollIndicator={false}
              />
            </Card.Content>
          </Card>
        </ScrollView>

        {/* Footer Button untuk Booking Flow */}
        <View style={styles.footer}>
          <View style={styles.footerSummary}>
            <Text style={styles.footerText}>
              {cart.items.length} items • Rp {cart.total.toLocaleString()}
            </Text>
            <Text style={styles.footerGrandTotal}>
              Grand Total: Rp {calculateGrandTotal().toLocaleString()}
            </Text>
          </View>
          <Button 
            mode="contained" 
            onPress={handleContinueToSummary}
            style={styles.continueButton}
            icon="clipboard-check"
            contentStyle={styles.continueButtonContent}
            disabled={cart.items.length === 0}
          >
            Lanjut ke Ringkasan
          </Button>
        </View>
      </View>
    );
  }

  // Default layout untuk tab Menu biasa
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollViewNormal}>
        <Card style={styles.menuContent}>
          <Card.Content>
            <Title style={styles.standaloneTitle}>Menu Kafe</Title>
            <Text style={styles.standaloneSubtitle}>
              Pilih makanan dan minuman favorit Anda
            </Text>
            
            <Searchbar
              placeholder="Cari menu..."
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={styles.searchBar}
            />
            
            <View style={styles.categoriesContainer}>
              {categories.map(category => (
                <Chip
                  key={category.id}
                  selected={selectedCategory === category.id}
                  onPress={() => setSelectedCategory(category.id)}
                  style={styles.chip}
                  showSelectedOverlay
                >
                  {category.name}
                </Chip>
              ))}
            </View>

            <FlatList
              data={filteredItems}
              renderItem={renderMenuItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.menuList}
              showsVerticalScrollIndicator={false}
            />
          </Card.Content>
        </Card>

        {/* Cart Summary untuk standalone */}
        {cart.items.length > 0 && (
          <Card style={styles.standaloneCartCard}>
            <Card.Content>
              <View style={styles.standaloneCart}>
                <Text style={styles.standaloneCartText}>
                  {cart.items.length} items di keranjang
                </Text>
                <Text style={styles.standaloneCartTotal}>
                  Rp {cart.total.toLocaleString()}
                </Text>
              </View>
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </View>
  );
};

// Styles tetap sama seperti sebelumnya
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollViewWithHeader: {
    flex: 1,
  },
  scrollViewNormal: {
    flex: 1,
    padding: 16,
  },
  bookingInfoCard: {
    margin: 16,
    marginBottom: 8,
    backgroundColor: '#E3F2FD',
  },
  bookingInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bookingDetails: {
    flex: 1,
  },
  bookingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bookingSubtitle: {
    color: '#666',
    fontSize: 14,
    marginBottom: 4,
  },
  quantityControls: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 4,
},
quantityNumber: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#333',
  minWidth: 24,
  textAlign: 'center',
},
  tablePrice: {
    color: '#2196F3',
    fontSize: 14,
    fontWeight: '500',
  },
  cartSummary: {
    alignItems: 'flex-end',
    marginLeft: 16,
  },
  cartCount: {
    fontSize: 14,
    color: '#666',
  },
  cartTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  cartDivider: {
    marginVertical: 4,
    width: '100%',
  },
  grandTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  menuContent: {
    margin: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 4,
  },
  sectionSubtitle: {
    color: '#666',
    marginBottom: 16,
  },
  standaloneTitle: {
    fontSize: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  standaloneSubtitle: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  searchBar: {
    marginBottom: 16,
  },
  categoriesContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginBottom: 8,
  },
  menuList: {
    paddingBottom: 16,
  },
  menuCard: {
    marginBottom: 12,
    elevation: 2,
  },
  menuItemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  menuEmoji: {
    fontSize: 40,
    marginRight: 16,
  },
  menuItemInfo: {
    flex: 1,
  },
  menuItemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  quantityContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  quantityText: {
    color: '#666',
    fontStyle: 'italic',
    fontSize: 12,
  },
  quantityTextActive: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontStyle: 'normal',
  },
  addButton: {
    borderRadius: 8,
  },
  footer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  footerSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
  footerGrandTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  continueButton: {
    borderRadius: 8,
  },
  continueButtonContent: {
    paddingVertical: 8,
  },
  standaloneCartCard: {
    margin: 16,
    marginTop: 8,
    backgroundColor: '#F3E5F5',
  },
  standaloneCart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  standaloneCartText: {
    fontSize: 14,
    fontWeight: '500',
  },
  standaloneCartTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7B1FA2',
  },
});

export default MenuScreen;