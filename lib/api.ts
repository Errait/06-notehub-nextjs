import axios from 'axios';
import type { Note, PostNote } from '../types/note';

interface FetchNotesResponse {
  notes: Note[],
  totalPages: number,
}

const myKey = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
const BASE_URL = 'https://notehub-public.goit.study/api';

const fetchNotes = async (searchWord: string, currentPage: number): Promise<FetchNotesResponse> => {
  const response = await axios.get<FetchNotesResponse>(
    `${BASE_URL}/notes`,
    {
      params: {
        search: searchWord,
        page: currentPage,
        perPage: 12,
      },
      headers: {
        Authorization: `Bearer ${myKey}`,
      },
    }
  )

  return response.data
}

const createNote = async (newToDo: PostNote): Promise<Note> => {
  const response = await axios.post<Note>(
    `${BASE_URL}/notes`,
    newToDo,
    {
      headers: {
        Authorization: `Bearer ${myKey}`,
      }
    },
  )
  return response.data
}

const deleteNote = async (id: string): Promise<Note> => {
  const response = await axios.delete<Note>(
    `${BASE_URL}/notes/${id}`,
    {
      headers: {
        Authorization: `Bearer ${myKey}`,
      }
    },
  )
  return response.data
}

const fetchNoteById = async (id: string) => {
  const response = await axios.get<Note>(
    `${BASE_URL}/notes/${id}`,
    {
      headers: {
        Authorization: `Bearer ${myKey}`,
      },
    }
  );
  return response.data;
};

export {fetchNotes, createNote, deleteNote, fetchNoteById}