'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, Plus, Trash2, Minimize2, Maximize2, Palette, MousePointer2, Zap } from 'lucide-react';

import { useEdit } from '@/context/EditContext';

export default function GradientEditor() {
    const { isEditing, gradientSettings, updateGradientSettings, backgroundType, setBackgroundType } = useEdit();
    const [isOpen, setIsOpen] = useState(true);

    if (!isEditing) return null;

    const { colors, speed, mouseInfluence } = gradientSettings;

    const updateSettings = (newSettings: Partial<typeof gradientSettings>) => {
        updateGradientSettings({
            ...gradientSettings,
            ...newSettings
        });
    };

    const addColor = () => {
        if (colors.length < 8) {
            updateSettings({ colors: [...colors, '#ffffff'] });
        }
    };

    const removeColor = (index: number) => {
        if (colors.length > 2) {
            const newColors = [...colors];
            newColors.splice(index, 1);
            updateSettings({ colors: newColors });
        }
    };

    const updateColor = (index: number, value: string) => {
        const newColors = [...colors];
        newColors[index] = value;
        updateSettings({ colors: newColors });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-4 right-4 z-50"
        >
            <AnimatePresence mode="wait">
                {isOpen ? (
                    <motion.div
                        key="editor"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-black/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 w-80 shadow-2xl"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 text-white font-medium">
                                <Settings className="w-4 h-4" />
                                <span>Background Editor</span>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white/50 hover:text-white transition-colors"
                            >
                                <Minimize2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Background Type Selector */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-1 text-xs text-white/70">
                                    <Settings className="w-3 h-3" />
                                    <span>Background Style</span>
                                </div>
                                <select
                                    value={backgroundType}
                                    onChange={(e) => setBackgroundType(e.target.value as any)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-white/30 transition-colors"
                                >
                                    <option value="starfield">Starfield</option>
                                    <option value="flowing-gradient">Flowing Gradient</option>
                                    <option value="colorbends">Color Bends</option>
                                </select>
                            </div>

                            {/* Speed Control */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs text-white/70">
                                    <div className="flex items-center gap-1">
                                        <Zap className="w-3 h-3" />
                                        <span>Animation Speed</span>
                                    </div>
                                    <span>{speed.toFixed(1)}x</span>
                                </div>
                                <input
                                    type="range"
                                    min="0.1"
                                    max="5.0"
                                    step="0.1"
                                    value={speed}
                                    onChange={(e) => updateSettings({ speed: parseFloat(e.target.value) })}
                                    className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                                />
                            </div>

                            {/* Mouse Influence Control */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs text-white/70">
                                    <div className="flex items-center gap-1">
                                        <MousePointer2 className="w-3 h-3" />
                                        <span>Mouse Influence</span>
                                    </div>
                                    <span>{(mouseInfluence * 100).toFixed(0)}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="2.0"
                                    step="0.1"
                                    value={mouseInfluence}
                                    onChange={(e) => updateSettings({ mouseInfluence: parseFloat(e.target.value) })}
                                    className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                                />
                            </div>

                            {/* Colors Control */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-xs text-white/70">
                                    <div className="flex items-center gap-1">
                                        <Palette className="w-3 h-3" />
                                        <span>Colors ({colors.length}/8)</span>
                                    </div>
                                    <button
                                        onClick={addColor}
                                        disabled={colors.length >= 8}
                                        className="p-1 hover:bg-white/10 rounded disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                                    >
                                        <Plus className="w-3 h-3" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-4 gap-2">
                                    {colors.map((color, index) => (
                                        <div key={index} className="relative group">
                                            <div className="w-full aspect-square rounded-lg overflow-hidden border border-white/10 relative">
                                                <input
                                                    type="color"
                                                    value={color}
                                                    onChange={(e) => updateColor(index, e.target.value)}
                                                    className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] p-0 border-0 cursor-pointer"
                                                />
                                            </div>
                                            {colors.length > 2 && (
                                                <button
                                                    onClick={() => removeColor(index)}
                                                    className="absolute -top-1 -right-1 bg-red-500 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                                >
                                                    <X className="w-2 h-2" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.button
                        key="button"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={() => setIsOpen(true)}
                        className="bg-black/80 backdrop-blur-md border border-white/10 rounded-full p-3 text-white shadow-lg hover:bg-white/10 transition-colors"
                    >
                        <Settings className="w-5 h-5" />
                    </motion.button>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
