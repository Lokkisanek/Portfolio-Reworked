import { ReactNode } from 'react';
import clsx from 'clsx';

type SectionBlockProps = {
    id: string;
    children: ReactNode;
    className?: string;
    contentClassName?: string;
};

export default function SectionBlock({ id, children, className, contentClassName }: SectionBlockProps) {
    return (
        <section id={id} className={clsx('relative py-24 sm:py-28', className)}>
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-x-0 top-10 bottom-10 mx-auto max-w-6xl px-6 blur-3xl opacity-50">
                    <div className="h-full w-full rounded-[2.75rem] bg-gradient-to-r from-cyan-400/20 via-transparent to-purple-500/20" />
                </div>
            </div>

            <div className="relative max-w-6xl mx-auto px-6">
                <div
                    className={clsx(
                        'relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-black/60 backdrop-blur-2xl shadow-[0_30px_120px_rgba(0,0,0,0.55)]',
                        contentClassName
                    )}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-20" />
                    <div className="relative p-10 sm:p-12 lg:p-16">{children}</div>
                </div>
            </div>
        </section>
    );
}
