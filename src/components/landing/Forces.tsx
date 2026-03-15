"use client"

import React from 'react';
import { Award, Globe, Layers, Clock } from 'lucide-react';

const forces = [
  {
    title: 'Expertise',
    desc: "Plus de 50 ans d'expérience cumulée au sein de l'équipe de direction.",
    icon: Award,
  },
  {
    title: 'Dimension internationale',
    desc: 'Déploiement possible sur tous les territoires du monde.',
    icon: Globe,
  },
  {
    title: 'Adaptabilité',
    desc: "Pas de limite : nous nous adaptons à vos besoins et à votre cahier des charges.",
    icon: Layers,
  },
  {
    title: 'Réactivité',
    desc: 'Décisions prises en moins de 2 heures pour avancer vite.',
    icon: Clock,
  },
];

export function Forces() {
  return (
    <section id="forces" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-adl-navy mb-4">
          Nos forces
        </h2>
        <p className="text-lg text-adl-gray max-w-2xl mb-16">
          Ce qui distingue ADL Fly : une équipe expérimentée, une couverture large et une réactivité de terrain.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {forces.map((f, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-xl p-6 bg-white hover:border-adl-sky/30 transition-colors"
            >
              <div className="h-12 w-12 rounded-lg flex items-center justify-center mb-4 bg-adl-sky/10 text-adl-sky">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-adl-navy mb-2">
                {f.title}
              </h3>
              <p className="text-adl-gray text-sm leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
