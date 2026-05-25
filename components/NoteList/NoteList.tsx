import css from './NoteList.module.css';
import type { Note } from '../../types/note';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '../../lib/api';
import Link from 'next/link';

export interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const deleteNoteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const handleDeleteNote = (id: Note['id']) => {
    deleteNoteMutation.mutate(id);
  };
  return (
    <ul className={css.list}>
      {notes?.map(note => (
        <li key={note.id} className={css.listItem}>
          <article>
            <h2 className={css.title}>{note.title}</h2>
            <p className={css.content}>{note.content}</p>
          </article>

          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <Link href={`/notes/${note.id}`} className={css.button}>
              View details
            </Link>

            <button
              className={css.button}
              onClick={() => handleDeleteNote(note.id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
