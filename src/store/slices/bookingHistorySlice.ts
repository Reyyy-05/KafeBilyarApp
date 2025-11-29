// src/store/slices/bookingHistorySlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Booking {
  id: string;
  table: {
    id: string;
    name: string;
    capacity: number;
    pricePerHour: number;
  };
  date: string;
  time: string;
  duration: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  menuItems?: any[];
  menuTotal?: number;
  grandTotal?: number;
  bookingCode?: string;
  createdAt: string;
}

interface BookingHistoryState {
  bookings: Booking[];
}

const initialState: BookingHistoryState = {
  bookings: [],
};

const bookingHistorySlice = createSlice({
  name: 'bookingHistory',
  initialState,
  reducers: {
    addBooking: (state, action: PayloadAction<Booking>) => {
      state.bookings.unshift(action.payload); // Add to beginning
    },
    
    updateBookingStatus: (state, action: PayloadAction<{ id: string; status: Booking['status'] }>) => {
      const booking = state.bookings.find(b => b.id === action.payload.id);
      if (booking) {
        booking.status = action.payload.status;
      }
    },
    
    removeBooking: (state, action: PayloadAction<string>) => {
      state.bookings = state.bookings.filter(b => b.id !== action.payload);
    },
    
    clearHistory: (state) => {
      state.bookings = [];
    },
  },
});

export const {
  addBooking,
  updateBookingStatus,
  removeBooking,
  clearHistory,
} = bookingHistorySlice.actions;

export default bookingHistorySlice.reducer;
