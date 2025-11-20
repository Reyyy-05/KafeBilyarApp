// src/store/slices/adminAuthSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AdminUser {
  id: string;
  username: string;
  role: 'super_admin' | 'admin' | 'kasir';
  name: string;
  faceData?: string;
}

interface AdminAuthState {
  isAuthenticated: boolean;
  admin: AdminUser | null;
  token: string | null;
  pendingVerification: boolean; // True setelah login, waiting for face verification
  loginAttempt: {
    username: string;
    tempToken: string;
  } | null;
}

const initialState: AdminAuthState = {
  isAuthenticated: false,
  admin: null,
  token: null,
  pendingVerification: false,
  loginAttempt: null,
};

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState,
  reducers: {
    // Step 1: Username + Password validated
    adminLoginPending: (state, action: PayloadAction<{ username: string; tempToken: string }>) => {
      state.pendingVerification = true;
      state.loginAttempt = action.payload;
    },
    
    // Step 2: Face verification success
    adminLoginSuccess: (state, action: PayloadAction<{ admin: AdminUser; token: string }>) => {
      state.isAuthenticated = true;
      state.admin = action.payload.admin;
      state.token = action.payload.token;
      state.pendingVerification = false;
      state.loginAttempt = null;
    },
    
    // Face verification failed
    adminLoginFailed: (state) => {
      state.pendingVerification = false;
      state.loginAttempt = null;
    },
    
    // Logout
    adminLogout: (state) => {
      state.isAuthenticated = false;
      state.admin = null;
      state.token = null;
      state.pendingVerification = false;
      state.loginAttempt = null;
    },
  },
});

export const { 
  adminLoginPending, 
  adminLoginSuccess, 
  adminLoginFailed, 
  adminLogout 
} = adminAuthSlice.actions;

export default adminAuthSlice.reducer;
