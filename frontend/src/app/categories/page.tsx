'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '../../lib/api';

interface Category {
  id: number;
  name: string;
  image: string;
  product_count: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await api.getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to load categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="text-xs sm:text-sm text-muted-text mb-6">
          <span className="hover:text-foreground"><Link href="/">Home</Link></span>
          <span className="mx-2">/</span>
          <span className="text-foreground font-bold">Categories</span>
        </nav>

        {/* Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-primary dark:text-blue-400">Our Departments</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mt-2 mb-6">
            Building & Hardware Categories
          </h1>
          <p className="text-base sm:text-lg text-muted-text leading-relaxed">
            We supply a diverse assortment of construction chemicals, pipes, coatings, paint accessories, and cement brands. Click on any category below to view specific product sheets, size configurations, and estimated price ranges.
          </p>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-slate-100 dark:bg-slate-800 h-64 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category_id=${cat.id}`}
                className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-card-border flex flex-col justify-end p-6"
              >
                {/* Background Image */}
                <Image
                  src={cat.image || 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=60'}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent group-hover:via-slate-900/50 transition-all duration-300" />
                
                {/* Content */}
                <div className="relative z-10 text-white">
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight mb-1">{cat.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300 font-semibold">{cat.product_count || 0} Products Catalogue</span>
                    <span className="text-xs text-blue-400 font-bold group-hover:text-blue-300 transition-colors flex items-center gap-1 group-hover:gap-2">
                      View items →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
