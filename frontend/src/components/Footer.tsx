import React from 'react';
import Link from 'next/link';
import { Phone, MapPin, Clock, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 transition-theme">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Bio */}
          <div className="space-y-4 md:col-span-1">
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="bg-blue-600 text-white px-2 py-0.5 rounded-md font-extrabold text-sm">LA</span>
              LAKSHMI AGENCY
            </span>
            <p className="text-sm text-slate-400 leading-relaxed">
              Wholesale & retail suppliers of building materials, hardware, paints, plumbing, and cement products. Serving Bangalore Rural construction needs with trust and quality since inception.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold bg-slate-800/40 p-2.5 rounded-lg border border-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              100% Direct Brand Supply
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Quick Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">Products Catalogue</Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-white transition-colors">Categories</Link>
              </li>
              <li>
                <Link href="/price-list" className="hover:text-white transition-colors">Price List Table</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">Contact & Map</Link>
              </li>
            </ul>
          </div>

          {/* Store Hours */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Business Hours</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="block text-white font-medium">Monday - Saturday</span>
                  <span className="text-xs">8:30 AM - 8:30 PM</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="block text-white font-medium">Sunday</span>
                  <span className="text-xs text-red-400">Closed</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Contact Details</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4.5 h-4.5 text-blue-500 mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed text-xs">
                  College Main Road, Sulibele,<br />
                  Hoskote Taluk, Bangalore Rural,<br />
                  Karnataka - 562129
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="block text-white font-medium">Phone Numbers</span>
                  <div className="flex flex-col gap-0.5 text-xs">
                    <a href="tel:9481252271" className="hover:text-white transition-colors">9481252271</a>
                    <a href="tel:6361033361" className="hover:text-white transition-colors">6361033361</a>
                    <a href="tel:9008157128" className="hover:text-white transition-colors">9008157128</a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>&copy; {currentYear} Lakshmi Agency. All rights reserved.</p>
          <div className="mt-4 sm:mt-0 flex gap-4 text-slate-600">
            <span>Sulibele, Bangalore Rural</span>
            <span>•</span>
            <span>Catalogue Website</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
