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
  stdPacking?: number;
  dealerPricePerBag?: string | number;
  status: string;
}

interface Product {
  id: number;
  product_name: string;
  description: string;
  image: string;
  tableType?: 'general' | 'jk_cement';
  variants: Variant[];
}

function ProductsCatalogInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filter States
  const [search, setSearch] = useState('');

  // Sync state with URL search params
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
  }, [searchParams]);

  // Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products
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
      text += ` Size/Type: ${variant.size} ${variant.unit}, Price: ₹${parseFloat(variant.price as string).toLocaleString('en-IN')}.`;
    }
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
  };

  // Split products by table type
  const generalProducts = products.filter(p => p.tableType !== 'jk_cement');
  const jkCementProducts = products.filter(p => p.tableType === 'jk_cement');

  return (
    // Forced Light Theme Wrapper: bg-slate-50 text-slate-900 (dark mode styles overridden)
    <div className="py-12 sm:py-20 bg-slate-50 text-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <nav className="text-xs sm:text-sm text-slate-500 mb-6">
          <span className="hover:text-slate-900"><Link href="/">Home</Link></span>
          <span className="mx-2">/</span>
          <span className="text-slate-900 font-bold">Products Catalogue</span>
        </nav>

        {/* Title */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Materials Rate Card & Products List
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            Search live wholesale & retail prices for building materials, paints, PVC components, or waterproofing.
          </p>
        </div>

        {/* Filter Controls Panel */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-10 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-1/2">
            <input
              type="text"
              placeholder="Search product name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3 top-3" />
          </form>

          <div className="flex gap-3 w-full md:w-auto items-center justify-end">
            {search && (
              <button
                type="button"
                onClick={resetFilters}
                className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-sm font-bold w-full sm:w-auto transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset Search
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white h-16 rounded-xl border border-slate-200 animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl shadow-sm">
            <p className="text-slate-400 text-lg mb-4">No products found matching &ldquo;{search}&rdquo;</p>
            <button
              onClick={resetFilters}
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 text-sm"
            >
              Clear Search Query
            </button>
          </div>
        ) : (
          <div className="space-y-16">
            
            {/* Table 1: General Hardware & Materials */}
            {generalProducts.length > 0 && (
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  Building Materials & Hardware Fittings
                </h2>
                <div className="border-2 border-slate-300 rounded-2xl overflow-hidden shadow-sm bg-white overflow-x-auto">
                  <table className="w-full border-collapse text-left min-w-[700px]">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider border-b-2 border-slate-300">
                        <th className="p-4 pl-6 border-r-2 border-slate-300 w-[28%]">Item Category / Name</th>
                        <th className="p-4 border-r border-slate-200 w-[25%]">Size / Type / Unit</th>
                        <th className="p-4 border-r border-slate-200 text-right w-[17%]">Selling Price (Rs)</th>
                        <th className="p-4 border-r-2 border-slate-300 text-center w-[20%]">Photo</th>
                        <th className="p-4 text-center w-[10%]">Inquire</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-sm">
                      {generalProducts.map((product) => (
                        <React.Fragment key={product.id}>
                          {product.variants.map((variant, index) => {
                            const isLastVariant = index === product.variants.length - 1;
                            return (
                              <tr 
                                key={variant.id} 
                                className={`hover:bg-slate-50/70 transition-colors ${
                                  isLastVariant 
                                    ? 'border-b-4 border-slate-400' 
                                    : 'border-b border-slate-200'
                                }`}
                              >
                                {index === 0 && (
                                  <td 
                                    rowSpan={product.variants.length} 
                                    className="p-4 pl-6 border-r-2 border-slate-300 align-middle font-bold text-slate-950 bg-slate-50/40"
                                  >
                                    <div className="flex flex-col gap-1">
                                      <span className="text-base font-extrabold uppercase leading-snug">{product.product_name}</span>
                                      {product.description && (
                                        <span className="text-xs text-slate-500 font-normal leading-relaxed">{product.description}</span>
                                      )}
                                    </div>
                                  </td>
                                )}
                                <td className="p-4 border-r border-slate-200 font-semibold text-slate-800 align-middle">
                                  {variant.size} {variant.unit}
                                </td>
                                <td className="p-4 border-r border-slate-200 font-black text-right text-base text-blue-600 align-middle bg-slate-50/10">
                                  {(() => {
                                    const val = String(variant.price);
                                    if (isNaN(parseFloat(val))) return val;
                                    if (val.includes('/') || val.toLowerCase().includes('mtr')) {
                                      return val.startsWith('₹') ? val : `₹ ${val}`;
                                    }
                                    return `₹ ${parseFloat(val).toLocaleString('en-IN')}`;
                                  })()}
                                </td>
                                {index === 0 && (
                                  <td 
                                    rowSpan={product.variants.length} 
                                    className="p-4 border-r-2 border-slate-300 text-center align-middle bg-slate-50/20"
                                  >
                                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shadow-inner">
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
                                {index === 0 && (
                                  <td 
                                    rowSpan={product.variants.length} 
                                    className="p-4 text-center align-middle bg-slate-50/10"
                                  >
                                    <a
                                      href={getWhatsAppInquiryUrl(product)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center justify-center p-3 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl shadow-md hover:shadow-lg transition-all"
                                    >
                                      <MessageSquare className="w-5 h-5 fill-current" />
                                    </a>
                                  </td>
                                )}
                              </tr>
                            );
                          })}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Table 2: JK Cement & Putty Products */}
            {jkCementProducts.length > 0 && (
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  JK Cement & Wall Putty Products
                </h2>
                <div className="border-2 border-slate-300 rounded-2xl overflow-hidden shadow-sm bg-white overflow-x-auto">
                  <table className="w-full border-collapse text-left min-w-[850px]">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider border-b-2 border-slate-300">
                        <th className="p-4 pl-6 border-r-2 border-slate-300 w-[22%]">Name</th>
                        <th className="p-4 border-r border-slate-200 text-center w-[10%]">Qty</th>
                        <th className="p-4 border-r border-slate-200 text-center w-[15%]">Std. Packing (Per Bag)</th>
                        <th className="p-4 border-r border-slate-200 text-right w-[15%]">Dealer Price</th>
                        <th className="p-4 border-r-2 border-slate-300 text-right w-[18%]">Dealer Price (Per Bag)</th>
                        <th className="p-4 border-r-2 border-slate-300 text-center w-[12%]">Photo</th>
                        <th className="p-4 text-center w-[8%]">Inquire</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-sm">
                      {jkCementProducts.map((product) => (
                        <React.Fragment key={product.id}>
                          {product.variants.map((variant, index) => {
                            const isLastVariant = index === product.variants.length - 1;
                            return (
                              <tr 
                                key={variant.id} 
                                className={`hover:bg-slate-50/70 transition-colors ${
                                  isLastVariant 
                                    ? 'border-b-4 border-slate-400' 
                                    : 'border-b border-slate-200'
                                }`}
                              >
                                {index === 0 && (
                                  <td 
                                    rowSpan={product.variants.length} 
                                    className="p-4 pl-6 border-r-2 border-slate-300 align-middle font-bold text-slate-950 bg-slate-50/40"
                                  >
                                    <div className="flex flex-col gap-1">
                                      <span className="text-base font-extrabold uppercase leading-snug">{product.product_name}</span>
                                      {product.description && (
                                        <span className="text-xs text-slate-500 font-normal leading-relaxed">{product.description}</span>
                                      )}
                                    </div>
                                  </td>
                                )}
                                <td className="p-4 border-r border-slate-200 text-center font-bold text-slate-800 align-middle">
                                  {variant.size}
                                </td>
                                <td className="p-4 border-r border-slate-200 text-center font-semibold text-slate-700 align-middle">
                                  {variant.stdPacking !== undefined ? String(variant.stdPacking).padStart(2, '0') : '-'}
                                </td>
                                <td className="p-4 border-r border-slate-200 font-bold text-right text-slate-800 align-middle bg-slate-50/10">
                                  {(() => {
                                    const val = String(variant.price);
                                    if (isNaN(parseFloat(val))) return val;
                                    return `₹ ${parseFloat(val).toLocaleString('en-IN')}`;
                                  })()}
                                </td>
                                <td className="p-4 border-r-2 border-slate-300 font-black text-right text-base text-emerald-600 align-middle bg-slate-50/20">
                                  {variant.dealerPricePerBag !== undefined ? (
                                    (() => {
                                      const val = String(variant.dealerPricePerBag);
                                      if (isNaN(parseFloat(val))) return val;
                                      return `₹ ${parseFloat(val).toLocaleString('en-IN')}`;
                                    })()
                                  ) : '-'}
                                </td>
                                {index === 0 && (
                                  <td 
                                    rowSpan={product.variants.length} 
                                    className="p-4 border-r-2 border-slate-300 text-center align-middle bg-slate-50/20"
                                  >
                                    <div className="relative w-16 h-20 sm:w-20 sm:h-24 mx-auto rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shadow-inner">
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
                                {index === 0 && (
                                  <td 
                                    rowSpan={product.variants.length} 
                                    className="p-4 text-center align-middle bg-slate-50/10"
                                  >
                                    <a
                                      href={getWhatsAppInquiryUrl(product)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center justify-center p-3 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl shadow-md hover:shadow-lg transition-all"
                                    >
                                      <MessageSquare className="w-5 h-5 fill-current" />
                                    </a>
                                  </td>
                                )}
                              </tr>
                            );
                          })}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="py-20 text-center text-slate-500">
        Loading Catalogue...
      </div>
    }>
      <ProductsCatalogInner />
    </Suspense>
  );
}
