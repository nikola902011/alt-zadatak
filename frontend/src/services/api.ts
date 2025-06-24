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
  role: string;
  profileImagePath?: string;
}

export interface DashboardStats {
  totalProducts: number;
  activeUsers: number;
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

export interface UserDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  profileImagePath?: string;
}

async function login(email: string, password: string): Promise<LoginResponse> {
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

async function getCurrentUser(): Promise<User | null> {
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
  localStorage.removeItem('role');
  localStorage.removeItem('profileImagePath');
  localStorage.removeItem('user');
}

async function forgotPassword(email: string): Promise<ForgotPasswordResponse> {
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

interface Product {
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

async function getDashboardStats(): Promise<DashboardStats> {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  const response = await fetch(`${API_URL}/dashboard/stats`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to fetch dashboard stats' }));
    throw new Error(errorData.message || 'Failed to fetch dashboard stats');
  }

  return response.json();
}

// Dodavanje novog proizvoda
async function addProduct(product: { name: string; price: number; category: string; imagePath?: string }): Promise<Product> {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    body: JSON.stringify(product)
  });
  if (!response.ok) {
    throw new Error('Failed to add product');
  }
  return response.json();
}

// Izmena postojećeg proizvoda
async function updateProduct(id: number, product: { id: number; name: string; price: number; category: string; imagePath?: string }): Promise<Product | void> {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    body: JSON.stringify(product)
  });
  if (!response.ok) {
    throw new Error('Failed to update product');
  }
  if (response.status === 204) {
    return;
  }
  return response.json();
}

// Brisanje proizvoda
async function deleteProduct(id: number): Promise<void> {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
    headers: {
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
  });
  if (!response.ok) {
    throw new Error('Failed to delete product');
  }
}

async function uploadImage(file: File): Promise<string> {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    headers: {
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    body: formData
  });
  if (!response.ok) {
    throw new Error('Failed to upload image');
  }
  const data = await response.json();
  return data.imagePath;
}

async function getCustomerUsers(): Promise<UserDto[]> {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  const response = await fetch(`${API_URL}/users/customers`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to fetch users' }));
    throw new Error(errorData.message || 'Failed to fetch users');
  }

  return response.json();
}

async function deleteUsers(userIds: number[]): Promise<void> {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  const response = await fetch(`${API_URL}/users/delete-users`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ userIds })
  });

  if (!response.ok) {
    throw new Error('Failed to delete users');
  }
}

export type { Product };
export { login, getCurrentUser, logout, forgotPassword, getProducts, getDashboardStats, addProduct, updateProduct, deleteProduct, uploadImage, getCustomerUsers, deleteUsers };

