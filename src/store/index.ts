// src/store/index.ts - VERIFY THIS
import { configureStore } from '@reduxjs/toolkit';
import { 
  persistStore, 
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';
import authReducer from './slices/authSlice';
import bookingReducer from './slices/bookingSlice';
import cartReducer from './slices/cartSlice';
import bookingHistoryReducer from './slices/bookingHistorySlice';
import adminAuthReducer from './slices/adminAuthSlice';
import attendanceReducer from './slices/attendanceSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'cart', 'bookingHistory', 'adminAuth', 'attendance'],
};

const rootReducer = combineReducers({
  auth: authReducer,
  booking: bookingReducer,
  cart: cartReducer,
  bookingHistory: bookingHistoryReducer,
  adminAuth: adminAuthReducer,
  attendance: attendanceReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store); // ✅ MAKE SURE THIS EXISTS

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
