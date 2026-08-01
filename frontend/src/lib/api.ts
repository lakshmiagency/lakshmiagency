const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function apiFetch(path: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Only set Content-Type to JSON if it's not FormData (which sets its own boundary)
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const data = await response.json();
      errorMessage = data.message || errorMessage;
    } catch (e) {
      // response might not be JSON
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export const api = {
  // Public Data
  async getCategories() {
    return apiFetch('/categories');
  },

  async getBrands() {
    return apiFetch('/brands');
  },

  async getProducts(filters?: { search?: string; category_id?: string; brand_id?: string }) {
    const query = new URLSearchParams();
    if (filters?.search) query.append('search', filters.search);
    if (filters?.category_id) query.append('category_id', filters.category_id);
    if (filters?.brand_id) query.append('brand_id', filters.brand_id);
    
    return apiFetch(`/products?${query.toString()}`);
  },

  async getProductById(id: string | number) {
    return apiFetch(`/products/${id}`);
  },

  async getPrices(filters?: { search?: string; category_id?: string; brand_id?: string }) {
    const query = new URLSearchParams();
    if (filters?.search) query.append('search', filters.search);
    if (filters?.category_id) query.append('category_id', filters.category_id);
    if (filters?.brand_id) query.append('brand_id', filters.brand_id);
    
    return apiFetch(`/prices?${query.toString()}`);
  },

  async getBusinessInfo() {
    return apiFetch('/business-info');
  },

};
export default api;
