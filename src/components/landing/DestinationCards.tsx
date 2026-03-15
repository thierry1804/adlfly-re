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
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-adl-navy mb-4">
            Nos destinations <span className="text-adl-sky">depuis La Réunion</span>
          </h2>
          <p className="text-xl text-adl-gray max-w-2xl">
            Vols directs et connexions vers l'Océan Indien, l'Afrique et les Antilles avec l'expertise ADL Fly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((dest, i) => (
            <div 
              key={i}
              className="group relative h-[400px] rounded-3xl overflow-hidden cursor-pointer shadow-xl transition-all hover:scale-[1.02] hover:shadow-2xl"
            >
              {/* Background gradient (as image placeholder) */}
              <div className={`absolute inset-0 bg-gradient-to-br ${dest.gradient} bg-adl-navy/10`} />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-adl-navy/60 transition-colors duration-500" />
              
              <div className="absolute top-6 left-6">
                <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-white/20">
                  {dest.region}
                </span>
              </div>

              <div className="absolute bottom-6 left-6 right-6 flex flex-col items-start text-white">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-3xl font-extrabold">{dest.name}</h3>
                  <span className="bg-white/10 border border-white/20 px-2 py-0.5 rounded text-xs font-bold">{dest.code}</span>
                </div>
                <div className="flex items-center justify-between w-full">
                   <div className="bg-adl-gold text-adl-navy px-4 py-1.5 rounded-full font-extrabold shadow-lg">
                    À partir de {dest.price} €
                  </div>
                  <div className="opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    <ArrowRight className="h-8 w-8 text-adl-gold" />
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
