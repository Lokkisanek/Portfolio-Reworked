"use client";

import React from 'react'

type Service = {
  id: number
  title: string
  priceText: string
  price: number | null
  bullets: string[]
  note?: string
}

const services: Service[] = [
  {
    id: 1,
    title: '1. Web Design & UI/UX',
    priceText: 'From 1 500 CZK',
    price: 1500,
    bullets: ['Homepage design (Figma or HTML prototype)', 'UX consultation — layout, flow, colors', 'Responsive for mobile/desktop'],
  },
  {
    id: 2,
    title: '2. Custom Website (development)',
    priceText: 'From 3 000 CZK',
    price: 3000,
    bullets: ['HTML, CSS, JavaScript (or React)', 'Responsive for mobile/tablet', 'Basic forms & simple animations'],
  },
  {
    id: 3,
    title: '3. Personal Mini Brand',
    priceText: 'From 2 000 CZK',
    price: 2000,
    bullets: ['Simple logo / icon', 'Color palette & typography', 'Visual style for web / social posts'],
  },
  {
    id: 4,
    title: '4. Existing Site Improvements',
    priceText: 'From 500 CZK / task',
    price: 500,
    bullets: ['Layout fixes', 'Mobile version improvements', 'Add new sections'],
  },
  {
    id: 5,
    title: '5. Basic SEO & Performance',
    priceText: 'From 800 CZK',
    price: 800,
    bullets: ['Meta tags, headings, structure', 'Image optimization', 'Basic site analysis & recommendations'],
  },
  {
    id: 6,
    title: '6. Consultation',
    priceText: 'Free (20 min) / then 300 CZK / 30 min',
    price: 300,
    bullets: ['Site structure planning', 'Technology choice', 'UX/UI or content advice'],
    note: 'First 20 minutes free',
  },
]

function formatCZK(n: number) {
  return n.toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ' ')+ ' Kč'
}

export default function Services() {
  return (
    <section id="services" className="py-12 px-6 sm:px-8 lg:px-16 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="bg-transparent">
          <h2 className="text-center text-3xl sm:text-4xl font-extrabold text-white mb-8">Services</h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => {
              const discounted = s.price ? Math.round(s.price * 0.8) : null
              const priceLabel = discounted ? `${formatCZK(discounted)}` : s.priceText
              return (
                <article key={s.id} className="p-6 rounded-xl bg-slate-900/30 border border-slate-800 hover:border-slate-700 transition">
                  <div className="flex flex-col">
                    <h3 className="text-lg font-semibold mb-2">{s.title}</h3>

                    <div className="mb-4">
                      <div className="mt-1">
                        <span className="text-indigo-300 text-xl font-bold">{priceLabel}</span>
                      </div>
                    </div>

                    <ul className="mb-4 space-y-2 text-sm text-slate-200">
                      {s.bullets.map((b, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="mt-1 text-green-400">✓</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>

                    {s.note && <div className="text-xs text-slate-400">{s.note}</div>}
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
