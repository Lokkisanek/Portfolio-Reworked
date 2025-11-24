import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const VISITS_FILE = path.join(process.cwd(), 'data', 'visits.json');

async function readVisitsFile(): Promise<number> {
    try {
        const file = await fs.readFile(VISITS_FILE, 'utf-8');
        const data = JSON.parse(file) as { visits?: number };
        return typeof data.visits === 'number' ? data.visits : 0;
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            await fs.mkdir(path.dirname(VISITS_FILE), { recursive: true });
            await fs.writeFile(VISITS_FILE, JSON.stringify({ visits: 0 }, null, 2));
            return 0;
        }
        console.error('Failed to read visits file', error);
        return 0;
    }
}

async function writeVisits(count: number) {
    await fs.writeFile(VISITS_FILE, JSON.stringify({ visits: count }, null, 2));
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
