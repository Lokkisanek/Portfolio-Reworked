'use client';

import { useEffect, useRef } from 'react';

interface Star {
    x: number;
    y: number;
    z: number;
    size: number;
    vx: number;
    vy: number;
    alpha: number;
    consumed: boolean;
}

export default function StarfieldBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const starsRef = useRef<Star[]>([]);
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

        // Initialize stars
        const initStars = () => {
            starsRef.current = [];
            const numStars = 500;

            for (let i = 0; i < numStars; i++) {
                starsRef.current.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    z: Math.random() * 1000,
                    size: Math.random() * 2 + 0.5,
                    vx: 0,
                    vy: 0,
                    alpha: 1,
                    consumed: false,
                });
            }
        };
        initStars();

        // Mouse tracking
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener('mousemove', handleMouseMove);

        // Animation loop
        const animate = () => {
            ctx.fillStyle = 'rgba(10, 10, 10, 0.15)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const mouse = mouseRef.current;
            const blackHoleRadius = 150; // Attraction radius
            const consumeRadius = 30; // Consumption radius
            const attractionStrength = 0.0008;

            starsRef.current.forEach((star) => {
                if (star.consumed) return;

                // Calculate distance to mouse (black hole)
                const dx = mouse.x - star.x;
                const dy = mouse.y - star.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Black hole attraction
                if (distance < blackHoleRadius) {
                    const force = attractionStrength * (1 - distance / blackHoleRadius) * 100;
                    star.vx += (dx / distance) * force;
                    star.vy += (dy / distance) * force;
                }

                // Apply velocity with damping
                star.x += star.vx;
                star.y += star.vy;
                star.vx *= 0.98;
                star.vy *= 0.98;

                // Starfield movement (flying through space effect)
                star.z -= 2;
                if (star.z <= 0) {
                    star.z = 1000;
                    star.x = Math.random() * canvas.width;
                    star.y = Math.random() * canvas.height;
                    star.alpha = 1;
                    star.consumed = false;
                }

                // Check if consumed by black hole
                if (distance < consumeRadius) {
                    star.alpha -= 0.05;
                    if (star.alpha <= 0) {
                        star.consumed = true;
                        // Respawn star
                        setTimeout(() => {
                            star.x = Math.random() * canvas.width;
                            star.y = Math.random() * canvas.height;
                            star.z = 1000;
                            star.alpha = 1;
                            star.consumed = false;
                            star.vx = 0;
                            star.vy = 0;
                        }, 100);
                    }
                }

                // Wrap around edges
                if (star.x < 0) star.x = canvas.width;
                if (star.x > canvas.width) star.x = 0;
                if (star.y < 0) star.y = canvas.height;
                if (star.y > canvas.height) star.y = 0;

                // Calculate star properties based on depth
                const scale = 1000 / (1000 + star.z);
                const size = star.size * scale;
                const brightness = Math.min(1, scale * 2);

                // Draw star with glow
                const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, size * 3);
                gradient.addColorStop(0, `rgba(255, 255, 255, ${brightness * star.alpha})`);
                gradient.addColorStop(0.3, `rgba(200, 220, 255, ${brightness * star.alpha * 0.5})`);
                gradient.addColorStop(1, 'rgba(200, 220, 255, 0)');

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(star.x, star.y, size * 3, 0, Math.PI * 2);
                ctx.fill();

                // Draw core
                ctx.fillStyle = `rgba(255, 255, 255, ${brightness * star.alpha})`;
                ctx.beginPath();
                ctx.arc(star.x, star.y, size, 0, Math.PI * 2);
                ctx.fill();

                // Draw motion trail for fast-moving stars
                const speed = Math.sqrt(star.vx * star.vx + star.vy * star.vy);
                if (speed > 0.5) {
                    ctx.strokeStyle = `rgba(255, 255, 255, ${Math.min(speed * 0.1, 0.3) * star.alpha})`;
                    ctx.lineWidth = size * 0.5;
                    ctx.beginPath();
                    ctx.moveTo(star.x - star.vx * 3, star.y - star.vy * 3);
                    ctx.lineTo(star.x, star.y);
                    ctx.stroke();
                }
            });

            // Draw black hole at cursor
            const blackHoleGradient = ctx.createRadialGradient(
                mouse.x, mouse.y, 0,
                mouse.x, mouse.y, consumeRadius
            );
            blackHoleGradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
            blackHoleGradient.addColorStop(0.5, 'rgba(20, 10, 40, 0.8)');
            blackHoleGradient.addColorStop(0.7, 'rgba(60, 30, 90, 0.4)');
            blackHoleGradient.addColorStop(1, 'rgba(100, 50, 150, 0)');

            ctx.fillStyle = blackHoleGradient;
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, consumeRadius, 0, Math.PI * 2);
            ctx.fill();

            // Accretion disk effect
            const time = Date.now() * 0.001;
            for (let i = 0; i < 3; i++) {
                const angle = time + i * (Math.PI * 2 / 3);
                const diskRadius = consumeRadius * 1.5;
                ctx.strokeStyle = `rgba(100, 50, 200, ${0.3 - i * 0.1})`;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(mouse.x, mouse.y, diskRadius + i * 5, angle, angle + Math.PI * 0.6);
                ctx.stroke();
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
