'use client';

import { EditProvider, useEdit } from '@/context/EditContext';
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
import StarfieldBackground from '@/components/ui/StarfieldBackground';
import ColorBendsBackground from '@/components/ui/ColorBendsBackground';
import BackgroundToggle from '@/components/BackgroundToggle';

function ClientPageContent() {
    const { backgroundType } = useEdit();

    return (
        <>
            <CustomCursor />
            {backgroundType === 'starfield' ? <StarfieldBackground /> : <ColorBendsBackground />}
            <BackgroundToggle />
            <main className="bg-transparent min-h-screen text-white selection:bg-blue-500/30 relative z-10">
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
        </>
    );
}

export default function ClientPage({ initialContent }: { initialContent: any }) {
    return (
        <EditProvider initialContent={initialContent}>
            <ClientPageContent />
        </EditProvider>
    );
}

