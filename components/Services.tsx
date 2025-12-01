"use client";

import React from 'react';
import type enLocale from '@/locales/en.json';
import { useLocale } from '@/context/LocaleContext';
import { defaultLocale } from '@/lib/i18n';
import { getLocaleBundle } from '@/lib/translate';

type ServicesLocale = typeof enLocale.services;
type ServiceCardKey = keyof ServicesLocale['cards'];

type ServiceConfig = {
  id: number;
  key: ServiceCardKey;
  price: number | null;
};

const serviceOrder: ServiceConfig[] = [
  { id: 1, key: 'web_design', price: 1500 },
  { id: 2, key: 'custom_website', price: 3000 },
  { id: 3, key: 'personal_brand', price: 2000 },
  { id: 4, key: 'site_improvements', price: 500 },
  { id: 5, key: 'seo_performance', price: 800 },
  { id: 6, key: 'consultation', price: 300 },
];

function formatCZK(n: number) {
  return n.toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ' ') + ' Kč';
}

const CZK_TO_EUR = 0.04; // ~1 EUR = 25 CZK, adjust if needed

function formatEURFromCZK(czk: number) {
  const eur = Math.round(czk * CZK_TO_EUR);
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(eur);
}

export default function Services() {
  const { locale } = useLocale();
  const servicesBundle = getLocaleBundle(locale).services ?? getLocaleBundle(defaultLocale).services;

  return (
    <section id="services" className="py-12 px-6 sm:px-8 lg:px-16 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="bg-transparent">
          <h2 className="text-center text-3xl sm:text-4xl font-extrabold text-white mb-8">
            {servicesBundle.title}
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {serviceOrder.map((service) => {
              const localizedCard = servicesBundle.cards[service.key];
              if (!localizedCard) return null;
              const discounted = service.price ? Math.round(service.price * 0.8) : null;
              const priceLabelCZK = discounted ? formatCZK(discounted) : '';
              const priceLabelEUR = discounted ? formatEURFromCZK(discounted) : null;

              const note = 'note' in localizedCard ? localizedCard.note : undefined;

              return (
                <article
                  key={service.id}
                  className="p-6 rounded-xl bg-slate-900/30 border border-slate-800 hover:border-slate-700 transition"
                >
                  <div className="flex flex-col">
                    <h3 className="text-lg font-semibold mb-2">{localizedCard.title}</h3>

                    <div className="mb-4">
                      <div className="mt-1">
                        <span className="text-indigo-300 text-xl font-bold">{priceLabelCZK}</span>
                      </div>
                      {priceLabelEUR && <div className="text-sm text-slate-300 mt-1">{priceLabelEUR}</div>}
                    </div>

                    <ul className="mb-4 space-y-2 text-sm text-slate-200">
                      {localizedCard.bullets.map((bullet, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="mt-1 text-green-400">✓</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>

                    {note && <div className="text-xs text-slate-400">{note}</div>}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
