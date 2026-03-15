"use client"

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FlightCard } from '@/components/results/FlightCard';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Filter, Search, ChevronDown, Plane } from 'lucide-react';

function ResultsContent() {
  const searchParams = useSearchParams();
  const [flights, setFlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFlights = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/amadeus/flight-offers?${searchParams.toString()}`);
        if (!res.ok) throw new Error('Erreur lors de la récupération des vols');
        const data = await res.json();
        setFlights(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (searchParams.get('originCode')) {
      fetchFlights();
    }
  }, [searchParams]);

  const origin = searchParams.get('originCode');
  const dest = searchParams.get('destinationCode');
  const date = searchParams.get('departureDate');

  return (
    <div className="min-h-screen bg-white pt-24 pb-12">
      <div className="container mx-auto px-6">
        {/* Summary Bar - style Corsair */}
        <div className="bg-adl-navy rounded-xl p-6 text-white mb-8 shadow-md flex flex-wrap items-center justify-between gap-6">
           <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-white/10 flex items-center justify-center">
                <Search className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xl font-black uppercase tracking-tight">
                  {origin} <span className="text-adl-sky mx-2">→</span> {dest}
                </div>
                <div className="text-sm font-medium text-white/60">{date} • {searchParams.get('adults')} Passager(s)</div>
              </div>
           </div>
           <Button variant="outline" className="border-white/30 text-white rounded-lg hover:bg-white/10">
             Modifier ma recherche
           </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-3 space-y-6">
             <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-extrabold text-adl-navy flex items-center gap-2">
                    <Filter className="h-4 w-4" /> Filtres
                  </h3>
                  <button className="text-xs font-bold text-adl-sky uppercase tracking-widest hover:underline">Réinitialiser</button>
                </div>
                
                <div className="space-y-8">
                  <div>
                    <Label className="text-adl-navy font-bold mb-4 block">Prix maximum</Label>
                    <input type="range" className="w-full accent-adl-navy" min="0" max="2000" />
                    <div className="flex justify-between text-xs font-bold text-adl-gray mt-2">
                      <span>0 €</span>
                      <span>2000 €</span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-adl-navy font-bold mb-4 block">Escales</Label>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" className="h-5 w-5 rounded border-gray-300 text-adl-navy" />
                        <span className="text-sm font-medium text-adl-navy group-hover:text-adl-sky">Direct uniquement</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" className="h-5 w-5 rounded border-gray-300 text-adl-navy" />
                        <span className="text-sm font-medium text-adl-navy group-hover:text-adl-sky">1 escale max.</span>
                      </label>
                    </div>
                  </div>
                </div>
             </div>
          </div>

          {/* Results List */}
          <div className="lg:col-span-9">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-adl-navy">
                {flights.length} vols <span className="text-adl-sky">trouvés</span>
              </h2>
              <div className="flex items-center gap-2 text-sm font-bold text-adl-gray">
                Trier par : 
                <button className="flex items-center gap-1 text-adl-navy">Meilleur prix <ChevronDown className="h-4 w-4" /></button>
              </div>
            </div>

            {loading ? (
              <div className="space-y-6">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-48 w-full rounded-xl bg-white shadow-md border border-gray-200" />
                ))}
              </div>
            ) : error ? (
              <div className="bg-white rounded-xl p-12 text-center shadow-md border border-gray-200">
                <div className="h-20 w-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-6">
                  <Plane className="h-10 w-10 rotate-45" />
                </div>
                <h3 className="text-2xl font-black text-adl-navy mb-2">Oops !</h3>
                <p className="text-adl-gray mb-8">{error}</p>
                <Button onClick={() => window.location.reload()} className="bg-adl-navy rounded-lg px-8">Réessayer</Button>
              </div>
            ) : flights.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center shadow-md border border-gray-200">
                 <div className="h-24 w-24 bg-gray-100 text-adl-sky rounded-lg flex items-center justify-center mx-auto mb-6">
                  <Plane className="h-12 w-12" />
                </div>
                <h3 className="text-2xl font-bold text-adl-navy mb-2">Aucun vol disponible</h3>
                <p className="text-adl-gray mb-8">Essayez de modifier vos dates ou destinations.</p>
                <Button onClick={() => window.history.back()} className="bg-adl-navy rounded-lg px-8">Retour</Button>
              </div>
            ) : (
              flights.map((offer) => (
                <FlightCard 
                  key={offer.id} 
                  offer={offer} 
                  onSelect={(o) => {
                    sessionStorage.setItem('selectedOffer', JSON.stringify(o));
                    window.location.href = `/booking`;
                  }} 
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const Label = ({ children, className, ...props }: any) => <label className={className} {...props}>{children}</label>;

export default function ResultsPage() {
  return (
    <main>
      <Header />
      <Suspense fallback={<div className="pt-24 text-center">Chargement des résultats...</div>}>
        <ResultsContent />
      </Suspense>
      <Footer />
    </main>
  );
}
