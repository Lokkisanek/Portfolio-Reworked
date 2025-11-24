'use client';

import { useEdit } from '@/context/EditContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function BackgroundToggle() {
    const { isAuthenticated, backgroundType, setBackgroundType } = useEdit();
    const [showLabel, setShowLabel] = useState(false);

    if (!isAuthenticated) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-24 right-6 z-50 flex flex-col items-end gap-2"
            onMouseEnter={() => setShowLabel(true)}
            onMouseLeave={() => setShowLabel(false)}
        >
            <AnimatePresence>
                {showLabel && (
                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 text-white text-sm whitespace-nowrap"
                    >
                        Background: {backgroundType === 'starfield' ? 'Starfield' : 'Color Bends'}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex items-center gap-3 px-4 py-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg">
                <button
                    onClick={() => setBackgroundType('starfield')}
                    className={`group relative p-3 rounded-lg transition-all duration-300 ${backgroundType === 'starfield'
                            ? 'bg-white/20 shadow-lg'
                            : 'hover:bg-white/5'
                        }`}
                    title="Starfield"
                >
                    {/* Stars icon */}
                    <svg
                        className={`w-5 h-5 transition-colors ${backgroundType === 'starfield' ? 'text-white' : 'text-white/60'
                            }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {backgroundType === 'starfield' && (
                        <motion.div
                            layoutId="activeIndicator"
                            className="absolute inset-0 rounded-lg border-2 border-white/40"
                        />
                    )}
                </button>

                <div className="w-px h-8 bg-white/20" />

                <button
                    onClick={() => setBackgroundType('colorbends')}
                    className={`group relative p-3 rounded-lg transition-all duration-300 ${backgroundType === 'colorbends'
                            ? 'bg-white/20 shadow-lg'
                            : 'hover:bg-white/5'
                        }`}
                    title="Color Bends"
                >
                    {/* Gradient icon */}
                    <svg
                        className={`w-5 h-5 transition-colors ${backgroundType === 'colorbends' ? 'text-white' : 'text-white/60'
                            }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                        />
                    </svg>
                    {backgroundType === 'colorbends' && (
                        <motion.div
                            layoutId="activeIndicator"
                            className="absolute inset-0 rounded-lg border-2 border-white/40"
                        />
                    )}
                </button>
            </div>
        </motion.div>
    );
}
