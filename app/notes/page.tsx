import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';

interface PageProps {
  searchParams: Promise<{ search?: string; page?: string }>;
}

export default async function NotesPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const searchWord = resolvedParams.search ?? '';
  const currentPage = Number(resolvedParams.page) || 1;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', searchWord, currentPage],
    queryFn: () => fetchNotes(searchWord, currentPage),
  });

  return (
    <main>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NotesClient searchWord={searchWord} currentPage={currentPage} />
      </HydrationBoundary>
    </main>
  );
}
