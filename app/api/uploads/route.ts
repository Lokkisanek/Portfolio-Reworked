import fs from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get('file') as File | null;
    if (!file) return new Response(JSON.stringify({ error: 'No file' }), { status: 400 });

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    // sanitize filename
    const originalName = (file as any).name || `upload-${Date.now()}`;
    const safeName = `${Date.now()}-${originalName.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
    const filePath = path.join(uploadsDir, safeName);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await fs.writeFile(filePath, buffer);

    const publicPath = `/uploads/${safeName}`;
    return new Response(JSON.stringify({ path: publicPath }), { status: 200 });
  } catch (err: any) {
    console.error('Upload error', err);
    return new Response(JSON.stringify({ error: err?.message || String(err) }), { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const p = body?.path as string | undefined;
    if (!p) return new Response(JSON.stringify({ error: 'No path provided' }), { status: 400 });

    // only allow deleting from /uploads
    if (!p.startsWith('/uploads/')) return new Response(JSON.stringify({ error: 'Invalid path' }), { status: 400 });

    const filePath = path.join(process.cwd(), 'public', p.replace(/^\//, ''));
    // ensure the file is inside public/uploads
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!filePath.startsWith(uploadsDir)) return new Response(JSON.stringify({ error: 'Invalid path' }), { status: 400 });

    await fs.unlink(filePath).catch(() => {});
    return new Response(null, { status: 204 });
  } catch (err: any) {
    console.error('Delete error', err);
    return new Response(JSON.stringify({ error: err?.message || String(err) }), { status: 500 });
  }
}
