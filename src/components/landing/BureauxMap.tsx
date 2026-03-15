"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { geoMercator, geoPath } from 'd3-geo';
import { Mail, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

const GEO_OCEAN_INDIEN_URL = '/api/geo/ocean-indien';
const GEO_ANTILLES_URL = '/api/geo/antilles';

const SVG_WIDTH = 800;
const SVG_HEIGHT = 400;
const MAP_HEIGHT = 320;

type ContactInfo = {
  id: string;
  name: string;
  detail: string;
  email: string;
  phone: string;
};

const oceanIndienContacts: ContactInfo[] = [
  { id: '974', name: 'La Réunion', detail: 'Siège et bureaux', email: 'contact@adlflyreunion.com', phone: '+262 2 62 66 62 37' },
  { id: '976', name: 'Mayotte', detail: 'Représentation', email: 'contact@adlflymayotte.com', phone: '+262 2 62 66 62 37' },
  { id: 'MDG', name: 'Madagascar', detail: 'Représentation', email: 'contact@adlflymadagascar.com', phone: '+262 2 62 66 62 37' },
];

const antillesContacts: ContactInfo[] = [
  { id: '972', name: 'Martinique', detail: 'Représentation', email: 'contact@adlfly.re', phone: '+262 2 62 66 62 37' },
  { id: '971', name: 'Guadeloupe', detail: 'Représentation', email: 'contact@adlfly.re', phone: '+262 2 62 66 62 37' },
];

function ContactCard({
  contact,
  isSelected,
  onSelect,
}: {
  contact: ContactInfo;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ease-out',
        'hover:border-adl-sky/40 hover:bg-white/80',
        isSelected ? 'border-adl-sky/50 bg-adl-sky/15 shadow-md' : 'border-transparent bg-white/50'
      )}
    >
      <p className="text-sm font-semibold text-adl-navy mb-2">{contact.name}</p>
      <a
        href={`mailto:${contact.email}`}
        className="flex items-center gap-2 text-xs text-adl-gray hover:text-adl-sky"
        onClick={(e) => e.stopPropagation()}
      >
        <Mail className="h-3 w-3 shrink-0" />
        <span className="truncate">{contact.email}</span>
      </a>
      <a
        href={`tel:${contact.phone.replace(/\s/g, '')}`}
        className="flex items-center gap-2 text-xs text-adl-gray hover:text-adl-sky mt-1"
        onClick={(e) => e.stopPropagation()}
      >
        <Phone className="h-3 w-3 shrink-0" />
        <span>{contact.phone}</span>
      </a>
    </button>
  );
}

// Antilles à gauche — À droite : Mayotte | Madagascar | La Réunion (alignées, espacées régulièrement)
const LEFT_CX = SVG_WIDTH * 0.18;
const CY = SVG_HEIGHT / 2;
const MAYOTTE_CX = SVG_WIDTH * 0.50;
const MADA_CX = SVG_WIDTH * 0.85;
const REUNION_CX = SVG_WIDTH * 0.90;

const PROJ_ANTILLES = geoMercator()
  .center([-61, 15])
  .scale(6000)
  .translate([LEFT_CX, CY]);
// Mayotte — à gauche du bloc océan Indien
const PROJ_MAYOTTE = geoMercator()
  .center([45.2, -12.8])
  .scale(1200 * 10)
  .translate([MAYOTTE_CX, CY * 0.5]);
// Madagascar — au centre
const PROJ_OCEAN = geoMercator()
  .center([55, -17])
  .scale(1200)
  .translate([MADA_CX, CY]);
// La Réunion — à droite
const PROJ_REUNION = geoMercator()
  .center([55.5, -21.1])
  .scale(1200 * 4)
  .translate([REUNION_CX, CY]);

const pathOcean = geoPath().projection(PROJ_OCEAN);
const pathReunion = geoPath().projection(PROJ_REUNION);
const pathMayotte = geoPath().projection(PROJ_MAYOTTE);
const pathAntilles = geoPath().projection(PROJ_ANTILLES);

function getFeatureId(f: GeoJSON.Feature): string {
  const p = f.properties as { code?: string } | null;
  return p?.code ? String(p.code) : '';
}

const ID_TO_NAME: Record<string, string> = {
  '971': 'Guadeloupe',
  '972': 'Martinique',
  '976': 'Mayotte',
  'MDG': 'Madagascar',
  '974': 'La Réunion',
};

