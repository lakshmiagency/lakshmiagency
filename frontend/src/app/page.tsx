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
  id: number;
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
            src="https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=1600&auto=format&fit=crop&q=80"
            alt="Hardware building materials background"
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

      {/* 3. About Teaser Section */}
      <section className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-video lg:aspect-square w-full rounded-2xl overflow-hidden shadow-lg bg-slate-100">
              <Image
                src="https://images.unsplash.com/photo-1530124560072-a059b014b666?w=800&auto=format&fit=crop&q=80"
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
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3885.503714578135!2d77.8931102!3d13.1306059!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae16ff2aaaaaab%3A0xe54df6373b9e4a5e!2sCollege%20Main%20Road%2C%20Sulibele%2C%20Karnataka%20562129!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
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
