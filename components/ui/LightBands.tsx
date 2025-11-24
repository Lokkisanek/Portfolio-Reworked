'use client';

import { useEffect, useRef, useState } from 'react';

export default function LightBands() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const animationRef = useRef<number | undefined>(undefined);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const resizeCanvas = () => {
            if (canvas) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Mouse tracking
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener('mousemove', handleMouseMove);

        // Light spectrum colors
        const lightSpectrum = [
            { r: 255, g: 0, b: 0 },     // Red
            { r: 255, g: 127, b: 0 },   // Orange
            { r: 255, g: 255, b: 0 },   // Yellow
            { r: 0, g: 255, b: 0 },     // Green
            { r: 0, g: 255, b: 255 },   // Cyan
            { r: 0, g: 0, b: 255 },     // Blue
            { r: 139, g: 0, b: 255 },   // Violet
        ];

        // Animation loop
        const animate = () => {
            // Clear canvas
            ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const mouse = mouseRef.current;
            const time = Date.now() * 0.0005;

            // Draw multiple light bands
            const numBands = 7;

            for (let i = 0; i < numBands; i++) {
                const color = lightSpectrum[i];

                // Calculate band position influenced by mouse
                const mouseInfluence = 0.3;
                const baseY = (canvas.height / (numBands + 1)) * (i + 1);
                const offsetY = Math.sin(time + i * 0.5) * 50;
                const mouseOffsetY = (mouse.y - canvas.height / 2) * mouseInfluence * (i / numBands);
                const y = baseY + offsetY + mouseOffsetY;

                // Mouse horizontal influence
                const mouseOffsetX = (mouse.x - canvas.width / 2) * 0.1;

                // Create wavy light band
                ctx.beginPath();

                for (let x = 0; x <= canvas.width; x += 10) {
                    const waveY = y + Math.sin(x * 0.01 + time * 2 + i) * 30;

                    if (x === 0) {
                        ctx.moveTo(x, waveY);
                    } else {
                        ctx.lineTo(x, waveY);
                    }
                }

                // Complete the band shape
                ctx.lineTo(canvas.width, canvas.height);
                ctx.lineTo(0, canvas.height);
                ctx.closePath();

                // Create gradient for light effect
                const gradient = ctx.createLinearGradient(0, y - 100, 0, y + 100);
                gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
                gradient.addColorStop(0.3, `rgba(${color.r}, ${color.g}, ${color.b}, 0.15)`);
                gradient.addColorStop(0.5, `rgba(${color.r}, ${color.g}, ${color.b}, 0.25)`);
                gradient.addColorStop(0.7, `rgba(${color.r}, ${color.g}, ${color.b}, 0.15)`);
                gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);

                ctx.fillStyle = gradient;
                ctx.fill();

                // Draw glowing edge
                ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.4)`;
                ctx.lineWidth = 3;
                ctx.filter = 'blur(8px)';

                ctx.beginPath();
                for (let x = 0; x <= canvas.width; x += 10) {
                    const waveY = y + Math.sin(x * 0.01 + time * 2 + i) * 30;

                    if (x === 0) {
                        ctx.moveTo(x, waveY);
                    } else {
                        ctx.lineTo(x, waveY);
                    }
                }
                ctx.stroke();
                ctx.filter = 'none';
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full pointer-events-none z-[1]"
            style={{ mixBlendMode: 'screen' }}
        />
    );
}
