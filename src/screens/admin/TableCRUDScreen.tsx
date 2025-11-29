// src/screens/admin/TableCRUDScreen.tsx
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

interface Table {
  id: string;
  name: string;
  type: 'VIP' | 'Regular';
  capacity: number;
  pricePerHour: number;
  description: string;
  status: 'available' | 'occupied' | 'maintenance';
  createdAt: string;
}

const TableCRUDScreen = () => {
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'VIP' | 'Regular'>('all');
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [addEditModalVisible, setAddEditModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Regular' as 'VIP' | 'Regular',
    capacity: '2',
    pricePerHour: '',
    description: '',
  });

  // Mock tables data
  const [tables, setTables] = useState<Table[]>([
    {
      id: '1',
      name: 'Meja VIP 1',
      type: 'VIP',
      capacity: 4,
      pricePerHour: 75000,
      description: 'VIP table with premium facilities',
      status: 'occupied',
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      name: 'Meja VIP 2',
      type: 'VIP',
      capacity: 4,
      pricePerHour: 75000,
      description: 'VIP table with premium facilities',
      status: 'available',
      createdAt: '2024-01-15',
    },
    {
      id: '3',
      name: 'Meja VIP 3',
      type: 'VIP',
      capacity: 6,
      pricePerHour: 100000,
      description: 'Large VIP table for groups',
      status: 'available',
      createdAt: '2024-02-20',
    },
    {
      id: '4',
      name: 'Meja Reguler 1',
      type: 'Regular',
      capacity: 2,
      pricePerHour: 50000,
      description: 'Standard billiard table',
      status: 'available',
      createdAt: '2024-01-10',
    },
    {
      id: '5',
      name: 'Meja Reguler 2',
      type: 'Regular',
      capacity: 2,
      pricePerHour: 50000,
      description: 'Standard billiard table',
      status: 'available',
      createdAt: '2024-01-10',
    },
    {
      id: '6',
      name: 'Meja Reguler 3',
      type: 'Regular',
      capacity: 2,
      pricePerHour: 50000,
      description: 'Standard billiard table',
      status: 'occupied',
      createdAt: '2024-01-10',
    },
    {
      id: '7',
      name: 'Meja Reguler 4',
      type: 'Regular',
      capacity: 2,
      pricePerHour: 50000,
      description: 'Standard billiard table',
      status: 'maintenance',
      createdAt: '2024-01-10',
    },
    {
      id: '8',
      name: 'Meja Reguler 5',
      type: 'Regular',
      capacity: 2,
      pricePerHour: 50000,
      description: 'Standard billiard table',
      status: 'available',
      createdAt: '2024-01-10',
    },
  ]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return Colors.status.success;
      case 'occupied': return Colors.status.error;
      case 'maintenance': return Colors.text.tertiary;
      default: return Colors.text.secondary;
    }
  };

  const filteredTables = tables.filter(table => {
    const matchesSearch = table.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || table.type === filter;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: tables.length,
    vip: tables.filter(t => t.type === 'VIP').length,
    regular: tables.filter(t => t.type === 'Regular').length,
    available: tables.filter(t => t.status === 'available').length,
  };

  const handleTablePress = (table: Table) => {
    setSelectedTable(table);
    setModalVisible(true);
  };

  const handleAddTable = () => {
    setIsEditing(false);
    setFormData({
      name: '',
      type: 'Regular',
      capacity: '2',
      pricePerHour: '',
      description: '',
    });
    setAddEditModalVisible(true);
  };

  const handleEditTable = (table: Table) => {
    setIsEditing(true);
    setFormData({
      name: table.name,
      type: table.type,
      capacity: table.capacity.toString(),
      pricePerHour: table.pricePerHour.toString(),
      description: table.description,
    });
    setSelectedTable(table);
    setModalVisible(false);
    setAddEditModalVisible(true);
  };

  const handleSaveTable = () => {
    if (!formData.name || !formData.pricePerHour) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    if (isEditing && selectedTable) {
      // Update existing table
      const updatedTables = tables.map(t => 
        t.id === selectedTable.id 
          ? {
              ...t,
              name: formData.name,
              type: formData.type,
              capacity: parseInt(formData.capacity),
              pricePerHour: parseInt(formData.pricePerHour),
              description: formData.description,
            }
          : t
      );
      setTables(updatedTables);
      Alert.alert('Success', 'Table updated successfully');
    } else {
      // Add new table
      const newTable: Table = {
        id: Date.now().toString(),
        name: formData.name,
        type: formData.type,
        capacity: parseInt(formData.capacity),
        pricePerHour: parseInt(formData.pricePerHour),
        description: formData.description,
        status: 'available',
        createdAt: new Date().toISOString().split('T')[0],
      };
      setTables([...tables, newTable]);
      Alert.alert('Success', 'Table added successfully');
    }
    
    setAddEditModalVisible(false);
  };

  const handleDeleteTable = (tableId: string) => {
    Alert.alert(
      'Delete Table',
      'Are you sure you want to delete this table? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setTables(tables.filter(t => t.id !== tableId));
            setModalVisible(false);
            Alert.alert('Success', 'Table deleted successfully');
          },
        },
      ]
    );
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
        <Text style={styles.headerTitle}>Table CRUD</Text>
        <Text style={styles.headerSubtitle}>
          Manage billiard tables
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
          <Ionicons name="star" size={20} color={Colors.orange.primary} />
          <Text style={styles.statValue}>{stats.vip}</Text>
          <Text style={styles.statLabel}>VIP</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="cafe" size={20} color={Colors.text.secondary} />
          <Text style={styles.statValue}>{stats.regular}</Text>
          <Text style={styles.statLabel}>Regular</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="checkmark-circle" size={20} color={Colors.status.success} />
          <Text style={styles.statValue}>{stats.available}</Text>
          <Text style={styles.statLabel}>Available</Text>
        </View>
      </View>

      {/* SEARCH & ADD */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={Colors.text.secondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search tables..."
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
        <TouchableOpacity style={styles.addButton} onPress={handleAddTable} activeOpacity={0.8}>
          <Ionicons name="add" size={24} color={Colors.text.inverse} />
        </TouchableOpacity>
      </View>

      {/* FILTER */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {[
            { id: 'all', label: 'All Tables' },
            { id: 'VIP', label: 'VIP Only' },
            { id: 'Regular', label: 'Regular Only' },
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

      {/* TABLES GRID */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.orange.primary} />
        }
      >
        <View style={styles.tablesGrid}>
          {filteredTables.map(table => (
            <TouchableOpacity
              key={table.id}
              style={styles.tableCard}
              onPress={() => handleTablePress(table)}
              activeOpacity={0.8}
            >
              <View style={[
                styles.typeBadge,
                table.type === 'VIP' ? styles.typeBadgeVIP : styles.typeBadgeRegular
              ]}>
                <Ionicons 
                  name={table.type === 'VIP' ? 'star' : 'cafe'} 
                  size={12} 
                  color={table.type === 'VIP' ? Colors.orange.primary : Colors.text.secondary} 
                />
                <Text style={[
                  styles.typeText,
                  table.type === 'VIP' && styles.typeTextVIP
                ]}>
                  {table.type}
                </Text>
              </View>

              <View style={styles.tableIconContainer}>
                <Ionicons name="cafe" size={40} color={getStatusColor(table.status)} />
              </View>

              <Text style={styles.tableName}>{table.name}</Text>

              <View style={styles.tableDetails}>
                <View style={styles.detailItem}>
                  <Ionicons name="people" size={14} color={Colors.text.secondary} />
                  <Text style={styles.detailText}>{table.capacity} pax</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="cash" size={14} color={Colors.text.secondary} />
                  <Text style={styles.detailText}>{(table.pricePerHour / 1000).toFixed(0)}K/h</Text>
                </View>
              </View>

              <View style={[
                styles.statusBadge,
                { backgroundColor: `${getStatusColor(table.status)}20` }
              ]}>
                <View style={[styles.statusDot, { backgroundColor: getStatusColor(table.status) }]} />
                <Text style={[styles.statusText, { color: getStatusColor(table.status) }]}>
                  {table.status === 'available' ? 'Available' : table.status === 'occupied' ? 'Occupied' : 'Maintenance'}
                </Text>
              </View>
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
              <Text style={styles.modalTitle}>Table Details</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.text.primary} />
              </TouchableOpacity>
            </View>

            {selectedTable && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Table Name</Text>
                  <Text style={styles.modalValue}>{selectedTable.name}</Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Type</Text>
                  <Text style={styles.modalValue}>{selectedTable.type}</Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Capacity</Text>
                  <Text style={styles.modalValue}>{selectedTable.capacity} people</Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Price per Hour</Text>
                  <Text style={styles.modalValue}>Rp {selectedTable.pricePerHour.toLocaleString()}</Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Description</Text>
                  <Text style={styles.modalValue}>{selectedTable.description}</Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Current Status</Text>
                  <Text style={[styles.modalValue, { color: getStatusColor(selectedTable.status) }]}>
                    {selectedTable.status === 'available' ? 'Available' : selectedTable.status === 'occupied' ? 'Occupied' : 'Under Maintenance'}
                  </Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Created At</Text>
                  <Text style={styles.modalValue}>{selectedTable.createdAt}</Text>
                </View>

                <View style={styles.divider} />

                <TouchableOpacity
                  style={[styles.actionButton, styles.editButton]}
                  onPress={() => handleEditTable(selectedTable)}
                >
                  <Ionicons name="create" size={20} color="#fff" />
                  <Text style={styles.actionButtonText}>Edit Table</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleDeleteTable(selectedTable.id)}
                >
                  <Ionicons name="trash" size={20} color="#fff" />
                  <Text style={styles.actionButtonText}>Delete Table</Text>
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
              <Text style={styles.modalTitle}>{isEditing ? 'Edit Table' : 'Add New Table'}</Text>
              <TouchableOpacity onPress={() => setAddEditModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.text.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Table Name *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g., Meja VIP 1"
                  placeholderTextColor={Colors.text.tertiary}
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Table Type</Text>
                <View style={styles.typeContainer}>
                  <TouchableOpacity
                    style={[
                      styles.typeChip,
                      formData.type === 'Regular' && styles.typeChipSelected
                    ]}
                    onPress={() => setFormData({ ...formData, type: 'Regular' })}
                  >
                    <Ionicons 
                      name="cafe" 
                      size={18} 
                      color={formData.type === 'Regular' ? Colors.text.inverse : Colors.text.secondary} 
                    />
                    <Text style={[
                      styles.typeChipText,
                      formData.type === 'Regular' && styles.typeChipTextSelected
                    ]}>
                      Regular
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.typeChip,
                      formData.type === 'VIP' && styles.typeChipSelected
                    ]}
                    onPress={() => setFormData({ ...formData, type: 'VIP' })}
                  >
                    <Ionicons 
                      name="star" 
                      size={18} 
                      color={formData.type === 'VIP' ? Colors.text.inverse : Colors.text.secondary} 
                    />
                    <Text style={[
                      styles.typeChipText,
                      formData.type === 'VIP' && styles.typeChipTextSelected
                    ]}>
                      VIP
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Capacity (people)</Text>
                <View style={styles.capacityContainer}>
                  {['2', '4', '6', '8'].map(cap => (
                    <TouchableOpacity
                      key={cap}
                      style={[
                        styles.capacityChip,
                        formData.capacity === cap && styles.capacityChipSelected
                      ]}
                      onPress={() => setFormData({ ...formData, capacity: cap })}
                    >
                      <Text style={[
                        styles.capacityText,
                        formData.capacity === cap && styles.capacityTextSelected
                      ]}>
                        {cap}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Price per Hour *</Text>
                <View style={styles.priceInputContainer}>
                  <Text style={styles.pricePrefix}>Rp</Text>
                  <TextInput
                    style={styles.priceInput}
                    placeholder="50000"
                    placeholderTextColor={Colors.text.tertiary}
                    value={formData.pricePerHour}
                    onChangeText={(text) => setFormData({ ...formData, pricePerHour: text.replace(/[^0-9]/g, '') })}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Description</Text>
                <TextInput
                  style={[styles.formInput, styles.textArea]}
                  placeholder="Table description..."
                  placeholderTextColor={Colors.text.tertiary}
                  value={formData.description}
                  onChangeText={(text) => setFormData({ ...formData, description: text })}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveTable}
                activeOpacity={0.8}
              >
                <Ionicons name="checkmark-circle" size={20} color="#000" />
                <Text style={styles.saveButtonText}>{isEditing ? 'Update Table' : 'Add Table'}</Text>
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
  tablesGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16 },
  tableCard: { width: '48%', backgroundColor: Colors.bg.secondary, borderRadius: BorderRadius.lg, padding: 12, marginHorizontal: '1%', marginBottom: 12, borderWidth: 1, borderColor: Colors.bg.tertiary, position: 'relative' },
  typeBadge: { position: 'absolute', top: 8, right: 8, flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.bg.elevated, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  typeBadgeVIP: { backgroundColor: `${Colors.orange.primary}20` },
  typeBadgeRegular: { backgroundColor: Colors.bg.elevated },
  typeText: { fontSize: Typography.sizes.xs, fontWeight: Typography.weights.semibold, color: Colors.text.secondary, marginLeft: 4 },
  typeTextVIP: { color: Colors.orange.primary },
  tableIconContainer: { alignItems: 'center', marginVertical: 12 },
  tableName: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.text.primary, textAlign: 'center', marginBottom: 8 },
  tableDetails: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 8 },
  detailItem: { flexDirection: 'row', alignItems: 'center' },
  detailText: { fontSize: Typography.sizes.xs, color: Colors.text.secondary, marginLeft: 4 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 6, borderRadius: BorderRadius.sm },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 4 },
  statusText: { fontSize: Typography.sizes.xs, fontWeight: Typography.weights.semibold },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: Colors.bg.primary, borderTopLeftRadius: BorderRadius.xxl, borderTopRightRadius: BorderRadius.xxl, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: Colors.bg.tertiary },
  modalTitle: { fontSize: Typography.sizes.xl, fontWeight: Typography.weights.bold, color: Colors.text.primary },
  modalBody: { padding: 20 },
  modalSection: { marginBottom: 16 },
  modalLabel: { fontSize: Typography.sizes.xs, color: Colors.text.secondary, marginBottom: 4 },
  modalValue: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.semibold, color: Colors.text.primary },
  divider: { height: 1, backgroundColor: Colors.bg.tertiary, marginVertical: 16 },
  actionButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: BorderRadius.md, marginBottom: 10 },
  editButton: { backgroundColor: Colors.status.info },
  deleteButton: { backgroundColor: Colors.status.error },
  actionButtonText: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: '#fff', marginLeft: 8 },
  formGroup: { marginBottom: 16 },
  formLabel: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.semibold, color: Colors.text.primary, marginBottom: 8 },
  formInput: { backgroundColor: Colors.bg.secondary, borderWidth: 1, borderColor: Colors.bg.tertiary, borderRadius: BorderRadius.md, paddingHorizontal: 16, paddingVertical: 14, fontSize: Typography.sizes.base, color: Colors.text.primary },
  textArea: { height: 80, textAlignVertical: 'top' },
  typeContainer: { flexDirection: 'row' },
  typeChip: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.bg.secondary, paddingVertical: 12, borderRadius: BorderRadius.md, marginHorizontal: 4, borderWidth: 1, borderColor: Colors.bg.tertiary },
  typeChipSelected: { backgroundColor: Colors.orange.primary, borderColor: Colors.orange.primary },
  typeChipText: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.semibold, color: Colors.text.secondary, marginLeft: 6 },
  typeChipTextSelected: { color: Colors.text.inverse },
  capacityContainer: { flexDirection: 'row' },
  capacityChip: { flex: 1, backgroundColor: Colors.bg.secondary, paddingVertical: 12, borderRadius: BorderRadius.md, marginHorizontal: 4, alignItems: 'center', borderWidth: 1, borderColor: Colors.bg.tertiary },
  capacityChipSelected: { backgroundColor: Colors.orange.primary, borderColor: Colors.orange.primary },
  capacityText: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.semibold, color: Colors.text.secondary },
  capacityTextSelected: { color: Colors.text.inverse },
  priceInputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.bg.secondary, borderWidth: 1, borderColor: Colors.bg.tertiary, borderRadius: BorderRadius.md, paddingHorizontal: 16 },
  pricePrefix: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.semibold, color: Colors.text.secondary, marginRight: 8 },
  priceInput: { flex: 1, paddingVertical: 14, fontSize: Typography.sizes.base, color: Colors.text.primary },
  saveButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.orange.primary, paddingVertical: 16, borderRadius: BorderRadius.md },
  saveButtonText: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.text.inverse, marginLeft: 8 },
});

export default TableCRUDScreen;
