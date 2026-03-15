"use client"

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/landing/HeroSection';
import { Services } from '@/components/landing/Services';
import { Forces } from '@/components/landing/Forces';
import { About } from '@/components/landing/About';
import { Bureaux } from '@/components/landing/Bureaux';
import { QuickStats } from '@/components/landing/QuickStats';
import { DestinationCards } from '@/components/landing/DestinationCards';
import { ContactSection } from '@/components/landing/ContactSection';

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <Services />
      <Forces />
      <About />
      <Bureaux />
      <QuickStats />
      <DestinationCards />
      <ContactSection />
      <Footer />
    </main>
  );
}
