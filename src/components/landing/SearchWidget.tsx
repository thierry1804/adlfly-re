"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plane, Users, MapPin, Search, ArrowRightLeft } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

type Location = {
  id?: string;
  name: string;
  iata: string;
  city: string;
  detailedName: string;
  type?: string;
  country?: string;
  countryCode?: string;
};

function locationKey(loc: Location, index: number) {
  return loc.id ?? `${loc.detailedName}|${loc.iata}|${index}`;
}

function locationSubtitle(loc: Location) {
  if (loc.country || loc.countryCode) {
    return [loc.country, loc.countryCode].filter(Boolean).join(' · ');
  }
  return loc.name;
}

export function SearchWidget() {
  const router = useRouter();
  const [tripType, setTripType] = useState<'round' | 'one'>('round');
  const [origin, setOrigin] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [departureDate, setDepartureDate] = useState<Date | undefined>(new Date());
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);
  const [passengers, setPassengers] = useState(1);
  
  const [originSearch, setOriginSearch] = useState('');
  const [destSearch, setDestSearch] = useState('');
  const [originResults, setOriginResults] = useState<Location[]>([]);
  const [destResults, setDestResults] = useState<Location[]>([]);
  const [loadingOrigin, setLoadingOrigin] = useState(false);
  const [loadingDest, setLoadingDest] = useState(false);

  // Debounced search + annulation des requêtes obsolètes (saisie rapide)
  useEffect(() => {
    if (originSearch.length < 2) {
      setOriginResults([]);
      return;
    }
    const ac = new AbortController();
    const timeout = setTimeout(async () => {
      setLoadingOrigin(true);
      try {
        const res = await fetch(
          `/api/amadeus/airports?keyword=${encodeURIComponent(originSearch)}`,
          { signal: ac.signal }
        );
        if (!res.ok) return;
        const data = await res.json();
        setOriginResults(Array.isArray(data) ? data : []);
      } catch (e) {
        if (e instanceof DOMException && e.name === 'AbortError') return;
      } finally {
        setLoadingOrigin(false);
      }
    }, 300);
    return () => {
      ac.abort();
      clearTimeout(timeout);
    };
  }, [originSearch]);

  useEffect(() => {
    if (destSearch.length < 2) {
      setDestResults([]);
      return;
    }
    const ac = new AbortController();
    const timeout = setTimeout(async () => {
      setLoadingDest(true);
      try {
        const res = await fetch(
          `/api/amadeus/airports?keyword=${encodeURIComponent(destSearch)}`,
          { signal: ac.signal }
        );
        if (!res.ok) return;
        const data = await res.json();
        setDestResults(Array.isArray(data) ? data : []);
      } catch (e) {
        if (e instanceof DOMException && e.name === 'AbortError') return;
      } finally {
        setLoadingDest(false);
      }
    }, 300);
    return () => {
      ac.abort();
      clearTimeout(timeout);
    };
  }, [destSearch]);

  const handleSearch = () => {
    if (!origin || !destination || !departureDate) return;
    
    const params = new URLSearchParams({
      originCode: origin.iata,
      destinationCode: destination.iata,
      departureDate: format(departureDate, 'yyyy-MM-dd'),
      adults: passengers.toString(),
      // Corsair International — filtre côté Amadeus Flight Offers Search
      includedAirlineCodes: 'SS',
    });

    if (tripType === 'round' && returnDate) {
      params.append('returnDate', format(returnDate, 'yyyy-MM-dd'));
    }

    router.push(`/results?${params.toString()}`);
  };

  const swapLocations = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  return (
    <div className="w-full max-w-6xl mx-auto glass-morphism rounded-xl p-6 md:p-8 animate-in fade-in slide-in-from-bottom-10 duration-700 relative overflow-visible">
      {/* Dégradé entre le fond du panneau et les champs / CTA (sous le contenu, au-dessus du fond) */}
      <div className="pointer-events-none absolute inset-0 z-[1] rounded-xl overflow-hidden" aria-hidden>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-adl-navy to-transparent" />
      </div>

      <div className="relative z-10">
      {/* Tabs - style Corsair */}
      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => setTripType('round')}
          className={cn(
            "text-sm font-bold pb-2 transition-colors border-b-2",
            tripType === 'round' ? "border-white text-white" : "border-transparent text-white/55 hover:text-white/80"
          )}
        >
          Aller-retour
        </button>
        <button 
          onClick={() => setTripType('one')}
          className={cn(
            "text-sm font-bold pb-2 transition-colors border-b-2",
            tripType === 'one' ? "border-white text-white" : "border-transparent text-white/55 hover:text-white/80"
          )}
        >
          Aller simple
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        {/* Origin */}
        <div className="md:col-span-3 relative">
          <Label className="text-white/80 text-xs mb-2 block font-medium">Origine</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-adl-gray h-5 w-5" />
            <Input
              placeholder="Ville, pays ou aéroport"
              spellCheck={false}
              autoComplete="off"
              value={originSearch || (origin?.name || '')}
              onChange={(e) => {
                setOriginSearch(e.target.value);
                if (origin) setOrigin(null);
              }}
              className="bg-white border border-gray-200 text-adl-navy pl-10 h-14 rounded-lg focus:ring-2 focus:ring-adl-navy focus:border-adl-navy placeholder:text-adl-gray/70"
            />
            {originResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg mt-2 z-20 shadow-lg max-h-[min(18rem,45vh)] overflow-y-auto overscroll-y-contain">
                {originResults.map((loc, index) => (
                  <button
                    key={locationKey(loc, index)}
                    onClick={() => {
                      setOrigin(loc);
                      setOriginSearch(loc.name);
                      setOriginResults([]);
                    }}
                    className="w-full text-left p-4 hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors"
                  >
                    <div className="text-adl-navy font-bold">{loc.city} ({loc.iata})</div>
                    <div className="text-adl-gray text-xs">{locationSubtitle(loc)}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Swap Button */}
        <div className="hidden md:flex md:col-span-1 justify-center pb-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={swapLocations}
            className="text-white/70 hover:text-white hover:bg-white/10 rounded-lg"
          >
            <ArrowRightLeft className="h-5 w-5" />
          </Button>
        </div>

        {/* Destination */}
        <div className="md:col-span-3 relative">
          <Label className="text-white/80 text-xs mb-2 block font-medium">Destination</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-adl-gray h-5 w-5" />
            <Input
              placeholder="Ville, pays ou aéroport"
              spellCheck={false}
              autoComplete="off"
              value={destSearch || (destination?.name || '')}
              onChange={(e) => {
                setDestSearch(e.target.value);
                if (destination) setDestination(null);
              }}
              className="bg-white border border-gray-200 text-adl-navy pl-10 h-14 rounded-lg focus:ring-2 focus:ring-adl-navy focus:border-adl-navy placeholder:text-adl-gray/70"
            />
            {destResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg mt-2 z-20 shadow-lg max-h-[min(18rem,45vh)] overflow-y-auto overscroll-y-contain">
                {destResults.map((loc, index) => (
                  <button
                    key={locationKey(loc, index)}
                    onClick={() => {
                      setDestination(loc);
                      setDestSearch(loc.name);
                      setDestResults([]);
                    }}
                    className="w-full text-left p-4 hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors"
                  >
                    <div className="text-adl-navy font-bold">{loc.city} ({loc.iata})</div>
                    <div className="text-adl-gray text-xs">{locationSubtitle(loc)}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Dates */}
        <div className="md:col-span-3">
          <Label className="text-white/80 text-xs mb-2 block font-medium">Dates</Label>
          <div className="grid grid-cols-2 gap-2">
            <DatePicker
              value={departureDate}
              onChange={(d) => {
                setDepartureDate(d);
                if (returnDate && d > returnDate) setReturnDate(undefined);
              }}
              label="Aller"
              placeholder="Depart"
            />
            <DatePicker
              value={returnDate}
              onChange={setReturnDate}
              minDate={departureDate}
              label="Retour"
              placeholder="Retour"
              disabled={tripType === 'one'}
            />
          </div>
        </div>

        {/* Passengers & Search */}
        <div className="md:col-span-2 flex gap-2">
           <div className="flex-1">
             <Label className="text-white/80 text-xs mb-2 block font-medium">Passagers</Label>
             <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-adl-gray h-5 w-5" />
                <select 
                  value={passengers}
                  onChange={(e) => setPassengers(parseInt(e.target.value))}
                  className="w-full bg-white border border-gray-200 text-adl-navy pl-10 h-14 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-adl-navy"
                >
                  <option value="1" className="bg-white">1 Adulte</option>
                  <option value="2" className="bg-white">2 Adultes</option>
                  <option value="3" className="bg-white">3 Adultes</option>
                  <option value="4" className="bg-white">4 Adultes</option>
                </select>
             </div>
           </div>
        </div>

        {/* Final CTA - bouton bleu Corsair */}
        <div className="md:col-span-12 mt-4 flex justify-end">
           <Button 
            onClick={handleSearch}
            disabled={!origin || !destination || !departureDate}
            className="w-full md:w-auto bg-white text-[rgb(0,20,46)] hover:bg-gray-100 text-lg font-bold h-14 px-10 rounded-lg border border-white/20 shadow-[0_2px_12px_rgba(0,0,0,0.2)] disabled:opacity-50"
           >
             <Search className="mr-2 h-5 w-5" />
             Réserver
           </Button>
        </div>
      </div>
      </div>
    </div>
  );
}
