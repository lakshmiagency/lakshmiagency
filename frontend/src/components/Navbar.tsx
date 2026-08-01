'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useDarkMode } from '../context/DarkModeContext';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

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
            <Link href="/" className="flex flex-col">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-primary dark:text-white flex items-center gap-2">
                <span className="bg-primary text-white px-2 py-0.5 rounded-md font-extrabold text-sm sm:text-base">LA</span>
                LAKSHMI AGENCY
              </span>
              <span className="text-[10px] tracking-wider text-muted-text font-semibold uppercase">Building Materials & Hardware</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary dark:hover:text-white ${
                  isActive(link.href)
                    ? 'text-primary dark:text-white font-bold border-b-2 border-primary dark:border-white pb-1'
                    : 'text-muted-text'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-muted-text hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5" />}
            </button>

          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-muted-text hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5" />}
            </button>

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
                  ? 'bg-primary/10 text-primary dark:bg-white/10 dark:text-white font-bold'
                  : 'text-muted-text hover:bg-slate-100 dark:hover:bg-slate-800/40 hover:text-primary dark:hover:text-white'
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
