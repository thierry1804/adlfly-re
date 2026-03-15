"use client"

import React, { useEffect, useState, useRef } from 'react';
import { useInView } from 'framer-motion';

const stats = [
  { value: 20, suffix: " ans", label: "d'expérience" },
  { value: 35, suffix: "", label: "collaborateurs" },
  { value: 8, suffix: "", label: "sites d'exploitation" },
  { value: 45000, prefix: "+", suffix: "", label: "billets émis par an" },
];

function Counter({ value, prefix = "", suffix = "" }: { value: number, prefix?: string, suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <span ref={ref} className="text-4xl md:text-5xl font-extrabold text-white block mb-2">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

export function QuickStats() {
  return (
    <section id="chiffres" className="py-20 bg-adl-navy text-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <Counter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              <span className="text-white/60 font-semibold uppercase tracking-widest text-xs">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
