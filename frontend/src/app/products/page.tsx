'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, RefreshCw, MessageSquare, AlertTriangle } from 'lucide-react';
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

function ProductCard({ 
  product, 
  getWhatsAppInquiryUrl, 
  formatPriceVal 
}: { 
  product: Product; 
  getWhatsAppInquiryUrl: (product: Product) => string; 
  formatPriceVal: (price: string | number) => string; 
}) {
  const [activeImage, setActiveImage] = useState(product.image);

  useEffect(() => {
    setActiveImage(product.image);
  }, [product.image]);

  return (
    <div className="product-card-print bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      {/* Product Image */}
      <div className="relative h-56 w-full bg-white border-b border-slate-200 p-4 flex items-center justify-center">
        <img
          src={activeImage || 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&auto=format&fit=crop&q=80'}
          alt={product.product_name}
          className="max-w-full max-h-full object-contain transition-all duration-300"
          loading="lazy"
        />
        <span className="absolute top-3 right-3 bg-emerald-500 text-white font-extrabold text-[10px] uppercase tracking-wider py-1 px-2.5 rounded-full shadow-sm">
          In Stock
        </span>
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-extrabold text-slate-900 uppercase tracking-tight mb-2">
          {product.product_name}
        </h3>
        {product.description && (
          <p className="text-xs text-slate-500 mb-4 leading-relaxed line-clamp-3">
            {product.description}
          </p>
        )}

        {/* Variants Sub-Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden text-xs bg-slate-50 mb-5">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200 text-[10px] uppercase tracking-wider">
                <th className="p-2.5 pl-3">Size / Option</th>
                <th className="p-2.5 text-right pr-3">Price (Rs)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {product.variants.map((v) => (
                <tr 
                  key={v.id} 
                  className="hover:bg-slate-100/50 cursor-pointer transition-colors"
                  onMouseEnter={() => v.image && setActiveImage(v.image)}
                  onMouseLeave={() => setActiveImage(product.image)}
                >
                  <td className="p-2.5 pl-3 font-semibold">{v.size} {v.unit}</td>
                  <td className="p-2.5 text-right pr-3 font-extrabold text-blue-600">
                    {formatPriceVal(v.price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* WhatsApp Inquire CTA */}
        <a
          href={getWhatsAppInquiryUrl(product)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-all"
        >
          <MessageSquare className="w-4 h-4 fill-current" />
          Send WhatsApp Inquiry
        </a>
      </div>
    </div>
  );
}

function JkCementProductCard({ 
  product, 
  getWhatsAppInquiryUrl 
}: { 
  product: Product; 
  getWhatsAppInquiryUrl: (product: Product) => string; 
}) {
  const [activeImage, setActiveImage] = useState(product.image);

  useEffect(() => {
    setActiveImage(product.image);
  }, [product.image]);

  return (
    <div className="product-card-print bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      {/* Product Image */}
      <div className="relative h-56 w-full bg-white border-b border-slate-200 p-4 flex items-center justify-center">
        <img
          src={activeImage || 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&auto=format&fit=crop&q=80'}
          alt={product.product_name}
          className="max-w-full max-h-full object-contain transition-all duration-300"
          loading="lazy"
        />
        <span className="absolute top-3 right-3 bg-emerald-500 text-white font-extrabold text-[10px] uppercase tracking-wider py-1 px-2.5 rounded-full shadow-sm">
          In Stock
        </span>
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-extrabold text-slate-900 uppercase tracking-tight mb-2">
          {product.product_name}
        </h3>
        {product.description && (
          <p className="text-xs text-slate-500 mb-4 leading-relaxed line-clamp-3">
            {product.description}
          </p>
        )}

        {/* JK Cement Specialized Sub-Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden text-[10px] bg-slate-50 mb-5">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider">
                <th className="p-2 pl-3">Qty</th>
                <th className="p-2 text-center">Std</th>
                <th className="p-2 text-right">Dealer</th>
                <th className="p-2 text-right pr-3">Bag Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700 text-xs">
              {product.variants.map((v) => (
                <tr 
                  key={v.id} 
                  className="hover:bg-slate-100/50 cursor-pointer transition-colors"
                  onMouseEnter={() => v.image && setActiveImage(v.image)}
                  onMouseLeave={() => setActiveImage(product.image)}
                >
                  <td className="p-2 pl-3 font-bold text-slate-800">{v.size}</td>
                  <td className="p-2 text-center text-slate-600">
                    {v.stdPacking !== undefined ? String(v.stdPacking).padStart(2, '0') : '-'}
                  </td>
                  <td className="p-2 text-right text-slate-600">
                    {(() => {
                      const val = String(v.price);
                      if (isNaN(parseFloat(val))) return val;
                      return `₹${parseFloat(val).toLocaleString('en-IN')}`;
                    })()}
                  </td>
                  <td className="p-2 text-right pr-3 font-extrabold text-emerald-600">
                    {v.dealerPricePerBag !== undefined ? (
                      (() => {
                        const val = String(v.dealerPricePerBag);
                        if (isNaN(parseFloat(val))) return val;
                        return `₹${parseFloat(val).toLocaleString('en-IN')}`;
                      })()
                    ) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* WhatsApp Inquire CTA */}
        <a
          href={getWhatsAppInquiryUrl(product)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-all"
        >
          <MessageSquare className="w-4 h-4 fill-current" />
          Send WhatsApp Inquiry
        </a>
      </div>
    </div>
  );
}

function PolycabMcbProductCard({ 
  product, 
  getWhatsAppInquiryUrl 
}: { 
  product: Product; 
  getWhatsAppInquiryUrl: (product: Product) => string; 
}) {
  const [activeImage, setActiveImage] = useState(product.image);

  useEffect(() => {
    setActiveImage(product.image);
  }, [product.image]);

  const getVariantWhatsAppInquiryUrl = (variant: Variant) => {
    const phoneNumber = '916361033361';
    const text = `Hello Lakshmi Agency,
I need "POLYCAB MCB - Item ${variant.itemCode} (${variant.size})"
Quantity : `;
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="product-card-print grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Product Info Card */}
      <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow lg:sticky lg:top-24">
        <div className="relative h-64 w-full bg-white border-b border-slate-200 p-6 flex items-center justify-center">
          <img
            src={activeImage || '/product-image/53.png'}
            alt={product.product_name}
            className="max-w-full max-h-full object-contain transition-all duration-300"
            loading="lazy"
          />
          <span className="absolute top-3 right-3 bg-emerald-500 text-white font-extrabold text-[10px] uppercase tracking-wider py-1 px-2.5 rounded-full shadow-sm">
            In Stock
          </span>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-extrabold text-slate-900 uppercase tracking-tight mb-3">
            {product.product_name}
          </h3>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            {product.description}
          </p>
          <a
            href={getWhatsAppInquiryUrl(product)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-all"
          >
            <MessageSquare className="w-4 h-4 fill-current" />
            Send Bulk Inquiry
          </a>
        </div>
      </div>

      {/* MCB Table Section */}
      <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">
            Polycab Rate List & Specification
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/75 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <th className="p-3 pl-4">Item Code</th>
                <th className="p-3">Description</th>
                <th className="p-3 text-right">New LP (1-Apr-23)</th>
                <th className="p-3 text-right">RLP</th>
                <th className="p-3 text-center pr-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {product.variants.map((v) => (
                <tr 
                  key={v.id} 
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="p-3 pl-4 font-mono font-bold text-slate-900">{v.itemCode}</td>
                  <td className="p-3 font-semibold text-slate-800">{v.size}</td>
                  <td className="p-3 text-right font-medium text-slate-500">
                    {v.newLp !== undefined ? (
                      (() => {
                        const val = String(v.newLp);
                        if (isNaN(parseFloat(val))) return val;
                        return `₹${parseFloat(val).toLocaleString('en-IN')}`;
                      })()
                    ) : '-'}
                  </td>
                  <td className="p-3 text-right font-extrabold text-blue-600 text-sm">
                    {v.price !== undefined ? (
                      (() => {
                        const val = String(v.price);
                        if (isNaN(parseFloat(val))) return val;
                        return `₹${parseFloat(val).toLocaleString('en-IN')}`;
                      })()
                    ) : '-'}
                  </td>
                  <td className="p-3 text-center pr-4">
                    <a
                      href={getVariantWhatsAppInquiryUrl(v)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 py-1.5 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10px] uppercase transition-all"
                    >
                      <MessageSquare className="w-3 h-3 fill-current" />
                      Inquire
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PolycabWireProductCard({ 
  product, 
  getWhatsAppInquiryUrl,
  formatPriceVal
}: { 
  product: Product; 
  getWhatsAppInquiryUrl: (product: Product) => string;
  formatPriceVal: (price: string | number) => string;
}) {
  const [activeImage, setActiveImage] = useState(product.image);

  useEffect(() => {
    setActiveImage(product.image);
  }, [product.image]);

  return (
    <div className="product-card-print bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      {/* Product Image */}
      <div className="relative h-52 w-full bg-white border-b border-slate-200 p-4 flex items-center justify-center">
        <img
          src={activeImage || 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&auto=format&fit=crop&q=80'}
          alt={product.product_name}
          className="max-w-full max-h-full object-contain transition-all duration-300"
          loading="lazy"
        />
        <span className="absolute top-3 right-3 bg-emerald-500 text-white font-extrabold text-[10px] uppercase tracking-wider py-1 px-2.5 rounded-full shadow-sm">
          In Stock
        </span>
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-extrabold text-slate-900 uppercase tracking-tight mb-2">
          {product.product_name}
        </h3>
        {product.description && (
          <p className="text-xs text-slate-500 mb-4 leading-relaxed line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Wire Specialized Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden text-[10px] bg-slate-50 mb-5">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[9px]">
                <th className="p-2 pl-3">Size (Sq.mm.)</th>
                <th className="p-2 text-right">LP (₹)</th>
                <th className="p-2 text-center">Packing</th>
                <th className="p-2 pl-2 pr-3">Colours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700 text-[11px]">
              {product.variants.map((v) => (
                <tr 
                  key={v.id} 
                  className="hover:bg-slate-100/50 cursor-pointer transition-colors"
                >
                  <td className="p-2 pl-3 font-bold text-slate-800">{v.size} {v.unit}</td>
                  <td className="p-2 text-right font-extrabold text-blue-600">
                    {formatPriceVal(v.price)}
                  </td>
                  <td className="p-2 text-center text-slate-600 font-medium">
                    {v.coilsPerCarton !== undefined ? `${v.coilsPerCarton} Coils` : '-'}
                  </td>
                  <td className="p-2 pl-2 pr-3 text-slate-500 font-medium max-w-[120px] truncate" title={v.colors}>
                    {v.colors || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* WhatsApp Inquire CTA */}
        <a
          href={getWhatsAppInquiryUrl(product)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-all"
        >
          <MessageSquare className="w-4 h-4 fill-current" />
          Send WhatsApp Inquiry
        </a>
      </div>
    </div>
  );
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
  const getWhatsAppInquiryUrl = (product: Product) => {
    const phoneNumber = '916361033361';
    const text = `Hello Lakshmi Agency,
I need "${product.product_name}"
Quanty : `;
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
  };

  // Format Price Helper
  const formatPriceVal = (price: string | number) => {
    const val = String(price);
    if (isNaN(parseFloat(val))) return val;
    if (val.includes('/') || val.toLowerCase().includes('mtr')) {
      return val.startsWith('₹') ? val : `₹ ${val}`;
    }
    return `₹ ${parseFloat(val).toLocaleString('en-IN')}`;
  };

  // Split products by table type
  const generalProducts = products.filter(p => p.tableType !== 'jk_cement' && p.tableType !== 'polycab_mcb' && p.tableType !== 'polycab_wire');
  const jkCementProducts = products.filter(p => p.tableType === 'jk_cement');
  const polycabMcbProducts = products.filter(p => p.tableType === 'polycab_mcb');
  const polycabWireProducts = products.filter(p => p.tableType === 'polycab_wire');

  return (
    // Forced Light Theme Wrapper
    <div className="py-12 sm:py-20 bg-slate-50 text-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <nav className="text-xs sm:text-sm text-slate-500 mb-6 no-print">
          <span className="hover:text-slate-900"><Link href="/">Home</Link></span>
          <span className="mx-2">/</span>
          <span className="text-slate-900 font-bold">Products Catalogue</span>
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

        {/* Title & Download Button */}
        <div className="mb-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Materials Rate Card & Products List
            </h1>
            <p className="text-sm text-slate-600 mt-2">
              Search live wholesale & retail prices for building materials, paints, PVC components, or waterproofing.
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="flex-shrink-0 flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition-all no-print"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            Download PDF
          </button>
        </div>

        {/* Filter Controls Panel */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-10 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between no-print">
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

        {/* Price Warning */}
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 p-4 rounded-2xl mb-10 text-xs sm:text-sm text-amber-800 leading-relaxed max-w-3xl">
          <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0 text-amber-600" />
          <div>
            <span className="font-bold">Important Notice:</span> Market prices fluctuate. Listed prices are catalog estimates. Please contact us via WhatsApp to confirm current rates before ordering.
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white h-96 rounded-2xl border border-slate-200 animate-pulse shadow-sm" />
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
          <div className="space-y-20">
            
            {/* Section 1: General Hardware & Materials */}
            {generalProducts.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  Building Materials & Hardware Fittings
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                  {generalProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      getWhatsAppInquiryUrl={getWhatsAppInquiryUrl}
                      formatPriceVal={formatPriceVal}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Section 2: JK Cement & Putty Products */}
            {jkCementProducts.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  JK Cement & Wall Putty Products
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                  {jkCementProducts.map((product) => (
                    <JkCementProductCard
                      key={product.id}
                      product={product}
                      getWhatsAppInquiryUrl={getWhatsAppInquiryUrl}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Section 3: Polycab MCB & RCCB Products */}
            {polycabMcbProducts.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  Polycab MCB & RCCB Products
                </h2>

                <div className="space-y-8">
                  {polycabMcbProducts.map((product) => (
                    <PolycabMcbProductCard
                      key={product.id}
                      product={product}
                      getWhatsAppInquiryUrl={getWhatsAppInquiryUrl}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Section 4: Polycab Wires & Cables */}
            {polycabWireProducts.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  Polycab Wires & Cables
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                  {polycabWireProducts.map((product) => (
                    <PolycabWireProductCard
                      key={product.id}
                      product={product}
                      getWhatsAppInquiryUrl={getWhatsAppInquiryUrl}
                      formatPriceVal={formatPriceVal}
                    />
                  ))}
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
        Loading Products Catalog...
      </div>
    }>
      <ProductsCatalogInner />
    </Suspense>
  );
}
