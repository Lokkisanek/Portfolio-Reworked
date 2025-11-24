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
}

export default function StarfieldBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const starsRef = useRef<Star[]>([]);
    const mouseRef = useRef({ x: -1000, y: -1000 });
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
                    vx: (Math.random() - 0.5) * 0.2,
                    vy: (Math.random() - 0.5) * 0.2,
                    alpha: 1,
                });
            }
        };
        initStars();

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener('mousemove', handleMouseMove);

        // Animation loop
        const animate = () => {
            ctx.fillStyle = '#0a0a0a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const mouse = mouseRef.current;
            const attractionRadius = 240;
            const consumeRadius = 45;
            const attractionStrength = 0.005;
            const swirlStrength = 0.008;

            starsRef.current.forEach((star) => {
                // gentle drift
                star.x += star.vx;
                star.y += star.vy;

                // cursor attraction – pull nearby stars toward the pointer and let them fade out
                const dx = mouse.x - star.x;
                const dy = mouse.y - star.y;
                const distance = Math.sqrt(dx * dx + dy * dy) || 1;

                if (distance < attractionRadius) {
                    const force = attractionStrength * (1 - distance / attractionRadius);
                    star.vx += (dx / distance) * force;
                    star.vy += (dy / distance) * force;

                    if (distance > consumeRadius) {
                        const swirl = swirlStrength * (1 - distance / attractionRadius);
                        star.vx += (-dy / distance) * swirl;
                        star.vy += (dx / distance) * swirl;
                    }
                }

                if (distance < consumeRadius) {
                    star.alpha -= 0.18;
                } else {
                    star.alpha = Math.min(1, star.alpha + 0.02);
                }

                // mild damping keeps motion stable
                star.vx *= 0.99;
                star.vy *= 0.99;

                // Starfield movement (flying through space effect)
                star.z -= 4;
                if (star.z <= 0) {
                    star.z = 1000;
                    star.x = Math.random() * canvas.width;
                    star.y = Math.random() * canvas.height;
                    star.alpha = 1;
                    star.vx = (Math.random() - 0.5) * 0.2;
                    star.vy = (Math.random() - 0.5) * 0.2;
                }

                if (star.alpha <= 0) {
                    star.x = Math.random() * canvas.width;
                    star.y = Math.random() * canvas.height;
                    star.z = 1000;
                    star.alpha = 1;
                    star.vx = (Math.random() - 0.5) * 0.2;
                    star.vy = (Math.random() - 0.5) * 0.2;
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
            });

            // draw black hole visual at cursor while keeping default system cursor
            const gradient = ctx.createRadialGradient(
                mouse.x,
                mouse.y,
                0,
                mouse.x,
                mouse.y,
                consumeRadius * 2
            );
            gradient.addColorStop(0, 'rgba(4, 4, 6, 0.95)');
            gradient.addColorStop(0.3, 'rgba(8, 8, 12, 0.6)');
            gradient.addColorStop(0.7, 'rgba(12, 12, 20, 0.18)');
            gradient.addColorStop(1, 'rgba(16, 16, 24, 0)');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, consumeRadius * 1.6, 0, Math.PI * 2);
            ctx.fill();

            const time = Date.now() * 0.0015;
            for (let i = 0; i < 3; i++) {
                const angleOffset = (time + i * 0.6) % (Math.PI * 2);
                ctx.strokeStyle = `rgba(180, 180, 220, ${0.18 - i * 0.05})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(mouse.x, mouse.y, consumeRadius * (1.5 + i * 0.4), angleOffset, angleOffset + Math.PI * 0.8);
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
