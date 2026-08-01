'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { api } from '../../lib/api';
import ProductCard from '../../components/ProductCard';
import ProductModal from '../../components/ProductModal';

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
  variants: Variant[];
}

function ProductsCatalogInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filter States initialized to empty for hydration safety
  const [search, setSearch] = useState('');

  // Sync state with URL search params on mount or when searchParams change
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
  }, [searchParams]);

  // Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Fetch products whenever filters in URL search params change
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      try {
        const queryText = searchParams.get('search') || undefined;

        const data = await api.getProducts({
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
  const applyFilters = (newSearch: string) => {
    const params = new URLSearchParams();
    if (newSearch) params.append('search', newSearch);
    
    router.push(`/products?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters(search);
  };

  const resetFilters = () => {
    setSearch('');
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
            Explore prices and sizes. Use the search bar below to find specific cement, paint accessories, PVC pipes, or waterproofing items.
          </p>
        </div>

        {/* Filter Controls Panel */}
        <div className="bg-card-bg border border-card-border rounded-2xl p-5 mb-10 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between transition-theme">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-1/2">
            <input
              type="text"
              placeholder="Search product name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
            <Search className="w-4.5 h-4.5 text-muted-text absolute left-3 top-3" />
          </form>

          <div className="flex gap-3 w-full md:w-auto items-center justify-end">
            {/* Reset Button */}
            {search && (
              <button
                type="button"
                onClick={resetFilters}
                className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl border border-red-200 dark:border-red-950/20 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/10 text-sm font-bold w-full sm:w-auto transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset Search
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
          <div className="text-center py-20 bg-card-bg border border-card-border rounded-3xl transition-theme">
            <p className="text-slate-400 dark:text-slate-500 text-lg mb-4">No products found matching &ldquo;{search}&rdquo;</p>
            <button
              onClick={resetFilters}
              className="px-5 py-2.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary-hover text-sm"
            >
              Clear Search Query
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

        {/* Product Details Modal */}
        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="py-20 text-center text-muted-text">
        Loading Catalogue...
      </div>
    }>
      <ProductsCatalogInner />
    </Suspense>
  );
}
