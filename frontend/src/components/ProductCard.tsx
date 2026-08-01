'use client';

import React from 'react';
import Image from 'next/image';
import { Eye, MessageSquare } from 'lucide-react';

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

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
  const { product_name, image, variants } = product;

  // Format prices
  const prices = variants.map((v) => parseFloat(v.price as string)).filter((p) => !isNaN(p));
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

  const displayPrice = () => {
    if (prices.length === 0) return 'Price on Request';
    if (minPrice === maxPrice) return `₹${minPrice.toLocaleString('en-IN')}`;
    return `₹${minPrice.toLocaleString('en-IN')} - ₹${maxPrice.toLocaleString('en-IN')}`;
  };

  const isAvailable = variants.some((v) => v.status === 'Available');

  // WhatsApp inquiry URL for this specific product
  const phoneNumber = '916361033361';
  const whatsappText = `Hello Lakshmi Agency, I would like to inquire about "${product_name}". Price range: ${displayPrice()}.`;
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappText)}`;

  return (
    <div className="bg-card-bg border border-card-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
      {/* Product Image */}
      <div className="relative aspect-square w-full bg-slate-50 dark:bg-slate-900 overflow-hidden cursor-pointer" onClick={() => onViewDetails(product)}>
        <Image
          src={image || 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&auto=format&fit=crop&q=60'}
          alt={product_name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority={false}
        />
        {/* Availability Badge */}
        <div className="absolute top-3 right-3 z-10">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md shadow-sm ${
            isAvailable 
              ? 'bg-emerald-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            {isAvailable ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        {/* Title */}
        <h3 
          className="text-base font-bold text-foreground hover:text-primary dark:hover:text-white transition-colors line-clamp-1 mb-1 cursor-pointer"
          onClick={() => onViewDetails(product)}
        >
          {product_name}
        </h3>

        {/* Available Sizes */}
        <p className="text-xs text-muted-text line-clamp-1 mb-3">
          Sizes: {variants.map((v) => `${v.size}${v.unit}`).join(', ') || 'Standard'}
        </p>

        {/* Price Display */}
        <div className="mt-auto pt-3 border-t border-card-border flex items-baseline justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-muted-text tracking-wider">Estimated Price</span>
            <span className="text-base sm:text-lg font-black text-primary dark:text-white">{displayPrice()}</span>
          </div>
        </div>

        {/* Call to Actions */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <button
            onClick={() => onViewDetails(product)}
            className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-800 text-foreground hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            Details
          </button>
          
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 fill-current" />
            Inquire
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
