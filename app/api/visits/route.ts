import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const baseDir = process.env.VERCEL ? path.join('/tmp', 'portfolio-data') : path.join(process.cwd(), 'data');
const visitsFilePath = path.join(baseDir, 'visits.json');

async function readVisitsFile(): Promise<number> {
    try {
        const file = await fs.readFile(visitsFilePath, 'utf-8');
        const data = JSON.parse(file) as { visits?: number };
        return typeof data.visits === 'number' ? data.visits : 0;
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            await fs.mkdir(path.dirname(visitsFilePath), { recursive: true });
            await fs.writeFile(visitsFilePath, JSON.stringify({ visits: 0 }, null, 2));
            return 0;
        }
        console.error('Failed to read visits file', error);
        return 0;
    }
}

async function writeVisits(count: number) {
    await fs.mkdir(path.dirname(visitsFilePath), { recursive: true });
    await fs.writeFile(visitsFilePath, JSON.stringify({ visits: count }, null, 2));
}

export async function GET() {
    const visits = await readVisitsFile();
    return NextResponse.json({ visits });
}

export async function POST() {
    const visits = await readVisitsFile();
    const updated = visits + 1;
    await writeVisits(updated);
    return NextResponse.json({ visits: updated });
}
