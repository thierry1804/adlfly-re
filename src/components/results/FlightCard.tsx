"use client"

import React from 'react';
import { Plane, ChevronRight, Clock, Luggage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format, parseISO, differenceInMinutes } from 'date-fns';
import { fr } from 'date-fns/locale';

export function FlightCard({ offer, onSelect }: { offer: any, onSelect: (offer: any) => void }) {
  const itinerary = offer.itineraries[0];
  const firstSegment = itinerary.segments[0];
  const lastSegment = itinerary.segments[itinerary.segments.length - 1];
  
  const departureTime = parseISO(firstSegment.departure.at);
  const arrivalTime = parseISO(lastSegment.arrival.at);
  const totalDuration = itinerary.duration.replace('PT', '').toLowerCase();
  
  const stops = itinerary.segments.length - 1;
  const price = offer.price.total;

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-200 hover:border-adl-sky/30 transition-all p-6 mb-6">
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Carrier info */}
        <div className="flex flex-col items-center md:items-start w-full md:w-32">
          <div className="h-12 w-12 bg-adl-navy rounded-lg flex items-center justify-center text-white font-bold text-xs mb-2">
            {firstSegment.carrierCode}
          </div>
          <span className="text-xs font-bold text-adl-navy uppercase">{firstSegment.carrierCode} {firstSegment.number}</span>
        </div>

        {/* Timeline */}
        <div className="flex-1 flex items-center justify-between gap-4 w-full">
          <div className="text-center md:text-left">
            <div className="text-2xl font-black text-adl-navy">{format(departureTime, 'HH:mm')}</div>
            <div className="text-sm font-bold text-adl-gray uppercase">{firstSegment.departure.iataCode}</div>
          </div>

          <div className="flex-1 flex flex-col items-center gap-2">
            <span className="text-[10px] font-bold text-adl-gray uppercase tracking-widest">{totalDuration}</span>
            <div className="relative w-full h-px bg-gray-200 flex justify-center items-center">
              <div className="absolute h-2 w-2 rounded-full bg-adl-navy left-0" />
              <div className="absolute h-2 w-2 rounded-full bg-adl-sky right-0" />
              <Plane className="text-adl-sky h-4 w-4 bg-white px-0.5" />
            </div>
            <Badge variant={stops === 0 ? "secondary" : "outline"} className={stops === 0 ? "bg-emerald-500/10 text-emerald-600 border-none" : ""}>
              {stops === 0 ? 'Direct' : `${stops} escale${stops > 1 ? 's' : ''}`}
            </Badge>
          </div>

          <div className="text-center md:text-right">
            <div className="text-2xl font-black text-adl-navy">{format(arrivalTime, 'HH:mm')}</div>
            <div className="text-sm font-bold text-adl-gray uppercase">{lastSegment.arrival.iataCode}</div>
          </div>
        </div>

        {/* Price & CTA */}
        <div className="flex flex-col items-center md:items-end w-full md:w-48 gap-4 pl-0 md:pl-8 border-t md:border-t-0 md:border-l border-gray-200 pt-6 md:pt-0">
          <div className="text-center md:text-right">
            <div className="text-3xl font-black text-adl-navy">{price} €</div>
            <div className="text-xs font-bold text-adl-gray">Total TTC</div>
          </div>
          <Button 
            onClick={() => onSelect(offer)}
            className="w-full bg-adl-navy hover:bg-adl-navy/90 text-white rounded-lg font-bold h-12 shadow-md"
          >
            Sélectionner
          </Button>
        </div>
      </div>

      {/* Footer details */}
      <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center text-xs text-adl-gray">
        <div className="flex gap-4">
          <span className="flex items-center gap-1"><Luggage className="h-3 w-3" /> Bagage inclus</span>
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Ponctualité 95%</span>
        </div>
        <button className="text-adl-sky font-bold hover:underline">Voir les détails</button>
      </div>
    </div>
  );
}
