import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const LOCALE_FILE = path.join(process.cwd(), 'data', 'locale-preferences.json');

async function writeLocale(data: any) {
    await fs.mkdir(path.dirname(LOCALE_FILE), { recursive: true });
    await fs.writeFile(LOCALE_FILE, JSON.stringify(data, null, 2));
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const locale = body?.locale || null;
        const entry = { locale, updatedAt: new Date().toISOString() };
        await writeLocale(entry);
        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error('Failed write locale', err);
        return NextResponse.json({ ok: false }, { status: 500 });
    }
}
