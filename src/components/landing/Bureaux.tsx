"use client"

import React from 'react';
import { BureauxMap } from './BureauxMap';

export function Bureaux() {
  return (
    <section id="bureaux" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-adl-navy mb-4">
          Nos bureaux
        </h2>
        <p className="text-lg text-adl-gray max-w-2xl mb-12">
          8 sites d'exploitation répartis sur La Réunion, Mayotte, Madagascar, la Martinique et la Guadeloupe.
        </p>

        <BureauxMap />
      </div>
    </section>
  );
}
