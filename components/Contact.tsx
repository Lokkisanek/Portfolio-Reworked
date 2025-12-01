'use client';

import { useEdit } from '@/context/EditContext';
import { useState } from 'react';
import { useLocale } from '@/context/LocaleContext';
import { t } from '@/lib/translate';

export default function Contact() {
    const { content } = useEdit();
    const { contact } = content;
    const { locale } = useLocale();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [serverMessage, setServerMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message || message.trim().length < 10) {
            setStatus('error');
            setServerMessage(t('contact.validation_error', locale));
            return;
        }

        try {
            setStatus('loading');
            setServerMessage(null);
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, message })
            });

            const data = await response.json();

            if (!response.ok || !data?.success) {
                throw new Error(data?.message || 'Unable to send message');
            }

            setStatus('success');
            setServerMessage(data?.message || t('contact.success', locale));
            setName('');
            setEmail('');
            setMessage('');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : null;
            setStatus('error');
            setServerMessage(errorMessage || t('contact.error', locale));
        }
    };
    const isLoading = status === 'loading';
    const feedback = status === 'success'
        ? serverMessage || t('contact.success', locale)
        : status === 'error'
            ? serverMessage || t('contact.error', locale)
            : null;

    return (
        <div className="text-white text-center space-y-8">
                <div className="space-y-3">
                <h2 className="text-3xl md:text-4xl font-bold">{t('contact.title', locale)}</h2>
                <p className="text-lg text-gray-300">{t('contact.description', locale)}</p>
            </div>

            <div className="flex flex-col items-center space-y-6">
                <form onSubmit={handleSubmit} className="w-full max-w-xl space-y-3" noValidate>
                    <div className="flex flex-col md:flex-row md:space-x-3">
                        <input
                            aria-label={t('contact.name_placeholder', locale)}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={t('contact.name_placeholder', locale)}
                            className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-400"
                            disabled={isLoading}
                        />
                        <input
                            aria-label={t('contact.email_placeholder', locale)}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t('contact.email_placeholder', locale)}
                            type="email"
                            className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-400 mt-2 md:mt-0"
                            disabled={isLoading}
                        />
                    </div>

                    <textarea
                        aria-label={t('contact.message_placeholder', locale)}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={t('contact.message_placeholder', locale)}
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-400 min-h-[110px]"
                        minLength={10}
                        required
                        disabled={isLoading}
                    />

                    <div className="flex items-center justify-center space-x-3">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded"
                        >
                            {isLoading ? t('contact.sending', locale) : t('contact.send', locale)}
                        </button>
                        <button
                            type="button"
                            disabled={isLoading}
                            onClick={() => { setName(''); setEmail(''); setMessage(''); setStatus('idle'); setServerMessage(null); }}
                            className="bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded"
                        >
                            {t('contact.clear', locale)}
                        </button>
                    </div>

                    {feedback && (
                        <p
                            className={`text-sm ${status === 'success' ? 'text-emerald-300' : 'text-rose-300'}`}
                            role="status"
                        >
                            {feedback}
                        </p>
                    )}
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
