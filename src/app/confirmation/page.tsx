"use client"

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Plane, Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ConfirmationPage() {
  const [ref, setRef] = useState('');

  useEffect(() => {
    const randomRef = 'ADL-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    setRef(randomRef);
  }, []);

  return (
    <main className="min-h-screen bg-adl-light">
      <Header />
      
      <div className="pt-40 pb-24 container mx-auto px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-[3rem] p-12 shadow-2xl border border-adl-light relative overflow-hidden">
             {/* Background Pattern */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-adl-orange/10 rounded-bl-[5rem]" />
             
             <div className="relative z-10">
                <div className="h-24 w-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-in zoom-in duration-500 shadow-xl shadow-emerald-500/30">
                  <CheckCircle2 className="h-12 w-12 text-white" />
                </div>
                
                <h1 className="text-4xl font-black text-adl-navy mb-4">C'est confirmé !</h1>
                <p className="text-adl-gray text-lg mb-8">Votre réservation pour votre prochain voyage est validée. Préparez vos valises !</p>
                
                <div className="bg-adl-navy rounded-2xl p-6 text-white mb-10 text-left">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-white/50">Référence dossier</span>
                    <span className="text-xl font-black text-adl-orange">{ref}</span>
                  </div>
                  <div className="flex items-center gap-4 py-4 border-t border-white/10">
                    <div className="h-10 w-10 bg-white/5 rounded-full flex items-center justify-center">
                      <Mail className="h-5 w-5 text-adl-sky" />
                    </div>
                    <p className="text-sm font-medium text-white/80">Un email de confirmation avec vos billets électroniques a été envoyé à votre adresse.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button asChild className="bg-adl-navy hover:bg-adl-navy/90 text-white rounded-full h-14 font-bold">
                    <Link href="/">Gérer ma réservation</Link>
                  </Button>
                  <Button asChild variant="outline" className="border-adl-light text-adl-navy hover:bg-adl-light rounded-full h-14 font-bold">
                    <Link href="/">Retour à l'accueil</Link>
                  </Button>
                </div>
             </div>
          </div>

          <div className="mt-12 flex items-center justify-center gap-2 text-adl-sky font-bold">
            <Plane className="h-5 w-5" />
            <span>Besoin d'un accueil VIP ? Meet & Greet disponible à l'arrivée.</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
