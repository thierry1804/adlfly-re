import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'ADL Fly — Sans Limite.',
  description: 'Votre agent général aérien basé à La Réunion. Réservez vos vols vers l\'Océan Indien et le monde entier.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground selection:bg-primary/30">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
