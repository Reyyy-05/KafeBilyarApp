// src/screens/admin/MenuManagementScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Modal,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors, Typography, BorderRadius } from '../../theme';

interface MenuItem {
  id: string;
  name: string;
  category: 'food' | 'drink' | 'snack';
  price: number;
  image: string;
  description: string;
  stock: number;
  isAvailable: boolean;
  orders?: number; // Today's orders
}

interface Order {
  id: string;
  orderCode: string;
  customerName: string;
  items: { menuItem: MenuItem; quantity: number }[];
  totalPrice: number;
  status: 'pending' | 'preparing' | 'ready' | 'served';
  tableNumber?: string;
  timestamp: string;
}

const MenuManagementScreen = () => {
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'menu' | 'orders'>('orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'food' | 'drink' | 'snack'>('all');
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'preparing' | 'ready'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Mock menu items
  const [menuItems] = useState<MenuItem[]>([
    {
      id: '1',
      name: 'Nasi Goreng',
      category: 'food',
      price: 25000,
      image: '🍳',
      description: 'Nasi goreng spesial dengan telur',
      stock: 50,
      isAvailable: true,
      orders: 12,
    },
    {
      id: '2',
      name: 'Mie Goreng',
      category: 'food',
      price: 20000,
      image: '🍜',
      description: 'Mie goreng pedas',
      stock: 30,
      isAvailable: true,
      orders: 8,
    },
    {
      id: '3',
      name: 'Es Teh Manis',
      category: 'drink',
      price: 5000,
      image: '🧋',
      description: 'Es teh manis segar',
      stock: 100,
      isAvailable: true,
      orders: 25,
    },
    {
      id: '4',
      name: 'Kopi Hitam',
      category: 'drink',
      price: 10000,
      image: '☕',
      description: 'Kopi hitam original',
      stock: 80,
      isAvailable: true,
      orders: 15,
    },
    {
      id: '5',
      name: 'Kentang Goreng',
      category: 'snack',
      price: 15000,
      image: '🍟',
      description: 'Kentang goreng crispy',
      stock: 0,
      isAvailable: false,
      orders: 0,
    },
  ]);

  // Mock orders
  const [orders] = useState<Order[]>([
    {
      id: '1',
      orderCode: 'ORD001',
      customerName: 'John Doe',
      items: [
        { menuItem: menuItems[0], quantity: 2 },
        { menuItem: menuItems[2], quantity: 3 },
      ],
      totalPrice: 65000,
      status: 'pending',
      tableNumber: 'Meja VIP 1',
      timestamp: '18:30',
    },
    {
      id: '2',
      orderCode: 'ORD002',
      customerName: 'Jane Smith',
      items: [
        { menuItem: menuItems[1], quantity: 1 },
        { menuItem: menuItems[3], quantity: 2 },
      ],
      totalPrice: 40000,
      status: 'preparing',
      tableNumber: 'Meja Reguler 3',
      timestamp: '18:25',
    },
    {
      id: '3',
      orderCode: 'ORD003',
      customerName: 'Bob Johnson',
      items: [
        { menuItem: menuItems[2], quantity: 5 },
      ],
      totalPrice: 25000,
      status: 'ready',
      tableNumber: 'Meja VIP 2',
      timestamp: '18:20',
    },
  ]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return Colors.status.warning;
      case 'preparing': return Colors.status.info;
      case 'ready': return Colors.status.success;
      case 'served': return Colors.text.tertiary;
      default: return Colors.text.secondary;
    }
  };

  const getOrderStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'preparing': return 'Preparing';
      case 'ready': return 'Ready';
      case 'served': return 'Served';
      default: return status;
    }
  };

  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredOrders = orders.filter(order => {
    return orderFilter === 'all' || order.status === orderFilter;
  });

  const handleOrderPress = (order: Order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const handleOrderStatusUpdate = (newStatus: 'preparing' | 'ready' | 'served') => {
    console.log('Update order', selectedOrder?.id, 'to', newStatus);
    setModalVisible(false);
  };

  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const preparingCount = orders.filter(o => o.status === 'preparing').length;
  const readyCount = orders.filter(o => o.status === 'ready').length;

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerGlow} />
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Menu Management</Text>
        <Text style={styles.headerSubtitle}>
          {activeTab === 'orders' ? `${filteredOrders.length} active orders` : `${filteredMenuItems.length} menu items`}
        </Text>
      </View>

      {/* TABS */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'orders' && styles.tabActive]}
          onPress={() => setActiveTab('orders')}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="restaurant" 
            size={20} 
            color={activeTab === 'orders' ? Colors.orange.primary : Colors.text.secondary} 
          />
          <Text style={[styles.tabText, activeTab === 'orders' && styles.tabTextActive]}>
            Orders ({pendingCount + preparingCount + readyCount})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'menu' && styles.tabActive]}
          onPress={() => setActiveTab('menu')}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="fast-food" 
            size={20} 
            color={activeTab === 'menu' ? Colors.orange.primary : Colors.text.secondary} 
          />
          <Text style={[styles.tabText, activeTab === 'menu' && styles.tabTextActive]}>
            Menu Items
          </Text>
        </TouchableOpacity>
      </View>

      {/* SEARCH BAR */}
      {activeTab === 'menu' && (
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={Colors.text.secondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search menu..."
              placeholderTextColor={Colors.text.tertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={Colors.text.secondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* FILTERS */}
      {activeTab === 'menu' ? (
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {[
              { id: 'all', label: 'All' },
              { id: 'food', label: 'Food' },
              { id: 'drink', label: 'Drinks' },
              { id: 'snack', label: 'Snacks' },
            ].map(item => {
              const isSelected = categoryFilter === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.filterChip, isSelected && styles.filterChipSelected]}
                  onPress={() => setCategoryFilter(item.id as any)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.filterText, isSelected && styles.filterTextSelected]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      ) : (
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {[
              { id: 'all', label: 'All', count: orders.length },
              { id: 'pending', label: 'Pending', count: pendingCount },
              { id: 'preparing', label: 'Preparing', count: preparingCount },
              { id: 'ready', label: 'Ready', count: readyCount },
            ].map(item => {
              const isSelected = orderFilter === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.filterChip, isSelected && styles.filterChipSelected]}
                  onPress={() => setOrderFilter(item.id as any)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.filterText, isSelected && styles.filterTextSelected]}>
                    {item.label} ({item.count})
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* CONTENT */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.orange.primary} />
        }
      >
        {activeTab === 'menu' ? (
          // MENU ITEMS LIST
          <View style={styles.menuList}>
            {filteredMenuItems.map(item => (
              <View key={item.id} style={styles.menuCard}>
                <View style={styles.menuImageContainer}>
                  <Text style={styles.menuEmoji}>{item.image}</Text>
                  {!item.isAvailable && (
                    <View style={styles.outOfStockBadge}>
                      <Text style={styles.outOfStockText}>Out of Stock</Text>
                    </View>
                  )}
                </View>
                <View style={styles.menuInfo}>
                  <Text style={styles.menuName}>{item.name}</Text>
                  <Text style={styles.menuDescription} numberOfLines={2}>{item.description}</Text>
                  <View style={styles.menuFooter}>
                    <Text style={styles.menuPrice}>Rp {item.price.toLocaleString()}</Text>
                    <View style={styles.menuStats}>
                      <Ionicons name="cube" size={14} color={Colors.text.secondary} />
                      <Text style={styles.menuStock}>{item.stock}</Text>
                      <Ionicons name="bar-chart" size={14} color={Colors.orange.primary} style={{ marginLeft: 8 }} />
                      <Text style={styles.menuOrders}>{item.orders || 0}</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity style={styles.menuEditButton}>
                  <Ionicons name="create-outline" size={20} color={Colors.orange.primary} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          // ORDERS LIST
          <View style={styles.ordersList}>
            {filteredOrders.map(order => (
              <TouchableOpacity
                key={order.id}
                style={styles.orderCard}
                onPress={() => handleOrderPress(order)}
                activeOpacity={0.8}
              >
                <View style={styles.orderHeader}>
                  <View>
                    <Text style={styles.orderCode}>{order.orderCode}</Text>
                    <Text style={styles.orderTime}>{order.timestamp}</Text>
                  </View>
                  <View style={[
                    styles.orderStatusBadge,
                    { backgroundColor: `${getOrderStatusColor(order.status)}20` }
                  ]}>
                    <View style={[styles.orderStatusDot, { backgroundColor: getOrderStatusColor(order.status) }]} />
                    <Text style={[styles.orderStatusText, { color: getOrderStatusColor(order.status) }]}>
                      {getOrderStatusLabel(order.status)}
                    </Text>
                  </View>
                </View>

                <View style={styles.orderCustomer}>
                  <Ionicons name="person" size={16} color={Colors.text.secondary} />
                  <Text style={styles.orderCustomerName}>{order.customerName}</Text>
                  {order.tableNumber && (
                    <>
                      <Ionicons name="cafe" size={16} color={Colors.text.secondary} style={{ marginLeft: 12 }} />
                      <Text style={styles.orderTable}>{order.tableNumber}</Text>
                    </>
                  )}
                </View>

                <View style={styles.orderItems}>
                  {order.items.map((item, index) => (
                    <View key={index} style={styles.orderItem}>
                      <Text style={styles.orderItemEmoji}>{item.menuItem.image}</Text>
                      <Text style={styles.orderItemText}>
                        {item.quantity}x {item.menuItem.name}
                      </Text>
                    </View>
                  ))}
                </View>

                <View style={styles.orderFooter}>
                  <Text style={styles.orderTotal}>Total: Rp {order.totalPrice.toLocaleString()}</Text>
                  <Ionicons name="chevron-forward" size={20} color={Colors.text.secondary} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ORDER DETAIL MODAL */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Order Details</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.text.primary} />
              </TouchableOpacity>
            </View>

            {selectedOrder && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Order Code</Text>
                  <Text style={styles.modalValue}>{selectedOrder.orderCode}</Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Customer</Text>
                  <Text style={styles.modalValue}>{selectedOrder.customerName}</Text>
                </View>
                {selectedOrder.tableNumber && (
                  <View style={styles.modalSection}>
                    <Text style={styles.modalLabel}>Table</Text>
                    <Text style={styles.modalValue}>{selectedOrder.tableNumber}</Text>
                  </View>
                )}
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Time</Text>
                  <Text style={styles.modalValue}>{selectedOrder.timestamp}</Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Status</Text>
                  <Text style={[styles.modalValue, { color: getOrderStatusColor(selectedOrder.status) }]}>
                    {getOrderStatusLabel(selectedOrder.status)}
                  </Text>
                </View>

                <View style={styles.divider} />
                <Text style={styles.modalSectionTitle}>Items</Text>
                {selectedOrder.items.map((item, index) => (
                  <View key={index} style={styles.modalItem}>
                    <Text style={styles.modalItemEmoji}>{item.menuItem.image}</Text>
                    <View style={styles.modalItemInfo}>
                      <Text style={styles.modalItemName}>{item.menuItem.name}</Text>
                      <Text style={styles.modalItemPrice}>Rp {item.menuItem.price.toLocaleString()}</Text>
                    </View>
                    <Text style={styles.modalItemQty}>x{item.quantity}</Text>
                    <Text style={styles.modalItemTotal}>
                      Rp {(item.menuItem.price * item.quantity).toLocaleString()}
                    </Text>
                  </View>
                ))}

                <View style={styles.divider} />
                <View style={styles.modalTotal}>
                  <Text style={styles.modalTotalLabel}>Total</Text>
                  <Text style={styles.modalTotalValue}>Rp {selectedOrder.totalPrice.toLocaleString()}</Text>
                </View>

                {/* Action Buttons */}
                {selectedOrder.status === 'pending' && (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.preparingButton]}
                    onPress={() => handleOrderStatusUpdate('preparing')}
                  >
                    <Ionicons name="restaurant" size={20} color="#fff" />
                    <Text style={styles.actionButtonText}>Start Preparing</Text>
                  </TouchableOpacity>
                )}
                {selectedOrder.status === 'preparing' && (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.readyButton]}
                    onPress={() => handleOrderStatusUpdate('ready')}
                  >
                    <Ionicons name="checkmark-circle" size={20} color="#fff" />
                    <Text style={styles.actionButtonText}>Mark as Ready</Text>
                  </TouchableOpacity>
                )}
                {selectedOrder.status === 'ready' && (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.servedButton]}
                    onPress={() => handleOrderStatusUpdate('served')}
                  >
                    <Ionicons name="checkmark-done" size={20} color="#fff" />
                    <Text style={styles.actionButtonText}>Mark as Served</Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
  },
  scrollView: {
    flex: 1,
  },

  // HEADER
  header: {
    backgroundColor: Colors.bg.secondary,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  headerGlow: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 160,
    height: 160,
    backgroundColor: Colors.orange.glow,
    borderRadius: 80,
    opacity: 0.3,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.bg.elevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
  },

  // TABS
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bg.secondary,
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: Colors.bg.tertiary,
  },
  tabActive: {
    backgroundColor: Colors.bg.tertiary,
    borderColor: Colors.orange.primary,
    borderWidth: 2,
  },
  tabText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.secondary,
    marginLeft: 6,
  },
  tabTextActive: {
    color: Colors.orange.primary,
  },

  // SEARCH
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg.secondary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.bg.tertiary,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: Typography.sizes.base,
    color: Colors.text.primary,
  },

  // FILTER
  filterContainer: {
    paddingBottom: 16,
  },
  filterScroll: {
    paddingHorizontal: 20,
  },
  filterChip: {
    backgroundColor: Colors.bg.secondary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: Colors.bg.tertiary,
  },
  filterChipSelected: {
    backgroundColor: Colors.orange.primary,
    borderColor: Colors.orange.primary,
  },
  filterText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.secondary,
  },
  filterTextSelected: {
    color: Colors.text.inverse,
  },

  // MENU LIST
  menuList: {
    paddingHorizontal: 20,
  },
  menuCard: {
    flexDirection: 'row',
    backgroundColor: Colors.bg.secondary,
    borderRadius: BorderRadius.lg,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.bg.tertiary,
    alignItems: 'center',
  },
  menuImageContainer: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.bg.elevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  menuEmoji: {
    fontSize: 32,
  },
  outOfStockBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.status.error,
    paddingVertical: 2,
    borderBottomLeftRadius: BorderRadius.md,
    borderBottomRightRadius: BorderRadius.md,
  },
  outOfStockText: {
    fontSize: Typography.sizes.xs,
    color: '#fff',
    textAlign: 'center',
    fontWeight: Typography.weights.bold,
  },
  menuInfo: {
    flex: 1,
  },
  menuName: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.secondary,
    marginBottom: 6,
  },
  menuFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuPrice: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.orange.primary,
  },
  menuStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuStock: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  menuOrders: {
    fontSize: Typography.sizes.xs,
    color: Colors.orange.primary,
    marginLeft: 4,
  },
  menuEditButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.bg.elevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },

  // ORDERS LIST
  ordersList: {
    paddingHorizontal: 20,
  },
  orderCard: {
    backgroundColor: Colors.bg.secondary,
    borderRadius: BorderRadius.lg,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.bg.tertiary,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.bg.tertiary,
  },
  orderCode: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.orange.primary,
    marginBottom: 2,
  },
  orderTime: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.tertiary,
  },
  orderStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.md,
  },
  orderStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  orderStatusText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
  },
  orderCustomer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderCustomerName: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.primary,
    marginLeft: 6,
  },
  orderTable: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    marginLeft: 6,
  },
  orderItems: {
    marginBottom: 12,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  orderItemEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  orderItemText: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.primary,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.bg.tertiary,
  },
  orderTotal: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.orange.primary,
  },

  // MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.bg.primary,
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.bg.tertiary,
  },
  modalTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
  },
  modalBody: {
    padding: 20,
  },
  modalSection: {
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  modalValue: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.bg.tertiary,
    marginVertical: 16,
  },
  modalSectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginBottom: 12,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.bg.tertiary,
  },
  modalItemEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  modalItemInfo: {
    flex: 1,
  },
  modalItemName: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  modalItemPrice: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.secondary,
  },
  modalItemQty: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    marginHorizontal: 12,
  },
  modalItemTotal: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.orange.primary,
  },
  modalTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTotalLabel: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
  },
  modalTotalValue: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.orange.primary,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    marginTop: 10,
  },
  preparingButton: {
    backgroundColor: Colors.status.info,
  },
  readyButton: {
    backgroundColor: Colors.status.success,
  },
  servedButton: {
    backgroundColor: Colors.text.tertiary,
  },
  actionButtonText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: '#fff',
    marginLeft: 8,
  },
});

export default MenuManagementScreen;
