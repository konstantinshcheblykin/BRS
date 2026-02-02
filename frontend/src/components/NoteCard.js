import React, { useCallback } from 'react';
import { formatDate } from '../utils/dateFormatter';

export const NoteCard = React.memo(({ note, onEdit, onDelete }) => {
  // Memoize handlers to prevent unnecessary re-renders
  const handleEdit = useCallback(() => {
    onEdit(note);
  }, [note, onEdit]);

  const handleDelete = useCallback(() => {
    onDelete(note.id);
  }, [note.id, onDelete]);

  // Memoize date comparison
  const isUpdated = note.updated_at !== note.created_at;

  return (
    <div className="note-card">
      <h3>{note.title}</h3>
      <p>{note.content}</p>
      <div className="date">
        Created: {formatDate(note.created_at)}
        {isUpdated && (
          <span> • Updated: {formatDate(note.updated_at)}</span>
        )}
      </div>
      <div className="note-actions">
        <button className="btn btn-edit" onClick={handleEdit}>
          Edit
        </button>
        <button className="btn btn-delete" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
});

NoteCard.displayName = 'NoteCard';
