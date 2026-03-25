"use client"

import React from 'react';
import { SearchWidget } from './SearchWidget';
import { CheckCircle, ClipboardList, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HERO_VIDEO_SRC = 'https://adlfly.re/wp-content/uploads/2023/02/nuage-48501.mp4';

export function HeroSection() {
  return (
    <section className="relative min-h-screen w-full flex flex-col justify-center items-center pt-20 bg-adl-navy">
      {/* Background: nuages video + overlay pour lisibilité */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden
        >
          <source src={HERO_VIDEO_SRC} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-adl-navy/70" aria-hidden />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-adl-navy to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center flex flex-col items-center">
        <h1 className="text-hero font-extrabold text-white mb-6 animate-in fade-in slide-in-from-top duration-1000">
          Vols au départ de La Réunion<span className="text-adl-sky">.</span>
        </h1>
        <p className="text-xl md:text-2xl text-white/90 max-w-3xl mb-12 font-medium animate-in fade-in slide-in-from-top duration-1000 delay-200">
          Réservez votre vol vers l'océan Indien, les Antilles ou l'Afrique avec ADL Fly.<br />
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
    </section>
  );
}
