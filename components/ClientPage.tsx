'use client';

import { EditProvider, useEdit } from '@/context/EditContext';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import Services from '@/components/Services';
import FloatingDock from '@/components/ui/FloatingDock';
import StarfieldBackground from '@/components/ui/StarfieldBackground';
import FlowingGradientBackground from '@/components/ui/FlowingGradientBackground';
import ColorBends from '@/components/ui/ColorBends';
import BackgroundToggle from '@/components/BackgroundToggle';
import GradualBlur from '@/components/ui/GradualBlur';
import SectionBlock from '@/components/ui/SectionBlock';
import GradientEditor from '@/components/ui/GradientEditor';

function ClientPageContent() {
    const { backgroundType, gradientSettings } = useEdit();

    return (
        <>
            {backgroundType === 'starfield' ? (
                <StarfieldBackground />
            ) : backgroundType === 'colorbends' ? (
                <>
                    <ColorBends
                        colors={gradientSettings.colors}
                        speed={gradientSettings.speed}
                        mouseInfluence={gradientSettings.mouseInfluence}
                    />
                    <GradientEditor />
                </>
            ) : (
                <>
                    <FlowingGradientBackground
                        colors={gradientSettings.colors}
                        speed={gradientSettings.speed}
                        mouseInfluence={gradientSettings.mouseInfluence}
                    />
                    <GradientEditor />
                </>
            )}
            <BackgroundToggle />
            <GradualBlur
                target="page"
                position="bottom"
                height="12rem"
                strength={3.2}
                divCount={6}
                curve="bezier"
                exponential
                opacity={0.95}
                zIndex={40}
                className="pointer-events-none"
            />
            <main className="bg-transparent min-h-screen text-white selection:bg-blue-500/30 relative z-10">
                {/* Navbar intentionally hidden; language selector moved to FloatingDock */}
                <FloatingDock />
                <Hero />
                <SectionBlock id="about">
                    <About />
                </SectionBlock>
                <SectionBlock id="skills">
                    <Skills />
                </SectionBlock>
                <SectionBlock id="services">
                    <Services />
                </SectionBlock>
                <SectionBlock id="projects">
                    <Projects />
                </SectionBlock>
                <SectionBlock id="contact">
                    <Contact />
                </SectionBlock>
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
