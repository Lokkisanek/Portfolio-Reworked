'use client';

import React from 'react';

export const NodejsIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M12 2l5 3v6l-5 3-5-3V5l5-3z" fill="#3C873A" />
        <path d="M7 9v6l5 3 5-3V9" stroke="#fff" strokeWidth={0.5} opacity={0.06} />
    </svg>
);

export const LaravelIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M3 12h18v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6z" fill="#FF2D20" />
        <path d="M7 6h10v4H7z" fill="#A71D2A" />
    </svg>
);

export const BootstrapIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect width="24" height="24" rx="4" fill="#563D7C" />
        <path d="M8 7h6a2 2 0 1 1 0 4H8V7zm0 6h6a2 2 0 1 1 0 4H8v-4z" fill="#fff" />
    </svg>
);

export const CanvaIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <circle cx="12" cy="12" r="10" fill="#00C4CC" />
        <path d="M7 12c1.5-3 8-3 9 0-1 3-7 3-9 0z" fill="#fff" opacity={0.9} />
    </svg>
);

const map: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
    Nodejs: NodejsIcon,
    Laravel: LaravelIcon,
    Bootstrap: BootstrapIcon,
    Canva: CanvaIcon,
};

export default map;
