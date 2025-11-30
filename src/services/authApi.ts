// src/services/authApi.ts
import api from './api';

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AdminLoginData {
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    email?: string;
    username?: string;
    name: string;
    phone?: string;
    role?: string;
  };
}

// Customer Auth
export const registerUser = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

// Admin Auth
export const loginAdmin = async (data: AdminLoginData): Promise<AuthResponse> => {
  const response = await api.post('/auth/admin/login', data);
  return response.data;
};
