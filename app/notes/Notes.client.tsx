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
  currentPage: initialPage,
}: NotesClientProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [search, setSearch] = useState(initialSearch);
  const [page, setPage] = useState(initialPage);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [debouncedSearch] = useDebounce(search, 300);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (page > 1) params.set('page', page.toString());
    router.push(`${pathname}?${params.toString()}`);
  }, [debouncedSearch, page, router, pathname]);

  const { data, isError, isLoading, isSuccess } = useQuery({
    queryKey: ['notes', initialSearch, page],
    queryFn: () => fetchNotes(initialSearch, page),
    placeholderData: keepPreviousData,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className={css.app}>
      <Toaster position="top-center" reverseOrder={false} />

      <header className={css.toolbar}>
        <SearchBox onChange={handleSearchChange} />

        {isSuccess && totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={page}
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
