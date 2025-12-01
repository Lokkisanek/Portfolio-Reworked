'use client';

import { useEdit } from '@/context/EditContext';
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Home, User, Code, Briefcase, Mail, Lock, Unlock, X } from 'lucide-react';
import GlassSurface from '@/components/ui/GlassSurface';
import { useLocale } from '@/context/LocaleContext';
import { supportedLocales } from '@/lib/i18n';
import { hasLocaleBundle, t } from '@/lib/translate';
import { useScroll } from '@/components/ScrollContext';

export default function FloatingDock() {
    const mouseX = useMotionValue(Infinity);
    const { isEditing, isAuthenticated, toggleEdit, login } = useEdit();
    const { locale } = useLocale();
    const [showLogin, setShowLogin] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const handleAdminClick = () => {
        if (isAuthenticated) {
            toggleEdit();
        } else {
            setShowLogin(true);
        }
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (login(password)) {
            setShowLogin(false);
            setPassword('');
            setError(false);
        } else {
            setError(true);
        }
    };

    return (
        <>
            <motion.div
                onMouseMove={(e) => mouseX.set(e.pageX)}
                onMouseLeave={() => mouseX.set(Infinity)}
                className="fixed top-6 left-1/2 -translate-x-1/2 z-50"
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
                        <DockIcon mouseX={mouseX} href="#hero" icon={Home} label={t('navbar.home', locale)} />
                        <DockIcon mouseX={mouseX} href="#about" icon={User} label={t('navbar.about', locale)} />
                        <DockIcon mouseX={mouseX} href="#skills" icon={Code} label={t('navbar.skills', locale)} />
                        <DockIcon mouseX={mouseX} href="#projects" icon={Briefcase} label={t('navbar.projects', locale)} />
                        <DockIcon mouseX={mouseX} href="#contact" icon={Mail} label={t('navbar.contact', locale)} />

                        <div className="w-[1px] h-8 bg-white/15 mx-1 self-center" />

                        <button onClick={handleAdminClick} className="relative group">
                                <DockIconContent
                                    mouseX={mouseX}
                                    icon={isEditing ? Unlock : Lock}
                                    label={isEditing ? t('navbar.lock', locale) : t('navbar.admin', locale)}
                                />
                        </button>

                            <LanguageDockButton mouseX={mouseX} />
                    </div>
                </GlassSurface>
            </motion.div>

            {/* Login Modal */}
            {showLogin && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center">
                    <div className="bg-gray-900 p-8 rounded-lg shadow-2xl w-full max-w-md relative border border-gray-800">
                        <button
                            onClick={() => setShowLogin(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                        >
                            <X />
                        </button>

                        <h2 className="text-2xl font-bold text-white mb-6">Admin Login</h2>

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white focus:border-blue-500 outline-none"
                                    placeholder="Enter admin password"
                                    autoFocus
                                />
                                {error && <p className="text-red-500 text-sm mt-2">Incorrect password</p>}
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded font-bold transition"
                            >
                                Login
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

function DockIcon({ mouseX, href, icon: Icon, label }: { mouseX: MotionValue; href: string; icon: any; label: string }) {
    const { setSelected } = useScroll();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setSelected(href.replace('#', ''));
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

function LanguageDockButton({ mouseX }: { mouseX: MotionValue }) {
    const { locale, setLocale } = useLocale();
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
        setLocale(key);
        setOpen(false);
        try {
            fetch('/api/locale', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ locale: key }),
            });
        } catch {
            /* noop */
        }
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
