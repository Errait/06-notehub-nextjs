export const VALID_TAGS = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'] as const;
export type NoteTag = typeof VALID_TAGS[number];

export interface PostNote {
  title: string,
  content: string,
  tag: NoteTag,
}

export interface Note extends PostNote{
  id: string,
  createdAt: string,
  updatedAt: string,
}