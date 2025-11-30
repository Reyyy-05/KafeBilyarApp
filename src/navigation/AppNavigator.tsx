// src/navigation/AppNavigator.tsx
import React, { useEffect } from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

// Auth Screens
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Admin Screens
import AdminLoginScreen from '../screens/admin/AdminLoginScreen';
import FaceVerificationScreen from '../screens/admin/FaceVerificationScreen';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import SuperAdminDashboardScreen from '../screens/admin/SuperAdminDashboardScreen';
import BookingManagementScreen from '../screens/admin/BookingManagementScreen';
import TableManagementScreen from '../screens/admin/TableManagementScreen';
import MenuManagementScreen from '../screens/admin/MenuManagementScreen';
import ReportsScreen from '../screens/admin/ReportsScreen';
import AttendanceScreen from '../screens/admin/AttendanceScreen';
import AdminManagementScreen from '../screens/admin/AdminManagementScreen';
import TableCRUDScreen from '../screens/admin/TableCRUDScreen';
import MenuCRUDScreen from '../screens/admin/MenuCRUDScreen';
import UserManagementScreen from '../screens/admin/UserManagementScreen';
import AdvancedReportsScreen from '../screens/admin/AdvancedReportsScreen';
import SystemSettingsScreen from '../screens/admin/SystemSettingsScreen';

// Customer Navigator & Screens
import CustomerTabNavigator from './tabs/CustomerTabNavigator';
import EditProfileScreen from '../screens/customer/EditProfileScreen';
import PaymentMethodsScreen from '../screens/customer/PaymentMethodsScreen';
import FavoritesScreen from '../screens/customer/FavoritesScreen';
import PromoScreen from '../screens/customer/PromoScreen';
import NotificationScreen from '../screens/customer/NotificationScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const navigationRef = useNavigationContainerRef();
  const { isAuthenticated: isCustomerAuth } = useSelector((state: RootState) => state.auth);
  const { isAuthenticated: isAdminAuth, admin } = useSelector((state: RootState) => state.adminAuth);

  // ✅ Auto-navigate based on auth state
  useEffect(() => {
    if (navigationRef.isReady()) {
      console.log('📍 Auth State:', { isCustomerAuth, isAdminAuth });
      
      if (isCustomerAuth) {
        console.log('✅ Navigating to Main');
        navigationRef.navigate('Main' as never);
      } else if (isAdminAuth) {
        const dashboard = admin?.role === 'super_admin' ? 'SuperAdminDashboard' : 'AdminDashboard';
        console.log(`✅ Navigating to ${dashboard}`);
        navigationRef.navigate(dashboard as never);
      } else {
        console.log('❌ Navigating to Onboarding');
        navigationRef.navigate('Onboarding' as never);
      }
    }
  }, [isCustomerAuth, isAdminAuth, navigationRef, admin]);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator 
        screenOptions={{ headerShown: false }}
        initialRouteName="Onboarding"
      >
        {/* ========== AUTH SCREENS ========== */}
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
        
        {/* ========== ADMIN SCREENS ========== */}
        <Stack.Screen name="FaceVerification" component={FaceVerificationScreen} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
        <Stack.Screen name="SuperAdminDashboard" component={SuperAdminDashboardScreen} />
        <Stack.Screen name="BookingManagement" component={BookingManagementScreen} />
        <Stack.Screen name="TableManagement" component={TableManagementScreen} />
        <Stack.Screen name="MenuManagement" component={MenuManagementScreen} />
        <Stack.Screen name="Reports" component={ReportsScreen} />
        <Stack.Screen name="Attendance" component={AttendanceScreen} />
        <Stack.Screen name="AdminManagement" component={AdminManagementScreen} />
        <Stack.Screen name="TableCRUD" component={TableCRUDScreen} />
        <Stack.Screen name="MenuCRUD" component={MenuCRUDScreen} />
        <Stack.Screen name="UserManagement" component={UserManagementScreen} />
        <Stack.Screen name="AdvancedReports" component={AdvancedReportsScreen} />
        <Stack.Screen name="SystemSettings" component={SystemSettingsScreen} />
        
        {/* ========== CUSTOMER SCREENS ========== */}
        <Stack.Screen name="Main" component={CustomerTabNavigator} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} />
        <Stack.Screen name="Promo" component={PromoScreen} />
        <Stack.Screen name="Notification" component={NotificationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
