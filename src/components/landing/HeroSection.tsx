"use client"

import React, { useState, useEffect } from 'react';
import { SearchWidget } from './SearchWidget';
import { Plane, CheckCircle, ClipboardList, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Star {
  left: string;
  top: string;
  width: string;
  height: string;
  animationDuration: string;
  animationDelay: string;
}

export function HeroSection() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    // Generate random star properties only on the client after hydration
    const generatedStars = Array.from({ length: 50 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      width: `${Math.random() * 3}px`,
      height: `${Math.random() * 3}px`,
      animationDuration: `${10 + Math.random() * 20}s`,
      animationDelay: `${-Math.random() * 20}s`
    }));
    setStars(generatedStars);
  }, []);

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-center items-center pt-20 overflow-hidden bg-adl-navy">
      {/* Background with starfield and gradient */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="star-field" />
        {stars.map((star, i) => (
          <div 
            key={i} 
            className="star" 
            style={{
              left: star.left,
              top: star.top,
              width: star.width,
              height: star.height,
              animationDuration: star.animationDuration,
              animationDelay: star.animationDelay
            }}
          />
        ))}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-adl-navy to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center flex flex-col items-center">
        <h1 className="text-hero font-extrabold text-white mb-6 animate-in fade-in slide-in-from-top duration-1000">
          Sans Limite<span className="text-adl-orange">.</span>
        </h1>
        <p className="text-xl md:text-2xl text-white/80 max-w-3xl mb-12 font-medium animate-in fade-in slide-in-from-top duration-1000 delay-200">
          Votre agent général aérien depuis La Réunion.<br />
          <span className="text-adl-sky">Réunion · Mayotte · Madagascar · Martinique · Guadeloupe</span>
        </p>

        {/* Quick Actions */}
        <div className="flex flex-wrap justify-center gap-4 mb-16 animate-in fade-in slide-in-from-top duration-1000 delay-300">
          <Button variant="outline" className="rounded-full border-white/20 text-white bg-white/5 hover:bg-white/10 px-6 py-6 h-auto">
            <CheckCircle className="mr-2 h-5 w-5 text-adl-orange" />
            Check-in en ligne
          </Button>
          <Button variant="outline" className="rounded-full border-white/20 text-white bg-white/5 hover:bg-white/10 px-6 py-6 h-auto">
            <ClipboardList className="mr-2 h-5 w-5 text-adl-orange" />
            Gérer ma réservation
          </Button>
          <Button variant="outline" className="rounded-full border-white/20 text-white bg-white/5 hover:bg-white/10 px-6 py-6 h-auto">
            <Search className="mr-2 h-5 w-5 text-adl-orange" />
            Suivi de vol
          </Button>
        </div>

        <SearchWidget />
      </div>

      {/* Subtle bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
}
