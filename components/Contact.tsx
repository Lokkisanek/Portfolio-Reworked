'use client';

import EditableText from '@/components/EditableText';
import { useEdit } from '@/context/EditContext';
import { useState } from 'react';

export default function Contact() {
    const { content } = useEdit();
    const { contact } = content;

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const to = contact?.email || '';
        const subject = encodeURIComponent(`Website contact from ${name || 'visitor'}`);
        const body = encodeURIComponent(`${message}\n\nFrom: ${name}${email ? ` (${email})` : ''}`);
        if (to) {
            window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
        } else {
            alert('No email configured. Please contact me directly.');
        }
    };

    return (
        <div className="text-white text-center space-y-8">
            <div className="space-y-3">
                <h2 className="text-3xl md:text-4xl font-bold">Get In Touch</h2>
                <p className="text-lg text-gray-300">I'm currently open for new opportunities — send a message or reach me on social media.</p>
            </div>

            <div className="flex flex-col items-center space-y-6">
                <form onSubmit={handleSubmit} className="w-full max-w-xl space-y-3">
                    <div className="flex flex-col md:flex-row md:space-x-3">
                        <input
                            aria-label="Your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                            className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-400"
                        />
                        <input
                            aria-label="Your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Your email (optional)"
                            className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-400 mt-2 md:mt-0"
                        />
                    </div>

                    <textarea
                        aria-label="Message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Your message"
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-400 min-h-[110px]"
                    />

                    <div className="flex items-center justify-center space-x-3">
                        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Send message</button>
                        <button type="button" onClick={() => { setName(''); setEmail(''); setMessage(''); }} className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded">Clear</button>
                    </div>
                </form>

                <div className="space-y-2 text-center">
                    <div className="text-sm text-gray-400">Or find me on</div>
                    <div className="flex items-center justify-center space-x-3">
                        <a href="https://github.com/Lokkisanek" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                <path d="M12 .5C5.73.5.75 5.48.75 11.77c0 4.93 3.2 9.1 7.64 10.57.56.1.76-.24.76-.54 0-.26-.01-1-.02-1.95-3.11.68-3.77-1.5-3.77-1.5-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 .17 1.55.94 1.55.94 1 . +" stroke="currentColor" strokeWidth="0"/>
                                <path d="M12 2.5c-5.24 0-9.5 4.26-9.5 9.5 0 4.2 2.74 7.75 6.54 9.01.48.09.66-.21.66-.47 0-.23-.01-.84-.01-1.65-2.66.58-3.22-1.28-3.22-1.28-.43-1.08-1.05-1.37-1.05-1.37-.86-.59.07-.58.07-.58.95.07 1.45.98 1.45.98.84 1.44 2.2 1.02 2.73.78.08-.6.33-1.02.6-1.25-2.12-.24-4.35-1.06-4.35-4.72 0-1.04.37-1.88.98-2.55-.1-.24-.43-1.22.09-2.54 0 0 .79-.25 2.6.97.75-.21 1.55-.31 2.35-.31.8 0 1.6.1 2.35.31 1.81-1.22 2.6-.97 2.6-.97.52 1.32.19 2.3.09 2.54.61.67.98 1.51.98 2.55 0 3.67-2.24 4.48-4.37 4.71.34.29.64.85.64 1.72 0 1.24-.01 2.24-.01 2.55 0 .26.18.57.67.47C20.76 19.75 23.5 16.2 23.5 12c0-5.24-4.26-9.5-9.5-9.5z" fill="currentColor"/>
                            </svg>
                            <span className="text-sm">GitHub</span>
                        </a>

                        <a href="https://www.instagram.com/matyas.ode/" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5z" stroke="currentColor" strokeWidth="1.2" fill="none"/>
                                <path d="M12 8.2a3.8 3.8 0 100 7.6 3.8 3.8 0 000-7.6z" stroke="currentColor" strokeWidth="1.2" fill="none"/>
                                <path d="M17.5 6.5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                            <span className="text-sm">Instagram</span>
                        </a>

                        <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                <path d="M4.98 3.5A2.5 2.5 0 002.5 6v12a2.5 2.5 0 002.48 2.5h14.04A2.5 2.5 0 0021.5 18V6a2.5 2.5 0 00-2.48-2.5H4.98z" stroke="currentColor" strokeWidth="1.2" fill="none"/>
                                <path d="M8.5 10.5v6M8.5 7.75v.01" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                                <path d="M12.5 10.5v3.5M16.5 10.5v3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                            </svg>
                            <span className="text-sm">LinkedIn</span>
                        </a>

                        {/* Project Union moved to Featured Projects */}
                    </div>
                </div>
            </div>

            <footer className="pt-6 text-gray-600 text-sm border-t border-white/10">
                © {new Date().getFullYear()} {contact.name || ''}. All rights reserved.
            </footer>
        </div>
    );
}
