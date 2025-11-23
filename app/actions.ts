'use server';

import { saveContent } from '@/lib/api';
import { revalidatePath } from 'next/cache';

export async function updateContent(data: any) {
    await saveContent(data);
    revalidatePath('/');
    revalidatePath('/admin');
}
