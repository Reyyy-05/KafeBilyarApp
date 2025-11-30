// src/services/api.ts
import axios from 'axios';

// ✅ Ganti dengan IP laptop kamu kalau test di HP
// Cara cek IP: buka CMD → ketik "ipconfig" → cari IPv4 Address
const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    // TODO: Get token from Redux store
    const token = null; // We'll implement this later
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
