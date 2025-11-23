'use client';

import { motion } from "framer-motion";

export default function BackgroundBeams() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -inset-[10px] opacity-50">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/20 blur-[100px] rounded-full mix-blend-screen animate-pulse" />
                <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-purple-500/20 blur-[100px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-500/20 blur-[100px] rounded-full mix-blend-screen" />
            </div>
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
        </div>
    );
}
