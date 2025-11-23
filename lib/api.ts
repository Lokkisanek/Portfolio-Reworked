import fs from 'fs/promises';
import path from 'path';

const dataPath = path.join(process.cwd(), 'data', 'content.json');

export async function getContent() {
    const file = await fs.readFile(dataPath, 'utf8');
    return JSON.parse(file);
}

export async function saveContent(data: any) {
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
}
