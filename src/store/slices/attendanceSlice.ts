// src/store/slices/attendanceSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AttendanceRecord {
  id: string;
  adminId: string;
  adminName: string;
  checkInTime: string;
  checkOutTime?: string;
  faceMatchScore: number;
  date: string;
}

interface AttendanceState {
  records: AttendanceRecord[];
  currentSession: {
    adminId: string;
    checkInTime: string;
  } | null;
}

const initialState: AttendanceState = {
  records: [],
  currentSession: null,
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    checkIn: (state, action: PayloadAction<{ adminId: string; adminName: string; faceMatchScore: number }>) => {
      const now = new Date().toISOString();
      const record: AttendanceRecord = {
        id: Date.now().toString(),
        adminId: action.payload.adminId,
        adminName: action.payload.adminName,
        checkInTime: now,
        faceMatchScore: action.payload.faceMatchScore,
        date: new Date().toLocaleDateString('id-ID'),
      };
      
      state.records.unshift(record);
      state.currentSession = {
        adminId: action.payload.adminId,
        checkInTime: now,
      };
    },
    
    checkOut: (state, action: PayloadAction<string>) => {
      const record = state.records.find(r => r.id === action.payload);
      if (record) {
        record.checkOutTime = new Date().toISOString();
      }
      state.currentSession = null;
    },
    
    clearAttendance: (state) => {
      state.records = [];
      state.currentSession = null;
    },
  },
});

export const { checkIn, checkOut, clearAttendance } = attendanceSlice.actions;
export default attendanceSlice.reducer;
