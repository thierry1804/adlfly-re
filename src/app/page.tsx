"use client"

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/landing/HeroSection';
import { QuickStats } from '@/components/landing/QuickStats';
import { DestinationCards } from '@/components/landing/DestinationCards';
import { Services } from '@/components/landing/Services';

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <QuickStats />
      <DestinationCards />
      <Services />
      <Footer />
    </main>
  );
}
