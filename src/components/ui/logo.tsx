import React from 'react';

export function Logo({ className = "h-8" }: { className?: string }) {
  return (
    <div className="flex items-center gap-2">
      <img
        src="https://adlfly.re/wp-content/uploads/elementor/thumbs/Logo-ADL-Fly-q2a621o9nz0lubzllme5pthf86woe0j45qrpqc2m8q.png"
        alt="ADL Fly"
        // Le logo source peut être peu contrasté sur `bg-adl-navy`.
        // On force une version “claire” (blanche) pour éviter "logo invisible".
        className={`${className} w-auto filter brightness-0 invert`}
      />
    </div>
  );
}
