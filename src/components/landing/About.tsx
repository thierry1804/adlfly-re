"use client"

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

/** Image générée — opérations piste / avion au sol (`public/about-airport-ramp.png`) */
const ABOUT_RAMP_IMAGE = '/about-airport-ramp.png';

export function About() {
  return (
    <section id="a-propos" className="bg-adl-navy text-white overflow-hidden">
      <div className="container mx-auto px-6">
        {/*
          md+ : grille 2 colonnes — la ligne prend la hauteur du contenu le plus haut ;
          les deux cellules s’étirent : l’image (fill) a la même hauteur que le bloc texte.
          < md : une colonne ; aspect-ratio pour hauteur stable (fill exige une hauteur de parent).
        */}
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] md:items-stretch gap-10 md:gap-10 lg:gap-12 py-24">
          <div className="flex min-h-0 flex-col md:h-full md:min-h-0 md:max-w-xl md:pr-4 lg:pr-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Qui sommes-nous ?
            </h2>
            <p className="text-white/70 max-w-2xl mb-10 text-lg md:mb-6">
              ADL Fly est un partenaire 360° pour tous les services liés à l&apos;aviation. Fort de plus de 20 ans d&apos;expérience dans le secteur aérien, nous accompagnons les compagnies et les voyageurs sur l&apos;océan Indien et les outre-mer.
            </p>

            <div className="mt-10 pt-10 border-t border-white/10 md:mt-auto md:pt-8">
              <Link
                href="#contact"
                className="inline-flex items-center gap-2 text-adl-sky font-semibold hover:underline"
              >
                Nous contacter pour un projet
                <span>→</span>
              </Link>
            </div>
          </div>

          <div
            className={[
              'relative w-full min-h-0 overflow-hidden',
              /* mobile : hauteur liée à la largeur (fill exige une hauteur de parent) */
              'aspect-[4/3] -mx-6 sm:mx-0',
              /* md+ : remplit la cellule grille = hauteur du bloc texte (items-stretch) */
              'md:aspect-auto md:mx-0 md:h-full md:min-h-0',
            ].join(' ')}
          >
            <Image
              src={ABOUT_RAMP_IMAGE}
              alt="Avion au sol, opérations aéroportuaires"
              fill
              className="object-cover object-center md:object-right"
              sizes="(max-width: 767px) 100vw, 50vw"
              priority={false}
            />
            <div
              className="absolute inset-0 pointer-events-none bg-[linear-gradient(115deg,#15183D_0%,#15183D_18%,rgba(21,24,61,0.82)_38%,rgba(21,24,61,0.35)_52%,transparent_68%)] md:bg-[linear-gradient(108deg,#15183D_0%,#15183D_12%,rgba(21,24,61,0.88)_32%,rgba(21,24,61,0.4)_48%,transparent_62%)]"
              aria-hidden
            />
            <div
              className="absolute inset-x-0 top-0 h-24 pointer-events-none bg-gradient-to-b from-adl-navy to-transparent md:hidden"
              aria-hidden
            />
          </div>
        </div>
      </div>
    </section>
  );
}