function UnifiedMap({
  oceanGeo,
  antillesGeo,
  selectedId,
  onSelect,
}: {
  oceanGeo: GeoJSON.FeatureCollection | null;
  antillesGeo: GeoJSON.FeatureCollection | null;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const items = useMemo(() => {
    const list: { id: string; path: string; name: string; x: number; y: number }[] = [];
    let mayotteItem: { id: string; path: string; name: string; x: number; y: number } | null = null;
    (oceanGeo?.features ?? []).forEach((f) => {
      const feat = f as GeoJSON.Feature;
      const id = getFeatureId(feat);
      if (id === '976') {
        const path = pathMayotte(feat);
        if (path) {
          const [x, y] = pathMayotte.centroid(feat);
          mayotteItem = { id, path, name: ID_TO_NAME[id] ?? id, x, y };
        }
        return;
      }
      const path = id === '974' ? pathReunion(feat) : pathOcean(feat);
      if (path) {
        const [x, y] = (id === '974' ? pathReunion : pathOcean).centroid(feat);
        list.push({ id, path, name: ID_TO_NAME[id] ?? id, x, y });
      }
    });
    (antillesGeo?.features ?? []).forEach((f) => {
      const feat = f as GeoJSON.Feature;
      const path = pathAntilles(feat);
      if (path) {
        const id = getFeatureId(feat);
        const [x, y] = pathAntilles.centroid(feat);
        list.push({ id, path, name: ID_TO_NAME[id] ?? id, x, y });
      }
    });
    if (mayotteItem) list.push(mayotteItem);
    return list;
  }, [oceanGeo, antillesGeo]);

  const loading = !oceanGeo || !antillesGeo;
  const empty = items.length === 0;

  if (loading) {
    return (
      <div className="w-full h-full min-h-[280px] rounded-xl bg-gray-200 flex items-center justify-center text-adl-gray text-sm">
        Chargement…
      </div>
    );
  }
  if (empty) {
    return (
      <div className="w-full h-full min-h-[280px] rounded-xl bg-gray-200 flex items-center justify-center text-adl-gray text-sm">
        Données indisponibles
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[280px] rounded-xl overflow-hidden border border-gray-200 bg-[#fafafa]">
      <svg
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        className="w-full h-full block"
        preserveAspectRatio="xMidYMid meet"
      >
        <g>
          {items.map(({ id, path }) => {
            const isSelected = selectedId === id;
            return (
              <path
                key={id}
                d={path}
                fill={isSelected ? '#7eb3e8' : '#15183D'}
                stroke={isSelected ? '#4A90D9' : '#0f1428'}
                strokeWidth={0.5}
                className="cursor-pointer hover:fill-[#7eb3e8]"
                style={{ transition: 'fill 0.25s ease-out, stroke 0.25s ease-out' }}
                onClick={() => onSelect(isSelected ? null : id)}
                aria-label={id}
              />
            );
          })}
        </g>
        <g className="pointer-events-none">
          {items.map(({ id, name, x, y }) => {
            const offset = 20;
            const below = { x, y: y + 22, anchor: 'middle' as const, baseline: 'hanging' as const };
            const above = { x, y: y - 44, anchor: 'middle' as const, baseline: 'hanging' as const };
            const left = { x: x - offset, y, anchor: 'end' as const, baseline: 'middle' as const };
            const right = { x: x + offset * 3, y, anchor: 'start' as const, baseline: 'middle' as const };
            const pos =
              id === '974' ? above
              : id === 'MDG' ? right
              : id === '972' ? left
              : id === '971' ? right
              : left;
            return (
              <text
                key={`label-${id}`}
                x={pos.x}
                y={pos.y}
                textAnchor={pos.anchor}
                dominantBaseline={pos.baseline}
                fill="#0f1428"
                style={{ fontFamily: 'system-ui, sans-serif', fontSize: 11, fontWeight: 600 }}
              >
                {name}
              </text>
            );
          })}
        </g>
      </svg>
    </div>
  );
}

const allContacts: ContactInfo[] = [
  ...oceanIndienContacts,
  ...antillesContacts,
];

export function BureauxMap() {
  const [oceanIndienGeo, setOceanIndienGeo] = useState<GeoJSON.FeatureCollection | null>(null);
  const [antillesGeo, setAntillesGeo] = useState<GeoJSON.FeatureCollection | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>('974');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [resOcean, resAntilles] = await Promise.all([
          fetch(GEO_OCEAN_INDIEN_URL),
          fetch(GEO_ANTILLES_URL),
        ]);
        if (cancelled) return;
        const [dataOcean, dataAntilles] = await Promise.all([resOcean.json(), resAntilles.json()]);
        setOceanIndienGeo({ type: 'FeatureCollection', features: dataOcean.features || [] });
        setAntillesGeo({ type: 'FeatureCollection', features: dataAntilles.features || [] });
      } catch {
        if (!cancelled) {
          setOceanIndienGeo({ type: 'FeatureCollection', features: [] });
          setAntillesGeo({ type: 'FeatureCollection', features: [] });
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="bg-[#f5f5f5] rounded-xl p-6 md:p-8">
      <p className="text-sm text-adl-gray mb-4">Cliquez sur une île ou une fiche pour la mettre en avant.</p>
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 min-h-[480px]">
        <div className="flex-[3] min-h-[320px] lg:min-h-0 flex flex-col">
          <UnifiedMap
            oceanGeo={oceanIndienGeo}
            antillesGeo={antillesGeo}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>
        <div className="flex-[1] min-w-0 flex flex-col gap-3 overflow-auto lg:max-w-[280px]">
          {allContacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              isSelected={selectedId === contact.id}
              onSelect={() => setSelectedId(selectedId === contact.id ? null : contact.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
