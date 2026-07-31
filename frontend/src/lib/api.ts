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

  // Auth
  async login(credentials: { username: string; password?: string }) {
    return apiFetch('/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  async verifyToken() {
    return apiFetch('/admin/verify');
  },

  // Image Upload
  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);
    return apiFetch('/upload', {
      method: 'POST',
      body: formData,
    });
  },

  // Admin Categories CRUD
  async createCategory(category: { name: string; image: string }) {
    return apiFetch('/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    });
  },

  async updateCategory(id: string | number, category: { name: string; image: string }) {
    return apiFetch(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(category),
    });
  },

  async deleteCategory(id: string | number) {
    return apiFetch(`/categories/${id}`, {
      method: 'DELETE',
    });
  },

  // Admin Brands CRUD
  async createBrand(brand: { name: string; logo?: string }) {
    return apiFetch('/brands', {
      method: 'POST',
      body: JSON.stringify(brand),
    });
  },

  async updateBrand(id: string | number, brand: { name: string; logo?: string }) {
    return apiFetch(`/brands/${id}`, {
      method: 'PUT',
      body: JSON.stringify(brand),
    });
  },

  async deleteBrand(id: string | number) {
    return apiFetch(`/brands/${id}`, {
      method: 'DELETE',
    });
  },

  // Admin Products CRUD
  async createProduct(product: {
    category_id: number;
    brand_id?: number | null;
    product_name: string;
    description?: string;
    image: string;
    variants: Array<{ size: string; unit: string; price: number; status?: string }>;
  }) {
    return apiFetch('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  },

  async updateProduct(
    id: string | number,
    product: {
      category_id: number;
      brand_id?: number | null;
      product_name: string;
      description?: string;
      image: string;
      variants: Array<{ size: string; unit: string; price: number; status?: string }>;
    }
  ) {
    return apiFetch(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  },

  async deleteProduct(id: string | number) {
    return apiFetch(`/products/${id}`, {
      method: 'DELETE',
    });
  },

  // Admin Inline Price updates
  async updateVariantPrice(variantId: string | number, data: { price: number; status?: string }) {
    return apiFetch(`/prices/${variantId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};
export default api;
