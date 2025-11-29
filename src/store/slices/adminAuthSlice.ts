// src/store/slices/adminAuthSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Admin {
  id: string;
  name: string;
  username: string;
  role: 'admin' | 'super_admin';
}

interface AdminAuthState {
  isAuthenticated: boolean;
  admin: Admin | null;
  token: string | null;
  needsFaceVerification: boolean;
  faceVerified: boolean;
}

const initialState: AdminAuthState = {
  isAuthenticated: false,
  admin: null,
  token: null,
  needsFaceVerification: false,
  faceVerified: false,
};

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState,
  reducers: {
    adminLogin: (state, action: PayloadAction<{ 
      admin: Admin; 
      token: string; 
      needsFaceVerification?: boolean;
    }>) => {
      state.isAuthenticated = true;
      state.admin = action.payload.admin;
      state.token = action.payload.token;
      state.needsFaceVerification = action.payload.needsFaceVerification || false;
      state.faceVerified = false;
    },
    
    setFaceVerified: (state, action: PayloadAction<boolean>) => {
      state.faceVerified = action.payload;
      if (action.payload) {
        state.needsFaceVerification = false;
      }
    },
    
    adminLogout: (state) => {
      state.isAuthenticated = false;
      state.admin = null;
      state.token = null;
      state.needsFaceVerification = false;
      state.faceVerified = false;
    },
    
    updateAdminProfile: (state, action: PayloadAction<Partial<Admin>>) => {
      if (state.admin) {
        state.admin = { ...state.admin, ...action.payload };
      }
    },
  },
});

// ✅ EXPORT ACTIONS
export const {
  adminLogin,
  setFaceVerified,
  adminLogout,
  updateAdminProfile,
} = adminAuthSlice.actions;

export default adminAuthSlice.reducer;
