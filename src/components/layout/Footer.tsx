"use client"

import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/logo';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, ArrowRight } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-adl-navy text-white pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Logo />
            <p className="text-white/50 leading-relaxed">
              ADL Fly, votre Agent Général Aérien basé à La Réunion. Expertise, réactivité et passion au service de votre voyage.
            </p>
            <div className="flex gap-4">
              <a href="#" className="h-10 w-10 rounded-lg bg-adl-navy/80 flex items-center justify-center hover:bg-adl-sky transition-colors border border-white/10">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-lg bg-adl-navy/80 flex items-center justify-center hover:bg-adl-sky transition-colors border border-white/10">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-lg bg-adl-navy/80 flex items-center justify-center hover:bg-adl-sky transition-colors border border-white/10">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-lg bg-adl-navy/80 flex items-center justify-center hover:bg-adl-sky transition-colors border border-white/10">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Navigation</h4>
            <ul className="space-y-4 text-white/50">
              <li><Link href="#" className="hover:text-white transition-colors">Nos destinations</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Nos vols directs</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Services premium</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Check-in</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Mon compte</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Informations</h4>
            <ul className="space-y-4 text-white/50">
              <li><Link href="#" className="hover:text-white transition-colors">À propos de ADL Fly</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Nos bureaux</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Actualités</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Recrutement</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Contactez-nous</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-lg font-bold mb-6">Contact</h4>
            <div className="flex items-center gap-4 text-white/50">
              <Phone className="h-5 w-5 text-adl-sky" />
              <span>+262 2 62 66 62 37</span>
            </div>
            <div className="flex items-center gap-4 text-white/50">
              <Mail className="h-5 w-5 text-adl-sky" />
              <span>contact@adlfly.re</span>
            </div>
            <div className="mt-8">
              <h5 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4">S'inscrire à la newsletter</h5>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Votre email" 
                  className="bg-white/5 border border-white/10 rounded-full px-4 py-2 flex-1 focus:outline-none focus:ring-1 focus:ring-adl-navy"
                />
                <button className="bg-adl-navy p-2 rounded-lg hover:bg-adl-navy/90 transition-colors">
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-white/30 font-medium">
          <div className="flex gap-8">
            <Link href="#" className="hover:text-white">Mentions Légales</Link>
            <Link href="#" className="hover:text-white">CGV</Link>
            <Link href="#" className="hover:text-white">Politique de confidentialité</Link>
          </div>
          <div>© ADL FLY 2025 - Sans Limite.</div>
        </div>
      </div>
    </footer>
  );
}
