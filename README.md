# ADL Fly Booking Platform

Prototype d'agence de voyage aérienne basé sur ADL Fly (La Réunion), avec intégration Amadeus API.

## Installation

1. Clonez le dépôt.
2. Installez les dépendances : `npm install`
3. Copiez le fichier `.env.example` vers `.env.local` et renseignez vos clés Amadeus.
4. Lancez le serveur de développement : `npm run dev`

## Amadeus API

Inscrivez-vous sur [developers.amadeus.com](https://developers.amadeus.com/) pour obtenir vos clés d'API (Environnement Test/Sandbox).

### Variables d'environnement requises :
- `AMADEUS_CLIENT_ID` : Votre API Key
- `AMADEUS_CLIENT_SECRET` : Votre API Secret
- `AMADEUS_HOSTNAME` : `test` (par défaut)

## Architecture

- **Next.js 14** : App Router, API Routes.
- **Tailwind CSS** : Design System premium (inspiré de Corsair).
- **Amadeus SDK** : Recherche de vols et autocomplétion.
- **Framer Motion** : Micro-interactions et animations.
