'use client';

import { useEdit } from '@/context/EditContext';
import EditableText from '@/components/EditableText';
import { motion } from 'framer-motion';
import { Music } from 'lucide-react';

export default function SpotifyWidget() {
    const { content } = useEdit();

    if (!content.spotify) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="fixed bottom-6 left-6 z-40 bg-black/40 backdrop-blur-xl border border-white/10 p-4 rounded-2xl flex items-center gap-4 shadow-2xl hover:bg-black/60 transition group"
        >
            <div className="relative w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                <Music className="text-black z-10" size={20} />
                <div className="absolute inset-0 bg-gradient-to-tr from-green-600 to-green-400 opacity-80" />
            </div>

            <div className="flex flex-col min-w-[120px]">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase tracking-wider text-green-400 font-bold">
                        My Anthem
                    </span>
                    <div className="flex gap-[2px] items-end h-3">
                        {[1, 2, 3].map((i) => (
                            <motion.div
                                key={i}
                                className="w-[2px] bg-green-500 rounded-full"
                                animate={{
                                    height: [4, 12, 4],
                                }}
                                transition={{
                                    duration: 0.5,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                    delay: i * 0.1,
                                }}
                            />
                        ))}
                    </div>
                </div>

                <EditableText
                    section="spotify"
                    field="song"
                    as="span"
                    className="text-sm font-bold text-white truncate max-w-[150px]"
                />
                <EditableText
                    section="spotify"
                    field="artist"
                    as="span"
                    className="text-xs text-gray-400 truncate max-w-[150px]"
                />
            </div>
        </motion.div>
    );
}
