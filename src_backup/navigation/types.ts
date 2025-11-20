// src/navigation/types.ts
export type RootStackParamList = {
  // Auth Stack
  Auth: undefined;
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  
  // Main App
  Main: undefined;
  Home: undefined;
  Booking: { preSelectedTable?: string }; // dari undefined
  Menu: { 
    fromBooking?: boolean;
    tableId?: string;
    tableName?: string;
    duration?: number;
    bookingDate?: string;
    bookingTime?: string;
    tablePrice?: number;
    totalTablePrice?: number;
  };
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
  };
  Profile: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}