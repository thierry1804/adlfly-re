"use client"

import React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const destinations = [
  { name: 'La Réunion', code: 'RUN', region: 'Océan Indien', price: '499', gradient: 'from-emerald-500/20 to-adl-sky/20' },
  { name: 'Mayotte', code: 'DZA', region: 'Canal du Mozambique', price: '389', gradient: 'from-blue-500/20 to-adl-sky/20' },
  { name: 'Madagascar', code: 'TNR', region: 'Océan Indien', price: '429', gradient: 'from-orange-500/20 to-red-500/20' },
  { name: 'Paris', code: 'CDG', region: 'Europe', price: '549', gradient: 'from-indigo-500/20 to-purple-500/20' },
  { name: 'Martinique', code: 'FDF', region: 'Antilles', price: '699', gradient: 'from-teal-500/20 to-emerald-500/20' },
  { name: 'Guadeloupe', code: 'PTP', region: 'Antilles', price: '719', gradient: 'from-cyan-500/20 to-blue-500/20' },
];

export function DestinationCards() {
  return (
    <section id="destinations" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-adl-navy mb-4">
            Les meilleures offres ADL Fly
          </h2>
          <p className="text-lg text-adl-gray max-w-2xl">
            Réservez votre vol en tout confiance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((dest, i) => (
            <div 
              key={i}
              className="group relative h-[360px] rounded-xl overflow-hidden cursor-pointer shadow-md transition-all hover:shadow-lg border border-gray-200"
            >
              {/* Background gradient (as image placeholder) */}
              <div className={`absolute inset-0 bg-gradient-to-br ${dest.gradient} bg-adl-navy/10`} />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-adl-navy/50 transition-colors duration-300" />
              
              <div className="absolute top-4 left-4">
                <span className="bg-white/90 text-adl-navy text-xs font-semibold px-3 py-1 rounded-lg">
                  {dest.region}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex flex-col items-start text-white">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-2xl font-bold">{dest.name}</h3>
                  <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-medium">{dest.code}</span>
                </div>
                <div className="flex items-center justify-between w-full">
                   <span className="text-lg font-bold text-white">
                    À partir de <strong>{dest.price} €</strong>
                  </span>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="h-6 w-6 text-adl-sky" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
