'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Target, Eye, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function AboutPage() {
  const storeImages = [
    {
      url: 'https://images.unsplash.com/photo-1530124560072-a059b014b666?w=600&auto=format&fit=crop&q=70',
      title: 'Premium Tools and Anchors Section'
    },
    {
      url: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=600&auto=format&fit=crop&q=70',
      title: 'Plumbing CPVC and PVC pipes'
    },
    {
      url: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&auto=format&fit=crop&q=70',
      title: 'Paint Accessories and Tinting Mixer'
    },
    {
      url: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?w=600&auto=format&fit=crop&q=70',
      title: 'Waterproofing Chemical Warehouse'
    }
  ];

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="text-xs sm:text-sm text-muted-text mb-6">
          <span className="hover:text-foreground"><Link href="/">Home</Link></span>
          <span className="mx-2">/</span>
          <span className="text-foreground font-bold">About Us</span>
        </nav>

        {/* Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-primary dark:text-blue-400">Our Story</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mt-2 mb-6">
            Lakshmi Agency — The Construction Supply Standard
          </h1>
          <p className="text-base sm:text-lg text-muted-text leading-relaxed">
            For years, builders, developers, and homeowners in Bangalore Rural have trusted Lakshmi Agency for their hardware, plumbing, paint, and cement requirements. We specialize in supply coordination, wholesale supply, and retail distribution directly from major manufacturers.
          </p>
        </div>

        {/* Story details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Why We Exist</h2>
            <p className="text-sm text-muted-text leading-relaxed">
              Construction and paint works demand reliability. Substandard PVC pipes, unverified cement bags, or poor quality wall primers can compromise structures and finishes. Lakshmi Agency was founded to solve this supply gap in the Hoskote region by assuring 100% genuine brand supply at competitive pricing.
            </p>
            <p className="text-sm text-muted-text leading-relaxed">
              By working as direct authorized distributors/retailers, we eliminate middle layers, allowing local builders to source products like JK Cement, Asian Paints, Finolex, and Dr. Fixit waterproofing systems quickly and transparently.
            </p>
            
            {/* Value cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex gap-3 bg-card-bg border border-card-border p-4 rounded-xl">
                <ShieldCheck className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <span className="block font-bold text-foreground text-sm">Genuine Supply</span>
                  <span className="text-xs text-muted-text">Direct manufacturer invoices.</span>
                </div>
              </div>
              <div className="flex gap-3 bg-card-bg border border-card-border p-4 rounded-xl">
                <HeartHandshake className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <span className="block font-bold text-foreground text-sm">Consultative Selling</span>
                  <span className="text-xs text-muted-text">Technical experts guide you.</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative aspect-video lg:aspect-square w-full rounded-2xl overflow-hidden shadow-md">
            <Image
              src="https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=800&auto=format&fit=crop&q=80"
              alt="Cement bag supplies"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="bg-primary/5 dark:bg-blue-900/10 border border-primary/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center mb-6">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Our Mission</h3>
              <p className="text-sm text-muted-text leading-relaxed mb-6">
                To streamline building material supply chains in Bangalore Rural by delivering 100% authentic products at wholesale rates. We strive to be the ultimate point of trust for commercial builders and independent homeowners alike.
              </p>
            </div>
            <span className="text-xs font-semibold text-primary dark:text-blue-400">QUALITY • INTEGRITY • SPEED</span>
          </div>

          <div className="bg-slate-100/50 dark:bg-slate-900/30 border border-card-border rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center mb-6">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Our Vision</h3>
              <p className="text-sm text-muted-text leading-relaxed mb-6">
                To become the premier building material supplier in Bangalore, recognized for our commitment to customer support, transparent price disclosures, and extensive product availability spanning cements, chemicals, paints, and hardware.
              </p>
            </div>
            <span className="text-xs font-semibold text-muted-text">FORWARD-THINKING PARTNERSHIP</span>
          </div>
        </div>

        {/* Store showcase gallery */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary dark:text-blue-400">Inventory Showcase</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-2 mb-8">Our Warehouses & Store</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {storeImages.map((img, index) => (
              <div key={index} className="group relative aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-card-border">
                <Image
                  src={img.url}
                  alt={img.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-xs text-white font-bold">{img.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
