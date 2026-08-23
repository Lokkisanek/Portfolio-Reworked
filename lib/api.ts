import fs from 'fs/promises';
import path from 'path';

const dataPath = path.join(process.cwd(), 'data', 'content.json');
const isVercel = Boolean(process.env.VERCEL);
const visitsPath = path.join(process.cwd(), 'data', 'visits.json');

type GlobalWithVisits = typeof globalThis & { __visitsCount?: number };

const getGlobalVisitsStore = () => {
    const target = globalThis as GlobalWithVisits;
    if (typeof target.__visitsCount !== 'number') {
        target.__visitsCount = 0;
    }
    return target;
};

async function readVisits(): Promise<number> {
    if (isVercel) {
        return getGlobalVisitsStore().__visitsCount ?? 0;
    }

    const inMemory = getGlobalVisitsStore().__visitsCount;
    if (typeof inMemory === 'number' && inMemory > 0) {
        return inMemory;
    }

    try {
        const file = await fs.readFile(visitsPath, 'utf8');
        const data = JSON.parse(file) as { visits?: number };
        const visits = typeof data.visits === 'number' ? data.visits : 0;
        getGlobalVisitsStore().__visitsCount = visits;
        return visits;
    } catch (err) {
        try {
            await fs.mkdir(path.dirname(visitsPath), { recursive: true });
            await fs.writeFile(visitsPath, JSON.stringify({ visits: 0 }, null, 2));
        } catch (writeErr) {
            console.error('Failed to initialize visits.json:', writeErr);
        }
        return getGlobalVisitsStore().__visitsCount ?? 0;
    }
}

async function writeVisits(count: number): Promise<boolean> {
    if (isVercel) {
        getGlobalVisitsStore().__visitsCount = count;
        return true;
    }

    try {
        await fs.mkdir(path.dirname(visitsPath), { recursive: true });
        await fs.writeFile(visitsPath, JSON.stringify({ visits: count }, null, 2));
        return true;
    } catch (err) {
        console.error('Failed to write visits.json:', err);
        getGlobalVisitsStore().__visitsCount = count;
        return false;
    }
}

export async function getContent() {
    let content: Record<string, unknown>;

    try {
        const file = await fs.readFile(dataPath, 'utf8');
        content = JSON.parse(file);
    } catch (err) {
        console.error(`Failed to read ${dataPath}:`, err);
        throw new Error(
            `Missing or unreadable content.json at ${dataPath}. ` +
                'Ensure /app/data exists and is readable by the container user.'
        );
    }

    const current = await readVisits();
    const updated = current + 1;
    await writeVisits(updated);

    content.metrics = { ...((content.metrics as object) || {}), visits: updated };

    return content;
}

export async function saveContent(data: any) {
    try {
        await fs.mkdir(path.dirname(dataPath), { recursive: true });
        await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error(`Failed to save ${dataPath}:`, err);
        throw err;
    }
}
