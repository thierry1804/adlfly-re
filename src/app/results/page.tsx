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

type SortOption = 'price-asc' | 'price-desc' | 'duration' | 'departure';

function getMaxStops(offer: any): number {
  return Math.max(
    ...offer.itineraries.map((it: any) => it.segments.length - 1)
  );
}

function getOfferPrice(offer: any): number {
  return parseFloat(offer.price?.total ?? '0');
}

function getTotalDurationMinutes(offer: any): number {
  const dur = offer.itineraries?.[0]?.duration ?? '';
  const match = dur.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return 0;
  return (parseInt(match[1] || '0') * 60) + parseInt(match[2] || '0');
}

function getDepartureTime(offer: any): string {
  return offer.itineraries?.[0]?.segments?.[0]?.departure?.at ?? '';
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const [flights, setFlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtres
  const [maxPrice, setMaxPrice] = useState(10000);
  const [stopsFilter, setStopsFilter] = useState<'any' | 'direct' | 'max1'>('any');
  const [sortBy, setSortBy] = useState<SortOption>('price-asc');
  const [sortOpen, setSortOpen] = useState(false);

  useEffect(() => {
    if (!searchParams.get('originCode')) return;

    const ac = new AbortController();
    setLoading(true);
    setError(null);

    fetch(`/api/amadeus/flight-offers?${searchParams.toString()}`, { signal: ac.signal })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'Erreur lors de la récupération des vols');
        setFlights(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setError(err.message);
      })
      .finally(() => setLoading(false));

    return () => ac.abort();
  }, [searchParams]);

  // Prix max dynamique
  const priceMax = flights.length > 0
    ? Math.ceil(Math.max(...flights.map(getOfferPrice)) / 100) * 100
    : 2000;

  useEffect(() => {
    if (flights.length > 0) setMaxPrice(priceMax);
  }, [flights, priceMax]);

  // Appliquer filtres + tri
  const filteredFlights = flights
    .filter((offer) => {
      if (getOfferPrice(offer) > maxPrice) return false;
      if (stopsFilter === 'direct' && getMaxStops(offer) > 0) return false;
      if (stopsFilter === 'max1' && getMaxStops(offer) > 1) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc': return getOfferPrice(a) - getOfferPrice(b);
        case 'price-desc': return getOfferPrice(b) - getOfferPrice(a);
        case 'duration': return getTotalDurationMinutes(a) - getTotalDurationMinutes(b);
        case 'departure': return getDepartureTime(a).localeCompare(getDepartureTime(b));
        default: return 0;
      }
    });

  const origin = searchParams.get('originCode');
  const dest = searchParams.get('destinationCode');
  const date = searchParams.get('departureDate');

  const sortLabels: Record<SortOption, string> = {
    'price-asc': 'Prix croissant',
    'price-desc': 'Prix decroissant',
    'duration': 'Duree',
    'departure': 'Heure de depart',
  };

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
           <Button
            variant="ghost"
            className="border border-white/30 text-white rounded-lg hover:bg-white/10 hover:text-white"
           >
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
                  <button
                    className="text-xs font-bold text-adl-sky uppercase tracking-widest hover:underline"
                    onClick={() => { setMaxPrice(priceMax); setStopsFilter('any'); }}
                  >Réinitialiser</button>
                </div>
                
                <div className="space-y-8">
                  <div>
                    <Label className="text-adl-navy font-bold mb-4 block">
                      Prix maximum : <span className="text-adl-sky">{maxPrice} €</span>
                    </Label>
                    <input
                      type="range"
                      className="w-full accent-adl-navy"
                      min="0"
                      max={priceMax}
                      step="50"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                    />
                    <div className="flex justify-between text-xs font-bold text-adl-gray mt-2">
                      <span>0 €</span>
                      <span>{priceMax} €</span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-adl-navy font-bold mb-4 block">Escales</Label>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="stops"
                          className="h-5 w-5 rounded border-gray-300 text-adl-navy"
                          checked={stopsFilter === 'any'}
                          onChange={() => setStopsFilter('any')}
                        />
                        <span className="text-sm font-medium text-adl-navy group-hover:text-adl-sky">Tous</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="stops"
                          className="h-5 w-5 rounded border-gray-300 text-adl-navy"
                          checked={stopsFilter === 'direct'}
                          onChange={() => setStopsFilter('direct')}
                        />
                        <span className="text-sm font-medium text-adl-navy group-hover:text-adl-sky">Direct uniquement</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="stops"
                          className="h-5 w-5 rounded border-gray-300 text-adl-navy"
                          checked={stopsFilter === 'max1'}
                          onChange={() => setStopsFilter('max1')}
                        />
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
                {filteredFlights.length} vol{filteredFlights.length !== 1 ? 's' : ''} <span className="text-adl-sky">trouvé{filteredFlights.length !== 1 ? 's' : ''}</span>
                {filteredFlights.length < flights.length && (
                  <span className="text-sm font-medium text-adl-gray ml-2">sur {flights.length}</span>
                )}
              </h2>
              <div className="relative">
                <button
                  className="flex items-center gap-2 text-sm font-bold text-adl-navy"
                  onClick={() => setSortOpen(!sortOpen)}
                >
                  Trier par : {sortLabels[sortBy]} <ChevronDown className="h-4 w-4" />
                </button>
                {sortOpen && (
                  <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[180px]">
                    {(Object.entries(sortLabels) as [SortOption, string][]).map(([key, label]) => (
                      <button
                        key={key}
                        className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${sortBy === key ? 'font-bold text-adl-navy' : 'text-adl-gray'}`}
                        onClick={() => { setSortBy(key); setSortOpen(false); }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}
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
            ) : filteredFlights.length === 0 && flights.length > 0 ? (
              <div className="bg-white rounded-xl p-12 text-center shadow-md border border-gray-200">
                <div className="h-24 w-24 bg-gray-100 text-adl-sky rounded-lg flex items-center justify-center mx-auto mb-6">
                  <Filter className="h-12 w-12" />
                </div>
                <h3 className="text-2xl font-bold text-adl-navy mb-2">Aucun vol ne correspond aux filtres</h3>
                <p className="text-adl-gray mb-8">{flights.length} vol{flights.length > 1 ? 's' : ''} disponible{flights.length > 1 ? 's' : ''} sans filtres.</p>
                <Button onClick={() => { setMaxPrice(priceMax); setStopsFilter('any'); }} className="bg-adl-navy rounded-lg px-8">Réinitialiser les filtres</Button>
              </div>
            ) : filteredFlights.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center shadow-md border border-gray-200">
                 <div className="h-24 w-24 bg-gray-100 text-adl-sky rounded-lg flex items-center justify-center mx-auto mb-6">
                  <Plane className="h-12 w-12" />
                </div>
                <h3 className="text-2xl font-bold text-adl-navy mb-2">Aucun vol disponible</h3>
                <p className="text-adl-gray mb-8">Essayez de modifier vos dates ou destinations.</p>
                <Button onClick={() => window.history.back()} className="bg-adl-navy rounded-lg px-8">Retour</Button>
              </div>
            ) : (
              filteredFlights.map((offer) => (
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
