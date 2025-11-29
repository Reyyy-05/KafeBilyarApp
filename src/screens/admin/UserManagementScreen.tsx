// src/screens/admin/UserManagementScreen.tsx
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

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'suspended' | 'banned';
  totalBookings: number;
  totalSpent: number;
  lastBooking: string;
  joinedAt: string;
}

const UserManagementScreen = () => {
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'suspended'>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Mock users data
  const [users] = useState<User[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      phone: '+62812345678',
      status: 'active',
      totalBookings: 15,
      totalSpent: 1250000,
      lastBooking: '2025-11-28',
      joinedAt: '2024-06-15',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@gmail.com',
      phone: '+62823456789',
      status: 'active',
      totalBookings: 8,
      totalSpent: 650000,
      lastBooking: '2025-11-27',
      joinedAt: '2024-08-20',
    },
    {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob.johnson@gmail.com',
      phone: '+62834567890',
      status: 'active',
      totalBookings: 25,
      totalSpent: 2100000,
      lastBooking: '2025-11-29',
      joinedAt: '2024-03-10',
    },
    {
      id: '4',
      name: 'Alice Brown',
      email: 'alice.brown@gmail.com',
      phone: '+62845678901',
      status: 'suspended',
      totalBookings: 3,
      totalSpent: 180000,
      lastBooking: '2025-11-15',
      joinedAt: '2024-10-05',
    },
    {
      id: '5',
      name: 'Charlie Wilson',
      email: 'charlie.wilson@gmail.com',
      phone: '+62856789012',
      status: 'active',
      totalBookings: 12,
      totalSpent: 980000,
      lastBooking: '2025-11-26',
      joinedAt: '2024-07-22',
    },
    {
      id: '6',
      name: 'Diana Martinez',
      email: 'diana.martinez@gmail.com',
      phone: '+62867890123',
      status: 'banned',
      totalBookings: 2,
      totalSpent: 120000,
      lastBooking: '2025-10-10',
      joinedAt: '2024-09-18',
    },
  ]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return Colors.status.success;
      case 'suspended': return Colors.status.warning;
      case 'banned': return Colors.status.error;
      default: return Colors.text.secondary;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'suspended': return 'Suspended';
      case 'banned': return 'Banned';
      default: return status;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery);
    const matchesFilter = filter === 'all' || user.status === filter;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    suspended: users.filter(u => u.status === 'suspended').length,
    banned: users.filter(u => u.status === 'banned').length,
  };

  const handleUserPress = (user: User) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const handleStatusChange = (userId: string, newStatus: 'active' | 'suspended' | 'banned') => {
    Alert.alert(
      'Change User Status',
      `Are you sure you want to change status to ${newStatus}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            console.log('Change user', userId, 'to', newStatus);
            setModalVisible(false);
            Alert.alert('Success', 'User status updated');
          },
        },
      ]
    );
  };

  const handleDeleteUser = (userId: string) => {
    Alert.alert(
      'Delete User',
      'Are you sure you want to permanently delete this user? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            console.log('Delete user:', userId);
            setModalVisible(false);
            Alert.alert('Success', 'User deleted successfully');
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
        <Text style={styles.headerTitle}>User Management</Text>
        <Text style={styles.headerSubtitle}>
          {filteredUsers.length} customers registered
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
          <Text style={styles.statValue}>{stats.suspended}</Text>
          <Text style={styles.statLabel}>Suspended</Text>
        </View>
        <View style={styles.statCard}>
          <View style={[styles.statDot, { backgroundColor: Colors.status.error }]} />
          <Text style={styles.statValue}>{stats.banned}</Text>
          <Text style={styles.statLabel}>Banned</Text>
        </View>
      </View>

      {/* SEARCH */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={Colors.text.secondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, email, or phone..."
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

      {/* FILTER */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {[
            { id: 'all', label: 'All Users' },
            { id: 'active', label: 'Active' },
            { id: 'suspended', label: 'Suspended' },
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

      {/* USERS LIST */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.orange.primary} />
        }
      >
        {filteredUsers.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={64} color={Colors.text.tertiary} />
            <Text style={styles.emptyTitle}>No users found</Text>
            <Text style={styles.emptySubtitle}>Try different search terms</Text>
          </View>
        ) : (
          <View style={styles.usersList}>
            {filteredUsers.map(user => (
              <TouchableOpacity
                key={user.id}
                style={styles.userCard}
                onPress={() => handleUserPress(user)}
                activeOpacity={0.8}
              >
                <View style={styles.userAvatar}>
                  <Text style={styles.userInitials}>
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </Text>
                </View>

                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userEmail}>{user.email}</Text>
                  <Text style={styles.userPhone}>{user.phone}</Text>

                  <View style={styles.userStats}>
                    <View style={styles.userStat}>
                      <Ionicons name="calendar" size={12} color={Colors.text.secondary} />
                      <Text style={styles.userStatText}>{user.totalBookings} bookings</Text>
                    </View>
                    <View style={styles.userStat}>
                      <Ionicons name="cash" size={12} color={Colors.orange.primary} />
                      <Text style={styles.userStatText}>Rp {(user.totalSpent / 1000).toFixed(0)}K</Text>
                    </View>
                  </View>
                </View>

                <View style={[
                  styles.statusBadge,
                  { backgroundColor: `${getStatusColor(user.status)}20` }
                ]}>
                  <View style={[styles.statusDot, { backgroundColor: getStatusColor(user.status) }]} />
                  <Text style={[styles.statusText, { color: getStatusColor(user.status) }]}>
                    {getStatusLabel(user.status)}
                  </Text>
                </View>
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
              <Text style={styles.modalTitle}>User Details</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.text.primary} />
              </TouchableOpacity>
            </View>

            {selectedUser && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.modalAvatarContainer}>
                  <View style={styles.modalAvatar}>
                    <Text style={styles.modalInitials}>
                      {selectedUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Name</Text>
                  <Text style={styles.modalValue}>{selectedUser.name}</Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Email</Text>
                  <Text style={styles.modalValue}>{selectedUser.email}</Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Phone</Text>
                  <Text style={styles.modalValue}>{selectedUser.phone}</Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Status</Text>
                  <Text style={[styles.modalValue, { color: getStatusColor(selectedUser.status) }]}>
                    {getStatusLabel(selectedUser.status)}
                  </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Total Bookings</Text>
                  <Text style={styles.modalValue}>{selectedUser.totalBookings} times</Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Total Spent</Text>
                  <Text style={styles.modalValue}>Rp {selectedUser.totalSpent.toLocaleString()}</Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Last Booking</Text>
                  <Text style={styles.modalValue}>{selectedUser.lastBooking}</Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Joined At</Text>
                  <Text style={styles.modalValue}>{selectedUser.joinedAt}</Text>
                </View>

                <View style={styles.divider} />

                {/* Status Actions */}
                {selectedUser.status !== 'banned' && (
                  <>
                    <Text style={styles.modalSectionTitle}>Status Actions</Text>
                    <View style={styles.modalActions}>
                      {selectedUser.status !== 'active' && (
                        <TouchableOpacity
                          style={[styles.actionButton, styles.activateButton]}
                          onPress={() => handleStatusChange(selectedUser.id, 'active')}
                        >
                          <Ionicons name="checkmark-circle" size={20} color="#fff" />
                          <Text style={styles.actionButtonText}>Activate</Text>
                        </TouchableOpacity>
                      )}
                      {selectedUser.status === 'active' && (
                        <TouchableOpacity
                          style={[styles.actionButton, styles.suspendButton]}
                          onPress={() => handleStatusChange(selectedUser.id, 'suspended')}
                        >
                          <Ionicons name="ban" size={20} color="#fff" />
                          <Text style={styles.actionButtonText}>Suspend</Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        style={[styles.actionButton, styles.banButton]}
                        onPress={() => handleStatusChange(selectedUser.id, 'banned')}
                      >
                        <Ionicons name="close-circle" size={20} color="#fff" />
                        <Text style={styles.actionButtonText}>Ban</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}

                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleDeleteUser(selectedUser.id)}
                >
                  <Ionicons name="trash" size={20} color="#fff" />
                  <Text style={styles.actionButtonText}>Delete User</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
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
  statDot: { width: 8, height: 8, borderRadius: 4, marginBottom: 8 },
  statValue: { fontSize: Typography.sizes.xl, fontWeight: Typography.weights.bold, color: Colors.text.primary, marginBottom: 2 },
  statLabel: { fontSize: Typography.sizes.xs, color: Colors.text.secondary },
  searchContainer: { paddingHorizontal: 20, paddingBottom: 12 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.bg.secondary, borderRadius: BorderRadius.md, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: Colors.bg.tertiary },
  searchInput: { flex: 1, marginLeft: 12, fontSize: Typography.sizes.base, color: Colors.text.primary },
  filterContainer: { paddingBottom: 16 },
  filterScroll: { paddingHorizontal: 20 },
  filterChip: { backgroundColor: Colors.bg.secondary, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: Colors.bg.tertiary },
  filterChipSelected: { backgroundColor: Colors.orange.primary, borderColor: Colors.orange.primary },
  filterText: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.semibold, color: Colors.text.secondary },
  filterTextSelected: { color: Colors.text.inverse },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 80 },
  emptyTitle: { fontSize: Typography.sizes.xl, fontWeight: Typography.weights.bold, color: Colors.text.primary, marginTop: 16, marginBottom: 8 },
  emptySubtitle: { fontSize: Typography.sizes.base, color: Colors.text.secondary, textAlign: 'center' },
  usersList: { paddingHorizontal: 20 },
  userCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.bg.secondary, borderRadius: BorderRadius.lg, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: Colors.bg.tertiary },
  userAvatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.orange.primary, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  userInitials: { fontSize: Typography.sizes.lg, fontWeight: Typography.weights.bold, color: Colors.text.inverse },
  userInfo: { flex: 1 },
  userName: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.text.primary, marginBottom: 4 },
  userEmail: { fontSize: Typography.sizes.sm, color: Colors.text.secondary, marginBottom: 2 },
  userPhone: { fontSize: Typography.sizes.xs, color: Colors.text.tertiary, marginBottom: 8 },
  userStats: { flexDirection: 'row' },
  userStat: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
  userStatText: { fontSize: Typography.sizes.xs, color: Colors.text.secondary, marginLeft: 4 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: BorderRadius.md, alignItems: 'center' },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginBottom: 4 },
  statusText: { fontSize: Typography.sizes.xs, fontWeight: Typography.weights.semibold },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: Colors.bg.primary, borderTopLeftRadius: BorderRadius.xxl, borderTopRightRadius: BorderRadius.xxl, maxHeight: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: Colors.bg.tertiary },
  modalTitle: { fontSize: Typography.sizes.xl, fontWeight: Typography.weights.bold, color: Colors.text.primary },
  modalBody: { padding: 20 },
  modalAvatarContainer: { alignItems: 'center', marginBottom: 20 },
  modalAvatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.orange.primary, justifyContent: 'center', alignItems: 'center' },
  modalInitials: { fontSize: Typography.sizes.display1, fontWeight: Typography.weights.bold, color: Colors.text.inverse },
  modalSection: { marginBottom: 16 },
  modalLabel: { fontSize: Typography.sizes.xs, color: Colors.text.secondary, marginBottom: 4 },
  modalValue: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.semibold, color: Colors.text.primary },
  divider: { height: 1, backgroundColor: Colors.bg.tertiary, marginVertical: 16 },
  modalSectionTitle: { fontSize: Typography.sizes.lg, fontWeight: Typography.weights.bold, color: Colors.text.primary, marginBottom: 12 },
  modalActions: { flexDirection: 'row', marginBottom: 10 },
  actionButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: BorderRadius.md, marginBottom: 10, marginHorizontal: 4 },
  activateButton: { flex: 1, backgroundColor: Colors.status.success },
  suspendButton: { flex: 1, backgroundColor: Colors.status.warning },
  banButton: { flex: 1, backgroundColor: Colors.status.error },
  deleteButton: { backgroundColor: Colors.status.error },
  actionButtonText: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: '#fff', marginLeft: 8 },
});

export default UserManagementScreen;
