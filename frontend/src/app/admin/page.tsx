'use client';

import React, { useEffect, useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  Award, 
  DollarSign, 
  LogOut, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  Upload, 
  Lock, 
  Search, 
  RefreshCw,
  Check,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';

// Sub-components state definitions
interface Category {
  id: number;
  name: string;
  image: string;
  product_count?: number;
}

interface Brand {
  id: number;
  name: string;
  logo: string;
  product_count?: number;
}

interface Variant {
  id?: number;
  size: string;
  unit: string;
  price: number | string;
  status: string;
}

interface Product {
  id: number;
  product_name: string;
  description: string;
  image: string;
  category_id: number;
  category_name?: string;
  brand_id: number | null;
  brand_name?: string | null;
  variants: Variant[];
}

interface PriceItem {
  variant_id: number;
  size: string;
  unit: string;
  price: string | number;
  status: string;
  product_name: string;
  brand_name: string | null;
  category_name: string;
  category_id: number;
  brand_id: number | null;
}

export default function AdminPage() {
  const { admin, login, logout, loading: authLoading, error: authError } = useAuth();
  
  // Login Form States
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginSubmitting, setLoginSubmitting] = useState(false);

  // Admin Navigation state
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'categories' | 'brands' | 'prices'>('dashboard');

  // Master Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [priceItems, setPriceItems] = useState<PriceItem[]>([]);
  const [stats, setStats] = useState({ products: 0, categories: 0, brands: 0 });
  const [dataLoading, setDataLoading] = useState(false);

  // CRUD Form Modals / States
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    category_id: '',
    brand_id: '',
    product_name: '',
    description: '',
    image: '',
    variants: [] as Variant[]
  });

  const [showCatModal, setShowCatModal] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [catForm, setCatForm] = useState({ name: '', image: '' });

  const [showBrandModal, setShowBrandModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [brandForm, setBrandForm] = useState({ name: '', logo: '' });

  // Uploader status
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Price bulk search
  const [priceSearch, setPriceSearch] = useState('');
  const [priceCatFilter, setPriceCatFilter] = useState('');
  const [inlinePriceEdits, setInlinePriceEdits] = useState<{ [variantId: number]: { price: string; status: string } }>({});
  const [priceSaveStatus, setPriceSaveStatus] = useState<{ [variantId: number]: 'idle' | 'saving' | 'saved' | 'error' }>({});

  // Trigger loads on authentication or tab switch
  useEffect(() => {
    if (admin) {
      loadTabContext();
    }
  }, [admin, activeTab]);

  const loadTabContext = async () => {
    setDataLoading(true);
    try {
      if (activeTab === 'dashboard') {
        const [cats, brs, prods] = await Promise.all([
          api.getCategories(),
          api.getBrands(),
          api.getProducts()
        ]);
        setCategories(cats);
        setBrands(brs);
        setProducts(prods);
        setStats({
          products: prods.length,
          categories: cats.length,
          brands: brs.length
        });
      } else if (activeTab === 'products') {
        const [cats, brs, prods] = await Promise.all([
          api.getCategories(),
          api.getBrands(),
          api.getProducts()
        ]);
        setCategories(cats);
        setBrands(brs);
        setProducts(prods);
      } else if (activeTab === 'categories') {
        const cats = await api.getCategories();
        setCategories(cats);
      } else if (activeTab === 'brands') {
        const brs = await api.getBrands();
        setBrands(brs);
      } else if (activeTab === 'prices') {
        const [cats, brs, flatPrices] = await Promise.all([
          api.getCategories(),
          api.getBrands(),
          api.getPrices()
        ]);
        setCategories(cats);
        setBrands(brs);
        setPriceItems(flatPrices);
        
        // Initialize inline price edit local values
        const edits: typeof inlinePriceEdits = {};
        flatPrices.forEach((p: PriceItem) => {
          edits[p.variant_id] = { price: String(p.price), status: p.status };
        });
        setInlinePriceEdits(edits);
      }
    } catch (error) {
      console.error('Failed to load admin context:', error);
    } finally {
      setDataLoading(false);
    }
  };

  // -------------------- AUTHENTICATION --------------------
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginSubmitting(true);
    try {
      await login(usernameInput, passwordInput);
    } catch (err) {
      // Handled by context
    } finally {
      setLoginSubmitting(false);
    }
  };

  // -------------------- IMAGE UPLOAD --------------------
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: 'product' | 'category' | 'brand') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    try {
      const result = await api.uploadImage(file);
      if (targetField === 'product') {
        setProductForm((prev) => ({ ...prev, image: result.url }));
      } else if (targetField === 'category') {
        setCatForm((prev) => ({ ...prev, image: result.url }));
      } else if (targetField === 'brand') {
        setBrandForm((prev) => ({ ...prev, logo: result.url }));
      }
    } catch (err: any) {
      setUploadError(err.message || 'Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  // -------------------- PRODUCT CRUD ACTIONS --------------------
  const openAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      category_id: categories[0]?.id ? String(categories[0].id) : '',
      brand_id: '',
      product_name: '',
      description: '',
      image: '',
      variants: [{ size: '', unit: 'kg', price: '', status: 'Available' }]
    });
    setShowProductModal(true);
  };

  const openEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({
      category_id: String(prod.category_id),
      brand_id: prod.brand_id ? String(prod.brand_id) : '',
      product_name: prod.product_name,
      description: prod.description || '',
      image: prod.image,
      variants: prod.variants.map(v => ({ ...v, price: String(v.price) }))
    });
    setShowProductModal(true);
  };

  const handleAddVariantRow = () => {
    setProductForm((prev) => ({
      ...prev,
      variants: [...prev.variants, { size: '', unit: 'kg', price: '', status: 'Available' }]
    }));
  };

  const handleRemoveVariantRow = (index: number) => {
    setProductForm((prev) => {
      const newVariants = [...prev.variants];
      newVariants.splice(index, 1);
      return { ...prev, variants: newVariants };
    });
  };

  const handleVariantRowChange = (index: number, field: keyof Variant, value: any) => {
    setProductForm((prev) => {
      const newVariants = [...prev.variants];
      newVariants[index] = { ...newVariants[index], [field]: value };
      return { ...prev, variants: newVariants };
    });
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.product_name || !productForm.image || !productForm.category_id) {
      alert('Please fill out Product Name, Category and Image.');
      return;
    }

    const payload = {
      product_name: productForm.product_name,
      category_id: parseInt(productForm.category_id),
      brand_id: productForm.brand_id ? parseInt(productForm.brand_id) : null,
      description: productForm.description,
      image: productForm.image,
      variants: productForm.variants.map((v) => ({
        ...v,
        price: parseFloat(v.price as string) || 0
      }))
    };

    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, payload);
      } else {
        await api.createProduct(payload);
      }
      setShowProductModal(false);
      loadTabContext();
    } catch (err: any) {
      alert(err.message || 'Error saving product.');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product? All its price variants will be deleted.')) return;
    try {
      await api.deleteProduct(id);
      loadTabContext();
    } catch (err: any) {
      alert(err.message || 'Error deleting product.');
    }
  };

  // -------------------- CATEGORY CRUD ACTIONS --------------------
  const openAddCategory = () => {
    setEditingCat(null);
    setCatForm({ name: '', image: '' });
    setShowCatModal(true);
  };

  const openEditCategory = (cat: Category) => {
    setEditingCat(cat);
    setCatForm({ name: cat.name, image: cat.image });
    setShowCatModal(true);
  };

  const handleCatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catForm.name || !catForm.image) return;

    try {
      if (editingCat) {
        await api.updateCategory(editingCat.id, catForm);
      } else {
        await api.createCategory(catForm);
      }
      setShowCatModal(false);
      loadTabContext();
    } catch (err: any) {
      alert(err.message || 'Error saving category.');
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Deleting this category will delete all products in it. Proceed?')) return;
    try {
      await api.deleteCategory(id);
      loadTabContext();
    } catch (err: any) {
      alert(err.message || 'Error deleting category.');
    }
  };

  // -------------------- BRAND CRUD ACTIONS --------------------
  const openAddBrand = () => {
    setEditingBrand(null);
    setBrandForm({ name: '', logo: '' });
    setShowBrandModal(true);
  };

  const openEditBrand = (brand: Brand) => {
    setEditingBrand(brand);
    setBrandForm({ name: brand.name, logo: brand.logo });
    setShowBrandModal(true);
  };

  const handleBrandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandForm.name) return;

    try {
      if (editingBrand) {
        await api.updateBrand(editingBrand.id, brandForm);
      } else {
        await api.createBrand(brandForm);
      }
      setShowBrandModal(false);
      loadTabContext();
    } catch (err: any) {
      alert(err.message || 'Error saving brand.');
    }
  };

  const handleDeleteBrand = async (id: number) => {
    if (!confirm('Are you sure you want to delete this brand? Products linked to it will set brand to Generic.')) return;
    try {
      await api.deleteBrand(id);
      loadTabContext();
    } catch (err: any) {
      alert(err.message || 'Error deleting brand.');
    }
  };

  // -------------------- INLINE PRICE BATCH EDITS --------------------
  const handleInlinePriceChange = (variantId: number, field: 'price' | 'status', value: string) => {
    setInlinePriceEdits((prev) => ({
      ...prev,
      [variantId]: {
        ...prev[variantId],
        [field]: value
      }
    }));
    // Reset save status back to idle
    setPriceSaveStatus((prev) => ({ ...prev, [variantId]: 'idle' }));
  };

  const saveSingleInlinePrice = async (variantId: number) => {
    const edit = inlinePriceEdits[variantId];
    if (!edit) return;

    setPriceSaveStatus((prev) => ({ ...prev, [variantId]: 'saving' }));
    try {
      await api.updateVariantPrice(variantId, {
        price: parseFloat(edit.price) || 0,
        status: edit.status
      });
      setPriceSaveStatus((prev) => ({ ...prev, [variantId]: 'saved' }));
      setTimeout(() => {
        setPriceSaveStatus((prev) => ({ ...prev, [variantId]: 'idle' }));
      }, 1500);
    } catch (error) {
      console.error('Failed to update inline price:', error);
      setPriceSaveStatus((prev) => ({ ...prev, [variantId]: 'error' }));
    }
  };

  // Filters for price listing
  const filteredPrices = priceItems.filter((p) => {
    const matchesSearch = p.product_name.toLowerCase().includes(priceSearch.toLowerCase()) || 
                          (p.brand_name && p.brand_name.toLowerCase().includes(priceSearch.toLowerCase()));
    const matchesCat = priceCatFilter ? String(p.category_id) === priceCatFilter : true;
    return matchesSearch && matchesCat;
  });

  // -------------------- RENDER TEMPLATES --------------------
  
  // 1. Auth Loading Page
  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm text-muted-text">Validating administration session...</p>
      </div>
    );
  }

  // 2. Login Screen
  if (!admin) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 sm:px-6">
        <div className="max-w-md w-full bg-card-bg border border-card-border rounded-3xl p-8 shadow-xl transition-theme">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-foreground">Admin Portal Login</h1>
            <p className="text-xs text-muted-text mt-1">Authorized access only for Lakshmi Agency admins</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-text mb-1">Username</label>
              <input
                type="text"
                required
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Enter username"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-text mb-1">Password</label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Enter password"
              />
            </div>

            {authError && (
              <div className="text-xs text-red-500 font-bold bg-red-50 dark:bg-red-950/20 p-3 rounded-xl border border-red-200 dark:border-red-900/40">
                ⚠️ {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={loginSubmitting}
              className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover transition-colors shadow-lg shadow-blue-500/10 text-sm disabled:opacity-50 mt-2"
            >
              {loginSubmitting ? 'Logging in...' : 'Login to Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 3. Admin Hub
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/30 flex flex-col md:flex-row transition-theme">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-card-bg border-r border-card-border p-6 flex flex-col justify-between transition-theme">
        <div className="space-y-8">
          <div>
            <span className="text-sm font-black text-foreground block">Admin Center</span>
            <span className="text-[10px] text-muted-text font-bold uppercase tracking-wider">Lakshmi Agency</span>
          </div>

          <nav className="space-y-1.5">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
              { id: 'products', name: 'Manage Products', icon: Package },
              { id: 'categories', name: 'Categories', icon: Tags },
              { id: 'brands', name: 'Brands', icon: Award },
              { id: 'prices', name: 'Price Update', icon: DollarSign }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-bold transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary text-white shadow-md shadow-blue-500/10'
                      : 'text-muted-text hover:bg-slate-100 dark:hover:bg-slate-800/40 hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User profile / Logout */}
        <div className="pt-6 border-t border-card-border mt-8 flex items-center justify-between">
          <div>
            <span className="block text-xs font-bold text-foreground">Logged in as</span>
            <span className="text-[10px] text-muted-text font-semibold">{admin.username}</span>
          </div>
          <button
            onClick={logout}
            className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
            title="Log out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="flex-grow p-6 sm:p-10">
        
        {/* Loading Indicator */}
        {dataLoading && (
          <div className="flex items-center gap-2 text-xs font-bold text-primary dark:text-blue-400 bg-primary/10 dark:bg-blue-400/10 px-4 py-2 rounded-xl mb-6 max-w-max border border-primary/10">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            Synchronizing database...
          </div>
        )}

        {/* ==================== DASHBOARD TAB ==================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl sm:text-3xl font-black text-foreground">Hub Overview</h1>
            </div>

            {/* Quick Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { name: 'Products Catalogued', count: stats.products, icon: Package, color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/20' },
                { name: 'Total Categories', count: stats.categories, icon: Tags, color: 'text-emerald-500 bg-emerald-100 dark:bg-emerald-900/20' },
                { name: 'Brands Supplied', count: stats.brands, icon: Award, color: 'text-amber-500 bg-amber-100 dark:bg-amber-900/20' }
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="bg-card-bg border border-card-border p-6 rounded-2xl shadow-sm flex items-center justify-between transition-theme">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-text">{stat.name}</span>
                      <span className="block text-3xl font-black text-foreground mt-2">{stat.count}</span>
                    </div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-card-bg border border-card-border rounded-2xl p-6 shadow-sm transition-theme">
              <h3 className="font-bold text-foreground mb-4">Quick Operations</h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <button
                  onClick={() => { setActiveTab('products'); openAddProduct(); }}
                  className="p-4 rounded-xl border border-card-border hover:border-primary/50 text-center font-bold text-sm text-foreground hover:bg-slate-50 dark:hover:bg-slate-900 flex flex-col items-center gap-2 group transition-colors"
                >
                  <Plus className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                  Add New Product
                </button>
                <button
                  onClick={() => { setActiveTab('categories'); openAddCategory(); }}
                  className="p-4 rounded-xl border border-card-border hover:border-primary/50 text-center font-bold text-sm text-foreground hover:bg-slate-50 dark:hover:bg-slate-900 flex flex-col items-center gap-2 group transition-colors"
                >
                  <Plus className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                  Add Category
                </button>
                <button
                  onClick={() => { setActiveTab('brands'); openAddBrand(); }}
                  className="p-4 rounded-xl border border-card-border hover:border-primary/50 text-center font-bold text-sm text-foreground hover:bg-slate-50 dark:hover:bg-slate-900 flex flex-col items-center gap-2 group transition-colors"
                >
                  <Plus className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                  Add Brand Partner
                </button>
                <button
                  onClick={() => setActiveTab('prices')}
                  className="p-4 rounded-xl border border-card-border hover:border-primary/50 text-center font-bold text-sm text-foreground hover:bg-slate-50 dark:hover:bg-slate-900 flex flex-col items-center gap-2 group transition-colors"
                >
                  <DollarSign className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
                  Update Prices Inline
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== PRODUCTS TAB ==================== */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-black text-foreground">Manage Products</h1>
                <p className="text-xs text-muted-text">Add, modify, and delete materials catalogued on the site.</p>
              </div>
              <button
                onClick={openAddProduct}
                className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-hover shadow-md transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </button>
            </div>

            {/* List products table */}
            <div className="border border-card-border bg-card-bg rounded-2xl overflow-hidden shadow-sm transition-theme">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950/20 text-xs font-bold text-muted-text border-b border-card-border uppercase">
                    <th className="p-4 pl-6">Product</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Brand</th>
                    <th className="p-4">Variants</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-card-border text-sm">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/20 dark:hover:bg-slate-900/10">
                      <td className="p-4 pl-6 font-bold text-foreground">{p.product_name}</td>
                      <td className="p-4">{p.category_name}</td>
                      <td className="p-4">{p.brand_name || <span className="text-xs text-slate-400">Generic</span>}</td>
                      <td className="p-4 text-xs font-medium text-slate-500">
                        {p.variants.map(v => `${v.size}${v.unit} (₹${parseFloat(v.price as string)})`).join(', ')}
                      </td>
                      <td className="p-4 pr-6 text-right space-x-1.5">
                        <button
                          onClick={() => openEditProduct(p)}
                          className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 hover:text-primary dark:hover:text-white hover:bg-slate-50 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-2 rounded-lg border border-red-200 dark:border-red-950/20 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== CATEGORIES TAB ==================== */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-black text-foreground">Categories CRUD</h1>
                <p className="text-xs text-muted-text">Control hardware segments.</p>
              </div>
              <button
                onClick={openAddCategory}
                className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-hover shadow-md transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Category
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {categories.map((c) => (
                <div key={c.id} className="bg-card-bg border border-card-border rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between transition-theme">
                  <div className="aspect-video relative bg-slate-100">
                    <img src={c.image} alt={c.name} className="object-cover w-full h-full" />
                  </div>
                  <div className="p-4 flex items-center justify-between border-t border-card-border">
                    <div>
                      <span className="font-extrabold text-foreground">{c.name}</span>
                      <span className="block text-[10px] text-muted-text uppercase font-bold tracking-wider">{c.product_count || 0} Products linked</span>
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => openEditCategory(c)}
                        className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 hover:text-primary dark:hover:text-white"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(c.id)}
                        className="p-2 rounded-lg border border-red-200 dark:border-red-950/20 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== BRANDS TAB ==================== */}
        {activeTab === 'brands' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-black text-foreground">Brand Suppliers</h1>
                <p className="text-xs text-muted-text">Manage corporate brands.</p>
              </div>
              <button
                onClick={openAddBrand}
                className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-hover shadow-md transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Brand
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {brands.map((b) => (
                <div key={b.id} className="bg-card-bg border border-card-border rounded-2xl p-5 shadow-sm flex flex-col justify-between items-center transition-theme">
                  <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-900 border border-card-border flex items-center justify-center text-sm font-black text-slate-500 uppercase tracking-widest">
                    {b.logo ? <img src={b.logo} alt={b.name} className="object-contain" /> : b.name.slice(0, 2)}
                  </div>
                  <div className="mt-4 text-center">
                    <span className="font-extrabold text-foreground block">{b.name}</span>
                    <span className="text-[10px] text-muted-text font-bold uppercase tracking-wider">{b.product_count || 0} items</span>
                  </div>
                  <div className="flex gap-1.5 mt-4 pt-4 border-t border-card-border w-full justify-center">
                    <button
                      onClick={() => openEditBrand(b)}
                      className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 hover:text-primary dark:hover:text-white"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteBrand(b.id)}
                      className="p-2 rounded-lg border border-red-200 dark:border-red-950/20 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== PRICE UPDATE TAB ==================== */}
        {activeTab === 'prices' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-foreground">Inline Price Updates</h1>
              <p className="text-xs text-muted-text">Change pricing cards instantly without loading forms.</p>
            </div>

            {/* Filter controls */}
            <div className="bg-card-bg border border-card-border p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between transition-theme">
              <div className="relative w-full sm:w-1/3">
                <input
                  type="text"
                  placeholder="Search variant item..."
                  value={priceSearch}
                  onChange={(e) => setPriceSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-xs"
                />
                <Search className="w-4 h-4 text-muted-text absolute left-3 top-2.5" />
              </div>

              <select
                value={priceCatFilter}
                onChange={(e) => setPriceCatFilter(e.target.value)}
                className="py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-card-bg text-xs text-foreground focus:outline-none"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Table */}
            <div className="border border-card-border bg-card-bg rounded-2xl overflow-hidden shadow-sm transition-theme">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950/20 text-xs font-bold text-muted-text border-b border-card-border uppercase">
                    <th className="p-4 pl-6">Product</th>
                    <th className="p-4">Brand</th>
                    <th className="p-4">Option Size</th>
                    <th className="p-4 w-40">Price (₹)</th>
                    <th className="p-4 w-44">Status</th>
                    <th className="p-4 pr-6 text-right w-28">Update</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-card-border text-sm">
                  {filteredPrices.map((item) => {
                    const localEdit = inlinePriceEdits[item.variant_id] || { price: String(item.price), status: item.status };
                    const saveState = priceSaveStatus[item.variant_id] || 'idle';

                    return (
                      <tr key={item.variant_id} className="hover:bg-slate-50/20 dark:hover:bg-slate-900/10">
                        <td className="p-4 pl-6 font-bold text-foreground">{item.product_name}</td>
                        <td className="p-4 text-xs font-semibold">{item.brand_name || 'Generic'}</td>
                        <td className="p-4 font-medium text-xs">{item.size} {item.unit}</td>
                        <td className="p-4">
                          <input
                            type="number"
                            step="any"
                            value={localEdit.price}
                            onChange={(e) => handleInlinePriceChange(item.variant_id, 'price', e.target.value)}
                            className="w-full p-1.5 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg text-sm font-bold text-primary dark:text-white focus:outline-none"
                          />
                        </td>
                        <td className="p-4">
                          <select
                            value={localEdit.status}
                            onChange={(e) => handleInlinePriceChange(item.variant_id, 'status', e.target.value)}
                            className="w-full p-1.5 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg text-xs"
                          >
                            <option value="Available">Available</option>
                            <option value="Out of Stock">Out of Stock</option>
                          </select>
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <button
                            onClick={() => saveSingleInlinePrice(item.variant_id)}
                            disabled={saveState === 'saving'}
                            className={`p-2 rounded-lg flex items-center justify-center font-bold text-white transition-all w-10 h-10 ml-auto shadow-sm ${
                              saveState === 'saved'
                                ? 'bg-emerald-500'
                                : saveState === 'error'
                                ? 'bg-red-500'
                                : 'bg-primary hover:bg-primary-hover disabled:opacity-50'
                            }`}
                          >
                            {saveState === 'saving' && <RefreshCw className="w-4 h-4 animate-spin" />}
                            {saveState === 'saved' && <Check className="w-4 h-4" />}
                            {saveState === 'error' && <AlertTriangle className="w-4 h-4" />}
                            {saveState === 'idle' && <Save className="w-4 h-4" />}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* ==================== ADD / EDIT PRODUCT MODAL ==================== */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-card-bg border border-card-border rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-black text-foreground mb-6">
              {editingProduct ? 'Modify Product Specifications' : 'Catalogue New Product'}
            </h2>

            <form onSubmit={handleProductSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-text mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    value={productForm.product_name}
                    onChange={(e) => setProductForm((p) => ({ ...p, product_name: e.target.value }))}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-text mb-1">Category</label>
                  <select
                    required
                    value={productForm.category_id}
                    onChange={(e) => setProductForm((p) => ({ ...p, category_id: e.target.value }))}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-card-bg text-sm"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-text mb-1">Brand Partner</label>
                  <select
                    value={productForm.brand_id}
                    onChange={(e) => setProductForm((p) => ({ ...p, brand_id: e.target.value }))}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-card-bg text-sm"
                  >
                    <option value="">Generic / No Brand</option>
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
                
                {/* Image Upload Area */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-text mb-1">Product Image Link</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={productForm.image}
                      onChange={(e) => setProductForm((p) => ({ ...p, image: e.target.value }))}
                      className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-xs"
                      placeholder="Or upload file..."
                    />
                    <label className="cursor-pointer bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 p-2.5 rounded-lg flex items-center justify-center border border-slate-200 dark:border-slate-700 flex-shrink-0">
                      <Upload className="w-4 h-4 text-muted-text" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'product')}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {uploading && <span className="text-[10px] text-primary font-bold">Uploading file...</span>}
                  {uploadError && <span className="text-[10px] text-red-500 font-bold">{uploadError}</span>}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-text mb-1">Description (Markdown Supported)</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm((p) => ({ ...p, description: e.target.value }))}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-xs resize-none"
                />
              </div>

              {/* Specification Variants Generator */}
              <div className="border-t border-card-border pt-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-foreground">Packaging Sizing & Base Prices</span>
                  <button
                    type="button"
                    onClick={handleAddVariantRow}
                    className="flex items-center gap-1 py-1 px-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg text-[10px] font-bold text-slate-700 dark:text-slate-300"
                  >
                    <Plus className="w-3 h-3" /> Add Size
                  </button>
                </div>

                <div className="space-y-2">
                  {productForm.variants.map((v, index) => (
                    <div key={index} className="flex flex-wrap sm:flex-nowrap gap-2 items-center">
                      <input
                        type="text"
                        required
                        placeholder="Size (e.g. 40, 110mm)"
                        value={v.size}
                        onChange={(e) => handleVariantRowChange(index, 'size', e.target.value)}
                        className="p-2 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg text-xs w-full sm:w-auto flex-grow"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Unit (e.g. kg, length, L)"
                        value={v.unit}
                        onChange={(e) => handleVariantRowChange(index, 'unit', e.target.value)}
                        className="p-2 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg text-xs w-24"
                      />
                      <input
                        type="number"
                        step="any"
                        required
                        placeholder="Price (₹)"
                        value={v.price}
                        onChange={(e) => handleVariantRowChange(index, 'price', e.target.value)}
                        className="p-2 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg text-xs w-28 font-bold"
                      />
                      <select
                        value={v.status}
                        onChange={(e) => handleVariantRowChange(index, 'status', e.target.value)}
                        className="p-2 border border-slate-200 dark:border-slate-800 bg-card-bg rounded-lg text-xs w-32"
                      >
                        <option value="Available">Available</option>
                        <option value="Out of Stock">Out of Stock</option>
                      </select>

                      {productForm.variants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveVariantRow(index)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit / Cancel buttons */}
              <div className="flex justify-end gap-3 border-t border-card-border pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover"
                >
                  Save Product specifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== ADD / EDIT CATEGORY MODAL ==================== */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-card-bg border border-card-border rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <h2 className="text-lg font-black text-foreground mb-4">
              {editingCat ? 'Modify Category' : 'Create Category'}
            </h2>

            <form onSubmit={handleCatSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-text mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={catForm.name}
                  onChange={(e) => setCatForm((c) => ({ ...c, name: e.target.value }))}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-text mb-1">Category Image Link</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={catForm.image}
                    onChange={(e) => setCatForm((c) => ({ ...c, image: e.target.value }))}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-xs"
                    placeholder="Or upload file..."
                  />
                  <label className="cursor-pointer bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 p-2.5 rounded-lg flex items-center justify-center border border-slate-200 dark:border-slate-700 flex-shrink-0">
                    <Upload className="w-4 h-4 text-muted-text" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'category')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-card-border">
                <button
                  type="button"
                  onClick={() => setShowCatModal(false)}
                  className="py-2 px-4 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-lg bg-primary text-white text-xs font-bold"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== ADD / EDIT BRAND MODAL ==================== */}
      {showBrandModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-card-bg border border-card-border rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <h2 className="text-lg font-black text-foreground mb-4">
              {editingBrand ? 'Modify Brand Partner' : 'Register Brand Partner'}
            </h2>

            <form onSubmit={handleBrandSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-text mb-1">Brand Name</label>
                <input
                  type="text"
                  required
                  value={brandForm.name}
                  onChange={(e) => setBrandForm((b) => ({ ...b, name: e.target.value }))}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-text mb-1">Logo URL (Optional)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={brandForm.logo}
                    onChange={(e) => setBrandForm((b) => ({ ...b, logo: e.target.value }))}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-xs"
                    placeholder="Or upload file..."
                  />
                  <label className="cursor-pointer bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 p-2.5 rounded-lg flex items-center justify-center border border-slate-200 dark:border-slate-700 flex-shrink-0">
                    <Upload className="w-4 h-4 text-muted-text" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'brand')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-card-border">
                <button
                  type="button"
                  onClick={() => setShowBrandModal(false)}
                  className="py-2 px-4 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-lg bg-primary text-white text-xs font-bold"
                >
                  Save Brand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
