"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import { Menu, Globe, User, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Destinations', href: '#' },
    { name: 'Nos vols', href: '#' },
    { name: 'Services', href: '#' },
    { name: 'Gérer ma réservation', href: '#' },
    { name: 'Check-in', href: '#' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4',
        isScrolled 
          ? 'bg-adl-navy/90 backdrop-blur-md shadow-lg py-3' 
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/">
          <Logo className="h-8 md:h-10" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href}
              className="text-sm font-semibold text-white/90 hover:text-adl-orange transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hidden sm:flex">
            <Globe className="h-5 w-5" />
          </Button>
          <Button variant="outline" className="hidden lg:flex border-white/20 text-white hover:bg-white/10 rounded-full">
            <User className="h-4 w-4 mr-2" />
            Mon compte
          </Button>
          <Link href="/results">
            <Button className="bg-adl-orange hover:bg-adl-orange/90 text-white rounded-full px-6 font-bold shadow-lg transition-transform hover:scale-105">
              Réserver
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-adl-navy border-t border-white/10 p-6 flex flex-col gap-4 animate-in slide-in-from-top duration-300">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href}
              className="text-lg font-bold text-white hover:text-adl-orange py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <Button variant="outline" className="w-full border-white/20 text-white rounded-full mt-4">
            <User className="h-4 w-4 mr-2" />
            Mon compte
          </Button>
        </div>
      )}
    </header>
  );
}
