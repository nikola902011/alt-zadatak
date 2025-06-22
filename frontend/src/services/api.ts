const API_BASE_URL = 'http://localhost:5189'; // Osnovni URL bez /api
const API_URL = `${API_BASE_URL}/api`; // URL za API pozive

export { API_BASE_URL }; // Exportujemo osnovni URL

export interface User {
  id: number;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  profileImagePath?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  email: string;
}

export interface ApiError {
  message: string;
  status?: number;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
  note: string;
}

async function login(email: string, password: string) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

async function getCurrentUser() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }

    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      return null;
    }

    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

async function forgotPassword(email: string) {
  try {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    if (!response.ok) {
      throw new Error('Failed to send reset email');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Forgot password error:', error);
    throw error;
  }
}

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  imagePath: string;
}

async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Get products error:', error);
    throw error;
  }
}

export { login, getCurrentUser, logout, forgotPassword, getProducts }; 