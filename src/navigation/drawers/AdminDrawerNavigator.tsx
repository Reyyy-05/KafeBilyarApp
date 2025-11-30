// src/navigation/drawers/AdminDrawerNavigator.tsx - FIXED
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

// Import ALL 13 Admin Screens
import AdminDashboardScreen from '../../screens/admin/AdminDashboardScreen';
import BookingManagementScreen from '../../screens/admin/BookingManagementScreen';
import TableManagementScreen from '../../screens/admin/TableManagementScreen';
import MenuManagementScreen from '../../screens/admin/MenuManagementScreen';
import ReportsScreen from '../../screens/admin/ReportsScreen';
import AttendanceScreen from '../../screens/admin/AttendanceScreen';
import SuperAdminDashboardScreen from '../../screens/admin/SuperAdminDashboardScreen';
import AdminManagementScreen from '../../screens/admin/AdminManagementScreen';
import TableCRUDScreen from '../../screens/admin/TableCRUDScreen';
import MenuCRUDScreen from '../../screens/admin/MenuCRUDScreen';
import UserManagementScreen from '../../screens/admin/UserManagementScreen';
import AdvancedReportsScreen from '../../screens/admin/AdvancedReportsScreen';
import SystemSettingsScreen from '../../screens/admin/SystemSettingsScreen';

const Stack = createStackNavigator();

const AdminDrawerNavigator = () => {
  const admin = useSelector((state: RootState) => state.adminAuth.admin);
  const isSuperAdmin = admin?.role === 'super_admin';

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* DASHBOARD - Show based on role */}
      {isSuperAdmin ? (
        <Stack.Screen name="SuperAdminDashboard" component={SuperAdminDashboardScreen} />
      ) : (
        <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      )}

      {/* GROUP 1 & 2: AVAILABLE FOR ALL ADMINS */}
      <Stack.Screen name="BookingManagement" component={BookingManagementScreen} />
      <Stack.Screen name="TableManagement" component={TableManagementScreen} />
      <Stack.Screen name="MenuManagement" component={MenuManagementScreen} />
      <Stack.Screen name="Reports" component={ReportsScreen} />
      <Stack.Screen name="Attendance" component={AttendanceScreen} />

      {/* GROUP 3 & 4: SUPER ADMIN SCREENS - Always registered, guard inside screen */}
      <Stack.Screen name="AdminManagement" component={AdminManagementScreen} />
      <Stack.Screen name="TableCRUD" component={TableCRUDScreen} />
      <Stack.Screen name="MenuCRUD" component={MenuCRUDScreen} />
      <Stack.Screen name="UserManagement" component={UserManagementScreen} />
      <Stack.Screen name="AdvancedReports" component={AdvancedReportsScreen} />
      <Stack.Screen name="SystemSettings" component={SystemSettingsScreen} />
    </Stack.Navigator>
  );
};

export default AdminDrawerNavigator;
