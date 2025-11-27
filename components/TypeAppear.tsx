'use client';

import { useEffect, useState } from 'react';

export default function TypeAppear({
    text,
    speed = 25,
    className = ''
}: {
    text: string;
    speed?: number;
    className?: string;
}) {
    const [visible, setVisible] = useState('');

    useEffect(() => {
        let i = 0;
        setVisible('');
        if (!text) return;
        const id = setInterval(() => {
            i += 1;
            setVisible(text.slice(0, i));
            if (i >= text.length) clearInterval(id);
        }, speed);

        return () => clearInterval(id);
    }, [text, speed]);

    return (
        <h2 className={className}>
            {visible}
            <span className="ml-1 inline-block h-6 w-[1px] bg-white/80 animate-pulse align-middle" aria-hidden />
        </h2>
    );
}
