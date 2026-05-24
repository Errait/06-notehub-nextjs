'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useDebounce } from 'use-debounce';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import css from './NotesPage.module.css';
import SearchBox from '../../components/SearchBox/SearchBox';
import Pagination from '../../components/Pagination/Pagination';
import NoteList from '../../components/NoteList/NoteList';
import Modal from '../../components/Modal/Modal';
import NoteForm from '../../components/NoteForm/NoteForm';
import { fetchNotes } from '../../lib/api';

interface NotesClientProps {
  searchWord: string;
  currentPage: number;
}

export default function NotesClient({
  searchWord: initialSearch,
  currentPage,
}: NotesClientProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [search, setSearch] = useState(initialSearch);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [debouncedSearch] = useDebounce(search, 300);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('search', debouncedSearch);
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  }, [debouncedSearch, router, pathname]);

  const { data, isError, isLoading, isSuccess } = useQuery({
    queryKey: ['notes', initialSearch, currentPage],
    queryFn: () => fetchNotes(initialSearch, currentPage),
    placeholderData: keepPreviousData,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams();
    if (initialSearch) params.set('search', initialSearch);
    params.set('page', page.toString());

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={css.app}>
      <Toaster position="top-center" reverseOrder={false} />

      <header className={css.toolbar}>
        <SearchBox value={search} onChange={setSearch} />

        {isSuccess && totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}

        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>

        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)}>
            <NoteForm onClose={() => setIsModalOpen(false)} />
          </Modal>
        )}
      </header>

      {isLoading && <p className={css.loading}>Loading notes...</p>}
      {isError && <p className={css.error}>Something went wrong...</p>}

      {!isError && !isLoading && notes.length > 0 && <NoteList notes={notes} />}
      {!isError && !isLoading && notes.length === 0 && (
        <p className={css.empty}>No notes found...</p>
      )}
    </div>
  );
}
