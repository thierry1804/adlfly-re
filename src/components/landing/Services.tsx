"use client"

import React from 'react';
import { Shield, Plane, Users, Briefcase, Zap, Globe } from 'lucide-react';

const services = [
  { 
    title: 'Distribution Commerciale', 
    desc: 'Gestion complète de votre inventaire et réseau de ventes.', 
    icon: Globe,
    color: 'bg-blue-500/10 text-blue-500' 
  },
  { 
    title: 'Jet Privé & Affrètement', 
    desc: 'Solutions de vols sur mesure pour entreprises et particuliers.', 
    icon: Zap,
    color: 'bg-adl-orange/10 text-adl-orange' 
  },
  { 
    title: 'Supervision de Vols', 
    desc: 'Contrôle opérationnel total sur le tarmac et en escale.', 
    icon: Shield,
    color: 'bg-adl-sky/10 text-adl-sky' 
  },
  { 
    title: 'Meet & Greet Premium', 
    desc: 'Accueil personnalisé et VIP à chaque étape de votre voyage.', 
    icon: Users,
    color: 'bg-adl-gold/10 text-adl-gold' 
  },
  { 
    title: 'Représentation GSA', 
    desc: 'Votre ambassadeur local pour le développement aérien.', 
    icon: Briefcase,
    color: 'bg-purple-500/10 text-purple-500' 
  },
];

export function Services() {
  return (
    <section className="py-24 bg-adl-navy">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-16">
          Une expertise <span className="text-adl-orange">à 360°</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {services.map((s, idx) => (
            <div 
              key={idx} 
              className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all group"
            >
              <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-6 ${s.color}`}>
                <s.icon className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-adl-orange transition-colors">
                {s.title}
              </h3>
              <p className="text-white/60 mb-6 leading-relaxed">
                {s.desc}
              </p>
              <button className="text-adl-gold font-bold text-sm uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all">
                En savoir plus <span>→</span>
              </button>
            </div>
          ))}
          <div className="bg-adl-orange rounded-3xl p-8 flex flex-col justify-center items-center text-center">
             <h3 className="text-2xl font-black text-white mb-4">Besoin d'un service sur mesure ?</h3>
             <button className="bg-white text-adl-navy font-bold px-8 py-3 rounded-full hover:scale-105 transition-transform">
               Contactez nos experts
             </button>
          </div>
        </div>
      </div>
    </section>
  );
}
