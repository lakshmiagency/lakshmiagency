'use client';

import React from 'react';
import Image from 'next/image';
import { X, AlertTriangle, Phone, MessageSquare } from 'lucide-react';
import { useEnquiry } from '../context/EnquiryContext';

interface Variant {
  id: number;
  size: string;
  unit: string;
  price: string | number;
  status: string;
}

interface Product {
  id: number | string;
  product_name: string;
  description: string;
  image: string;
  variants: Variant[];
}

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { addToEnquiry } = useEnquiry();

  if (!product) return null;

  const { product_name, description, image, variants } = product;

  // Format prices
  const prices = variants.map((v) => parseFloat(v.price as string)).filter((p) => !isNaN(p));
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

  const displayPrice = () => {
    if (prices.length === 0) return 'Price on Request';
    if (minPrice === maxPrice) return `₹${minPrice.toLocaleString('en-IN')}`;
    return `₹${minPrice.toLocaleString('en-IN')} - ₹${maxPrice.toLocaleString('en-IN')}`;
  };

  // WhatsApp inquiry URL for this specific product
  const phoneNumber = '916361033361';
  const whatsappText = `Hello Lakshmi Agency,
I need "${product_name}"
Quanty : `;
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappText)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300">
      {/* Modal Container */}
      <div className="bg-card-bg border border-card-border rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col md:flex-row transition-all duration-300">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-muted-text hover:text-foreground hover:scale-105 transition-all focus:outline-none"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image Section */}
        <div className="w-full md:w-1/2 aspect-square relative bg-white dark:bg-slate-900 flex-shrink-0 p-6 flex items-center justify-center">
          <div className="relative w-full h-full">
            <Image
              src={image || 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=60'}
              alt={product_name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain"
              priority={true}
            />
          </div>
        </div>

        {/* Details Section */}
        <div className="p-6 md:p-8 flex flex-col flex-grow justify-between">
          <div>
            {/* Title */}
            <h2 className="text-xl sm:text-2xl font-extrabold text-foreground mb-3 mt-4 leading-tight">
              {product_name}
            </h2>

            {/* Description */}
            <p className="text-sm text-muted-text leading-relaxed mb-5 whitespace-pre-line">
              {description || 'Premium quality building material supplied directly by top brands. Built for durability and performance.'}
            </p>

            {/* Variants Table */}
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-2">Available Options & Price List</h3>
              <div className="border border-card-border rounded-xl overflow-hidden text-sm bg-slate-50/50 dark:bg-slate-900/30">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-card-border bg-slate-100/50 dark:bg-slate-950/20 text-muted-text font-semibold text-xs">
                      <th className="p-2.5 pl-3">Size/Option</th>
                      <th className="p-2.5">Price</th>
                      <th className="p-2.5 text-center">Status</th>
                      <th className="p-2.5 pr-3 text-center no-print">List</th>
                    </tr>
                  </thead>
                  <tbody>
                    {variants.map((v) => (
                      <tr key={v.id} className="border-b border-card-border last:border-b-0 hover:bg-slate-100/30 dark:hover:bg-slate-800/10">
                        <td className="p-2.5 pl-3 font-medium text-foreground">{v.size} {v.unit}</td>
                        <td className="p-2.5 font-bold text-primary dark:text-white">
                          {(() => {
                            const val = String(v.price);
                            if (isNaN(parseFloat(val))) return val;
                            if (val.includes('/') || val.toLowerCase().includes('mtr')) {
                              return val.startsWith('₹') ? val : `₹ ${val}`;
                            }
                            return `₹ ${parseFloat(val).toLocaleString('en-IN')}`;
                          })()}
                        </td>
                        <td className="p-2.5 text-center">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${
                            v.status === 'Available' ? 'text-emerald-500' : 'text-red-500'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              v.status === 'Available' ? 'bg-emerald-500' : 'bg-red-500'
                            }`} />
                            {v.status}
                          </span>
                        </td>
                        <td className="p-2.5 pr-3 text-center no-print">
                          <button
                            onClick={() => addToEnquiry(product, v)}
                            className="px-2 py-0.5 rounded-lg bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 font-extrabold text-[10px] uppercase transition-all cursor-pointer"
                          >
                            + Add
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Price Warning */}
            <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 p-3 rounded-xl mb-6 text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-bold">Important Notice:</span> Market prices fluctuate. Listed prices are catalog estimates. Please contact us to confirm current rates before ordering.
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-card-border">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-accent text-white font-bold hover:bg-accent-hover transition-colors shadow-md hover:shadow-lg"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              WhatsApp Inquiry
            </a>
            
            <a
              href="tel:6361033361"
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-foreground font-bold hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
            >
              <Phone className="w-4 h-4" />
              Call Store
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
