'use client';

import { Toaster } from 'react-hot-toast';
import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';

import css from './NotesPage.module.css';

import SearchBox from '../../components/SearchBox/SearchBox';
import Pagination from '../../components/Pagination/Pagination';
import NoteList from '../../components/NoteList/NoteList';
import Modal from '../../components/Modal/Modal';
import NoteForm from '../../components/NoteForm/NoteForm';
import { fetchNotes } from '../../lib/api';

export default function App() {
  const [searchWord, setSearchWord] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [debouncedSearchWord] = useDebounce(searchWord, 300);

  const { data, isError, isLoading, isSuccess } = useQuery({
    queryKey: ['notes', debouncedSearchWord, currentPage],
    queryFn: () => fetchNotes(debouncedSearchWord, currentPage),
    placeholderData: keepPreviousData,
  });

  const handleSearchChange = (value: string) => {
    setSearchWord(value);
    setCurrentPage(1);
  };

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
      <Toaster position="top-center" reverseOrder={false} />

      <header className={css.toolbar}>
        <SearchBox value={searchWord} onChange={handleSearchChange} />

        {isSuccess && totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
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

      {!isError && !isLoading && notes.length > 0 && <NoteList notes={notes} />}

      {!isError && !isLoading && notes.length === 0 && (
        <p className={css.empty}>No notes found...</p>
      )}
    </div>
  );
}
