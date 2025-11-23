'use client';

import { EditProvider } from '@/context/EditContext';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import EditToggle from '@/components/EditToggle';
import CustomCursor from '@/components/ui/CustomCursor';
import SpotifyWidget from '@/components/ui/SpotifyWidget';
import FloatingDock from '@/components/ui/FloatingDock';

export default function ClientPage({ initialContent }: { initialContent: any }) {
    return (
        <EditProvider initialContent={initialContent}>
            <CustomCursor />
            <main className="bg-[#0a0a0a] min-h-screen text-white selection:bg-blue-500/30">
                {/* <Navbar /> */}
                <FloatingDock />
                <Hero />
                <About />
                <Skills />
                <Projects />
                <Contact />
                {/* <EditToggle /> */}
                <SpotifyWidget />
            </main>
        </EditProvider>
    );
}
