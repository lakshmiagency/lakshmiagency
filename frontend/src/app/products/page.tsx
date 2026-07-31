'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, RefreshCw, XCircle } from 'lucide-react';
import { api } from '../../lib/api';
import ProductCard from '../../components/ProductCard';
import ProductModal from '../../components/ProductModal';

interface Category {
  id: number;
  name: string;
}

interface Brand {
  id: number;
  name: string;
}

interface Variant {
  id: number;
  size: string;
  unit: string;
  price: string | number;
  status: string;
}

interface Product {
  id: number;
  product_name: string;
  description: string;
  image: string;
  category_name: string;
  brand_name: string | null;
  variants: Variant[];
}

function ProductsCatalogInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filter States
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category_id') || '');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand_id') || '');

  // Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Load Categories and Brands for dropdown filters
  useEffect(() => {
    const loadFilterData = async () => {
      try {
        const [cats, brs] = await Promise.all([
          api.getCategories(),
          api.getBrands()
        ]);
        setCategories(cats);
        setBrands(brs);
      } catch (err) {
        console.error('Error loading filter options:', err);
      }
    };
    loadFilterData();
  }, []);

  // Fetch products whenever filters in URL search params change
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      try {
        const catId = searchParams.get('category_id') || undefined;
        const brandId = searchParams.get('brand_id') || undefined;
        const queryText = searchParams.get('search') || undefined;

        const data = await api.getProducts({
          category_id: catId,
          brand_id: brandId,
          search: queryText
        });
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [searchParams]);

  // Sync state with URL
  const applyFilters = (newSearch: string, newCat: string, newBrand: string) => {
    const params = new URLSearchParams();
    if (newSearch) params.append('search', newSearch);
    if (newCat) params.append('category_id', newCat);
    if (newBrand) params.append('brand_id', newBrand);
    
    router.push(`/products?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters(search, selectedCategory, selectedBrand);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedCategory(val);
    applyFilters(search, val, selectedBrand);
  };

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedBrand(val);
    applyFilters(search, selectedCategory, val);
  };

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedBrand('');
    router.push('/products');
  };

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <nav className="text-xs sm:text-sm text-muted-text mb-6">
          <span className="hover:text-foreground"><Link href="/">Home</Link></span>
          <span className="mx-2">/</span>
          <span className="text-foreground font-bold">Products Catalogue</span>
        </nav>

        {/* Title */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Materials & Product Catalogue
          </h1>
          <p className="text-sm text-muted-text mt-2">
            Explore prices and sizes. Use filtering parameters below to find cement, primers, paint mixes, PVC components or waterproofing solutions.
          </p>
        </div>

        {/* Filter Controls Panel */}
        <div className="bg-card-bg border border-card-border rounded-2xl p-5 mb-10 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between transition-theme">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search product name or brand..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
            <Search className="w-4.5 h-4.5 text-muted-text absolute left-3 top-3" />
          </form>

          <div className="flex flex-wrap md:flex-nowrap gap-3 w-full md:w-auto items-center justify-end">
            <div className="flex items-center gap-1 text-xs font-bold text-muted-text uppercase tracking-wider mr-2">
              <SlidersHorizontal className="w-4 h-4 text-primary" />
              Filters
            </div>

            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-card-bg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary w-full sm:w-auto"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            {/* Brand Dropdown */}
            <select
              value={selectedBrand}
              onChange={handleBrandChange}
              className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-card-bg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary w-full sm:w-auto"
            >
              <option value="">All Brands</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>

            {/* Reset Button */}
            {(search || selectedCategory || selectedBrand) && (
              <button
                type="button"
                onClick={resetFilters}
                className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl border border-red-200 dark:border-red-950/20 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/10 text-sm font-bold w-full sm:w-auto transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Product Grid / Listings */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse bg-slate-100 dark:bg-slate-800/50 h-96 rounded-2xl border border-card-border" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-card-bg border border-card-border rounded-2xl">
            <XCircle className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-1">No Products Found</h3>
            <p className="text-sm text-muted-text max-w-sm mx-auto mb-6">
              We couldn&apos;t find any items matching your selected criteria. Try adjusting search queries or filter dropdowns.
            </p>
            <button
              onClick={resetFilters}
              className="py-2 px-4 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-hover transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onViewDetails={setSelectedProduct}
              />
            ))}
          </div>
        )}

      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-muted-text">Loading catalog items...</p>
      </div>
    }>
      <ProductsCatalogInner />
    </Suspense>
  );
}
