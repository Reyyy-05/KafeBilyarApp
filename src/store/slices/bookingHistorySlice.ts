// src/store/slices/bookingHistorySlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface BookingHistoryItem {
  id: string;
  tableId: string;
  tableName: string;
  bookingDate: string;
  bookingTime: string;
  duration: number;
  tablePrice: number;
  totalTablePrice: number;
  menuItems: CartItem[];
  menuTotal: number;
  grandTotal: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  createdAt: string;
}

interface BookingHistoryState {
  bookings: BookingHistoryItem[];
}

const initialState: BookingHistoryState = {
  bookings: [],
};

const bookingHistorySlice = createSlice({
  name: 'bookingHistory',
  initialState,
  reducers: {
    addBooking: (state, action: PayloadAction<Omit<BookingHistoryItem, 'id' | 'createdAt' | 'status'>>) => {
      const newBooking: BookingHistoryItem = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        status: 'upcoming',
      };
      state.bookings.unshift(newBooking); // Add to beginning
    },
    
    updateBookingStatus: (state, action: PayloadAction<{ id: string; status: 'upcoming' | 'completed' | 'cancelled' }>) => {
      const booking = state.bookings.find(b => b.id === action.payload.id);
      if (booking) {
        booking.status = action.payload.status;
      }
    },
    
    cancelBooking: (state, action: PayloadAction<string>) => {
      const booking = state.bookings.find(b => b.id === action.payload);
      if (booking) {
        booking.status = 'cancelled';
      }
    },
    
    clearHistory: (state) => {
      state.bookings = [];
    },
  },
});

export const { 
  addBooking, 
  updateBookingStatus, 
  cancelBooking, 
  clearHistory 
} = bookingHistorySlice.actions;

export default bookingHistorySlice.reducer;
