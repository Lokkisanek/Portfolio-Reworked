'use client';

import { useEffect, useMemo, useState } from 'react';
import MetallicPaint, { parseLogoImage } from '@/components/MetallicPaint';
import { useEdit } from '@/context/EditContext';
import styles from './MetallicHeroName.module.css';

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 520;
const CANVAS_PADDING = 80;
const LINE_HEIGHT_MULTIPLIER = 1.05;

const metallicParams = {
    edge: 2,
    patternBlur: 0.005,
    patternScale: 2,
    refraction: 0.015,
    speed: 0.3,
    liquid: 0.07,
};

function splitLines(rawText: string): string[] {
    const text = rawText.trim();
    if (!text) return ['Matyáš', 'Odehnal'];

    const manualBreaks = text.split(/\n+/).filter(Boolean);
    if (manualBreaks.length > 1) return manualBreaks.slice(0, 2);

    const words = text.split(/\s+/);
    if (words.length === 1) return [text];

    const midpoint = Math.ceil(words.length / 2);
    return [words.slice(0, midpoint).join(' '), words.slice(midpoint).join(' ')].filter(Boolean);
}

async function createMaskFile(text: string): Promise<File | null> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const lines = splitLines(text);
    const maxWidth = CANVAS_WIDTH - CANVAS_PADDING * 2;

    let fontSize = Math.min(220, CANVAS_HEIGHT / lines.length);
    let fits = false;

    while (!fits && fontSize > 48) {
        fits = true;
        ctx.font = `900 ${fontSize}px 'Poppins', 'Inter', 'Segoe UI', sans-serif`;
        for (const line of lines) {
            if (ctx.measureText(line).width > maxWidth) {
                fontSize -= 6;
                fits = false;
                break;
            }
        }
    }

    const effectiveLineHeight = fontSize * LINE_HEIGHT_MULTIPLIER;
    lines.forEach((line, index) => {
        const y = CANVAS_HEIGHT / 2 + (index - (lines.length - 1) / 2) * effectiveLineHeight;
        ctx.fillText(line, CANVAS_WIDTH / 2, y);
    });

    return new Promise(resolve => {
        canvas.toBlob(blob => {
            if (!blob) {
                resolve(null);
                return;
            }
            resolve(new File([blob], 'hero-name-mask.png', { type: 'image/png' }));
        }, 'image/png');
    });
}

export default function MetallicHeroName({ className }: { className?: string }) {
    const { content, isEditing } = useEdit();
    const [imageData, setImageData] = useState<ImageData | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const nameValue = useMemo(() => {
        const name = content?.hero?.name as string | undefined;
        return name?.trim() ? name : 'Matyáš Odehnal';
    }, [content?.hero?.name]);

    useEffect(() => {
        if (isEditing) return;

        let cancelled = false;

        async function generateImage() {
            setIsLoading(true);
            const file = await createMaskFile(nameValue);
            if (!file) {
                setIsLoading(false);
                return;
            }
            try {
                const parsed = await parseLogoImage(file);
                if (!cancelled) {
                    setImageData(parsed.imageData);
                }
            } catch (error) {
                console.error('Failed to parse metallic logo image', error);
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        }

        generateImage();

        return () => {
            cancelled = true;
        };
    }, [nameValue, isEditing]);

    const showCanvas = !!imageData && !isLoading;

    if (isEditing) {
        return null;
    }

    return (
        <div className={[styles.wrapper, className].filter(Boolean).join(' ')}>
            {showCanvas && <MetallicPaint imageData={imageData} params={metallicParams} className={styles.canvas} />}
            <div className={styles.fallback} aria-hidden="true" style={{ opacity: showCanvas ? 0.18 : 1 }}>
                {nameValue}
            </div>
            <span className="sr-only">{nameValue}</span>
        </div>
    );
}
