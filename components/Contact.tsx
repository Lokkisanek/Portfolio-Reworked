'use client';

import EditableText from '@/components/EditableText';
import { useEdit } from '@/context/EditContext';

export default function Contact() {
    const { content } = useEdit();
    const { contact } = content;

    return (
        <div className="text-white text-center space-y-10">
            <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold">Get In Touch</h2>
                <p className="text-xl text-gray-300">
                    I'm currently open for new opportunities.
                </p>
            </div>

            <div className="flex flex-col items-center space-y-4">
                <div className="text-2xl font-bold text-blue-400 hover:underline">
                    <EditableText section="contact" field="email" as="span" />
                </div>
                <div className="text-gray-400">
                    <EditableText section="contact" field="phone" as="span" />
                </div>
            </div>

            <footer className="pt-10 text-gray-600 text-sm border-t border-white/10">
                © {new Date().getFullYear()} {contact.name}. All rights reserved.
            </footer>
        </div>
    );
}
