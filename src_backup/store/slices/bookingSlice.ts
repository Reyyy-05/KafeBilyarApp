import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BookingState {
  selectedTable: string | null;
  bookingDate: string | null;
  bookingTime: string | null;
  duration: number;
  totalPrice: number;
}

const initialState: BookingState = {
  selectedTable: null,
  bookingDate: null,
  bookingTime: null,
  duration: 2,
  totalPrice: 0,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setSelectedTable: (state, action: PayloadAction<string>) => {
      state.selectedTable = action.payload;
    },
    setBookingDate: (state, action: PayloadAction<string>) => {
      state.bookingDate = action.payload;
    },
    setBookingTime: (state, action: PayloadAction<string>) => {
      state.bookingTime = action.payload;
    },
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
    setTotalPrice: (state, action: PayloadAction<number>) => {
      state.totalPrice = action.payload;
    },
    clearBooking: (state) => {
      state.selectedTable = null;
      state.bookingDate = null;
      state.bookingTime = null;
      state.duration = 2;
      state.totalPrice = 0;
    },
  },
});

export const { 
  setSelectedTable, 
  setBookingDate, 
  setBookingTime, 
  setDuration, 
  setTotalPrice,
  clearBooking 
} = bookingSlice.actions;
export default bookingSlice.reducer;