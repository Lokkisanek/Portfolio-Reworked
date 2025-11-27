"use client";

import React from 'react';
import Link from 'next/link';
import { useScroll } from '@/components/ScrollContext';

export default function Navbar() {
    const { setSelected } = useScroll();

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
        e.preventDefault();
        setSelected(hash.replace('#', ''));
    };
    return (
        <nav className="fixed top-0 left-0 w-full bg-black/80 backdrop-blur-md z-50 border-b border-gray-800">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold text-white">
                    Portfolio
                </Link>
                <div className="hidden md:flex space-x-8">
                    <a href="#about" onClick={(e) => handleNavClick(e, '#about')} className="text-gray-300 hover:text-white transition">About</a>
                    <a href="#skills" onClick={(e) => handleNavClick(e, '#skills')} className="text-gray-300 hover:text-white transition">Skills</a>
                    <a href="#projects" onClick={(e) => handleNavClick(e, '#projects')} className="text-gray-300 hover:text-white transition">Projects</a>
                    <a href="#contact" onClick={(e) => handleNavClick(e, '#contact')} className="text-gray-300 hover:text-white transition">Contact</a>
                    <Link href="/admin" className="text-blue-400 hover:text-blue-300 transition">Admin</Link>
                </div>
            </div>
        </nav>
    );
}
