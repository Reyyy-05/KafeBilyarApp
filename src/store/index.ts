import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';

// Import slices
import authReducer from './slices/authSlice';
import adminAuthReducer from './slices/adminAuthSlice';
import bookingReducer from './slices/bookingSlice';
import bookingHistoryReducer from './slices/bookingHistorySlice'; // ✅ Pastikan ada
import cartReducer from './slices/cartSlice';
import attendanceReducer from './slices/attendanceSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'adminAuth', 'bookingHistory', 'cart'], // ✅ Pastikan bookingHistory ada
};

const rootReducer = combineReducers({
  auth: authReducer,
  adminAuth: adminAuthReducer,
  booking: bookingReducer,
  bookingHistory: bookingHistoryReducer, // ✅ Pastikan ada
  cart: cartReducer,
  attendance: attendanceReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
