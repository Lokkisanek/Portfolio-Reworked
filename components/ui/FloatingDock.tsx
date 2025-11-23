'use client';

import { useEdit } from '@/context/EditContext';
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from 'framer-motion';
import { useRef, useState } from 'react';
import { Home, User, Code, Briefcase, Mail, Lock, Unlock, X } from 'lucide-react';
import Link from 'next/link';

export default function FloatingDock() {
    const mouseX = useMotionValue(Infinity);
    const { isEditing, isAuthenticated, toggleEdit, login } = useEdit();
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
                className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex h-16 items-end gap-4 rounded-2xl bg-gray-900/80 border border-white/10 px-4 pb-3 backdrop-blur-md shadow-2xl"
            >
                <DockIcon mouseX={mouseX} href="#hero" icon={Home} label="Home" />
                <DockIcon mouseX={mouseX} href="#about" icon={User} label="About" />
                <DockIcon mouseX={mouseX} href="#skills" icon={Code} label="Skills" />
                <DockIcon mouseX={mouseX} href="#projects" icon={Briefcase} label="Projects" />
                <DockIcon mouseX={mouseX} href="#contact" icon={Mail} label="Contact" />

                <div className="w-[1px] h-8 bg-white/10 mx-1 self-center" />

                <button onClick={handleAdminClick} className="relative group">
                    <DockIconContent mouseX={mouseX} icon={isEditing ? Unlock : Lock} label={isEditing ? "Lock" : "Admin"} />
                </button>
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
    return (
        <Link href={href}>
            <DockIconContent mouseX={mouseX} icon={Icon} label={label} />
        </Link>
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
                    className="absolute top-full mt-2 px-2 py-1 bg-gray-900/90 text-white text-xs rounded border border-white/10 whitespace-nowrap backdrop-blur-md"
                >
                    {label}
                </motion.div>
            )}

            <motion.div
                ref={ref}
                style={{ width, height: width }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className="aspect-square rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center hover:bg-gray-700 transition-colors shadow-lg"
            >
                <Icon className="w-1/2 h-1/2 text-gray-300" />
            </motion.div>
        </div>
    );
}
