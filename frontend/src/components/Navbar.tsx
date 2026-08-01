'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);


  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-50 glass transition-theme">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo / Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Lakshmi Agency Logo"
                width={40}
                height={40}
                className="object-contain rounded-full border border-slate-200"
              />
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-primary">
                  LAKSHMI AGENCY
                </span>
                <span className="text-[10px] tracking-wider text-muted-text font-semibold uppercase leading-none mt-0.5">Building Materials & Hardware</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(link.href)
                    ? 'text-primary font-bold border-b-2 border-primary pb-1'
                    : 'text-muted-text'
                }`}
              >
                {link.name}
              </Link>
            ))}



          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">


            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-muted-text hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
              aria-label="Main menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass border-t border-slate-200 dark:border-slate-800 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2.5 rounded-md text-base font-medium transition-colors ${
                isActive(link.href)
                  ? 'bg-primary/10 text-primary font-bold'
                  : 'text-muted-text hover:bg-slate-100 hover:text-primary'
              }`}
            >
              {link.name}
            </Link>
          ))}
          
        </div>
      )}
    </nav>
  );
};
export default Navbar;
