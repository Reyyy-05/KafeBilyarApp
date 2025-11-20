// src/navigation/tabs/CustomerTabNavigator.tsx - DENGAN FIX TYPES
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../../screens/customer/HomeScreen';
import BookingScreen from '../../screens/customer/BookingScreen';
import MenuScreen from '../../screens/customer/MenuScreen';
import BookingHistoryScreen from '../../screens/customer/BookingHistoryScreen';
import ProfileScreen from '../../screens/customer/ProfileScreen';

const Tab = createBottomTabNavigator();

type IoniconsName = 
  | 'home' | 'home-outline' 
  | 'calendar' | 'calendar-outline'
  | 'restaurant' | 'restaurant-outline'
  | 'time' | 'time-outline'
  | 'person' | 'person-outline';

const CustomerTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: IoniconsName = 'home-outline';

          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Booking') iconName = focused ? 'calendar' : 'calendar-outline';
          else if (route.name === 'Menu') iconName = focused ? 'restaurant' : 'restaurant-outline';
          else if (route.name === 'History') iconName = focused ? 'time' : 'time-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF6B35',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Booking" component={BookingScreen} />
      <Tab.Screen name="Menu" component={MenuScreen} />
      <Tab.Screen name="History" component={BookingHistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default CustomerTabNavigator;