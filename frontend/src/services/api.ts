const API_BASE_URL = import.meta.env.PROD 
  ? '/api'  // Relativni URL za Docker
  : 'http://localhost:5000';  // Lokalni development
const API_URL = API_BASE_URL; // URL za API pozive

export { API_BASE_URL }; // Exportujemo osnovni URL

export interface User {
  id: number;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  profileImagePath?: string;
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

export interface ForgotPasswordResponse {
  message: string;
  note: string;
}

export interface UserDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username?: string;
  profileImagePath?: string;
  contactNumber?: string;
  password?: string;
}

export interface UserListDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profileImagePath?: string;
  createdAt: string;
}

async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    if (response.status === 400) {
      const errorData = await response.json();
      if (errorData.errors) {
        const validationErrors = Object.values(errorData.errors).flat().join(', ');
        throw new Error(`Validation error: ${validationErrors}`);
      } else if (errorData.title) {
        throw new Error(`Validation error: ${errorData.title}`);
      } else {
        throw new Error('Validation error: Invalid data provided');
      }
    } else if (response.status === 401) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Invalid email or password');
    }
    throw new Error('Login failed');
  }

  return response.json();
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('profileImagePath');
  localStorage.removeItem('user');
  localStorage.removeItem('activeTab');
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
    if (response.status === 400) {
      const errorData = await response.json();
      if (errorData.errors) {
        const validationErrors = Object.values(errorData.errors).flat().join(', ');
        throw new Error(`Validation error: ${validationErrors}`);
      } else if (errorData.title) {
        throw new Error(`Validation error: ${errorData.title}`);
      } else {
        throw new Error('Validation error: Invalid data provided');
      }
    }
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
    if (response.status === 400) {
      const errorData = await response.json();
      if (errorData.errors) {
        const validationErrors = Object.values(errorData.errors).flat().join(', ');
        throw new Error(`Validation error: ${validationErrors}`);
      } else if (errorData.title) {
        throw new Error(`Validation error: ${errorData.title}`);
      } else {
        throw new Error('Validation error: Invalid data provided');
      }
    }
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

async function uploadUserImage(file: File): Promise<string> {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/upload/user`, {
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

async function getCustomerUsers(): Promise<UserListDto[]> {
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

async function fetchCurrentUserProfile(): Promise<UserDto | null> {
  const token = localStorage.getItem('token');
  if (!token) return null;
  const response = await fetch(`${API_URL}/users/me`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) return null;
  return await response.json();
}

async function updateCurrentUserProfile(data: UserDto): Promise<UserDto | null> {
  const token = localStorage.getItem('token');
  if (!token) return null;
  const response = await fetch(`${API_URL}/users/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    if (response.status === 400) {
      const errorData = await response.json();
      // Pokušaj da izvučeš validacione greške iz ModelState
      if (errorData.errors) {
        const validationErrors = Object.values(errorData.errors).flat().join(', ');
        throw new Error(`Validation error: ${validationErrors}`);
      } else if (errorData.title) {
        throw new Error(`Validation error: ${errorData.title}`);
      } else {
        throw new Error('Validation error: Invalid data provided');
      }
    }
    return null;
  }
  return await response.json();
}

export type { Product };
export { login, logout, forgotPassword, getProducts, getDashboardStats, addProduct, updateProduct, deleteProduct, uploadImage, uploadUserImage, getCustomerUsers, deleteUsers, fetchCurrentUserProfile, updateCurrentUserProfile};



