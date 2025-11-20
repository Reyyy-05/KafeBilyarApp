// src/screens/customer/ProfileScreen.tsx - WEB COMPATIBLE LOGOUT
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform // ✅ ADD
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { logout } from '../../store/slices/authSlice';
import { persistor } from '../../store';
import type { RootState } from '../../store';

type NavigationProps = {
  navigate: (screen: string, params?: any) => void;
};

const ProfileScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  // ✅ WEB-COMPATIBLE LOGOUT
  const handleLogout = async () => {
    console.log('🔴 LOGOUT BUTTON CLICKED!');
    
    // ✅ WEB: Use window.confirm
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Apakah Anda yakin ingin logout?');
      
      if (confirmed) {
        console.log('🔓 Logout confirmed');
        
        // Logout
        dispatch(logout());
        
        // Purge persist
        await persistor.purge();
        
        console.log('✅ Logout complete, reloading...');
        
        // Force reload
        window.location.href = '/';
      } else {
        console.log('❌ Logout cancelled');
      }
    } else {
      // ✅ MOBILE: Use Alert (import it first)
      const { Alert } = require('react-native');
      Alert.alert(
        'Logout',
        'Apakah Anda yakin ingin logout?',
        [
          { text: 'Batal', style: 'cancel' },
          { 
            text: 'Logout', 
            style: 'destructive',
            onPress: async () => {
              dispatch(logout());
              await persistor.purge();
            }
          }
        ]
      );
    }
  };

  const menuItems = [
    {
      title: 'Edit Profil',
      icon: 'person-outline',
      screen: 'EditProfile'
    },
    {
      title: 'Riwayat Booking',
      icon: 'calendar-outline', 
      screen: 'History'
    },
    {
      title: 'Pembayaran',
      icon: 'card-outline',
      screen: 'PaymentMethods'
    },
    {
      title: 'Favorit',
      icon: 'heart-outline',
      screen: 'Favorites'
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color="#666" />
        </View>
        <Text style={styles.name}>{user?.name || 'User'}</Text>
        <Text style={styles.email}>{user?.email || 'user@example.com'}</Text>
      </View>

      {/* Menu */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Menu</Text>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.screen)}
          >
            <Ionicons name={item.icon as any} size={24} color="#666" />
            <Text style={styles.menuText}>{item.title}</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 20,
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  menuSection: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  logoutButton: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff3b30',
  },
  logoutText: {
    color: '#ff3b30',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;
