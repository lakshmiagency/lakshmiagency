const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function apiFetch(path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers || {});
  
  if (!headers.has('Content-Type')) {
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
  async getProducts(filters?: { search?: string }) {
    const query = new URLSearchParams();
    if (filters?.search) query.append('search', filters.search);
    
    return apiFetch(`/products?${query.toString()}`);
  },

  async getProductById(id: string | number) {
    return apiFetch(`/products/${id}`);
  },

  async getBusinessInfo() {
    return apiFetch('/business-info');
  },
};

export default api;
