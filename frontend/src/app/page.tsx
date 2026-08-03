'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Award,
  ShieldCheck,
  Truck,
  BadgeCheck,
  ChevronRight,
  Phone,
  MessageSquare
} from 'lucide-react';
import { api } from '../lib/api';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';

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

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const prodsRes = await api.getProducts();
        setProducts(prodsRes.slice(0, 4)); // Display first 4 featured products
      } catch (error) {
        console.error('Failed to load home page data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">

      {/* 1. Hero Section */}
      <section className="relative bg-slate-50 text-slate-900 overflow-hidden py-24 md:py-32 flex items-center min-h-[75vh]">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 opacity-10">
          <Image
            src="/shop-front.png"
            alt="Lakshmi Agency Store Front"
            fill
            className="object-cover"
            priority={true}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-100 via-slate-50 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              Wholesale & Retail Supplier
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-slate-900 mb-6">
              Premium Hardware & <br />
              <span className="text-blue-600">Building Materials</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 mb-8 leading-relaxed">
              Authorized dealers of cement, premium paints, CPVC pipes, garden water hoses, waterproofing products, and tile adhesives. We supply top-quality hardware materials to builders and homeowners in Sulibele, Hoskote Taluk.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/products"
                className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover transition-colors shadow-lg hover:shadow-blue-500/20"
              >
                Explore Catalogue
                <ArrowRight className="w-4 h-4" />
              </Link>

            </div>
          </div>
        </div>
      </section>

      {/* 2. Stats & Trust Badges */}
      <section className="bg-card-bg border-b border-card-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-primary" />
              <div>
                <span className="block text-xl font-bold text-foreground">15+ Years</span>
                <span className="text-xs text-muted-text">Business Experience</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-primary" />
              <div>
                <span className="block text-xl font-bold text-foreground">100% Genuine</span>
                <span className="text-xs text-muted-text">Original Brand Supply</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Truck className="w-8 h-8 text-primary" />
              <div>
                <span className="block text-xl font-bold text-foreground">Fast Delivery</span>
                <span className="text-xs text-muted-text">To Your Build Site</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <BadgeCheck className="w-8 h-8 text-primary" />
              <div>
                <span className="block text-xl font-bold text-foreground">Best Rates</span>
                <span className="text-xs text-muted-text">Wholesale & Retail Prices</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2.5 Featured Brands Showcase */}
      <section className="py-16 sm:py-24 bg-slate-100/60 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-blue-50 text-blue-600 border border-blue-100 tracking-wider">
              Authorized Partner Brands
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
              Shop Premium Builder Brands
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
              Explore rates, structural listings, and view photo catalogues for our leading partner manufacturers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Polycab Wires & MCBs */}
            <div className="group bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-xl hover:border-blue-350 transition-all duration-300 transform hover:-translate-y-1">
              <div className="relative h-48 bg-gradient-to-br from-red-50 to-blue-50 flex items-center justify-center p-6 border-b border-slate-100 overflow-hidden">
                {/* Brand Accent Shading */}
                <div className="absolute inset-0 bg-gradient-to-tr from-red-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <img
                  src="/product-image/53.png"
                  alt="Polycab Electrical Fittings"
                  className="max-h-36 object-contain z-10 drop-shadow-md group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-red-600 text-white font-extrabold text-[9px] uppercase tracking-wider py-1 px-2.5 rounded-full shadow-sm">
                  Electricals
                </span>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-2 group-hover:text-blue-600 transition-colors">
                  Polycab Electricals
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-6">
                  Premium industrial copper wires, flame-retardant cable coils, MCBs, RCCBs, and home electrical components.
                </p>
                <div className="mt-auto grid grid-cols-2 gap-3">
                  <Link
                    href="/products?search=polycab"
                    className="flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl border border-slate-200 hover:border-blue-300 bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-600 font-bold text-xs transition-colors"
                  >
                    View Rates
                  </Link>
                  <Link
                    href="/gallery?category=Electrical"
                    className="flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm hover:shadow-blue-500/10 transition-colors"
                  >
                    View Gallery
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 2: JK Cement & Putty */}
            <div className="group bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-xl hover:border-amber-350 transition-all duration-300 transform hover:-translate-y-1">
              <div className="relative h-48 bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-6 border-b border-slate-100 overflow-hidden">
                {/* Brand Accent Shading */}
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <img
                  src="/product-image/44.png"
                  alt="JK Cement Products"
                  className="max-h-36 object-contain z-10 drop-shadow-md group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-amber-600 text-white font-extrabold text-[9px] uppercase tracking-wider py-1 px-2.5 rounded-full shadow-sm">
                  Cement & Putty
                </span>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-2 group-hover:text-amber-600 transition-colors">
                  JK Cement & Putty
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-6">
                  Industry-grade white Portland cement, smooth undercoat wall putty, dampness shields, and POP materials.
                </p>
                <div className="mt-auto grid grid-cols-2 gap-3">
                  <Link
                    href="/products?search=jk"
                    className="flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl border border-slate-200 hover:border-amber-300 bg-white hover:bg-slate-50 text-slate-700 hover:text-amber-600 font-bold text-xs transition-colors"
                  >
                    View Rates
                  </Link>
                  <Link
                    href="/gallery?category=Cement+%26+Putty"
                    className="flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm hover:shadow-amber-500/10 transition-colors"
                  >
                    View Gallery
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 3: V Bond Adhesives */}
            <div className="group bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-xl hover:border-indigo-350 transition-all duration-300 transform hover:-translate-y-1">
              <div className="relative h-48 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-6 border-b border-slate-100 overflow-hidden">
                {/* Brand Accent Shading */}
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <img
                  src="/product-image/35.png"
                  alt="V Bond Adhesives & Chemicals"
                  className="max-h-36 object-contain z-10 drop-shadow-md group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-indigo-600 text-white font-extrabold text-[9px] uppercase tracking-wider py-1 px-2.5 rounded-full shadow-sm">
                  Adhesives & Chemicals
                </span>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-2 group-hover:text-indigo-600 transition-colors">
                  V Bond Adhesives
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-6">
                  High-performance polymer tile adhesives, epoxy joint grouts, waterproofing bonds, and tile cleaners.
                </p>
                <div className="mt-auto grid grid-cols-2 gap-3">
                  <Link
                    href="/products?search=v+bond"
                    className="flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl border border-slate-200 hover:border-indigo-300 bg-white hover:bg-slate-50 text-slate-700 hover:text-indigo-600 font-bold text-xs transition-colors"
                  >
                    View Rates
                  </Link>
                  <Link
                    href="/gallery?search=v+bond"
                    className="flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm hover:shadow-indigo-500/10 transition-colors"
                  >
                    View Gallery
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 4: Tufit Acrylic Textures */}
            <div className="group bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-xl hover:border-emerald-350 transition-all duration-300 transform hover:-translate-y-1">
              <div className="relative h-48 bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-6 border-b border-slate-100 overflow-hidden">
                {/* Brand Accent Shading */}
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <img
                  src="/product-image/50.png"
                  alt="Tufit Texture Layouts"
                  className="max-h-36 object-contain z-10 drop-shadow-md group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-emerald-600 text-white font-extrabold text-[9px] uppercase tracking-wider py-1 px-2.5 rounded-full shadow-sm">
                  Paints & Textures
                </span>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-2 group-hover:text-emerald-600 transition-colors">
                  Tufit Premium Textures
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-6">
                  High-grade acrylic decorative texture mixes, granular stone layouts, interior jointing gypsum, and fillers.
                </p>
                <div className="mt-auto grid grid-cols-2 gap-3">
                  <Link
                    href="/products?search=tufit"
                    className="flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl border border-slate-200 hover:border-emerald-300 bg-white hover:bg-slate-50 text-slate-700 hover:text-emerald-600 font-bold text-xs transition-colors"
                  >
                    View Rates
                  </Link>
                  <Link
                    href="/gallery?category=Paints+%26+Coatings"
                    className="flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm hover:shadow-emerald-500/10 transition-colors"
                  >
                    View Gallery
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. About Teaser Section */}
      <section className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-video lg:aspect-square w-full rounded-2xl overflow-hidden shadow-lg bg-slate-100">
              <Image
                src="/shop-front.png"
                alt="Lakshmi Agency Hardware Store Front"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary dark:text-blue-400">About Lakshmi Agency</span>
              <h2 className="text-3xl font-extrabold text-foreground mt-2 mb-6">
                Your Trusted Supply Partner for Modern Construction
              </h2>
              <p className="text-sm text-muted-text leading-relaxed mb-6">
                Located in Sulibele, Hoskote, Lakshmi Agency is a leading supplier of building materials and hardware. We bridge the gap between premium manufacturers and your projects, ensuring you get factory-original materials at the most competitive wholesale rates.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  'Supplying cement, waterproofing chemicals, and hardware tools.',
                  'Stockist of premium CPVC, PVC, and Garden hoses.',
                  'Expert consultancy for paint formulations and waterproofing coatings.'
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-primary dark:text-blue-400 font-bold text-xs mt-0.5">✓</span>
                    <span className="text-sm text-foreground font-medium">{item}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-primary dark:text-blue-400 hover:gap-2.5 transition-all"
              >
                Learn More About Us
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Popular Products */}
      <section className="py-16 sm:py-24 bg-card-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary dark:text-blue-400">Featured Materials</span>
              <h2 className="text-3xl font-extrabold text-foreground mt-2">
                Popular Products
              </h2>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1 text-sm font-bold text-primary dark:text-blue-400 hover:text-primary-hover"
            >
              Full Catalogue
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse bg-slate-100 dark:bg-slate-800 h-[320px] rounded-2xl" />
              ))}
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
      </section>

      {/* 5. Call To Action (WhatsApp Inquiry & Contact) */}
      <section className="py-20 bg-slate-900 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500 via-slate-900 to-slate-950" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 leading-tight">Need a Wholesale Quote or Custom Order?</h2>
          <p className="text-slate-400 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
            Get instant price estimates and product availability directly from our store coordinators on WhatsApp or phone. No sign-ups needed.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="https://wa.me/916361033361?text=Hello%20Lakshmi%20Agency,%20I%20am%20looking%20for%20a%20price%20quote%20for%20bulk%20construction%20materials."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3.5 px-8 rounded-xl bg-accent text-white font-bold hover:bg-accent-hover transition-colors shadow-lg shadow-green-500/20 text-base"
            >
              <MessageSquare className="w-5 h-5 fill-current" />
              Inquire on WhatsApp
            </a>
            <a
              href="tel:6361033361"
              className="flex items-center justify-center gap-2 py-3.5 px-8 rounded-xl border border-slate-700 bg-slate-800 text-white font-bold hover:bg-slate-700 transition-colors text-base"
            >
              <Phone className="w-5 h-5" />
              Call 6361033361
            </a>
          </div>
        </div>
      </section>

      {/* 6. Google Map Location */}
      <section className="h-[400px] w-full relative border-t border-card-border bg-slate-100">
        <iframe
          title="Lakshmi Agency Google Map Location"
          src="https://maps.google.com/maps?q=13.186937,77.801894&z=17&output=embed"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>

      {/* Product Details Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
