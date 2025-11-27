import ClientPage from '@/components/ClientPage';
import { getContent } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default async function VisualPortfolioPage() {
    const initialContent = await getContent();

    return <ClientPage initialContent={initialContent} />;
}
