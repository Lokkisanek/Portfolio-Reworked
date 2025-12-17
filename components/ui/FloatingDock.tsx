'use client';

import { motion, useMotionValue, useSpring, useTransform, MotionValue, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Home, User, Code, Briefcase, Mail, X, Menu } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import GlassSurface from '@/components/ui/GlassSurface';
import { useLocale } from '@/context/LocaleContext';
import { supportedLocales } from '@/lib/i18n';
import { hasLocaleBundle, t } from '@/lib/translate';
import { useScroll } from '@/components/ScrollContext';

export default function FloatingDock() {
    const mouseX = useMotionValue(Infinity);
    const { locale, setLocale } = useLocale();
    const { setSelected } = useScroll();
    
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems: NavItem[] = [
        { href: '#hero', icon: Home, label: t('navbar.home', locale) },
        { href: '#about', icon: User, label: t('navbar.about', locale) },
        { href: '#skills', icon: Code, label: t('navbar.skills', locale) },
        { href: '#projects', icon: Briefcase, label: t('navbar.projects', locale) },
        { href: '#contact', icon: Mail, label: t('navbar.contact', locale) },
    ];

    

    const handleLocaleChange = (key: string) => {
        setLocale(key);
        try {
            fetch('/api/locale', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ locale: key })
            });
        } catch {
            /* noop */
        }
    };

    const handleNavigate = (hash: string) => {
        setSelected(hash.replace('#', ''));
    };

    

    useEffect(() => {
        if (!mobileMenuOpen) return;
        const { body, documentElement } = document;
        const prevBody = body.style.overflow;
        const prevRoot = documentElement.style.overflow;
        body.style.overflow = 'hidden';
        documentElement.style.overflow = 'hidden';
        return () => {
            body.style.overflow = prevBody;
            documentElement.style.overflow = prevRoot;
        };
    }, [mobileMenuOpen]);

    return (
        <>
            <motion.div
                className="hidden md:block fixed top-6 left-1/2 -translate-x-1/2 z-50"
                onMouseMove={(e) => mouseX.set(e.pageX)}
                onMouseLeave={() => mouseX.set(Infinity)}
            >
                <GlassSurface
                    width="auto"
                    height="auto"
                    borderRadius={40}
                    borderWidth={0.18}
                    displace={10}
                    distortionScale={-140}
                    redOffset={6}
                    greenOffset={14}
                    blueOffset={28}
                    brightness={62}
                    opacity={0.9}
                    mixBlendMode="screen"
                    backgroundOpacity={0.12}
                    saturation={1.4}
                    blur={22}
                    className="pointer-events-auto"
                >
                    <div className="flex items-center gap-4 px-6 py-3">
                        {navItems.map((item) => (
                            <DockIcon
                                key={item.href}
                                mouseX={mouseX}
                                href={item.href}
                                icon={item.icon}
                                label={item.label}
                                onNavigate={handleNavigate}
                            />
                        ))}
                        <LanguageDockButton mouseX={mouseX} onLocaleChange={handleLocaleChange} />
                    </div>
                </GlassSurface>
            </motion.div>

            <MobileDock
                navItems={navItems}
                isOpen={mobileMenuOpen}
                onToggle={() => setMobileMenuOpen((prev) => !prev)}
                onClose={() => setMobileMenuOpen(false)}
                onNavigate={(hash) => {
                    handleNavigate(hash);
                    setMobileMenuOpen(false);
                }}
                locale={locale}
                onLocaleChange={(key) => {
                    handleLocaleChange(key);
                    setMobileMenuOpen(false);
                }}
            />

            
        </>
    );
}

function DockIcon({ mouseX, href, icon: Icon, label, onNavigate }: { mouseX: MotionValue; href: string; icon: LucideIcon; label: string; onNavigate: (hash: string) => void }) {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        onNavigate(href);
    };

    return (
        <a href={href} onClick={handleClick}>
            <DockIconContent mouseX={mouseX} icon={Icon} label={label} />
        </a>
    );
}

function DockIconContent({ mouseX, icon: Icon, label }: { mouseX: MotionValue; icon: any; label: string }) {
    const ref = useRef<HTMLDivElement>(null);

    const distance = useTransform(mouseX, (val) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val - bounds.x - bounds.width / 2;
    });

    const widthTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
    const width = useSpring(widthTransform, { mass: 0.1, stiffness: 150, damping: 12 });

    const [hovered, setHovered] = useState(false);

    return (
        <div className="relative flex flex-col items-center">
            {/* Tooltip - appears below */}
            {hovered && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 10 }}
                    className="absolute top-full mt-2 px-3 py-1 bg-black/60 text-white text-xs rounded border border-white/20 whitespace-nowrap backdrop-blur"
                >
                    {label}
                </motion.div>
            )}

            <motion.div
                ref={ref}
                style={{ width, height: width }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className="aspect-square rounded-full bg-white/10 border border-white/20 flex items-center justify-center transition-colors shadow-lg backdrop-blur-sm hover:bg-white/20"
            >
                <Icon className="w-1/2 h-1/2 text-white" />
            </motion.div>
        </div>
    );
}

