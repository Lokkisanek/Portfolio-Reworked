'use client';

import EditableText from './EditableText';
import MotionWrapper from './ui/MotionWrapper';
import { motion } from 'framer-motion';
import { useEdit } from '@/context/EditContext';
import CountUp from '@/components/ui/CountUp';
import { useLocale } from '@/context/LocaleContext';
import { defaultLocale } from '@/lib/i18n';
import { t } from '@/lib/translate';

export default function Hero() {
    const { isEditing, content } = useEdit();
    const { locale } = useLocale();
    const isDefaultLocale = locale === defaultLocale;

    const localized = (value: string | undefined, key: string) => {
        if (isDefaultLocale) {
            return value && value.trim().length > 0 ? value : t(key, locale);
        }
        return t(key, locale);
    };

    const heroName = localized((content?.hero?.name as string | undefined)?.trim(), 'hero.name');
    const heroTitle = localized((content?.hero?.title as string | undefined)?.trim(), 'hero.title');
    const heroDescription = localized((content?.hero?.description as string | undefined)?.trim(), 'hero.description');

    return (
        <section id="hero" className="relative h-screen flex flex-col justify-center items-center text-center overflow-hidden">
            <div className="z-10 relative px-6">
                <MotionWrapper delay={0.1}>
                    <div className="inline-block px-3 py-1 mb-4 text-sm font-medium text-blue-400 bg-blue-500/10 rounded-full border border-blue-500/20 backdrop-blur-sm">
                        {t('hero.badge', locale)}
                    </div>
                </MotionWrapper>

                <MotionWrapper delay={0.2}>
                    {isEditing ? (
                        <EditableText
                            section="hero"
                            field="name"
                            as="h1"
                            className="text-6xl md:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400 tracking-tight"
                        />
                    ) : (
                        <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400 tracking-tight">
                            {heroName}
                        </h1>
                    )}
                </MotionWrapper>

                <MotionWrapper delay={0.3}>
                    {isEditing ? (
                        <EditableText
                            section="hero"
                            field="title"
                            as="h2"
                            className="text-2xl md:text-4xl text-gray-400 mb-8 font-light"
                        />
                    ) : (
                        <h2 className="text-2xl md:text-4xl text-gray-400 mb-8 font-light">{heroTitle}</h2>
                    )}
                </MotionWrapper>

                <MotionWrapper delay={0.4}>
                    {isEditing ? (
                        <EditableText
                            section="hero"
                            field="description"
                            as="p"
                            className="text-lg max-w-2xl mx-auto text-gray-300 leading-relaxed"
                        />
                    ) : (
                        <p className="text-lg max-w-2xl mx-auto text-gray-300 leading-relaxed">{heroDescription}</p>
                    )}
                </MotionWrapper>

                <MotionWrapper delay={0.5} className="mt-10">
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="text-gray-500 text-sm"
                    >
                        {t('hero.scroll', locale)}
                    </motion.div>
                </MotionWrapper>

                <MotionWrapper delay={0.6} className="mt-12">
                    <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-2 backdrop-blur">
                        <span className="text-xs uppercase tracking-[0.3em] text-gray-400">{t('hero.visits', locale)}</span>
                        <CountUp
                            from={0}
                            to={(content?.metrics?.visits as number | undefined) ?? 1284}
                            separator="," 
                            duration={1.6}
                            className="text-2xl font-semibold text-white"
                        />
                    </div>
                </MotionWrapper>
            </div>
        </section>
    );
}
