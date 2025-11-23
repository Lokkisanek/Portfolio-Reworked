'use client';

import EditableText from '@/components/EditableText';

export default function About() {
    return (
        <section id="about" className="py-20 bg-[#1a1a1a] text-white">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold mb-8 border-l-4 border-blue-500 pl-4">About Me</h2>
                <EditableText
                    section="about"
                    field="text"
                    as="p"
                    className="text-gray-300 leading-relaxed max-w-3xl"
                />
            </div>
        </section>
    );
}
