// src/navigation/AppNavigator.tsx - WITH ADMIN SUPPORT
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
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
import AdminDrawerNavigator from './drawers/AdminDrawerNavigator';

// Main Navigator
import CustomerTabNavigator from './tabs/CustomerTabNavigator';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const adminAuth = useSelector((state: RootState) => state.adminAuth);
  
  const isAdminAuth = adminAuth?.isAuthenticated || false;
  const needsFaceVerification = adminAuth?.needsFaceVerification || false;
  const faceVerified = adminAuth?.faceVerified || false;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user && !isAdminAuth ? (
          // NOT AUTHENTICATED
          <>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
          </>
        ) : isAdminAuth ? (
          // ADMIN AUTHENTICATED
          <>
            {needsFaceVerification && !faceVerified ? (
              <Stack.Screen name="FaceVerification" component={FaceVerificationScreen} />
            ) : (
              <Stack.Screen name="Admin" component={AdminDrawerNavigator} />
            )}
          </>
        ) : (
          // CUSTOMER AUTHENTICATED
          <Stack.Screen name="Home" component={CustomerTabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
