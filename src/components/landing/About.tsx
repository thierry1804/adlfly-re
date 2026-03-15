"use client"

import React from 'react';
import Link from 'next/link';
import { Users, Plane } from 'lucide-react';

export function About() {
  return (
    <section id="a-propos" className="py-24 bg-adl-navy text-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Qui sommes-nous ?
        </h2>
        <p className="text-white/70 max-w-2xl mb-12 text-lg">
          ADL Fly est un partenaire 360° pour tous les services liés à l'aviation. Fort de plus de 20 ans d'expérience dans le secteur aérien, nous accompagnons les compagnies et les voyageurs sur l'océan Indien et les outre-mer.
        </p>

        <div className="flex flex-wrap gap-8 items-center">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-xl flex items-center justify-center bg-white/10 text-adl-sky">
              <Users className="h-7 w-7" />
            </div>
            <div>
              <span className="text-3xl font-bold block">35</span>
              <span className="text-white/60 text-sm">collaborateurs</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-xl flex items-center justify-center bg-white/10 text-adl-sky">
              <Plane className="h-7 w-7" />
            </div>
            <div>
              <span className="text-3xl font-bold block">20+</span>
              <span className="text-white/60 text-sm">ans dans l'aérien</span>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-16 border-t border-white/10">
          <Link
            href="#contact"
            className="inline-flex items-center gap-2 text-adl-sky font-semibold hover:underline"
          >
            Nous contacter pour un projet
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
