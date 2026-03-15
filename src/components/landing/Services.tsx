"use client"

import React from 'react';
import { Shield, Plane, Users, Briefcase, Zap, Globe } from 'lucide-react';

const services = [
  { 
    title: 'Distribution Commerciale', 
    desc: 'Gestion complète de votre inventaire et réseau de ventes.', 
    icon: Globe,
    color: 'bg-adl-sky/20 text-adl-sky' 
  },
  { 
    title: 'Jet Privé & Affrètement', 
    desc: 'Solutions de vols sur mesure pour entreprises et particuliers.', 
    icon: Zap,
    color: 'bg-adl-sky/20 text-adl-sky' 
  },
  { 
    title: 'Supervision de Vols', 
    desc: 'Contrôle opérationnel total sur le tarmac et en escale.', 
    icon: Shield,
    color: 'bg-adl-sky/20 text-adl-sky' 
  },
  { 
    title: 'Meet & Greet Premium', 
    desc: 'Accueil personnalisé et VIP à chaque étape de votre voyage.', 
    icon: Users,
    color: 'bg-adl-sky/20 text-adl-sky' 
  },
  { 
    title: 'Représentation GSA', 
    desc: 'Votre ambassadeur local pour le développement aérien.', 
    icon: Briefcase,
    color: 'bg-adl-sky/20 text-adl-sky' 
  },
];

export function Services() {
  return (
    <section className="py-24 bg-adl-navy">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-16">
          Pourquoi choisir ADL Fly ?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {services.map((s, idx) => (
            <div 
              key={idx} 
              className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all group"
            >
              <div className={`h-12 w-12 rounded-lg flex items-center justify-center mb-4 text-adl-navy ${s.color}`}>
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-adl-sky transition-colors">
                {s.title}
              </h3>
              <p className="text-white/70 mb-4 leading-relaxed text-sm">
                {s.desc}
              </p>
              <button className="text-adl-sky font-semibold text-sm flex items-center gap-2 hover:underline">
                En savoir plus <span>→</span>
              </button>
            </div>
          ))}
          <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col justify-center items-center text-center shadow-md">
             <h3 className="text-xl font-bold text-adl-navy mb-4">Besoin d'un service sur mesure ?</h3>
             <button className="bg-adl-navy text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-adl-navy/90 transition-colors">
               Contactez nos experts
             </button>
          </div>
        </div>
      </div>
    </section>
  );
}
