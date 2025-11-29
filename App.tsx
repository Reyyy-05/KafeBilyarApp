// App.tsx - WITH ADMIN ROUTES
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ActivityIndicator, View, Text } from 'react-native';
import { store, persistor } from './src/store';
import { useSelector } from 'react-redux';
import type { RootState } from './src/store';

// Customer Auth screens
import OnboardingScreen from './src/screens/auth/OnboardingScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';

// Customer Main app
import CustomerTabNavigator from './src/navigation/tabs/CustomerTabNavigator';

// Customer Additional screens
import EditProfileScreen from './src/screens/customer/EditProfileScreen';
import PaymentMethodsScreen from './src/screens/customer/PaymentMethodsScreen';
import FavoritesScreen from './src/screens/customer/FavoritesScreen';
import PromoScreen from './src/screens/customer/PromoScreen';
import NotificationScreen from './src/screens/customer/NotificationScreen';

// ✅ ADMIN SCREENS
import AdminLoginScreen from './src/screens/admin/AdminLoginScreen';
import FaceVerificationScreen from './src/screens/admin/FaceVerificationScreen';
import AdminDashboardScreen from './src/screens/admin/AdminDashboardScreen';

const Stack = createStackNavigator();

function AppContent() {
  const { isAuthenticated: isCustomerAuth, user } = useSelector((state: RootState) => state.auth);
  const { isAuthenticated: isAdminAuth, admin } = useSelector((state: RootState) => state.adminAuth);

  useEffect(() => {
    console.log('🔐 Auth States:', { 
      customer: isCustomerAuth, 
      admin: isAdminAuth,
      user: user?.name,
      adminUser: admin?.name 
    });
  }, [isCustomerAuth, isAdminAuth, user, admin]);

  // ✅ ADMIN AUTHENTICATED
  if (isAdminAuth && admin) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
        {/* Admin screens akan ditambah di sini nanti */}
      </Stack.Navigator>
    );
  }

  // ✅ CUSTOMER AUTHENTICATED
  if (isCustomerAuth && user) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={CustomerTabNavigator} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} />
        <Stack.Screen name="Promo" component={PromoScreen} />
        <Stack.Screen name="Notification" component={NotificationScreen} />
        {/* ✅ Allow access to Admin Login from customer side */}
        <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
        
        
      </Stack.Navigator>
    );
  }

  // ✅ NOT AUTHENTICATED - SHOW ONBOARDING
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      {/* ✅ Allow admin login from auth flow */}
      <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
      
    </Stack.Navigator>
  );
}

function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <ActivityIndicator size="large" color="#FF6B35" />
      <Text style={{ marginTop: 20, fontSize: 16, color: '#666' }}>
        Memuat aplikasi...
      </Text>
    </View>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <NavigationContainer>
          <AppContent />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}
