"use client"

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plane, Calendar, Users, MapPin, Search, ArrowRightLeft } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

type Location = {
  name: string;
  iata: string;
  city: string;
  detailedName: string;
};

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

  // Debounced search for locations
  useEffect(() => {
    if (originSearch.length < 2) {
      setOriginResults([]);
      return;
    }
    const timeout = setTimeout(async () => {
      setLoadingOrigin(true);
      try {
        const res = await fetch(`/api/amadeus/airports?keyword=${originSearch}`);
        const data = await res.json();
        setOriginResults(data);
      } finally {
        setLoadingOrigin(false);
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [originSearch]);

  useEffect(() => {
    if (destSearch.length < 2) {
      setDestResults([]);
      return;
    }
    const timeout = setTimeout(async () => {
      setLoadingDest(true);
      try {
        const res = await fetch(`/api/amadeus/airports?keyword=${destSearch}`);
        const data = await res.json();
        setDestResults(data);
      } finally {
        setLoadingDest(false);
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [destSearch]);

  const handleSearch = () => {
    if (!origin || !destination || !departureDate) return;
    
    const params = new URLSearchParams({
      originCode: origin.iata,
      destinationCode: destination.iata,
      departureDate: format(departureDate, 'yyyy-MM-dd'),
      adults: passengers.toString(),
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
    <div className="w-full max-w-6xl mx-auto glass-morphism rounded-xl p-6 md:p-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
      {/* Tabs - style Corsair */}
      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => setTripType('round')}
          className={cn(
            "text-sm font-bold pb-2 transition-all border-b-2",
            tripType === 'round' ? "border-adl-navy text-adl-navy" : "border-transparent text-adl-gray"
          )}
        >
          Aller-retour
        </button>
        <button 
          onClick={() => setTripType('one')}
          className={cn(
            "text-sm font-bold pb-2 transition-all border-b-2",
            tripType === 'one' ? "border-adl-navy text-adl-navy" : "border-transparent text-adl-gray"
          )}
        >
          Aller simple
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        {/* Origin */}
        <div className="md:col-span-3 relative">
          <Label className="text-adl-gray text-xs mb-2 block font-medium">Origine</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-adl-gray h-5 w-5" />
            <Input 
              placeholder="D'où partez-vous ?"
              value={originSearch || (origin?.name || '')}
              onChange={(e) => {
                setOriginSearch(e.target.value);
                if (origin) setOrigin(null);
              }}
              className="bg-white border border-gray-200 text-adl-navy pl-10 h-14 rounded-lg focus:ring-2 focus:ring-adl-navy focus:border-adl-navy placeholder:text-adl-gray/70"
            />
            {originResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg mt-2 overflow-hidden z-20 shadow-lg">
                {originResults.map((loc) => (
                  <button
                    key={loc.iata}
                    onClick={() => {
                      setOrigin(loc);
                      setOriginSearch(loc.name);
                      setOriginResults([]);
                    }}
                    className="w-full text-left p-4 hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors"
                  >
                    <div className="text-adl-navy font-bold">{loc.city} ({loc.iata})</div>
                    <div className="text-adl-gray text-xs">{loc.name}</div>
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
            className="text-adl-gray hover:text-adl-navy hover:bg-gray-100 rounded-lg"
          >
            <ArrowRightLeft className="h-5 w-5" />
          </Button>
        </div>

        {/* Destination */}
        <div className="md:col-span-3 relative">
          <Label className="text-adl-gray text-xs mb-2 block font-medium">Destination</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-adl-gray h-5 w-5" />
            <Input 
              placeholder="Où allez-vous ?"
              value={destSearch || (destination?.name || '')}
              onChange={(e) => {
                setDestSearch(e.target.value);
                if (destination) setDestination(null);
              }}
              className="bg-white border border-gray-200 text-adl-navy pl-10 h-14 rounded-lg focus:ring-2 focus:ring-adl-navy focus:border-adl-navy placeholder:text-adl-gray/70"
            />
            {destResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg mt-2 overflow-hidden z-20 shadow-lg">
                {destResults.map((loc) => (
                  <button
                    key={loc.iata}
                    onClick={() => {
                      setDestination(loc);
                      setDestSearch(loc.name);
                      setDestResults([]);
                    }}
                    className="w-full text-left p-4 hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors"
                  >
                    <div className="text-adl-navy font-bold">{loc.city} ({loc.iata})</div>
                    <div className="text-adl-gray text-xs">{loc.name}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Dates */}
        <div className="md:col-span-3">
          <Label className="text-adl-gray text-xs mb-2 block font-medium">Dates</Label>
          <div className="grid grid-cols-2 gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-14 bg-white border border-gray-200 text-adl-navy hover:bg-gray-50 flex justify-start pl-4 rounded-lg">
                  <Calendar className="mr-2 h-4 w-4 text-adl-gray" />
                  <span className="truncate">{departureDate ? format(departureDate, 'dd MMM', { locale: fr }) : 'Départ'}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white border border-gray-200" align="start">
                <CalendarComponent
                  mode="single"
                  selected={departureDate}
                  onSelect={setDepartureDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild disabled={tripType === 'one'}>
                <Button 
                  variant="outline" 
                  disabled={tripType === 'one'}
                  className="h-14 bg-white border border-gray-200 text-adl-navy hover:bg-gray-50 flex justify-start pl-4 rounded-lg disabled:opacity-50"
                >
                  <Calendar className="mr-2 h-4 w-4 text-adl-gray" />
                  <span className="truncate">{returnDate ? format(returnDate, 'dd MMM', { locale: fr }) : 'Retour'}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white border border-gray-200" align="start">
                <CalendarComponent
                  mode="single"
                  selected={returnDate}
                  onSelect={setReturnDate}
                  disabled={(date) => date < (departureDate || new Date())}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Passengers & Search */}
        <div className="md:col-span-2 flex gap-2">
           <div className="flex-1">
             <Label className="text-adl-gray text-xs mb-2 block font-medium">Passagers</Label>
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
            className="w-full md:w-auto bg-adl-navy hover:bg-adl-navy/90 text-white text-lg font-bold h-14 px-10 rounded-lg shadow-md disabled:opacity-50"
           >
             <Search className="mr-2 h-5 w-5" />
             Réserver
           </Button>
        </div>
      </div>
    </div>
  );
}
