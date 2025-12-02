'use client';

import { useEdit } from '@/context/EditContext';
import { useLocale } from '@/context/LocaleContext';
import { t } from '@/lib/translate';
import { useEffect, useState } from 'react';

export default function Contact() {
    const { content } = useEdit();
    const { contact } = content;
    const { locale } = useLocale();

    const emailAddress = contact.email || '';
    const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');

    useEffect(() => {
        setCopyStatus('idle');
    }, [emailAddress]);

    const copyEmail = async () => {
        if (!emailAddress) {
            setCopyStatus('error');
            return;
        }

        try {
            if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(emailAddress);
            } else {
                const textarea = document.createElement('textarea');
                textarea.value = emailAddress;
                textarea.setAttribute('readonly', '');
                textarea.style.position = 'absolute';
                textarea.style.left = '-9999px';
                document.body.appendChild(textarea);
                textarea.select();
                const success = document.execCommand('copy');
                document.body.removeChild(textarea);

                if (!success) {
                    throw new Error('execCommand failed');
                }
            }

            setCopyStatus('copied');
        } catch (error) {
            console.error('Failed to copy email', error);
            setCopyStatus('error');
        }
    };

    const feedback =
        copyStatus === 'copied'
            ? t('contact.copy_success', locale)
            : copyStatus === 'error'
                ? t('contact.copy_error', locale)
                : null;

    return (
        <div className="text-white text-center space-y-8 px-4">
            <div className="space-y-3">
                <h2 className="text-3xl sm:text-4xl font-bold">{t('contact.title', locale)}</h2>
                <p className="text-base sm:text-lg text-gray-300">{t('contact.description', locale)}</p>
            </div>

            <div className="flex flex-col items-center space-y-6">
                <div className="w-full max-w-xl space-y-4">
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-left sm:px-6">
                        <div className="text-xs uppercase tracking-[0.3em] text-blue-200/70">
                            {t('contact.direct_email_label', locale)}
                        </div>
                        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <code className="rounded-lg bg-black/40 px-3 py-2 text-sm text-blue-100">
                                {emailAddress || t('contact.no_email', locale)}
                            </code>
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                <button
                                    type="button"
                                    onClick={copyEmail}
                                    className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600 disabled:opacity-60"
                                    disabled={!emailAddress}
                                >
                                    {t('contact.copy_email', locale)}
                                </button>
                                {emailAddress && (
                                    <a
                                        href={`mailto:${emailAddress}`}
                                        className="rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10"
                                    >
                                        {t('contact.open_email_client', locale)}
                                    </a>
                                )}
                            </div>
                        </div>
                        {feedback && (
                            <p
                                className={`mt-3 text-sm ${copyStatus === 'copied' ? 'text-emerald-300' : 'text-rose-300'}`}
                                role="status"
                            >
                                {feedback}
                            </p>
                        )}
                    </div>
                </div>

                <div className="space-y-2 text-center w-full">
                    <div className="text-sm text-gray-400">Or find me on</div>
                    <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-md mx-auto">
                        <a
                            href="https://github.com/Lokkisanek"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg min-w-[140px] justify-center"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                <path d="M12 .5C5.73.5.75 5.48.75 11.77c0 4.93 3.2 9.1 7.64 10.57.56.1.76-.24.76-.54 0-.26-.01-1-.02-1.95-3.11.68-3.77-1.5-3.77-1.5-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 .17 1.55.94 1.55.94 1 .17 1.55-.94 1.55-.94s.59-1.08 1.72-1.16c0 0 1.1-.01.08.69 0 0-.74.35-1.25 1.65 0 0-.66 2.18-3.77 1.5.01.95.02 1.69.02 1.95 0 .3-.2.64-.76.54 4.44-1.47 7.64-5.64 7.64-10.57C23.25 5.48 18.27.5 12 .5z" fill="currentColor"/>
                            </svg>
                            <span className="text-sm">GitHub</span>
                        </a>

                        <a
                            href="https://www.instagram.com/matyas.ode/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg min-w-[140px] justify-center"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5z" stroke="currentColor" strokeWidth="1.2" fill="none"/>
                                <path d="M12 8.2a3.8 3.8 0 100 7.6 3.8 3.8 0 000-7.6z" stroke="currentColor" strokeWidth="1.2" fill="none"/>
                                <path d="M17.5 6.5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                            <span className="text-sm">Instagram</span>
                        </a>

                        <a
                            href="https://www.linkedin.com/in/matyáš-odehnal-97784739b"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg min-w-[140px] justify-center"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                <path d="M4.98 3.5A2.5 2.5 0 002.5 6v12a2.5 2.5 0 002.48 2.5h14.04A2.5 2.5 0 0021.5 18V6a2.5 2.5 0 00-2.48-2.5H4.98z" stroke="currentColor" strokeWidth="1.2" fill="none"/>
                                <path d="M8.5 10.5v6M8.5 7.75v.01" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                                <path d="M12.5 10.5v3.5M16.5 10.5v3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                            </svg>
                            <span className="text-sm">LinkedIn</span>
                        </a>
                    </div>
                </div>
            </div>

            <footer className="pt-6 text-gray-600 text-xs sm:text-sm border-t border-white/10">
                © {new Date().getFullYear()} {contact.name || ''}. All rights reserved.
            </footer>
        </div>
    );
}
