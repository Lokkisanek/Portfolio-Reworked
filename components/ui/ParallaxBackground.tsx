'use client';

import { useEffect, useState, useRef } from 'react';

export default function ParallaxBackground() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [scrollY, setScrollY] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
            const y = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1
            setMousePos({ x, y });
        };

        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Calculate parallax offsets for each layer (more subtle speeds)
    const skyOffset = {
        x: mousePos.x * 3,
        y: mousePos.y * 3 + scrollY * 0.05,
    };

    const distantOffset = {
        x: mousePos.x * 10,
        y: mousePos.y * 8 + scrollY * 0.2,
    };

    const hillsOffset = {
        x: mousePos.x * 20,
        y: mousePos.y * 15 + scrollY * 0.4,
    };

    const foregroundOffset = {
        x: mousePos.x * 35,
        y: mousePos.y * 25 + scrollY * 0.6,
    };

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{ zIndex: 0 }}
        >
            {/* Sky Layer - Dark gradient background */}
            <div
                className="absolute inset-0 w-full h-full"
                style={{
                    backgroundImage: 'url(/parallax/sky.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transform: `translate3d(${skyOffset.x}px, ${skyOffset.y}px, 0)`,
                    willChange: 'transform',
                }}
            />

            {/* Distant Mountains - Dark silhouettes */}
            <div
                className="absolute inset-0 w-full h-full"
                style={{
                    backgroundImage: 'url(/parallax/distant.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center bottom',
                    backgroundRepeat: 'no-repeat',
                    transform: `translate3d(${distantOffset.x}px, ${distantOffset.y}px, 0)`,
                    willChange: 'transform',
                    opacity: 0.8,
                }}
            />

            {/* Mid-range Hills - Black silhouettes */}
            <div
                className="absolute inset-0 w-full h-full"
                style={{
                    backgroundImage: 'url(/parallax/hills.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center bottom',
                    backgroundRepeat: 'no-repeat',
                    transform: `translate3d(${hillsOffset.x}px, ${hillsOffset.y}px, 0)`,
                    willChange: 'transform',
                }}
            />

            {/* Foreground - CSS gradient overlay for depth */}
            <div
                className="absolute inset-0 w-full h-full"
                style={{
                    background: 'linear-gradient(to bottom, transparent 0%, transparent 60%, rgba(0,0,0,0.3) 85%, rgba(0,0,0,0.6) 100%)',
                    transform: `translate3d(${foregroundOffset.x}px, ${foregroundOffset.y}px, 0)`,
                    willChange: 'transform',
                }}
            />
        </div>
    );
}
