export type BackgroundQuality = 'high' | 'balanced' | 'performance';

interface QualityPreset {
    pixelRatioCap: number;
    frameInterval: number;
    pointerSmoothing: number;
    powerPreference: WebGLPowerPreference;
}

const QUALITY_PRESETS: Record<BackgroundQuality, QualityPreset> = {
    high: {
        pixelRatioCap: 2,
        frameInterval: 1 / 60,
        pointerSmoothing: 8,
        powerPreference: 'high-performance'
    },
    balanced: {
        pixelRatioCap: 1.5,
        frameInterval: 1 / 48,
        pointerSmoothing: 6,
        powerPreference: 'default'
    },
    performance: {
        pixelRatioCap: 1,
        frameInterval: 1 / 30,
        pointerSmoothing: 4,
        powerPreference: 'low-power'
    }
};

const isBrowser = typeof window !== 'undefined';

const readNavigator = () => {
    if (!isBrowser) {
        return {
            userAgent: '',
            deviceMemory: undefined as number | undefined,
            hardwareConcurrency: undefined as number | undefined
        };
    }
    const nav = window.navigator as Navigator & { deviceMemory?: number };
    return {
        userAgent: nav.userAgent || '',
        deviceMemory: typeof nav.deviceMemory === 'number' ? nav.deviceMemory : undefined,
        hardwareConcurrency: typeof nav.hardwareConcurrency === 'number' ? nav.hardwareConcurrency : undefined
    };
};

const getRuntimeHints = () => {
    const { userAgent, deviceMemory, hardwareConcurrency } = readNavigator();
    const isChrome = /Chrome\//.test(userAgent) && !/Edg\//.test(userAgent) && !/OPR\//.test(userAgent);
    const isMobile = /Android|iPhone|iPad|iPod/i.test(userAgent);
    const hiDpi = isBrowser ? (window.devicePixelRatio || 1) > 1.5 : false;
    const lowMemory = typeof deviceMemory === 'number' ? deviceMemory <= 4 : false;
    const lowCores = typeof hardwareConcurrency === 'number' ? hardwareConcurrency <= 6 : false;
    return { isChrome, isMobile, hiDpi, lowMemory, lowCores };
};

export const resolveBackgroundQuality = (value: string | undefined): BackgroundQuality => {
    if (value === 'high' || value === 'balanced' || value === 'performance') {
        return value;
    }
    return 'balanced';
};

export const getBackgroundQualityPreset = (quality: BackgroundQuality = 'balanced') => {
    const preset = QUALITY_PRESETS[quality] ?? QUALITY_PRESETS.balanced;
    const devicePixelRatio = isBrowser ? window.devicePixelRatio || 1 : 1;
    const hints = getRuntimeHints();
    let cap = preset.pixelRatioCap;

    if (hints.isChrome) {
        if (quality === 'high') {
            cap = Math.min(cap, hints.hiDpi ? 1.35 : 1.45);
        } else if (quality === 'balanced') {
            cap = Math.min(cap, hints.hiDpi ? 1.15 : 1.35);
        }
    }

    if (hints.isMobile) {
        cap = Math.min(cap, 1.1);
    }

    const pixelRatio = Math.min(devicePixelRatio, cap);
    return {
        pixelRatio,
        frameInterval: preset.frameInterval,
        pointerSmoothing: preset.pointerSmoothing,
        powerPreference: preset.powerPreference
    };
};

export const shouldUseLiteMode = (quality: BackgroundQuality): boolean => {
    if (!isBrowser) return false;
    if (quality === 'performance') return true;

    const hints = getRuntimeHints();

    if (!hints.isChrome) {
        return false;
    }

    // Chrome on weaker / hiDPI setups struggles with the shader even on balanced.
    if (quality === 'balanced') {
        return hints.hiDpi || hints.lowMemory || hints.lowCores || hints.isMobile;
    }

    // For high, only fallback on clearly constrained devices.
    return (hints.lowMemory && hints.lowCores) || hints.isMobile;
};
