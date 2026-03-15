"use client"

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MessageSquare } from 'lucide-react';

export function ContactSection() {
  return (
    <section id="contact" className="py-24 bg-adl-navy text-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Contact commercial
        </h2>
        <p className="text-white/70 max-w-2xl mb-16 text-lg">
          Compagnies aériennes, opérateurs, entreprises : parlons de votre projet. Notre équipe vous répond sous 2 heures.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <a
            href="mailto:contact@adlfly.re"
            className="flex items-center gap-4 p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors group"
          >
            <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-adl-sky/20 text-adl-sky group-hover:bg-adl-sky/30 transition-colors">
              <Mail className="h-6 w-6" />
            </div>
            <div>
              <span className="text-white/60 text-sm block mb-1">Email</span>
              <span className="font-semibold text-white">contact@adlfly.re</span>
            </div>
          </a>
          <a
            href="tel:+262262666237"
            className="flex items-center gap-4 p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors group"
          >
            <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-adl-sky/20 text-adl-sky group-hover:bg-adl-sky/30 transition-colors">
              <Phone className="h-6 w-6" />
            </div>
            <div>
              <span className="text-white/60 text-sm block mb-1">Téléphone</span>
              <span className="font-semibold text-white">+262 2 62 66 62 37</span>
            </div>
          </a>
          <Link
            href="#contact"
            className="flex items-center gap-4 p-6 bg-adl-orange/20 border border-adl-orange/40 rounded-xl hover:bg-adl-orange/30 transition-colors group"
          >
            <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-adl-orange/30 text-adl-orange group-hover:bg-adl-orange/40 transition-colors">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <span className="text-white/80 text-sm block mb-1">Demande</span>
              <span className="font-semibold text-white">Demande commerciale</span>
            </div>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-8 border-t border-white/10">
          <p className="text-white/60 text-sm">
            Réservation de billets, check-in et suivi de vol : utilisez la recherche ci-dessus ou le bouton Réserver.
          </p>
          <Link
            href="/results"
            className="text-adl-sky font-semibold hover:underline shrink-0"
          >
            Réserver un vol →
          </Link>
        </div>
      </div>
    </section>
  );
}
