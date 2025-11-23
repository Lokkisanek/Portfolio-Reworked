import { getContent } from '@/lib/api';
import ClientPage from '@/components/ClientPage';

export default async function Home() {
    const data = await getContent();

    return <ClientPage initialContent={data} />;
}
