import React, { useMemo } from 'react';
import { NoteCard } from './NoteCard';

export const NoteList = React.memo(({ notes, onEdit, onDelete }) => {
  // Memoize empty state check
  const isEmpty = useMemo(() => notes.length === 0, [notes.length]);

  // Memoize notes list to prevent unnecessary re-renders
  const notesList = useMemo(
    () =>
      notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )),
    [notes, onEdit, onDelete]
  );

  if (isEmpty) {
    return (
      <div className="empty-state">
        <h2>No notes yet</h2>
        <p>Create your first note to get started!</p>
      </div>
    );
  }

  return <div className="notes-container">{notesList}</div>;
});

NoteList.displayName = 'NoteList';
