'use client';

import { useEffect, useRef, useState } from 'react';

export default function ColorBendsBackground() {
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

        // Light spectrum colors - simulating visible light refraction
        const lightSpectrum = [
            { r: 255, g: 0, b: 0 },     // Red - 700nm
            { r: 255, g: 127, b: 0 },   // Orange - 620nm
            { r: 255, g: 255, b: 0 },   // Yellow - 580nm
            { r: 0, g: 255, b: 0 },     // Green - 530nm
            { r: 0, g: 255, b: 255 },   // Cyan - 490nm
            { r: 0, g: 0, b: 255 },     // Blue - 450nm
            { r: 139, g: 0, b: 255 },   // Violet - 400nm
        ];

        // Animation loop
        const animate = () => {
            // Soft fade effect for smooth trails
            ctx.fillStyle = 'rgba(10, 10, 10, 0.08)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const mouse = mouseRef.current;
            const time = Date.now() * 0.0005;

            // Draw multiple light bands
            const numBands = 7;

            for (let i = 0; i < numBands; i++) {
                const color = lightSpectrum[i];

                // Calculate band position influenced by mouse
                const mouseInfluence = 0.15;
                const baseY = (canvas.height / (numBands + 1)) * (i + 1);
                const offsetY = Math.sin(time + i * 0.8) * 60;
                const mouseOffsetY = (mouse.y - canvas.height / 2) * mouseInfluence * (i / numBands);
                const y = baseY + offsetY + mouseOffsetY;

                // Mouse horizontal influence for wave phase
                const mousePhaseShift = (mouse.x / canvas.width) * Math.PI;

                // Create wavy light band path
                ctx.beginPath();

                const points: { x: number; y: number }[] = [];
                for (let x = 0; x <= canvas.width; x += 8) {
                    const waveY = y +
                        Math.sin(x * 0.01 + time * 2 + i + mousePhaseShift) * 35 +
                        Math.sin(x * 0.005 + time * 1.5) * 20;
                    points.push({ x, y: waveY });

                    if (x === 0) {
                        ctx.moveTo(x, waveY);
                    } else {
                        ctx.lineTo(x, waveY);
                    }
                }

                // Complete the band shape for fill
                ctx.lineTo(canvas.width, canvas.height);
                ctx.lineTo(0, canvas.height);
                ctx.closePath();

                // Create gradient for volumetric light effect
                const gradient = ctx.createLinearGradient(0, y - 120, 0, y + 120);
                gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
                gradient.addColorStop(0.2, `rgba(${color.r}, ${color.g}, ${color.b}, 0.08)`);
                gradient.addColorStop(0.35, `rgba(${color.r}, ${color.g}, ${color.b}, 0.18)`);
                gradient.addColorStop(0.5, `rgba(${color.r}, ${color.g}, ${color.b}, 0.25)`);
                gradient.addColorStop(0.65, `rgba(${color.r}, ${color.g}, ${color.b}, 0.18)`);
                gradient.addColorStop(0.8, `rgba(${color.r}, ${color.g}, ${color.b}, 0.08)`);
                gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);

                ctx.fillStyle = gradient;
                ctx.fill();

                // Draw glowing edge - main light beam
                ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.5)`;
                ctx.lineWidth = 4;
                ctx.filter = 'blur(12px)';

                ctx.beginPath();
                for (let j = 0; j < points.length; j++) {
                    if (j === 0) {
                        ctx.moveTo(points[j].x, points[j].y);
                    } else {
                        ctx.lineTo(points[j].x, points[j].y);
                    }
                }
                ctx.stroke();

                // Draw sharper center line
                ctx.strokeStyle = `rgba(${Math.min(255, color.r + 50)}, ${Math.min(255, color.g + 50)}, ${Math.min(255, color.b + 50)}, 0.7)`;
                ctx.lineWidth = 2;
                ctx.filter = 'blur(4px)';

                ctx.beginPath();
                for (let j = 0; j < points.length; j++) {
                    if (j === 0) {
                        ctx.moveTo(points[j].x, points[j].y);
                    } else {
                        ctx.lineTo(points[j].x, points[j].y);
                    }
                }
                ctx.stroke();

                ctx.filter = 'none';

                // Add light particles/sparkles along the band
                if (Math.random() > 0.7) {
                    const sparkleX = Math.random() * canvas.width;
                    const waveY = y +
                        Math.sin(sparkleX * 0.01 + time * 2 + i + mousePhaseShift) * 35 +
                        Math.sin(sparkleX * 0.005 + time * 1.5) * 20;

                    const sparkleGradient = ctx.createRadialGradient(sparkleX, waveY, 0, sparkleX, waveY, 8);
                    sparkleGradient.addColorStop(0, `rgba(255, 255, 255, 0.8)`);
                    sparkleGradient.addColorStop(0.3, `rgba(${color.r}, ${color.g}, ${color.b}, 0.5)`);
                    sparkleGradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);

                    ctx.fillStyle = sparkleGradient;
                    ctx.beginPath();
                    ctx.arc(sparkleX, waveY, 8, 0, Math.PI * 2);
                    ctx.fill();
                }
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
            className="fixed inset-0 w-full h-full pointer-events-none z-0"
            style={{ background: '#0a0a0a' }}
        />
    );
}
