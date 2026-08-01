'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, RefreshCw, AlertCircle, MessageSquare } from 'lucide-react';
import { api } from '../../lib/api';

interface PriceItem {
  variant_id: number;
  product_id: number;
  product_name: string;
  size: string;
  unit: string;
  price: string | number;
  status: string;
}

function PriceListInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filter States initialized to empty for hydration safety
  const [search, setSearch] = useState('');

  // Sync state with URL search params on mount or when searchParams change
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
  }, [searchParams]);

  // Data States
  const [prices, setPrices] = useState<PriceItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch flat prices
  useEffect(() => {
    const fetchPrices = async () => {
      setLoading(true);
      try {
        const queryText = searchParams.get('search') || undefined;

        const data = await api.getPrices({
          search: queryText
        });
        setPrices(data);
      } catch (err) {
        console.error('Error loading price list:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, [searchParams]);

  // Apply filters
  const applyFilters = (newSearch: string) => {
    const params = new URLSearchParams();
    if (newSearch) params.append('search', newSearch);
    router.push(`/price-list?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters(search);
  };

  const resetFilters = () => {
    setSearch('');
    router.push('/price-list');
  };

  // WhatsApp Inquiry Generator
  const getWhatsAppInquiryUrl = (item: PriceItem) => {
    const phoneNumber = '916361033361';
    const msg = `Hello Lakshmi Agency, I am checking your website price list. I would like to inquire about the item:\n\n*Product*: ${item.product_name}\n*Size*: ${item.size} ${item.unit}\n*Listed Price*: ₹${parseFloat(item.price as string).toLocaleString('en-IN')}\n\nPlease confirm availability and let me know if there are any price changes. Thank you!`;
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="text-xs sm:text-sm text-muted-text mb-6">
          <span className="hover:text-foreground"><Link href="/">Home</Link></span>
          <span className="mx-2">/</span>
          <span className="text-foreground font-bold">Price List</span>
        </nav>

        {/* Title */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Materials Rate Card & Price List
          </h1>
          <p className="text-sm text-muted-text mt-2">
            Search live prices for cement, primers, paint mixes, PVC components, or waterproofing solutions.
          </p>
        </div>

        {/* Disclaimer Alert */}
        <div className="flex gap-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 p-4 rounded-2xl mb-8 text-xs sm:text-sm text-amber-800 dark:text-amber-300 leading-relaxed shadow-sm">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-bold">Market Price Advisory:</span> Cement, steel, PVC polymer, and chemical prices fluctuate daily based on manufacturer tariff updates. The prices below represent catalog estimates. Please click <span className="font-bold text-slate-900 dark:text-white">Inquire</span> to verify the absolute latest rates.
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-card-bg border border-card-border rounded-2xl p-5 mb-8 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between transition-theme">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-1/2">
            <input
              type="text"
              placeholder="Search product name or size..."
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

        {/* Pricing Data Container */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-slate-100 dark:bg-slate-800/40 h-14 rounded-xl border border-card-border" />
            ))}
          </div>
        ) : prices.length === 0 ? (
          <div className="text-center py-20 bg-card-bg border border-card-border rounded-2xl">
            <h3 className="text-lg font-bold text-foreground mb-1">No Pricing Records Found</h3>
            <p className="text-sm text-muted-text max-w-sm mx-auto mb-6">
              We couldn&apos;t find any variant matching your search query &ldquo;{search}&rdquo;.
            </p>
            <button
              onClick={resetFilters}
              className="py-2 px-4 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-hover transition-colors"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block border border-card-border rounded-2xl overflow-hidden shadow-sm bg-card-bg transition-theme">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950/20 text-muted-text font-bold text-xs uppercase tracking-wider border-b border-card-border">
                    <th className="p-4 pl-6">Product Item</th>
                    <th className="p-4">Variant Size</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Availability</th>
                    <th className="p-4 pr-6 text-center">Inquire</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-card-border text-sm">
                  {prices.map((item) => (
                    <tr key={item.variant_id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors">
                      <td className="p-4 pl-6 font-bold text-foreground">{item.product_name}</td>
                      <td className="p-4 font-medium text-foreground">{item.size} {item.unit}</td>
                      <td className="p-4 font-black text-primary dark:text-white text-base">
                        ₹{parseFloat(item.price as string).toLocaleString('en-IN')}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${
                          item.status === 'Available' ? 'text-emerald-500' : 'text-red-500'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            item.status === 'Available' ? 'bg-emerald-500' : 'bg-red-500'
                          }`} />
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-center">
                        <a
                          href={getWhatsAppInquiryUrl(item)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center p-2 bg-accent text-white hover:bg-accent-hover rounded-lg transition-colors shadow-sm"
                          title="WhatsApp Inquiry for this rate"
                        >
                          <MessageSquare className="w-4.5 h-4.5 fill-current" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards List View */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {prices.map((item) => (
                <div key={item.variant_id} className="bg-card-bg border border-card-border rounded-xl p-4 shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <div>
                      <h3 className="font-extrabold text-foreground leading-snug">{item.product_name}</h3>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      item.status === 'Available' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-950/20 dark:text-red-400'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-card-border">
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-muted-text">Size: {item.size} {item.unit}</span>
                      <span className="text-base font-extrabold text-primary dark:text-white">
                        ₹{parseFloat(item.price as string).toLocaleString('en-IN')}
                      </span>
                    </div>
                    
                    <a
                      href={getWhatsAppInquiryUrl(item)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-accent text-white text-xs font-bold hover:bg-accent-hover transition-colors shadow-sm"
                    >
                      <MessageSquare className="w-3.5 h-3.5 fill-current" />
                      Inquire
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default function PriceListPage() {
  return (
    <Suspense fallback={
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-muted-text">Loading price tables...</p>
      </div>
    }>
      <PriceListInner />
    </Suspense>
  );
}
