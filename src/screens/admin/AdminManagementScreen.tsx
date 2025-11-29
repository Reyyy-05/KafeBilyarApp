// src/screens/admin/AdminManagementScreen.tsx
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

interface Admin {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  role: 'admin' | 'super_admin';
  status: 'active' | 'inactive' | 'suspended';
  hasFaceData: boolean;
  lastLogin: string;
  createdAt: string;
}

const AdminManagementScreen = () => {
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    role: 'admin' as 'admin' | 'super_admin',
  });

  // Mock admins data
  const [admins] = useState<Admin[]>([
    {
      id: '1',
      name: 'Super Admin',
      username: 'superadmin',
      email: 'super@kafebilyar.com',
      phone: '+62812345678',
      role: 'super_admin',
      status: 'active',
      hasFaceData: true,
      lastLogin: '2 hours ago',
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@kafebilyar.com',
      phone: '+62823456789',
      role: 'admin',
      status: 'active',
      hasFaceData: true,
      lastLogin: '5 hours ago',
      createdAt: '2024-03-20',
    },
    {
      id: '3',
      name: 'Jane Smith',
      username: 'janesmith',
      email: 'jane@kafebilyar.com',
      phone: '+62834567890',
      role: 'admin',
      status: 'active',
      hasFaceData: false,
      lastLogin: '1 day ago',
      createdAt: '2024-05-10',
    },
    {
      id: '4',
      name: 'Bob Johnson',
      username: 'bobjohnson',
      email: 'bob@kafebilyar.com',
      phone: '+62845678901',
      role: 'admin',
      status: 'inactive',
      hasFaceData: true,
      lastLogin: '1 week ago',
      createdAt: '2024-02-28',
    },
    {
      id: '5',
      name: 'Alice Brown',
      username: 'alicebrown',
      email: 'alice@kafebilyar.com',
      phone: '+62856789012',
      role: 'admin',
      status: 'suspended',
      hasFaceData: false,
      lastLogin: '2 weeks ago',
      createdAt: '2024-04-05',
    },
  ]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return Colors.status.success;
      case 'inactive': return Colors.status.warning;
      case 'suspended': return Colors.status.error;
      default: return Colors.text.secondary;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'inactive': return 'Inactive';
      case 'suspended': return 'Suspended';
      default: return status;
    }
  };

  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = 
      admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || admin.status === filter;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: admins.length,
    active: admins.filter(a => a.status === 'active').length,
    inactive: admins.filter(a => a.status === 'inactive').length,
    suspended: admins.filter(a => a.status === 'suspended').length,
    withFace: admins.filter(a => a.hasFaceData).length,
  };

  const handleAdminPress = (admin: Admin) => {
    setSelectedAdmin(admin);
    setModalVisible(true);
  };

  const handleAddAdmin = () => {
    setFormData({
      name: '',
      username: '',
      email: '',
      phone: '',
      password: '',
      role: 'admin',
    });
    setAddModalVisible(true);
  };

  const handleSaveAdmin = () => {
    if (!formData.name || !formData.username || !formData.email || !formData.password) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
    console.log('Creating admin:', formData);
    setAddModalVisible(false);
    Alert.alert('Success', 'Admin account created! Face registration will be required on first login.');
  };

  const handleRegisterFace = (adminId: string) => {
    Alert.alert(
      'Register Face',
      'This will open face registration process for this admin.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start Registration',
          onPress: () => {
            setModalVisible(false);
            // Navigate to face registration screen
            console.log('Start face registration for admin:', adminId);
            Alert.alert('Info', 'Face registration feature will be implemented with backend integration');
          },
        },
      ]
    );
  };

  const handleStatusChange = (adminId: string, newStatus: 'active' | 'inactive' | 'suspended') => {
    Alert.alert(
      'Change Status',
      `Are you sure you want to change status to ${newStatus}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            console.log('Change admin', adminId, 'to', newStatus);
            setModalVisible(false);
            Alert.alert('Success', 'Admin status updated');
          },
        },
      ]
    );
  };

  const handleDeleteAdmin = (adminId: string) => {
    Alert.alert(
      'Delete Admin',
      'Are you sure you want to delete this admin? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            console.log('Delete admin:', adminId);
            setModalVisible(false);
            Alert.alert('Success', 'Admin deleted successfully');
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
        <Text style={styles.headerTitle}>Admin Management</Text>
        <Text style={styles.headerSubtitle}>
          {filteredAdmins.length} admins • {stats.withFace} with face data
        </Text>
      </View>

      {/* STATS */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={[styles.statDot, { backgroundColor: Colors.text.primary }]} />
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statCard}>
          <View style={[styles.statDot, { backgroundColor: Colors.status.success }]} />
          <Text style={styles.statValue}>{stats.active}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statCard}>
          <View style={[styles.statDot, { backgroundColor: Colors.status.warning }]} />
          <Text style={styles.statValue}>{stats.inactive}</Text>
          <Text style={styles.statLabel}>Inactive</Text>
        </View>
        <View style={styles.statCard}>
          <View style={[styles.statDot, { backgroundColor: Colors.orange.primary }]} />
          <Text style={styles.statValue}>{stats.withFace}</Text>
          <Text style={styles.statLabel}>Face Data</Text>
        </View>
      </View>

      {/* SEARCH & ADD */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={Colors.text.secondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, username, or email..."
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
        <TouchableOpacity style={styles.addButton} onPress={handleAddAdmin} activeOpacity={0.8}>
          <Ionicons name="add" size={24} color={Colors.text.inverse} />
        </TouchableOpacity>
      </View>

      {/* FILTER */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {[
            { id: 'all', label: 'All' },
            { id: 'active', label: 'Active' },
            { id: 'inactive', label: 'Inactive' },
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

      {/* ADMINS LIST */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.orange.primary} />
        }
      >
        {filteredAdmins.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={64} color={Colors.text.tertiary} />
            <Text style={styles.emptyTitle}>No admins found</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery ? 'Try different search terms' : 'Add your first admin'}
            </Text>
          </View>
        ) : (
          <View style={styles.adminsList}>
            {filteredAdmins.map(admin => (
              <TouchableOpacity
                key={admin.id}
                style={styles.adminCard}
                onPress={() => handleAdminPress(admin)}
                activeOpacity={0.8}
              >
                <View style={styles.adminAvatar}>
                  <Ionicons 
                    name={admin.role === 'super_admin' ? 'shield' : 'person'} 
                    size={28} 
                    color={admin.role === 'super_admin' ? Colors.orange.primary : Colors.text.secondary} 
                  />
                </View>

                <View style={styles.adminInfo}>
                  <View style={styles.adminHeader}>
                    <Text style={styles.adminName}>{admin.name}</Text>
                    {admin.role === 'super_admin' && (
                      <View style={styles.superAdminBadge}>
                        <Ionicons name="star" size={10} color={Colors.orange.primary} />
                        <Text style={styles.superAdminText}>Super</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.adminUsername}>@{admin.username}</Text>
                  <Text style={styles.adminEmail}>{admin.email}</Text>

                  <View style={styles.adminFooter}>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: `${getStatusColor(admin.status)}20` }
                    ]}>
                      <View style={[styles.statusDot, { backgroundColor: getStatusColor(admin.status) }]} />
                      <Text style={[styles.statusText, { color: getStatusColor(admin.status) }]}>
                        {getStatusLabel(admin.status)}
                      </Text>
                    </View>

                    {admin.hasFaceData ? (
                      <View style={styles.faceBadge}>
                        <Ionicons name="scan" size={12} color={Colors.status.success} />
                        <Text style={styles.faceText}>Face Registered</Text>
                      </View>
                    ) : (
                      <View style={[styles.faceBadge, styles.faceBadgeWarning]}>
                        <Ionicons name="warning" size={12} color={Colors.status.warning} />
                        <Text style={[styles.faceText, { color: Colors.status.warning }]}>No Face Data</Text>
                      </View>
                    )}
                  </View>
                </View>

                <Ionicons name="chevron-forward" size={20} color={Colors.text.secondary} />
              </TouchableOpacity>
            ))}
          </View>
        )}

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
              <Text style={styles.modalTitle}>Admin Details</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.text.primary} />
              </TouchableOpacity>
            </View>

            {selectedAdmin && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Name</Text>
                  <Text style={styles.modalValue}>{selectedAdmin.name}</Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Username</Text>
                  <Text style={styles.modalValue}>@{selectedAdmin.username}</Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Email</Text>
                  <Text style={styles.modalValue}>{selectedAdmin.email}</Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Phone</Text>
                  <Text style={styles.modalValue}>{selectedAdmin.phone}</Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Role</Text>
                  <Text style={styles.modalValue}>
                    {selectedAdmin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                  </Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Status</Text>
                  <Text style={[styles.modalValue, { color: getStatusColor(selectedAdmin.status) }]}>
                    {getStatusLabel(selectedAdmin.status)}
                  </Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Face Data</Text>
                  <Text style={[
                    styles.modalValue, 
                    { color: selectedAdmin.hasFaceData ? Colors.status.success : Colors.status.warning }
                  ]}>
                    {selectedAdmin.hasFaceData ? 'Registered ✓' : 'Not Registered'}
                  </Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Last Login</Text>
                  <Text style={styles.modalValue}>{selectedAdmin.lastLogin}</Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Created At</Text>
                  <Text style={styles.modalValue}>{selectedAdmin.createdAt}</Text>
                </View>

                {/* Face Registration */}
                {!selectedAdmin.hasFaceData && (
                  <>
                    <View style={styles.divider} />
                    <TouchableOpacity
                      style={[styles.actionButton, styles.faceButton]}
                      onPress={() => handleRegisterFace(selectedAdmin.id)}
                    >
                      <Ionicons name="scan" size={20} color="#fff" />
                      <Text style={styles.actionButtonText}>Register Face Data</Text>
                    </TouchableOpacity>
                  </>
                )}

                {/* Status Actions */}
                {selectedAdmin.role !== 'super_admin' && (
                  <>
                    <View style={styles.divider} />
                    <Text style={styles.modalSectionTitle}>Status Actions</Text>
                    <View style={styles.modalActions}>
                      {selectedAdmin.status !== 'active' && (
                        <TouchableOpacity
                          style={[styles.actionButton, styles.activateButton]}
                          onPress={() => handleStatusChange(selectedAdmin.id, 'active')}
                        >
                          <Ionicons name="checkmark-circle" size={20} color="#fff" />
                          <Text style={styles.actionButtonText}>Activate</Text>
                        </TouchableOpacity>
                      )}
                      {selectedAdmin.status === 'active' && (
                        <TouchableOpacity
                          style={[styles.actionButton, styles.suspendButton]}
                          onPress={() => handleStatusChange(selectedAdmin.id, 'suspended')}
                        >
                          <Ionicons name="ban" size={20} color="#fff" />
                          <Text style={styles.actionButtonText}>Suspend</Text>
                        </TouchableOpacity>
                      )}
                    </View>

                    <TouchableOpacity
                      style={[styles.actionButton, styles.deleteButton]}
                      onPress={() => handleDeleteAdmin(selectedAdmin.id)}
                    >
                      <Ionicons name="trash" size={20} color="#fff" />
                      <Text style={styles.actionButtonText}>Delete Admin</Text>
                    </TouchableOpacity>
                  </>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* ADD ADMIN MODAL */}
      <Modal
        visible={addModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Admin</Text>
              <TouchableOpacity onPress={() => setAddModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.text.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Full Name *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Enter full name"
                  placeholderTextColor={Colors.text.tertiary}
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Username *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Enter username"
                  placeholderTextColor={Colors.text.tertiary}
                  value={formData.username}
                  onChangeText={(text) => setFormData({ ...formData, username: text })}
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Email *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Enter email"
                  placeholderTextColor={Colors.text.tertiary}
                  value={formData.email}
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Phone</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Enter phone number"
                  placeholderTextColor={Colors.text.tertiary}
                  value={formData.phone}
                  onChangeText={(text) => setFormData({ ...formData, phone: text })}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Password *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Enter password"
                  placeholderTextColor={Colors.text.tertiary}
                  value={formData.password}
                  onChangeText={(text) => setFormData({ ...formData, password: text })}
                  secureTextEntry
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Role</Text>
                <View style={styles.roleContainer}>
                  <TouchableOpacity
                    style={[
                      styles.roleChip,
                      formData.role === 'admin' && styles.roleChipSelected
                    ]}
                    onPress={() => setFormData({ ...formData, role: 'admin' })}
                  >
                    <Text style={[
                      styles.roleText,
                      formData.role === 'admin' && styles.roleTextSelected
                    ]}>
                      Admin
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.roleChip,
                      formData.role === 'super_admin' && styles.roleChipSelected
                    ]}
                    onPress={() => setFormData({ ...formData, role: 'super_admin' })}
                  >
                    <Text style={[
                      styles.roleText,
                      formData.role === 'super_admin' && styles.roleTextSelected
                    ]}>
                      Super Admin
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.infoBox}>
                <Ionicons name="information-circle" size={20} color={Colors.status.info} />
                <Text style={styles.infoText}>
                  Face registration will be required on first login
                </Text>
              </View>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveAdmin}
                activeOpacity={0.8}
              >
                <Ionicons name="checkmark-circle" size={20} color="#000" />
                <Text style={styles.saveButtonText}>Create Admin</Text>
              </TouchableOpacity>
            </ScrollView>
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

  // STATS
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.bg.secondary,
    borderRadius: BorderRadius.md,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.bg.tertiary,
  },
  statDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  statValue: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.secondary,
  },

  // SEARCH & ADD
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 12,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg.secondary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.bg.tertiary,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: Typography.sizes.base,
    color: Colors.text.primary,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.orange.primary,
    justifyContent: 'center',
    alignItems: 'center',
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

  // EMPTY STATE
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: Typography.sizes.base,
    color: Colors.text.secondary,
    textAlign: 'center',
  },

  // ADMINS LIST
  adminsList: {
    paddingHorizontal: 20,
  },
  adminCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg.secondary,
    borderRadius: BorderRadius.lg,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.bg.tertiary,
  },
  adminAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.bg.elevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  adminInfo: {
    flex: 1,
  },
  adminHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  adminName: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginRight: 8,
  },
  superAdminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.orange.primary}20`,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  superAdminText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.orange.primary,
    marginLeft: 3,
  },
  adminUsername: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  adminEmail: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.tertiary,
    marginBottom: 8,
  },
  adminFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    marginRight: 8,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  statusText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
  },
  faceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.status.success}20`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  faceBadgeWarning: {
    backgroundColor: `${Colors.status.warning}20`,
  },
  faceText: {
    fontSize: Typography.sizes.xs,
    color: Colors.status.success,
    marginLeft: 4,
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
    maxHeight: '90%',
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
  modalActions: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    marginBottom: 10,
    marginHorizontal: 4,
  },
  faceButton: {
    backgroundColor: Colors.status.info,
  },
  activateButton: {
    flex: 1,
    backgroundColor: Colors.status.success,
  },
  suspendButton: {
    flex: 1,
    backgroundColor: Colors.status.warning,
  },
  deleteButton: {
    backgroundColor: Colors.status.error,
  },
  actionButtonText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: '#fff',
    marginLeft: 8,
  },

  // FORM
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: Colors.bg.secondary,
    borderWidth: 1,
    borderColor: Colors.bg.tertiary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: Typography.sizes.base,
    color: Colors.text.primary,
  },
  roleContainer: {
    flexDirection: 'row',
  },
  roleChip: {
    flex: 1,
    backgroundColor: Colors.bg.secondary,
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.bg.tertiary,
  },
  roleChipSelected: {
    backgroundColor: Colors.orange.primary,
    borderColor: Colors.orange.primary,
  },
  roleText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.secondary,
  },
  roleTextSelected: {
    color: Colors.text.inverse,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.status.info}20`,
    padding: 12,
    borderRadius: BorderRadius.md,
    marginBottom: 20,
  },
  infoText: {
    flex: 1,
    fontSize: Typography.sizes.sm,
    color: Colors.status.info,
    marginLeft: 8,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.orange.primary,
    paddingVertical: 16,
    borderRadius: BorderRadius.md,
  },
  saveButtonText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.text.inverse,
    marginLeft: 8,
  },
});

export default AdminManagementScreen;
