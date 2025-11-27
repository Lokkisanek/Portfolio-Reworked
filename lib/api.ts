import fs from 'fs/promises';
import path from 'path';

const dataPath = path.join(process.cwd(), 'data', 'content.json');
const visitsPath = path.join(process.cwd(), 'data', 'visits.json');

async function readVisits(): Promise<number> {
    try {
        const file = await fs.readFile(visitsPath, 'utf8');
        const data = JSON.parse(file) as { visits?: number };
        return typeof data.visits === 'number' ? data.visits : 0;
    } catch (err) {
        // If file doesn't exist, initialize with 0
        await fs.mkdir(path.dirname(visitsPath), { recursive: true });
        await fs.writeFile(visitsPath, JSON.stringify({ visits: 0 }, null, 2));
        return 0;
    }
}

async function writeVisits(count: number) {
    await fs.writeFile(visitsPath, JSON.stringify({ visits: count }, null, 2));
}

export async function getContent() {
    const file = await fs.readFile(dataPath, 'utf8');
    const content = JSON.parse(file);

    // Read and increment visits on each server render
    const current = await readVisits();
    const updated = current + 1;
    await writeVisits(updated);

    // Ensure metrics object exists and attach visits
    content.metrics = { ...(content.metrics || {}), visits: updated };

    return content;
}

export async function saveContent(data: any) {
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
}
