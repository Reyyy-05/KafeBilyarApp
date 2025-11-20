export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin' | 'super-admin';
}

export interface Table {
  id: string;
  name: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved';
  image: string;
  description: string;
}

export interface Booking {
  id: string;
  tableId: string;
  userId: string;
  date: string;
  timeSlot: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  guests: number;
}

// Navigation Types
export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Main: undefined;
  Admin: undefined;
};

export type CustomerTabParamList = {
  Home: undefined;
  Booking: undefined;
  Profile: undefined;
};