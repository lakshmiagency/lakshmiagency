'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, RefreshCw, MessageSquare } from 'lucide-react';
import { api } from '../../lib/api';

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

  // Fetch products whenever search params change
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      try {
        const queryText = searchParams.get('search') || undefined;
        const data = await api.getProducts({ search: queryText });
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [searchParams]);

  // Sync search state with URL
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

  // WhatsApp inquiry URL generator
  const getWhatsAppInquiryUrl = (product: Product, variant?: Variant) => {
    const phoneNumber = '916361033361';
    let text = `Hello Lakshmi Agency, I am interested in inquiring about "${product.product_name}".`;
    if (variant) {
      text += ` Size/Type: ${variant.size} ${variant.unit}, Listed Price: ₹${parseFloat(variant.price as string).toLocaleString('en-IN')}.`;
    }
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
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
            Materials Rate Card & Products List
          </h1>
          <p className="text-sm text-muted-text mt-2">
            Search live wholesale & retail prices for building materials, paints, PVC components, or waterproofing.
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

        {/* Product Rate Card Table */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-slate-100 dark:bg-slate-800/40 h-16 rounded-xl border border-card-border" />
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
          <div className="border border-card-border rounded-2xl overflow-hidden shadow-sm bg-card-bg transition-theme overflow-x-auto">
            <table className="w-full border-collapse text-left min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950/20 text-muted-text font-bold text-xs uppercase tracking-wider border-b border-card-border">
                  <th className="p-4 pl-6 border-r border-card-border">Item Category / Name</th>
                  <th className="p-4 border-r border-card-border">Size / Type / Unit</th>
                  <th className="p-4 border-r border-card-border text-right">Selling Price (Rs)</th>
                  <th className="p-4 border-r border-card-border text-center">Photo</th>
                  <th className="p-4 text-center">Inquire</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border text-sm">
                {products.map((product) => (
                  <React.Fragment key={product.id}>
                    {product.variants.map((variant, index) => (
                      <tr 
                        key={variant.id} 
                        className="hover:bg-slate-50/30 dark:hover:bg-slate-900/5 transition-colors border-b border-card-border last:border-b-0"
                      >
                        {/* Spanned Product Details Column */}
                        {index === 0 && (
                          <td 
                            rowSpan={product.variants.length} 
                            className="p-4 pl-6 border-r border-card-border align-middle font-bold text-foreground w-[28%]"
                          >
                            <div className="flex flex-col gap-1">
                              <span className="text-base font-extrabold uppercase leading-snug">{product.product_name}</span>
                              {product.description && (
                                <span className="text-xs text-muted-text font-normal leading-relaxed">{product.description}</span>
                              )}
                            </div>
                          </td>
                        )}

                        {/* Variant Size Column */}
                        <td className="p-4 border-r border-card-border font-medium text-foreground align-middle w-[25%]">
                          {variant.size} {variant.unit}
                        </td>

                        {/* Variant Price Column */}
                        <td className="p-4 border-r border-card-border font-black text-right text-base text-primary dark:text-white align-middle w-[17%]">
                          ₹{parseFloat(variant.price as string).toLocaleString('en-IN')}
                        </td>

                        {/* Spanned Product Image Column */}
                        {index === 0 && (
                          <td 
                            rowSpan={product.variants.length} 
                            className="p-4 border-r border-card-border text-center align-middle w-[20%]"
                          >
                            <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-xl overflow-hidden border border-card-border bg-slate-50 dark:bg-slate-900 shadow-sm">
                              <Image
                                src={product.image || 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=300&auto=format&fit=crop&q=60'}
                                alt={product.product_name}
                                fill
                                sizes="100px"
                                className="object-cover"
                              />
                            </div>
                          </td>
                        )}

                        {/* Spanned Inquire Button Column */}
                        {index === 0 && (
                          <td 
                            rowSpan={product.variants.length} 
                            className="p-4 text-center align-middle w-[10%]"
                          >
                            <a
                              href={getWhatsAppInquiryUrl(product)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center p-3 bg-accent text-white hover:bg-accent-hover rounded-xl shadow-sm hover:shadow-lg transition-all"
                              title="Send WhatsApp Inquiry"
                            >
                              <MessageSquare className="w-5 h-5 fill-current" />
                            </a>
                          </td>
                        )}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
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
