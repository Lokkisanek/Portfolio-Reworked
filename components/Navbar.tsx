"use client";

import React from 'react';
import Link from 'next/link';
import { useScroll } from '@/components/ScrollContext';
import { useLocale } from '@/context/LocaleContext';
import { supportedLocales } from '@/lib/i18n';
import { t } from '@/lib/translate';
import { useState } from 'react';

export default function Navbar() {
    const { setSelected } = useScroll();
    const { locale, setLocale } = useLocale();
    const [open, setOpen] = useState(false);

    const localesList = Object.entries(supportedLocales);

    const flagFor = (code: string) => {
        const flags: Record<string, string> = {
            en: '🇬🇧',
            cs: '🇨🇿',
            de: '🇩🇪',
            es: '🇪🇸',
            fr: '🇫🇷',
            zh: '🇨🇳',
            ru: '🇷🇺',
            pt: '🇵🇹',
            ar: '🇦🇪',
        };
        return flags[code] || '🏳️';
    };

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
        e.preventDefault();
        setSelected(hash.replace('#', ''));
    };
    return (
        <nav className="fixed top-0 left-0 w-full bg-black/80 backdrop-blur-md z-50 border-b border-gray-800">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold text-white">
                    {t('navbar.brand', locale)}
                </Link>
                <div className="flex items-center space-x-4">
                    <div className="hidden md:flex space-x-8">
                        <a href="#about" onClick={(e) => handleNavClick(e, '#about')} className="text-gray-300 hover:text-white transition">{t('navbar.about', locale)}</a>
                        <a href="#skills" onClick={(e) => handleNavClick(e, '#skills')} className="text-gray-300 hover:text-white transition">{t('navbar.skills', locale)}</a>
                        <a href="#projects" onClick={(e) => handleNavClick(e, '#projects')} className="text-gray-300 hover:text-white transition">{t('navbar.projects', locale)}</a>
                        <a href="#contact" onClick={(e) => handleNavClick(e, '#contact')} className="text-gray-300 hover:text-white transition">{t('navbar.contact', locale)}</a>
                        <Link href="/admin" className="text-blue-400 hover:text-blue-300 transition">{t('navbar.admin', locale)}</Link>
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => setOpen((s) => !s)}
                            aria-haspopup="listbox"
                            aria-expanded={open}
                            className="flex items-center gap-2 rounded border border-white/10 px-2 py-1 text-gray-300 hover:bg-white/5"
                        >
                            <span className="text-2xl">{flagFor(locale)}</span>
                            <span className="text-sm ml-1">{supportedLocales[locale]?.native || locale}</span>
                        </button>

                        {open && (
                            <div className="absolute right-0 mt-2 w-40 rounded bg-slate-900 border border-white/10 shadow-lg z-50">
                                <ul role="listbox" className="py-1">
                                    {localesList.map(([key, val]) => (
                                        <li key={key}>
                                            <button
                                                onClick={() => {
                                                    setLocale(key);
                                                    setOpen(false);
                                                    // attempt to persist on server (best-effort)
                                                    try {
                                                        fetch('/api/locale', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ locale: key }) });
                                                    } catch {}
                                                }}
                                                className="w-full text-left px-3 py-2 hover:bg-white/5 flex items-center gap-2 text-gray-200"
                                            >
                                                <span className="text-lg">{flagFor(key)}</span>
                                                <span className="text-sm">{val.native}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
