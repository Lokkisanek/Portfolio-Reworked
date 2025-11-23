'use client';

import { useEdit } from '@/context/EditContext';
import EditableText from '@/components/EditableText';
import { motion } from 'framer-motion';
import { Music } from 'lucide-react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function SpotifyWidget() {
    const { content } = useEdit();
    const { data, error } = useSWR('/api/spotify', fetcher, { refreshInterval: 10000 });

    // Fallback to manual content if API fails or returns not playing
    const isPlaying = data?.isPlaying;
    const songName = isPlaying ? data.title : content.spotify?.song;
    const artistName = isPlaying ? data.artist : content.spotify?.artist;
    const albumImage = isPlaying ? data.albumImageUrl : null;

    if (!content.spotify) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="fixed bottom-6 left-6 z-40 bg-black/40 backdrop-blur-xl border border-white/10 p-4 rounded-2xl flex items-center gap-4 shadow-2xl hover:bg-black/60 transition group"
        >
            <div className="relative w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                {albumImage ? (
                    <img src={albumImage} alt="Album Art" className="w-full h-full object-cover" />
                ) : (
                    <Music className="text-black z-10" size={20} />
                )}
                {!albumImage && <div className="absolute inset-0 bg-gradient-to-tr from-green-600 to-green-400 opacity-80" />}
            </div>

            <div className="flex flex-col min-w-[120px]">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase tracking-wider text-green-400 font-bold">
                        {isPlaying ? 'Now Playing' : 'Offline / Last Played'}
                    </span>
                    <div className="flex gap-[2px] items-end h-3">
                        {[1, 2, 3].map((i) => (
                            <motion.div
                                key={i}
                                className="w-[2px] bg-green-500 rounded-full"
                                animate={{
                                    height: isPlaying ? [4, 12, 4] : 4,
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

                {isPlaying ? (
                    <>
                        <span className="text-sm font-bold text-white truncate max-w-[150px]">{songName}</span>
                        <span className="text-xs text-gray-400 truncate max-w-[150px]">{artistName}</span>
                    </>
                ) : (
                    <>
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
                    </>
                )}
            </div>
        </motion.div>
    );
}
