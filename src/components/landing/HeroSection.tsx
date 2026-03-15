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
          Vols au départ de La Réunion<span className="text-adl-sky">.</span>
        </h1>
        <p className="text-xl md:text-2xl text-white/90 max-w-3xl mb-12 font-medium animate-in fade-in slide-in-from-top duration-1000 delay-200">
          Réservez votre billet vers l'océan Indien, les Antilles ou l'Afrique.<br />
          <span className="text-adl-sky">Réunion · Mayotte · Madagascar · Martinique · Guadeloupe</span>
        </p>

        {/* Quick Actions - style Corsair (coins arrondis, fond discret) */}
        <div className="flex flex-wrap justify-center gap-4 mb-16 animate-in fade-in slide-in-from-top duration-1000 delay-300">
          <Button variant="outline" className="rounded-lg border-white/30 text-white bg-white/5 hover:bg-white/10 px-5 py-3 h-auto text-sm font-medium">
            <CheckCircle className="mr-2 h-4 w-4 text-adl-sky" />
            Check-in en ligne
          </Button>
          <Button variant="outline" className="rounded-lg border-white/30 text-white bg-white/5 hover:bg-white/10 px-5 py-3 h-auto text-sm font-medium">
            <ClipboardList className="mr-2 h-4 w-4 text-adl-sky" />
            Gérer ma réservation
          </Button>
          <Button variant="outline" className="rounded-lg border-white/30 text-white bg-white/5 hover:bg-white/10 px-5 py-3 h-auto text-sm font-medium">
            <Search className="mr-2 h-4 w-4 text-adl-sky" />
            Suivi de vol
          </Button>
        </div>

        <SearchWidget />
      </div>

      {/* Transition vers section suivante */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-adl-navy to-transparent z-10" />
    </section>
  );
}
