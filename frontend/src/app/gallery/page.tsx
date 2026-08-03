'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, X, MessageSquare, AlertTriangle, Eye, ArrowRight } from 'lucide-react';
import { api } from '../../lib/api';

interface Variant {
  id: number;
  size: string;
  unit: string;
  price: string | number;
  stdPacking?: number;
  dealerPricePerBag?: string | number;
  itemCode?: string;
  newLp?: string | number;
  coilsPerCarton?: number;
  colors?: string;
  status: string;
  image?: string;
}

interface Product {
  id: number | string;
  product_name: string;
  description: string;
  image: string;
  tableType?: 'general' | 'jk_cement' | 'polycab_mcb' | 'polycab_wire';
  variants: Variant[];
}

const CATEGORIES = [
  'All',
  'Cement & Putty',
  'Electrical',
  'Pipes & Fittings',
  'Paints & Coatings',
  'Hardware & Tools'
];

const getProductCategory = (product: Product): string => {
  if (product.tableType === 'jk_cement') return 'Cement & Putty';
  if (product.tableType === 'polycab_mcb' || product.tableType === 'polycab_wire') return 'Electrical';
  
  const name = product.product_name.toLowerCase();
  
  if (name.includes('cement') || name.includes('putty') || name.includes('gypsum') || name.includes('pop') || name.includes('gypso')) {
    return 'Cement & Putty';
  }
  if (name.includes('mcb') || name.includes('rccb') || name.includes('wire') || name.includes('cable') || name.includes('polycab') || name.includes('changeover') || name.includes('steel wool')) {
    return 'Electrical';
  }
  if (name.includes('pipe') || name.includes('hose') || name.includes('braided') || name.includes('zebra') || name.includes('foam') || name.includes('garden')) {
    return 'Pipes & Fittings';
  }
  if (name.includes('paint') || name.includes('primer') || name.includes('texture') || name.includes('aqua bond') || name.includes('anchor lock') || name.includes('waterproof')) {
    return 'Paints & Coatings';
  }
  return 'Hardware & Tools';
};

function GalleryInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Search & Filter States
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Sync state with URL search params
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setActiveCategory(searchParams.get('category') || 'All');
  }, [searchParams]);

  // Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Fetch products
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await api.getProducts();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products for gallery:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  // Filter products locally for instant response
  const filteredProducts = products.filter((product) => {
    const category = getProductCategory(product);
    const matchesCategory = activeCategory === 'All' || category === activeCategory;
    
    const term = search.toLowerCase();
    const matchesSearch = 
      product.product_name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term) ||
      product.variants.some((v) => v.size.toLowerCase().includes(term) || (v.itemCode && v.itemCode.toLowerCase().includes(term)));

    return matchesCategory && matchesSearch;
  });

  const applyFilters = (newSearch: string, newCategory: string) => {
    const params = new URLSearchParams();
    if (newSearch) params.append('search', newSearch);
    if (newCategory !== 'All') params.append('category', newCategory);
    router.push(`/gallery?${params.toString()}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    applyFilters(val, activeCategory);
  };

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    applyFilters(search, cat);
  };

  const resetFilters = () => {
    setSearch('');
    setActiveCategory('All');
    router.push('/gallery');
  };

  // WhatsApp Inquiry Generator
  const getWhatsAppInquiryUrl = (product: Product, variant?: Variant) => {
    const phoneNumber = '916361033361';
    let text = `Hello Lakshmi Agency,\nI need "${product.product_name}"`;
    if (variant) {
      if (variant.itemCode) {
        text = `Hello Lakshmi Agency,\nI need "POLYCAB MCB - Item ${variant.itemCode} (${variant.size})"`;
      } else {
        text = `Hello Lakshmi Agency,\nI need "${product.product_name} - Size: ${variant.size} ${variant.unit}"`;
      }
    }
    text += `\nQuantity : `;
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
  };

  // Helper for formatting prices
  const formatPriceVal = (price: string | number) => {
    const val = String(price);
    if (isNaN(parseFloat(val))) return val;
    return `₹${parseFloat(val).toLocaleString('en-IN')}`;
  };

  return (
    <div className="py-12 sm:py-20 bg-slate-50 text-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <nav className="text-xs sm:text-sm text-slate-500 mb-6 no-print">
          <span className="hover:text-slate-900"><Link href="/">Home</Link></span>
          <span className="mx-2">/</span>
          <span className="text-slate-900 font-bold">Visual Gallery</span>
        </nav>

        {/* Print-only Brand Header */}
        <div className="hidden print:flex flex-col items-center text-center border-b-2 border-slate-300 pb-5 mb-8 w-full">
          <div className="flex items-center gap-4 mb-2">
            <img src="/logo.png" alt="Lakshmi Agency Logo" className="w-16 h-16 object-contain rounded-full border border-slate-200" />
            <div className="text-left">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">LAKSHMI AGENCY</h1>
              <p className="text-xs text-slate-500 font-extrabold uppercase tracking-wider mt-1">Building Materials & Hardware Fittings</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 max-w-2xl mt-1 leading-relaxed">
            Wholesale & Retail Supplier of Building Materials, Putty, Paints, PVC Pipes, Waterproofing Products, and Electricals.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-xs font-bold text-slate-700 mt-3 pt-2 border-t border-slate-100 w-full max-w-lg">
            <span>📍 College Main Road, Sulibele, Hoskote, Bangalore Rural</span>
            <span>📞 Phone: +91 6361033361, +91 9481252271</span>
          </div>
        </div>

        {/* Header */}
        <div className="mb-10 print:hidden">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Visual Product Gallery
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            Quickly browse through our complete product range. Click on any product to view its price list and details.
          </p>
        </div>

        {/* Filter & Search Panel */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-10 shadow-sm space-y-4 no-print">
          {/* Search bar */}
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search by name, description, size or code..."
              value={search}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 bg-white text-slate-955 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
            {search && (
              <button 
                onClick={() => { setSearch(''); applyFilters('', activeCategory); }}
                className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Category Filter Tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Loader or No Products */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white aspect-square rounded-2xl border border-slate-200 animate-pulse shadow-sm" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl shadow-sm">
            <p className="text-slate-400 text-lg mb-4">No products found matching filters.</p>
            <button
              onClick={resetFilters}
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 text-sm"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* Products Grid: 4 columns on large screens, 3 on md, 2 on mobile */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="product-card-print group cursor-pointer bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center p-4 text-center hover:border-blue-300"
              >
                {/* Image Wrapper */}
                <div className="relative aspect-square w-full bg-white flex items-center justify-center p-2 mb-3 overflow-hidden">
                  <img
                    src={product.image || 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=300&auto=format&fit=crop&q=80'}
                    alt={product.product_name}
                    className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 bg-white/95 text-blue-700 border border-blue-100 shadow-sm font-bold text-[10px] uppercase py-1.5 px-3 rounded-lg flex items-center gap-1 transition-all transform translate-y-2 group-hover:translate-y-0">
                      <Eye className="w-3.5 h-3.5" />
                      View Details
                    </span>
                  </div>
                </div>

                {/* Name */}
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-800 uppercase tracking-tight line-clamp-2 mt-auto w-full group-hover:text-blue-600 transition-colors">
                  {product.product_name}
                </h3>
              </div>
            ))}
          </div>
        )}

        {/* Details & Pricing Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-3xl border border-slate-200 max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative flex flex-col md:flex-row transition-all">
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 hover:scale-105 transition-all"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Product Photo */}
              <div className="w-full md:w-1/2 aspect-square relative bg-white flex-shrink-0 p-6 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-200">
                <img
                  src={selectedProduct.image || 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&auto=format&fit=crop&q=80'}
                  alt={selectedProduct.product_name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              {/* Product Info & Table */}
              <div className="p-6 md:p-8 flex flex-col flex-grow justify-between overflow-x-hidden">
                <div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wider mb-2">
                    {getProductCategory(selectedProduct)}
                  </span>
                  
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-3 leading-tight uppercase font-black">
                    {selectedProduct.product_name}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6">
                    {selectedProduct.description || 'Premium quality building material supplied directly by top brands. Built for durability and performance.'}
                  </p>

                  {/* Dynamic Variant Tables based on product type */}
                  <div className="mb-6">
                    <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">Specifications & Rate List</h3>
                    <div className="border border-slate-200 rounded-xl overflow-hidden text-xs bg-slate-50/50">
                      
                      {/* 1. JK CEMENT TABLE */}
                      {selectedProduct.tableType === 'jk_cement' ? (
                        <table className="w-full text-left border-collapse text-[10px]">
                          <thead>
                            <tr className="bg-slate-100 border-b border-slate-200 font-bold text-slate-600 uppercase">
                              <th className="p-2 pl-3">Qty</th>
                              <th className="p-2 text-center">Std</th>
                              <th className="p-2 text-right">Dealer</th>
                              <th className="p-2 text-right pr-3">Bag Price</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 text-slate-700 text-xs">
                            {selectedProduct.variants.map((v) => (
                              <tr key={v.id} className="hover:bg-slate-100/50 transition-colors">
                                <td className="p-2 pl-3 font-bold text-slate-800">{v.size}</td>
                                <td className="p-2 text-center text-slate-500">
                                  {v.stdPacking !== undefined ? String(v.stdPacking).padStart(2, '0') : '-'}
                                </td>
                                <td className="p-2 text-right text-slate-500">
                                  {formatPriceVal(v.price)}
                                </td>
                                <td className="p-2 text-right pr-3 font-extrabold text-emerald-600">
                                  {v.dealerPricePerBag !== undefined ? formatPriceVal(v.dealerPricePerBag) : '-'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : 
                      
                      /* 2. POLYCAB MCB TABLE */
                      selectedProduct.tableType === 'polycab_mcb' ? (
                        <table className="w-full text-left border-collapse text-[10px]">
                          <thead>
                            <tr className="bg-slate-100 border-b border-slate-200 font-bold text-slate-600 uppercase">
                              <th className="p-2 pl-3">Item Code</th>
                              <th className="p-2">Description</th>
                              <th className="p-2 text-right">New LP</th>
                              <th className="p-2 text-right pr-3">RLP</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 text-slate-700 text-[11px]">
                            {selectedProduct.variants.map((v) => (
                              <tr key={v.id} className="hover:bg-slate-100/50 transition-colors">
                                <td className="p-2 pl-3 font-mono font-bold text-slate-900">{v.itemCode}</td>
                                <td className="p-2 font-semibold text-slate-800">{v.size}</td>
                                <td className="p-2 text-right text-slate-500">{v.newLp ? formatPriceVal(v.newLp) : '-'}</td>
                                <td className="p-2 text-right pr-3 font-extrabold text-blue-600">{formatPriceVal(v.price)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : 
                      
                      /* 3. POLYCAB WIRE TABLE */
                      selectedProduct.tableType === 'polycab_wire' ? (
                        <table className="w-full text-left border-collapse text-[10px]">
                          <thead>
                            <tr className="bg-slate-100 border-b border-slate-200 font-bold text-slate-600 uppercase">
                              <th className="p-2 pl-3">Size</th>
                              <th className="p-2 text-right">LP (₹)</th>
                              <th className="p-2 text-center">Packing</th>
                              <th className="p-2 pl-2 pr-3">Colours</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 text-slate-700 text-xs">
                            {selectedProduct.variants.map((v) => (
                              <tr key={v.id} className="hover:bg-slate-100/50 transition-colors">
                                <td className="p-2 pl-3 font-bold text-slate-800">{v.size} {v.unit}</td>
                                <td className="p-2 text-right font-extrabold text-blue-600">{formatPriceVal(v.price)}</td>
                                <td className="p-2 text-center text-slate-500 font-medium">{v.coilsPerCarton ? `${v.coilsPerCarton} Coils` : '-'}</td>
                                <td className="p-2 pl-2 pr-3 text-slate-500 font-medium max-w-[120px] truncate" title={v.colors}>{v.colors || '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : 
                      
                      /* 4. DEFAULT PRODUCT TABLE */
                      (
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-slate-100 border-b border-slate-200 font-bold text-slate-600 uppercase text-[10px]">
                              <th className="p-2.5 pl-3">Size/Option</th>
                              <th className="p-2.5 pr-3 text-right">Estimated Price</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 text-slate-700">
                            {selectedProduct.variants.map((v) => (
                              <tr key={v.id} className="hover:bg-slate-100/50 transition-colors">
                                <td className="p-2.5 pl-3 font-semibold">{v.size} {v.unit}</td>
                                <td className="p-2.5 text-right pr-3 font-extrabold text-blue-600">
                                  {formatPriceVal(v.price)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}

                    </div>
                  </div>

                  {/* Rate Warning */}
                  <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 p-3 rounded-xl mb-6 text-[10px] text-amber-800 leading-relaxed">
                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-600" />
                    <div>
                      <span className="font-bold">Price Note:</span> Market rates change frequently. Please verify final pricing via WhatsApp.
                    </div>
                  </div>
                </div>

                {/* WhatsApp Inquire CTA */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
                  <a
                    href={getWhatsAppInquiryUrl(selectedProduct)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-grow flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-all"
                  >
                    <MessageSquare className="w-4 h-4 fill-current" />
                    WhatsApp Inquiry
                  </a>
                  <Link
                    href={`/products?search=${encodeURIComponent(selectedProduct.product_name)}`}
                    onClick={() => setSelectedProduct(null)}
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors"
                  >
                    Detailed Catalog
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function GalleryPage() {
  return (
    <Suspense fallback={
      <div className="py-20 text-center text-slate-500">
        Loading Product Gallery...
      </div>
    }>
      <GalleryInner />
    </Suspense>
  );
}
