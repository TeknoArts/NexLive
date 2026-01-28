const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  if (!token && endpoint.includes('/analytics/') || endpoint.includes('/partners/me/')) {
    throw new Error('Authentication required');
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Clear invalid token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      throw new Error('Authentication failed. Please login again.');
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `API error: ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      apiRequest<{ access_token: string; user: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
  },
  channels: {
    getAll: (category?: string) =>
      apiRequest<any[]>('/channels' + (category ? `?category=${category}` : '')),
    getOne: (id: string) => apiRequest<any>(`/channels/${id}`),
    getAllAdmin: () => apiRequest<any[]>('/channels/all'),
    create: (data: any) => apiRequest<any>('/channels', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiRequest<any>(`/channels/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => apiRequest<any>(`/channels/${id}`, { method: 'DELETE' }),
  },
  vod: {
    getAll: (category?: string, search?: string) => {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (search) params.append('search', search);
      return apiRequest<any[]>(`/vod${params.toString() ? '?' + params.toString() : ''}`);
    },
    getOne: (id: string) => apiRequest<any>(`/vod/${id}`),
    getAllAdmin: () => apiRequest<any[]>('/vod/all'),
    create: (data: any) => apiRequest<any>('/vod', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiRequest<any>(`/vod/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => apiRequest<any>(`/vod/${id}`, { method: 'DELETE' }),
  },
  wallet: {
    get: () => apiRequest<any>('/wallet'),
    topUp: (amount: number) =>
      apiRequest<any>('/wallet/topup', {
        method: 'POST',
        body: JSON.stringify({ amount }),
      }),
  },
  vouchers: {
    redeem: (code: string) =>
      apiRequest<any>('/vouchers/redeem', {
        method: 'POST',
        body: JSON.stringify({ code }),
      }),
  },
  analytics: {
    getPartnerDashboard: () => apiRequest<any>('/analytics/partner'),
  },
  partners: {
    getMyPortal: () => apiRequest<any>('/partners/me/portal'),
    getAll: () => apiRequest<any[]>('/partners'),
  },
  users: {
    getMe: () => apiRequest<any>('/users/me').catch(() => null),
  },
  categories: {
    getAll: () => apiRequest<any[]>('/categories/all'),
    getActive: () => apiRequest<any[]>('/categories'),
    getOne: (id: string) => apiRequest<any>(`/categories/${id}`),
    create: (data: any) => apiRequest<any>('/categories', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiRequest<any>(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => apiRequest<any>(`/categories/${id}`, { method: 'DELETE' }),
  },
};
