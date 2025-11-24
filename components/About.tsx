'use client';

import { ReactNode } from 'react';
import Image from 'next/image';
import EditableText from '@/components/EditableText';
import { useEdit } from '@/context/EditContext';
import { Clock, MapPin, Sparkles, type LucideIcon } from 'lucide-react';

type InfoCardProps = {
    icon: LucideIcon;
    label: string;
    children: ReactNode;
};

function InfoCard({ icon: Icon, label, children }: InfoCardProps) {
    return (
        <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.35)] transition duration-300 hover:border-blue-400/40 hover:shadow-[0_25px_70px_rgba(59,130,246,0.25)]">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 opacity-0 transition duration-300 group-hover:opacity-100" />
            <div className="relative flex items-start gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-blue-200">
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                </span>
                <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-white/40">{label}</p>
                    <div className="mt-2 text-base text-white/90">{children}</div>
                </div>
            </div>
        </div>
    );
}

export default function About() {
    const { content, isEditing } = useEdit();
    const photoSrc = content?.about?.photo?.trim();
    const hasPhoto = Boolean(photoSrc);

    return (
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.95fr)_1fr] lg:items-center">
            <div className="order-2 space-y-10 lg:order-1">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] uppercase tracking-[0.35em] text-blue-200/90 shadow-[0_18px_60px_rgba(56,189,248,0.15)]">
                    <span className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.8)]" />
                    <EditableText section="about" field="eyebrow" as="span" className="font-medium text-white/80" />
                </div>

                <div className="space-y-4">
                    <EditableText
                        section="about"
                        field="headline"
                        as="h2"
                        className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight text-white"
                    />
                    <EditableText
                        section="about"
                        field="subheading"
                        as="p"
                        className="max-w-2xl text-base sm:text-lg text-white/70"
                    />
                </div>

                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 shadow-[0_35px_120px_rgba(15,23,42,0.35)]">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 opacity-70" />
                    <div className="relative">
                        <EditableText
                            section="about"
                            field="text"
                            as="p"
                            className="text-base leading-relaxed text-white/75 whitespace-pre-line"
                        />
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <InfoCard icon={MapPin} label="based in">
                        <EditableText
                            section="about"
                            field="location"
                            as="span"
                            className="text-lg font-medium text-white"
                        />
                    </InfoCard>
                    <InfoCard icon={Sparkles} label="focused on">
                        <EditableText
                            section="about"
                            field="focus"
                            as="span"
                            className="text-lg font-medium text-white"
                        />
                    </InfoCard>
                    <InfoCard icon={Clock} label="currently">
                        <EditableText
                            section="about"
                            field="availability"
                            as="span"
                            className="text-lg font-medium text-white"
                        />
                    </InfoCard>
                </div>
            </div>

            <div className="order-1 lg:order-2">
                <div className="relative mx-auto max-w-xs sm:max-w-sm lg:max-w-md">
                    <div className="absolute inset-0 -translate-y-4 rounded-[3rem] bg-gradient-to-br from-blue-500/40 via-slate-900/40 to-purple-500/40 blur-[80px]" />
                    <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent shadow-[0_45px_120px_rgba(15,23,42,0.55)]">
                        {hasPhoto ? (
                            <Image
                                src={photoSrc!}
                                alt={content?.about?.headline ?? 'Portrait'}
                                width={640}
                                height={800}
                                className="h-full w-full object-cover"
                                priority
                            />
                        ) : (
                            <div className="flex aspect-[3/4] items-center justify-center bg-gradient-to-br from-slate-900/70 via-slate-800/80 to-slate-900/70 text-center text-sm text-white/60">
                                Upload your portrait via editing mode
                            </div>
                        )}
                    </div>
                    {isEditing && (
                        <div className="mt-4 text-center text-xs text-white/60">
                            Photo path:{' '}
                            <EditableText
                                section="about"
                                field="photo"
                                as="span"
                                className="ml-1 rounded-md bg-white/10 px-2 py-1 font-mono text-[11px] text-white/80"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