function LanguageDockButton({ mouseX, onLocaleChange }: { mouseX: MotionValue; onLocaleChange: (key: string) => void }) {
    const { locale } = useLocale();
    const [hovered, setHovered] = useState(false);
    const [open, setOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const distance = useTransform(mouseX, (val) => {
        const bounds = buttonRef.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val - bounds.x - bounds.width / 2;
    });
    const widthTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
    const width = useSpring(widthTransform, { mass: 0.1, stiffness: 150, damping: 12 });

    useEffect(() => {
        if (!open) return;
        const closeOnOutside = (event: MouseEvent) => {
            if (!containerRef.current) return;
            if (!containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('click', closeOnOutside);
        return () => document.removeEventListener('click', closeOnOutside);
    }, [open]);

    const localeOptions = Object.entries(supportedLocales).filter(([key]) => hasLocaleBundle(key));

    const selectLocale = (key: string) => {
        onLocaleChange(key);
        setOpen(false);
    };

    return (
        <div className="relative flex flex-col items-center" ref={containerRef}>
            {hovered && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 10 }}
                    className="absolute top-full mt-2 px-3 py-1 bg-black/60 text-white text-xs rounded border border-white/20 whitespace-nowrap backdrop-blur"
                >
                    {supportedLocales[locale]?.native || locale}
                </motion.div>
            )}

            <motion.button
                ref={buttonRef}
                type="button"
                style={{ width, height: width }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onClick={(e) => {
                    e.stopPropagation();
                    setOpen((s) => !s);
                }}
                className="aspect-square rounded-full bg-white/10 border border-white/20 flex items-center justify-center transition-colors shadow-lg backdrop-blur-sm hover:bg-white/20"
            >
                <span className="text-xl" aria-hidden>
                    {flagFor(locale)}
                </span>
                <span className="sr-only">{supportedLocales[locale]?.name || 'Language'}</span>
            </motion.button>

            {open && (
                <div className="absolute top-full mt-3 w-48 rounded-xl bg-slate-900/95 border border-white/10 shadow-2xl z-50 backdrop-blur">
                    <ul className="py-1 max-h-64 overflow-y-auto">
                        {localeOptions.map(([key, val]) => (
                            <li key={key}>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        selectLocale(key);
                                    }}
                                    className="w-full text-left px-3 py-2 hover:bg-white/5 flex items-center gap-2 text-gray-100"
                                >
                                    <span className="text-lg" aria-hidden>
                                        {flagFor(key)}
                                    </span>
                                    <span className="text-sm">{val.native}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

function flagFor(code: string): string {
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
}

type NavItem = {
    href: string;
    label: string;
    icon: LucideIcon;
};

type MobileDockProps = {
    navItems: NavItem[];
    isOpen: boolean;
    onToggle: () => void;
    onClose: () => void;
    onNavigate: (href: string) => void;
    locale: string;
    onLocaleChange: (key: string) => void;
};

function MobileDock({
    navItems,
    isOpen,
    onToggle,
    onClose,
    onNavigate,
    locale,
    onLocaleChange,
}: MobileDockProps) {
    const localeOptions = Object.entries(supportedLocales).filter(([key]) => hasLocaleBundle(key));

    return (
        <div className="md:hidden fixed top-4 right-4 z-50">
            <button
                type="button"
                onClick={onToggle}
                className="rounded-full border border-white/15 bg-black/60 backdrop-blur px-4 py-3 text-white shadow-lg"
                aria-expanded={isOpen}
                aria-label="Toggle navigation menu"
            >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.button
                            type="button"
                            className="fixed inset-0 bg-black/70"
                            onClick={onClose}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        />
                        <motion.div
                            className="fixed top-16 right-4 left-4 rounded-3xl border border-white/10 bg-slate-900/95 p-6 text-white shadow-2xl backdrop-blur"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <nav className="space-y-2">
                                {navItems.map((item) => (
                                    <button
                                        key={item.href}
                                        type="button"
                                        onClick={() => onNavigate(item.href)}
                                        className="w-full flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-left text-base font-medium hover:bg-white/10"
                                    >
                                        <item.icon className="w-5 h-5 text-white/70" />
                                        <span>{item.label}</span>
                                    </button>
                                ))}
                            </nav>

                            <div className="mt-4 space-y-4 border-t border-white/10 pt-4">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.3em] text-white/60 mb-2">Languages</p>
                                    <div className="flex flex-wrap gap-2">
                                        {localeOptions.map(([key, val]) => (
                                            <button
                                                key={key}
                                                type="button"
                                                onClick={() => onLocaleChange(key)}
                                                className={`flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm ${
                                                    key === locale
                                                        ? 'border-white/40 bg-white/15'
                                                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                                                }`}
                                            >
                                                <span className="text-lg" aria-hidden>
                                                    {flagFor(key)}
                                                </span>
                                                <span>{val.native}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
