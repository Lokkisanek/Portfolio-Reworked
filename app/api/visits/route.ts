import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

type VisitStore = {
    read(): Promise<number>;
    write(count: number): Promise<void>;
};

const getFileStore = (): VisitStore => {
    const baseDir = path.join(process.cwd(), 'data');
    const visitsFilePath = path.join(baseDir, 'visits.json');

    return {
        async read() {
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
        },
        async write(count: number) {
            await fs.mkdir(path.dirname(visitsFilePath), { recursive: true });
            await fs.writeFile(visitsFilePath, JSON.stringify({ visits: count }, null, 2));
        }
    };
};

const getInMemoryStore = (): VisitStore => {
    const globalWithStore = globalThis as typeof globalThis & { __visitsCount?: number };
    if (typeof globalWithStore.__visitsCount !== 'number') {
        globalWithStore.__visitsCount = 0;
    }

    return {
        async read() {
            return globalWithStore.__visitsCount ?? 0;
        },
        async write(count: number) {
            globalWithStore.__visitsCount = count;
        }
    };
};

const store: VisitStore = process.env.VERCEL ? getInMemoryStore() : getFileStore();

const readVisits = () => store.read();
const writeVisits = (count: number) => store.write(count);

export async function GET() {
    const visits = await readVisits();
    return NextResponse.json({ visits });
}

export async function POST() {
    const visits = await readVisits();
    const updated = visits + 1;
    await writeVisits(updated);
    return NextResponse.json({ visits: updated });
}
