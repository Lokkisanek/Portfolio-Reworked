'use client';

import EditableText from '@/components/EditableText';
import { useEdit } from '@/context/EditContext';

export default function Contact() {
    const { content } = useEdit();
    const { contact } = content;

    return (
        <section id="contact" className="py-20 bg-[#111] text-white">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl font-bold mb-8">Get In Touch</h2>
                <p className="text-xl text-gray-300 mb-8">
                    I'm currently open for new opportunities.
                </p>
                <div className="flex flex-col items-center space-y-4">
                    <div className="text-2xl font-bold text-blue-400 hover:underline">
                        <EditableText section="contact" field="email" as="span" />
                    </div>
                    <div className="text-gray-400">
                        <EditableText section="contact" field="phone" as="span" />
                    </div>
                </div>

                <footer className="mt-20 text-gray-600 text-sm">
                    © {new Date().getFullYear()} {contact.name}. All rights reserved.
                </footer>
            </div>
        </section>
    );
}
