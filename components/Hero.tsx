'use client';

import EditableText from './EditableText';
import MotionWrapper from './ui/MotionWrapper';
import { motion } from 'framer-motion';

export default function Hero() {
    return (
        <section id="hero" className="relative h-screen flex flex-col justify-center items-center text-center overflow-hidden">
            <div className="z-10 relative px-6">
                <MotionWrapper delay={0.1}>
                    <div className="inline-block px-3 py-1 mb-4 text-sm font-medium text-blue-400 bg-blue-500/10 rounded-full border border-blue-500/20 backdrop-blur-sm">
                        Welcome to my portfolio
                    </div>
                </MotionWrapper>

                <MotionWrapper delay={0.2}>
                    <EditableText
                        section="hero"
                        field="name"
                        as="h1"
                        className="text-6xl md:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400 tracking-tight"
                    />
                </MotionWrapper>

                <MotionWrapper delay={0.3}>
                    <EditableText
                        section="hero"
                        field="title"
                        as="h2"
                        className="text-2xl md:text-4xl text-gray-400 mb-8 font-light"
                    />
                </MotionWrapper>

                <MotionWrapper delay={0.4}>
                    <EditableText
                        section="hero"
                        field="description"
                        as="p"
                        className="text-lg max-w-2xl mx-auto text-gray-300 leading-relaxed"
                    />
                </MotionWrapper>

                <MotionWrapper delay={0.5} className="mt-10">
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="text-gray-500 text-sm"
                    >
                        Scroll Down
                    </motion.div>
                </MotionWrapper>
            </div>
        </section>
    );
}
