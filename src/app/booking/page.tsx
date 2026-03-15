"use client"

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Plane, CreditCard, User, Luggage } from 'lucide-react';

export default function BookingPage() {
  const [offer, setOffer] = useState<any>(null);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const saved = sessionStorage.getItem('selectedOffer');
    if (saved) setOffer(JSON.parse(saved));
  }, []);

  if (!offer) return <div className="pt-32 text-center font-bold">Chargement de votre réservation...</div>;

  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      <div className="pt-32 pb-24 container mx-auto px-6">
        {/* Stepper */}
        <div className="max-w-4xl mx-auto flex items-center justify-between mb-12">
          {[
            { id: 1, label: 'Passagers', icon: User },
            { id: 2, label: 'Paiement', icon: CreditCard },
            { id: 3, label: 'Confirmation', icon: CheckCircle2 }
          ].map((s) => (
            <div key={s.id} className="flex flex-col items-center gap-3 relative flex-1">
               <div className={`h-12 w-12 rounded-lg flex items-center justify-center border-2 transition-all ${
                 step >= s.id ? 'bg-adl-navy border-adl-navy text-white' : 'bg-white border-gray-200 text-adl-gray'
               }`}>
                 <s.icon className="h-5 w-5" />
               </div>
               <span className={`text-xs font-bold uppercase tracking-widest ${
                 step >= s.id ? 'text-adl-navy' : 'text-adl-gray'
               }`}>{s.label}</span>
               {s.id < 3 && <div className={`absolute top-6 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 ${step > s.id ? 'bg-adl-navy' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
          {/* Main Form */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-xl p-8 shadow-md border border-gray-200">
              <h2 className="text-3xl font-black text-adl-navy mb-8">Informations <span className="text-adl-sky">Passager</span></h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="font-bold text-adl-navy">Civilité</Label>
                    <select className="w-full bg-gray-50 border border-gray-200 h-12 rounded-lg px-4 font-medium focus:ring-2 focus:ring-adl-navy">
                      <option>M.</option>
                      <option>Mme</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="font-bold text-adl-navy">Prénom</Label>
                    <Input placeholder="Jean" className="bg-gray-50 border border-gray-200 h-12 rounded-lg px-4 font-medium" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-adl-navy">Nom</Label>
                    <Input placeholder="Dupont" className="bg-gray-50 border border-gray-200 h-12 rounded-lg px-4 font-medium" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                    <Label className="font-bold text-adl-navy">Email</Label>
                    <Input type="email" placeholder="jean.dupont@email.com" className="bg-gray-50 border border-gray-200 h-12 rounded-lg px-4 font-medium" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-adl-navy">Téléphone</Label>
                    <Input placeholder="+262 6 92 00 00 00" className="bg-gray-50 border border-gray-200 h-12 rounded-lg px-4 font-medium" />
                  </div>
                </div>

                <div className="pt-8 border-t border-gray-200">
                   <Button 
                    onClick={() => window.location.href='/confirmation'}
                    className="w-full bg-adl-navy hover:bg-adl-navy/90 text-white text-lg font-bold h-14 rounded-lg shadow-md"
                   >
                     Procéder au paiement ({offer.price.total} €)
                   </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-4">
            <div className="bg-adl-navy rounded-xl p-6 text-white shadow-md sticky top-32">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Plane className="h-5 w-5 text-adl-sky" /> Récapitulatif
              </h3>
              
              <div className="space-y-6">
                <div className="flex justify-between items-start pb-6 border-b border-white/10">
                  <div>
                    <div className="text-sm font-bold text-adl-sky uppercase tracking-widest mb-1">Itinéraire</div>
                    <div className="text-lg font-black">{offer.itineraries[0].segments[0].departure.iataCode} → {offer.itineraries[0].segments[offer.itineraries[0].segments.length-1].arrival.iataCode}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-adl-sky uppercase tracking-widest mb-1">Vol</div>
                    <div className="font-bold">{offer.itineraries[0].segments[0].carrierCode} {offer.itineraries[0].segments[0].number}</div>
                  </div>
                </div>

                <div className="space-y-4">
                   <div className="flex justify-between items-center text-sm">
                      <span className="text-white/60">Prix du billet</span>
                      <span className="font-bold">{(parseFloat(offer.price.total) * 0.85).toFixed(2)} €</span>
                   </div>
                   <div className="flex justify-between items-center text-sm">
                      <span className="text-white/60">Taxes et frais</span>
                      <span className="font-bold">{(parseFloat(offer.price.total) * 0.15).toFixed(2)} €</span>
                   </div>
                   <div className="flex justify-between items-center text-xl font-bold pt-4 border-t border-white/10 text-white">
                      <span>Total TTC</span>
                      <span>{offer.price.total} €</span>
                   </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 flex items-center gap-3">
                   <Luggage className="h-5 w-5 text-adl-sky" />
                   <span className="text-xs font-medium text-white/60">Bagage cabine (10kg) et bagage soute (23kg) inclus par passager.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
