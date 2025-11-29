// src/screens/admin/MenuCRUDScreen.tsx
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
  Alert,
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
  createdAt: string;
}

const MenuCRUDScreen = () => {
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'food' | 'drink' | 'snack'>('all');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [addEditModalVisible, setAddEditModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'food' as 'food' | 'drink' | 'snack',
    price: '',
    image: '🍔',
    description: '',
    stock: '',
  });

  // Emoji picker options
  const emojisByCategory = {
    food: ['🍔', '🍕', '🍝', '🍳', '🍜', '🍲', '🌮', '🌯', '🥗', '🍱'],
    drink: ['☕', '🧋', '🥤', '🍵', '🧃', '🥛', '🍹', '🍺', '🍷', '🧉'],
    snack: ['🍟', '🍿', '🥨', '🍪', '🍩', '🧁', '🍰', '🥧', '🍫', '🍬'],
  };

  // Mock menu items
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: '1',
      name: 'Nasi Goreng Spesial',
      category: 'food',
      price: 25000,
      image: '🍳',
      description: 'Nasi goreng dengan telur, ayam, dan sayuran',
      stock: 50,
      isAvailable: true,
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      name: 'Mie Goreng Pedas',
      category: 'food',
      price: 20000,
      image: '🍜',
      description: 'Mie goreng dengan level kepedasan tinggi',
      stock: 30,
      isAvailable: true,
      createdAt: '2024-01-15',
    },
    {
      id: '3',
      name: 'Pizza Margherita',
      category: 'food',
      price: 45000,
      image: '🍕',
      description: 'Pizza klasik dengan keju dan tomat',
      stock: 20,
      isAvailable: true,
      createdAt: '2024-02-10',
    },
    {
      id: '4',
      name: 'Es Teh Manis',
      category: 'drink',
      price: 5000,
      image: '🧋',
      description: 'Es teh manis segar',
      stock: 100,
      isAvailable: true,
      createdAt: '2024-01-10',
    },
    {
      id: '5',
      name: 'Kopi Hitam',
      category: 'drink',
      price: 10000,
      image: '☕',
      description: 'Kopi hitam original tanpa gula',
      stock: 80,
      isAvailable: true,
      createdAt: '2024-01-10',
    },
    {
      id: '6',
      name: 'Jus Jeruk Fresh',
      category: 'drink',
      price: 15000,
      image: '🧃',
      description: 'Jus jeruk segar tanpa pengawet',
      stock: 40,
      isAvailable: true,
      createdAt: '2024-01-20',
    },
    {
      id: '7',
      name: 'Kentang Goreng',
      category: 'snack',
      price: 15000,
      image: '🍟',
      description: 'Kentang goreng crispy dengan saus',
      stock: 0,
      isAvailable: false,
      createdAt: '2024-01-12',
    },
    {
      id: '8',
      name: 'Popcorn',
      category: 'snack',
      price: 10000,
      image: '🍿',
      description: 'Popcorn caramel atau asin',
      stock: 60,
      isAvailable: true,
      createdAt: '2024-01-12',
    },
  ]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || item.category === filter;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: menuItems.length,
    food: menuItems.filter(i => i.category === 'food').length,
    drink: menuItems.filter(i => i.category === 'drink').length,
    snack: menuItems.filter(i => i.category === 'snack').length,
    outOfStock: menuItems.filter(i => !i.isAvailable || i.stock === 0).length,
  };

  const handleItemPress = (item: MenuItem) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleAddItem = () => {
    setIsEditing(false);
    setFormData({
      name: '',
      category: 'food',
      price: '',
      image: '🍔',
      description: '',
      stock: '',
    });
    setAddEditModalVisible(true);
  };

  const handleEditItem = (item: MenuItem) => {
    setIsEditing(true);
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price.toString(),
      image: item.image,
      description: item.description,
      stock: item.stock.toString(),
    });
    setSelectedItem(item);
    setModalVisible(false);
    setAddEditModalVisible(true);
  };

  const handleSaveItem = () => {
    if (!formData.name || !formData.price || !formData.stock) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    if (isEditing && selectedItem) {
      // Update existing item
      const updatedItems = menuItems.map(i => 
        i.id === selectedItem.id 
          ? {
              ...i,
              name: formData.name,
              category: formData.category,
              price: parseInt(formData.price),
              image: formData.image,
              description: formData.description,
              stock: parseInt(formData.stock),
              isAvailable: parseInt(formData.stock) > 0,
            }
          : i
      );
      setMenuItems(updatedItems);
      Alert.alert('Success', 'Menu item updated successfully');
    } else {
      // Add new item
      const newItem: MenuItem = {
        id: Date.now().toString(),
        name: formData.name,
        category: formData.category,
        price: parseInt(formData.price),
        image: formData.image,
        description: formData.description,
        stock: parseInt(formData.stock),
        isAvailable: parseInt(formData.stock) > 0,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setMenuItems([...menuItems, newItem]);
      Alert.alert('Success', 'Menu item added successfully');
    }
    
    setAddEditModalVisible(false);
  };

  const handleToggleAvailability = (itemId: string) => {
    const updatedItems = menuItems.map(i => 
      i.id === itemId ? { ...i, isAvailable: !i.isAvailable } : i
    );
    setMenuItems(updatedItems);
    setModalVisible(false);
    Alert.alert('Success', 'Availability status updated');
  };

  const handleDeleteItem = (itemId: string) => {
    Alert.alert(
      'Delete Menu Item',
      'Are you sure you want to delete this item? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setMenuItems(menuItems.filter(i => i.id !== itemId));
            setModalVisible(false);
            Alert.alert('Success', 'Menu item deleted successfully');
          },
        },
      ]
    );
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'food': return 'Food';
      case 'drink': return 'Drink';
      case 'snack': return 'Snack';
      default: return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'food': return Colors.orange.primary;
      case 'drink': return Colors.status.info;
      case 'snack': return Colors.status.warning;
      default: return Colors.text.secondary;
    }
  };

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
        <Text style={styles.headerTitle}>Menu CRUD</Text>
        <Text style={styles.headerSubtitle}>
          Manage menu items
        </Text>
      </View>

      {/* STATS */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="apps" size={20} color={Colors.text.primary} />
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="restaurant" size={20} color={Colors.orange.primary} />
          <Text style={styles.statValue}>{stats.food}</Text>
          <Text style={styles.statLabel}>Food</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="cafe" size={20} color={Colors.status.info} />
          <Text style={styles.statValue}>{stats.drink}</Text>
          <Text style={styles.statLabel}>Drink</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="fast-food" size={20} color={Colors.status.warning} />
          <Text style={styles.statValue}>{stats.snack}</Text>
          <Text style={styles.statLabel}>Snack</Text>
        </View>
      </View>

      {/* SEARCH & ADD */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={Colors.text.secondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search menu items..."
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
        <TouchableOpacity style={styles.addButton} onPress={handleAddItem} activeOpacity={0.8}>
          <Ionicons name="add" size={24} color={Colors.text.inverse} />
        </TouchableOpacity>
      </View>

      {/* FILTER */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {[
            { id: 'all', label: 'All Items' },
            { id: 'food', label: 'Food' },
            { id: 'drink', label: 'Drinks' },
            { id: 'snack', label: 'Snacks' },
          ].map(item => {
            const isSelected = filter === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.filterChip, isSelected && styles.filterChipSelected]}
                onPress={() => setFilter(item.id as any)}
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

      {/* MENU LIST */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.orange.primary} />
        }
      >
        <View style={styles.menuList}>
          {filteredItems.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuCard}
              onPress={() => handleItemPress(item)}
              activeOpacity={0.8}
            >
              <View style={styles.menuImageContainer}>
                <Text style={styles.menuEmoji}>{item.image}</Text>
                {(!item.isAvailable || item.stock === 0) && (
                  <View style={styles.outOfStockBadge}>
                    <Text style={styles.outOfStockText}>Out of Stock</Text>
                  </View>
                )}
              </View>

              <View style={styles.menuInfo}>
                <View style={styles.menuHeader}>
                  <Text style={styles.menuName}>{item.name}</Text>
                  <View style={[
                    styles.categoryBadge,
                    { backgroundColor: `${getCategoryColor(item.category)}20` }
                  ]}>
                    <Text style={[
                      styles.categoryText,
                      { color: getCategoryColor(item.category) }
                    ]}>
                      {getCategoryLabel(item.category)}
                    </Text>
                  </View>
                </View>

                <Text style={styles.menuDescription} numberOfLines={2}>
                  {item.description}
                </Text>

                <View style={styles.menuFooter}>
                  <Text style={styles.menuPrice}>Rp {item.price.toLocaleString()}</Text>
                  <View style={styles.menuStock}>
                    <Ionicons name="cube" size={14} color={Colors.text.secondary} />
                    <Text style={styles.menuStockText}>Stock: {item.stock}</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={styles.menuEditButton}
                onPress={() => handleEditItem(item)}
              >
                <Ionicons name="create-outline" size={20} color={Colors.orange.primary} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* DETAIL MODAL */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Menu Item Details</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.text.primary} />
              </TouchableOpacity>
            </View>

            {selectedItem && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.modalImageContainer}>
                  <Text style={styles.modalEmoji}>{selectedItem.image}</Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Name</Text>
                  <Text style={styles.modalValue}>{selectedItem.name}</Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Category</Text>
                  <Text style={[
                    styles.modalValue,
                    { color: getCategoryColor(selectedItem.category) }
                  ]}>
                    {getCategoryLabel(selectedItem.category)}
                  </Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Price</Text>
                  <Text style={styles.modalValue}>Rp {selectedItem.price.toLocaleString()}</Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Description</Text>
                  <Text style={styles.modalValue}>{selectedItem.description}</Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Stock</Text>
                  <Text style={styles.modalValue}>{selectedItem.stock} units</Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Availability</Text>
                  <Text style={[
                    styles.modalValue,
                    { color: selectedItem.isAvailable ? Colors.status.success : Colors.status.error }
                  ]}>
                    {selectedItem.isAvailable ? 'Available' : 'Not Available'}
                  </Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Created At</Text>
                  <Text style={styles.modalValue}>{selectedItem.createdAt}</Text>
                </View>

                <View style={styles.divider} />

                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    selectedItem.isAvailable ? styles.disableButton : styles.enableButton
                  ]}
                  onPress={() => handleToggleAvailability(selectedItem.id)}
                >
                  <Ionicons 
                    name={selectedItem.isAvailable ? 'eye-off' : 'eye'} 
                    size={20} 
                    color="#fff" 
                  />
                  <Text style={styles.actionButtonText}>
                    {selectedItem.isAvailable ? 'Mark as Unavailable' : 'Mark as Available'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.editButton]}
                  onPress={() => handleEditItem(selectedItem)}
                >
                  <Ionicons name="create" size={20} color="#fff" />
                  <Text style={styles.actionButtonText}>Edit Item</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleDeleteItem(selectedItem.id)}
                >
                  <Ionicons name="trash" size={20} color="#fff" />
                  <Text style={styles.actionButtonText}>Delete Item</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* ADD/EDIT MODAL */}
      <Modal
        visible={addEditModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAddEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{isEditing ? 'Edit Menu Item' : 'Add New Item'}</Text>
              <TouchableOpacity onPress={() => setAddEditModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.text.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Item Name *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g., Nasi Goreng Spesial"
                  placeholderTextColor={Colors.text.tertiary}
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Category</Text>
                <View style={styles.categoryContainer}>
                  {(['food', 'drink', 'snack'] as const).map(cat => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryChip,
                        formData.category === cat && styles.categoryChipSelected
                      ]}
                      onPress={() => setFormData({ ...formData, category: cat, image: emojisByCategory[cat][0] })}
                    >
                      <Text style={[
                        styles.categoryChipText,
                        formData.category === cat && styles.categoryChipTextSelected
                      ]}>
                        {getCategoryLabel(cat)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Select Icon</Text>
                <View style={styles.emojiContainer}>
                  {emojisByCategory[formData.category].map(emoji => (
                    <TouchableOpacity
                      key={emoji}
                      style={[
                        styles.emojiChip,
                        formData.image === emoji && styles.emojiChipSelected
                      ]}
                      onPress={() => setFormData({ ...formData, image: emoji })}
                    >
                      <Text style={styles.emojiText}>{emoji}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Price *</Text>
                <View style={styles.priceInputContainer}>
                  <Text style={styles.pricePrefix}>Rp</Text>
                  <TextInput
                    style={styles.priceInput}
                    placeholder="25000"
                    placeholderTextColor={Colors.text.tertiary}
                    value={formData.price}
                    onChangeText={(text) => setFormData({ ...formData, price: text.replace(/[^0-9]/g, '') })}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Stock *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="50"
                  placeholderTextColor={Colors.text.tertiary}
                  value={formData.stock}
                  onChangeText={(text) => setFormData({ ...formData, stock: text.replace(/[^0-9]/g, '') })}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Description</Text>
                <TextInput
                  style={[styles.formInput, styles.textArea]}
                  placeholder="Item description..."
                  placeholderTextColor={Colors.text.tertiary}
                  value={formData.description}
                  onChangeText={(text) => setFormData({ ...formData, description: text })}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveItem}
                activeOpacity={0.8}
              >
                <Ionicons name="checkmark-circle" size={20} color="#000" />
                <Text style={styles.saveButtonText}>{isEditing ? 'Update Item' : 'Add Item'}</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg.primary },
  scrollView: { flex: 1 },
  header: { backgroundColor: Colors.bg.secondary, paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, position: 'relative', overflow: 'hidden' },
  headerGlow: { position: 'absolute', top: -80, right: -80, width: 160, height: 160, backgroundColor: Colors.orange.glow, borderRadius: 80, opacity: 0.3 },
  backButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.bg.elevated, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  headerTitle: { fontSize: Typography.sizes.xl, fontWeight: Typography.weights.bold, color: Colors.text.primary, marginBottom: 4 },
  headerSubtitle: { fontSize: Typography.sizes.sm, color: Colors.text.secondary },
  statsContainer: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 16 },
  statCard: { flex: 1, backgroundColor: Colors.bg.secondary, borderRadius: BorderRadius.md, padding: 12, marginHorizontal: 4, alignItems: 'center', borderWidth: 1, borderColor: Colors.bg.tertiary },
  statValue: { fontSize: Typography.sizes.xl, fontWeight: Typography.weights.bold, color: Colors.text.primary, marginVertical: 4 },
  statLabel: { fontSize: Typography.sizes.xs, color: Colors.text.secondary },
  searchContainer: { flexDirection: 'row', paddingHorizontal: 20, paddingBottom: 12, alignItems: 'center' },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.bg.secondary, borderRadius: BorderRadius.md, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: Colors.bg.tertiary, marginRight: 12 },
  searchInput: { flex: 1, marginLeft: 12, fontSize: Typography.sizes.base, color: Colors.text.primary },
  addButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.orange.primary, justifyContent: 'center', alignItems: 'center' },
  filterContainer: { paddingBottom: 16 },
  filterScroll: { paddingHorizontal: 20 },
  filterChip: { backgroundColor: Colors.bg.secondary, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: Colors.bg.tertiary },
  filterChipSelected: { backgroundColor: Colors.orange.primary, borderColor: Colors.orange.primary },
  filterText: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.semibold, color: Colors.text.secondary },
  filterTextSelected: { color: Colors.text.inverse },
  menuList: { paddingHorizontal: 20 },
  menuCard: { flexDirection: 'row', backgroundColor: Colors.bg.secondary, borderRadius: BorderRadius.lg, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: Colors.bg.tertiary, alignItems: 'center' },
  menuImageContainer: { width: 60, height: 60, borderRadius: BorderRadius.md, backgroundColor: Colors.bg.elevated, justifyContent: 'center', alignItems: 'center', marginRight: 12, position: 'relative' },
  menuEmoji: { fontSize: 32 },
  outOfStockBadge: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: Colors.status.error, paddingVertical: 2, borderBottomLeftRadius: BorderRadius.md, borderBottomRightRadius: BorderRadius.md },
  outOfStockText: { fontSize: Typography.sizes.xs, color: '#fff', textAlign: 'center', fontWeight: Typography.weights.bold },
  menuInfo: { flex: 1 },
  menuHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  menuName: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.text.primary, flex: 1 },
  categoryBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: BorderRadius.sm, marginLeft: 8 },
  categoryText: { fontSize: Typography.sizes.xs, fontWeight: Typography.weights.semibold },
  menuDescription: { fontSize: Typography.sizes.xs, color: Colors.text.secondary, marginBottom: 6 },
  menuFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  menuPrice: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.bold, color: Colors.orange.primary },
  menuStock: { flexDirection: 'row', alignItems: 'center' },
  menuStockText: { fontSize: Typography.sizes.xs, color: Colors.text.secondary, marginLeft: 4 },
  menuEditButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.bg.elevated, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: Colors.bg.primary, borderTopLeftRadius: BorderRadius.xxl, borderTopRightRadius: BorderRadius.xxl, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: Colors.bg.tertiary },
  modalTitle: { fontSize: Typography.sizes.xl, fontWeight: Typography.weights.bold, color: Colors.text.primary },
  modalBody: { padding: 20 },
  modalImageContainer: { alignItems: 'center', marginBottom: 20 },
  modalEmoji: { fontSize: 80 },
  modalSection: { marginBottom: 16 },
  modalLabel: { fontSize: Typography.sizes.xs, color: Colors.text.secondary, marginBottom: 4 },
  modalValue: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.semibold, color: Colors.text.primary },
  divider: { height: 1, backgroundColor: Colors.bg.tertiary, marginVertical: 16 },
  actionButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: BorderRadius.md, marginBottom: 10 },
  enableButton: { backgroundColor: Colors.status.success },
  disableButton: { backgroundColor: Colors.status.warning },
  editButton: { backgroundColor: Colors.status.info },
  deleteButton: { backgroundColor: Colors.status.error },
  actionButtonText: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: '#fff', marginLeft: 8 },
  formGroup: { marginBottom: 16 },
  formLabel: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.semibold, color: Colors.text.primary, marginBottom: 8 },
  formInput: { backgroundColor: Colors.bg.secondary, borderWidth: 1, borderColor: Colors.bg.tertiary, borderRadius: BorderRadius.md, paddingHorizontal: 16, paddingVertical: 14, fontSize: Typography.sizes.base, color: Colors.text.primary },
  textArea: { height: 80, textAlignVertical: 'top' },
  categoryContainer: { flexDirection: 'row' },
  categoryChip: { flex: 1, backgroundColor: Colors.bg.secondary, paddingVertical: 12, borderRadius: BorderRadius.md, marginHorizontal: 4, alignItems: 'center', borderWidth: 1, borderColor: Colors.bg.tertiary },
  categoryChipSelected: { backgroundColor: Colors.orange.primary, borderColor: Colors.orange.primary },
  categoryChipText: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.semibold, color: Colors.text.secondary },
  categoryChipTextSelected: { color: Colors.text.inverse },
  emojiContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  emojiChip: { width: '18%', aspectRatio: 1, backgroundColor: Colors.bg.secondary, borderRadius: BorderRadius.md, justifyContent: 'center', alignItems: 'center', margin: '1%', borderWidth: 2, borderColor: Colors.bg.tertiary },
  emojiChipSelected: { borderColor: Colors.orange.primary, backgroundColor: Colors.bg.tertiary },
  emojiText: { fontSize: 28 },
  priceInputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.bg.secondary, borderWidth: 1, borderColor: Colors.bg.tertiary, borderRadius: BorderRadius.md, paddingHorizontal: 16 },
  pricePrefix: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.semibold, color: Colors.text.secondary, marginRight: 8 },
  priceInput: { flex: 1, paddingVertical: 14, fontSize: Typography.sizes.base, color: Colors.text.primary },
  saveButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.orange.primary, paddingVertical: 16, borderRadius: BorderRadius.md },
  saveButtonText: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.text.inverse, marginLeft: 8 },
});

export default MenuCRUDScreen;
