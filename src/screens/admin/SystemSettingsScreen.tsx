// src/screens/admin/SystemSettingsScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors, Typography, BorderRadius } from '../../theme';

const SystemSettingsScreen = () => {
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    // General
    maintenanceMode: false,
    allowNewBookings: true,
    allowNewRegistrations: true,
    
    // Notifications
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    
    // Security
    twoFactorAuth: true,
    faceRecognition: true,
    sessionTimeout: true,
    
    // Business
    autoApproveBookings: false,
    requireDeposit: true,
    allowCancellations: true,
  });

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleBackup = () => {
    Alert.alert(
      'Create Backup',
      'This will create a full system backup including database and files.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Create Backup',
          onPress: () => {
            Alert.alert('Success', 'System backup created successfully');
          },
        },
      ]
    );
  };

  const handleRestore = () => {
    Alert.alert(
      'Restore from Backup',
      'This will restore the system from the latest backup. All current data will be replaced.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Restore',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'System restored from backup');
          },
        },
      ]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached data. The app may run slower temporarily.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          onPress: () => {
            Alert.alert('Success', 'Cache cleared successfully');
          },
        },
      ]
    );
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Reset All Settings',
      'This will reset all settings to default values. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setSettings({
              maintenanceMode: false,
              allowNewBookings: true,
              allowNewRegistrations: true,
              pushNotifications: true,
              emailNotifications: true,
              smsNotifications: false,
              twoFactorAuth: true,
              faceRecognition: true,
              sessionTimeout: true,
              autoApproveBookings: false,
              requireDeposit: true,
              allowCancellations: true,
            });
            Alert.alert('Success', 'Settings reset to defaults');
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
        <Text style={styles.headerTitle}>System Settings</Text>
        <Text style={styles.headerSubtitle}>
          Configure app behavior & preferences
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.orange.primary} />
        }
      >
        {/* GENERAL SETTINGS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General Settings</Text>
          
          <View style={styles.settingCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <View style={styles.settingHeader}>
                  <Ionicons name="construct" size={20} color={Colors.status.warning} />
                  <Text style={styles.settingLabel}>Maintenance Mode</Text>
                </View>
                <Text style={styles.settingDescription}>
                  Disable app access for maintenance
                </Text>
              </View>
              <Switch
                value={settings.maintenanceMode}
                onValueChange={() => handleToggle('maintenanceMode')}
                trackColor={{ false: Colors.bg.tertiary, true: Colors.orange.primary }}
                thumbColor={settings.maintenanceMode ? '#fff' : '#f4f3f4'}
              />
            </View>

            <View style={styles.settingDivider} />

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <View style={styles.settingHeader}>
                  <Ionicons name="calendar" size={20} color={Colors.status.info} />
                  <Text style={styles.settingLabel}>Allow New Bookings</Text>
                </View>
                <Text style={styles.settingDescription}>
                  Enable customers to create bookings
                </Text>
              </View>
              <Switch
                value={settings.allowNewBookings}
                onValueChange={() => handleToggle('allowNewBookings')}
                trackColor={{ false: Colors.bg.tertiary, true: Colors.orange.primary }}
                thumbColor={settings.allowNewBookings ? '#fff' : '#f4f3f4'}
              />
            </View>

            <View style={styles.settingDivider} />

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <View style={styles.settingHeader}>
                  <Ionicons name="person-add" size={20} color={Colors.status.success} />
                  <Text style={styles.settingLabel}>Allow New Registrations</Text>
                </View>
                <Text style={styles.settingDescription}>
                  Enable new user sign-ups
                </Text>
              </View>
              <Switch
                value={settings.allowNewRegistrations}
                onValueChange={() => handleToggle('allowNewRegistrations')}
                trackColor={{ false: Colors.bg.tertiary, true: Colors.orange.primary }}
                thumbColor={settings.allowNewRegistrations ? '#fff' : '#f4f3f4'}
              />
            </View>
          </View>
        </View>

        {/* NOTIFICATION SETTINGS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.settingCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <View style={styles.settingHeader}>
                  <Ionicons name="notifications" size={20} color={Colors.orange.primary} />
                  <Text style={styles.settingLabel}>Push Notifications</Text>
                </View>
                <Text style={styles.settingDescription}>
                  Send push notifications to users
                </Text>
              </View>
              <Switch
                value={settings.pushNotifications}
                onValueChange={() => handleToggle('pushNotifications')}
                trackColor={{ false: Colors.bg.tertiary, true: Colors.orange.primary }}
                thumbColor={settings.pushNotifications ? '#fff' : '#f4f3f4'}
              />
            </View>

            <View style={styles.settingDivider} />

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <View style={styles.settingHeader}>
                  <Ionicons name="mail" size={20} color={Colors.status.info} />
                  <Text style={styles.settingLabel}>Email Notifications</Text>
                </View>
                <Text style={styles.settingDescription}>
                  Send email confirmations & updates
                </Text>
              </View>
              <Switch
                value={settings.emailNotifications}
                onValueChange={() => handleToggle('emailNotifications')}
                trackColor={{ false: Colors.bg.tertiary, true: Colors.orange.primary }}
                thumbColor={settings.emailNotifications ? '#fff' : '#f4f3f4'}
              />
            </View>

            <View style={styles.settingDivider} />

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <View style={styles.settingHeader}>
                  <Ionicons name="chatbubble" size={20} color={Colors.status.success} />
                  <Text style={styles.settingLabel}>SMS Notifications</Text>
                </View>
                <Text style={styles.settingDescription}>
                  Send SMS alerts (requires credits)
                </Text>
              </View>
              <Switch
                value={settings.smsNotifications}
                onValueChange={() => handleToggle('smsNotifications')}
                trackColor={{ false: Colors.bg.tertiary, true: Colors.orange.primary }}
                thumbColor={settings.smsNotifications ? '#fff' : '#f4f3f4'}
              />
            </View>
          </View>
        </View>

        {/* SECURITY SETTINGS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          
          <View style={styles.settingCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <View style={styles.settingHeader}>
                  <Ionicons name="shield-checkmark" size={20} color={Colors.status.success} />
                  <Text style={styles.settingLabel}>Two-Factor Authentication</Text>
                </View>
                <Text style={styles.settingDescription}>
                  Require 2FA for admin login
                </Text>
              </View>
              <Switch
                value={settings.twoFactorAuth}
                onValueChange={() => handleToggle('twoFactorAuth')}
                trackColor={{ false: Colors.bg.tertiary, true: Colors.orange.primary }}
                thumbColor={settings.twoFactorAuth ? '#fff' : '#f4f3f4'}
              />
            </View>

            <View style={styles.settingDivider} />

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <View style={styles.settingHeader}>
                  <Ionicons name="scan" size={20} color={Colors.orange.primary} />
                  <Text style={styles.settingLabel}>Face Recognition</Text>
                </View>
                <Text style={styles.settingDescription}>
                  Enable face verification for admins
                </Text>
              </View>
              <Switch
                value={settings.faceRecognition}
                onValueChange={() => handleToggle('faceRecognition')}
                trackColor={{ false: Colors.bg.tertiary, true: Colors.orange.primary }}
                thumbColor={settings.faceRecognition ? '#fff' : '#f4f3f4'}
              />
            </View>

            <View style={styles.settingDivider} />

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <View style={styles.settingHeader}>
                  <Ionicons name="time" size={20} color={Colors.status.warning} />
                  <Text style={styles.settingLabel}>Session Timeout</Text>
                </View>
                <Text style={styles.settingDescription}>
                  Auto-logout after 30 min of inactivity
                </Text>
              </View>
              <Switch
                value={settings.sessionTimeout}
                onValueChange={() => handleToggle('sessionTimeout')}
                trackColor={{ false: Colors.bg.tertiary, true: Colors.orange.primary }}
                thumbColor={settings.sessionTimeout ? '#fff' : '#f4f3f4'}
              />
            </View>
          </View>
        </View>

        {/* BUSINESS SETTINGS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Rules</Text>
          
          <View style={styles.settingCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <View style={styles.settingHeader}>
                  <Ionicons name="checkmark-done" size={20} color={Colors.status.info} />
                  <Text style={styles.settingLabel}>Auto-Approve Bookings</Text>
                </View>
                <Text style={styles.settingDescription}>
                  Automatically approve all bookings
                </Text>
              </View>
              <Switch
                value={settings.autoApproveBookings}
                onValueChange={() => handleToggle('autoApproveBookings')}
                trackColor={{ false: Colors.bg.tertiary, true: Colors.orange.primary }}
                thumbColor={settings.autoApproveBookings ? '#fff' : '#f4f3f4'}
              />
            </View>

            <View style={styles.settingDivider} />

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <View style={styles.settingHeader}>
                  <Ionicons name="cash" size={20} color={Colors.orange.primary} />
                  <Text style={styles.settingLabel}>Require Deposit</Text>
                </View>
                <Text style={styles.settingDescription}>
                  Require payment before booking
                </Text>
              </View>
              <Switch
                value={settings.requireDeposit}
                onValueChange={() => handleToggle('requireDeposit')}
                trackColor={{ false: Colors.bg.tertiary, true: Colors.orange.primary }}
                thumbColor={settings.requireDeposit ? '#fff' : '#f4f3f4'}
              />
            </View>

            <View style={styles.settingDivider} />

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <View style={styles.settingHeader}>
                  <Ionicons name="close-circle" size={20} color={Colors.status.error} />
                  <Text style={styles.settingLabel}>Allow Cancellations</Text>
                </View>
                <Text style={styles.settingDescription}>
                  Let users cancel their bookings
                </Text>
              </View>
              <Switch
                value={settings.allowCancellations}
                onValueChange={() => handleToggle('allowCancellations')}
                trackColor={{ false: Colors.bg.tertiary, true: Colors.orange.primary }}
                thumbColor={settings.allowCancellations ? '#fff' : '#f4f3f4'}
              />
            </View>
          </View>
        </View>

        {/* SYSTEM ACTIONS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Actions</Text>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleBackup} activeOpacity={0.8}>
            <View style={[styles.actionIcon, { backgroundColor: `${Colors.status.info}20` }]}>
              <Ionicons name="cloud-upload" size={24} color={Colors.status.info} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Create Backup</Text>
              <Text style={styles.actionSubtitle}>Backup database & files</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.text.secondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleRestore} activeOpacity={0.8}>
            <View style={[styles.actionIcon, { backgroundColor: `${Colors.status.success}20` }]}>
              <Ionicons name="cloud-download" size={24} color={Colors.status.success} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Restore from Backup</Text>
              <Text style={styles.actionSubtitle}>Restore latest backup</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.text.secondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleClearCache} activeOpacity={0.8}>
            <View style={[styles.actionIcon, { backgroundColor: `${Colors.status.warning}20` }]}>
              <Ionicons name="trash" size={24} color={Colors.status.warning} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Clear Cache</Text>
              <Text style={styles.actionSubtitle}>Free up storage space</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.text.secondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleResetSettings} activeOpacity={0.8}>
            <View style={[styles.actionIcon, { backgroundColor: `${Colors.status.error}20` }]}>
              <Ionicons name="refresh" size={24} color={Colors.status.error} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Reset All Settings</Text>
              <Text style={styles.actionSubtitle}>Restore default configuration</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.text.secondary} />
          </TouchableOpacity>
        </View>

        {/* APP INFO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Information</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>App Name</Text>
              <Text style={styles.infoValue}>KafeBilyarApp</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Version</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Build</Text>
              <Text style={styles.infoValue}>2025.11.29</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Environment</Text>
              <Text style={styles.infoValue}>Development</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Database</Text>
              <Text style={[styles.infoValue, { color: Colors.status.success }]}>Connected</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
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
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: { fontSize: Typography.sizes.lg, fontWeight: Typography.weights.bold, color: Colors.text.primary, marginBottom: 16 },
  settingCard: { backgroundColor: Colors.bg.secondary, borderRadius: BorderRadius.xl, padding: 16, borderWidth: 1, borderColor: Colors.bg.tertiary },
  settingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  settingInfo: { flex: 1, marginRight: 12 },
  settingHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  settingLabel: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.semibold, color: Colors.text.primary, marginLeft: 8 },
  settingDescription: { fontSize: Typography.sizes.sm, color: Colors.text.secondary },
  settingDivider: { height: 1, backgroundColor: Colors.bg.tertiary, marginVertical: 12 },
  actionButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.bg.secondary, borderRadius: BorderRadius.lg, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: Colors.bg.tertiary },
  actionIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  actionContent: { flex: 1 },
  actionTitle: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.text.primary, marginBottom: 4 },
  actionSubtitle: { fontSize: Typography.sizes.sm, color: Colors.text.secondary },
  infoCard: { backgroundColor: Colors.bg.secondary, borderRadius: BorderRadius.lg, padding: 16, borderWidth: 1, borderColor: Colors.bg.tertiary },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.bg.tertiary },
  infoLabel: { fontSize: Typography.sizes.sm, color: Colors.text.secondary },
  infoValue: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.semibold, color: Colors.text.primary },
});

export default SystemSettingsScreen;
