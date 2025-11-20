// src/navigation/types.ts - WITH ADMIN ROUTES
export type RootStackParamList = {
  // Auth Stack
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  
  // Main Stack
  Main: undefined;
  
  // Customer Screens
  Home: undefined;
  Booking: { preSelectedTable?: string } | undefined;
  
  Menu: {
    fromBooking?: boolean;
    tableId?: string;
    tableName?: string;
    duration?: number;
    bookingDate?: string;
    bookingTime?: string;
    tablePrice?: number;
    totalTablePrice?: number;
  } | undefined;
  
  History: {
    isBookingSummary?: boolean;
    tableId?: string;
    tableName?: string;
    duration?: number;
    bookingDate?: string;
    bookingTime?: string;
    tablePrice?: number;
    totalTablePrice?: number;
    cartItems?: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
      image: string;
    }>;
    cartTotal?: number;
    grandTotal?: number;
  } | undefined;
  
  Profile: undefined;
  EditProfile: undefined;
  PaymentMethods: undefined;
  Favorites: undefined;
  Promo: undefined;
  Notification: undefined;
  TableDetail: { tableId: string } | undefined;

  // ✅ ADMIN ROUTES
  AdminLogin: undefined;
  FaceVerification: {
    adminData: {
      id: string;
      username: string;
      role: 'super_admin' | 'admin' | 'kasir';
      name: string;
      faceData: string;
    };
  };
  AdminDashboard: undefined;
  TableManagement: undefined;
  BookingManagement: undefined;
  MenuManagement: undefined;
  SuperAdmin: undefined;
};

// Tab Navigator Types
export type CustomerTabParamList = {
  Home: undefined;
  Booking: undefined;
  Menu: undefined;
  History: undefined;
  Profile: undefined;
};
