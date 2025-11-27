'use client';

import { useEffect, useState } from 'react';

export default function CustomCursor() {
    const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
    const [isPointer, setIsPointer] = useState(false);

    useEffect(() => {
        const updatePosition = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });

            const target = e.target as HTMLElement;
            setIsPointer(
                window.getComputedStyle(target).cursor === 'pointer' ||
                target.tagName === 'BUTTON' ||
                target.tagName === 'A'
            );
        };

        window.addEventListener('mousemove', updatePosition);

        // Hide default cursor
        document.body.style.cursor = 'none';

        return () => {
            window.removeEventListener('mousemove', updatePosition);
            document.body.style.cursor = 'auto';
        };
    }, []);

    return (
        <>
            {position && (
                <div
                    className="fixed pointer-events-none z-[9999] mix-blend-difference"
                    style={{
                        left: `${position.x}px`,
                        top: `${position.y}px`,
                        transform: 'translate(-50%, -50%)',
                        transition: 'width 0.2s ease, height 0.2s ease',
                    }}
                >
                    {/* Outer ring */}
                    <div
                        className="absolute rounded-full border-2 border-white"
                        style={{
                            width: isPointer ? '40px' : '30px',
                            height: isPointer ? '40px' : '30px',
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            transition: 'width 0.2s ease, height 0.2s ease',
                        }}
                    />
                    {/* Center dot */}
                    <div
                        className="absolute rounded-full bg-white"
                        style={{
                            width: '4px',
                            height: '4px',
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                        }}
                    />
                </div>
            )}
            <style jsx global>{`
                * {
                    cursor: none !important;
                }
            `}</style>
        </>
    );
}
