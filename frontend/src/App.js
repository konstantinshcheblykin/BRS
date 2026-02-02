import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useNotes } from './hooks/useNotes';
import { Alert } from './components/Alert';
import { NoteForm } from './components/NoteForm';
import { NoteList } from './components/NoteList';
import './index.css';

function App() {
  const {
    notes,
    loading,
    error,
    isCreating,
    isUpdating,
    isDeleting,
    createNote,
    updateNote,
    deleteNote,
  } = useNotes();
  const [success, setSuccess] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [showForm, setShowForm] = useState(false);
  const successTimeoutRef = useRef(null);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (success) {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
      successTimeoutRef.current = setTimeout(() => {
        setSuccess(null);
      }, 3000);
    }

    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, [success]);

  // Handle form submit (create or update)
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setSuccess(null);

      const result = editingNote
        ? await updateNote(editingNote.id, formData)
        : await createNote(formData);

      if (result.success) {
        setSuccess(
          editingNote ? 'Note updated successfully!' : 'Note created successfully!'
        );
        // Reset form
        setFormData({ title: '', content: '' });
        setEditingNote(null);
        setShowForm(false);
      }
    },
    [editingNote, formData, createNote, updateNote]
  );

  // Handle delete with confirmation
  const handleDelete = useCallback(
    async (id) => {
      if (!window.confirm('Are you sure you want to delete this note?')) {
        return;
      }

      const result = await deleteNote(id);
      if (result.success) {
        setSuccess('Note deleted successfully!');
      }
    },
    [deleteNote]
  );

  // Start editing note
  const handleEdit = useCallback(
    (note) => {
      setEditingNote(note);
      setFormData({ title: note.title, content: note.content });
      setShowForm(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    []
  );

  // Cancel editing
  const handleCancel = useCallback(() => {
    setEditingNote(null);
    setFormData({ title: '', content: '' });
    setShowForm(false);
  }, []);

  // Show create form
  const handleCreateClick = useCallback(() => {
    setShowForm(true);
    setEditingNote(null);
    setFormData({ title: '', content: '' });
  }, []);

  // Close alerts
  const handleCloseError = useCallback(() => {
    // Error is managed by useNotes hook, but we can clear it if needed
  }, []);

  const handleCloseSuccess = useCallback(() => {
    setSuccess(null);
    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current);
    }
  }, []);

  // Memoize empty state check
  const isEmpty = useMemo(() => notes.length === 0, [notes.length]);

  return (
    <div className="App">
      <div className="header">
        <div className="container">
          <h1>📝 Notes microService</h1>
        </div>
      </div>

      <div className="container">
        <Alert type="error" message={error} onClose={handleCloseError} />
        <Alert type="success" message={success} onClose={handleCloseSuccess} />

        {!showForm && (
          <button className="btn btn-create" onClick={handleCreateClick}>
            + Create New Note
          </button>
        )}

        {showForm && (
          <NoteForm
            note={editingNote}
            formData={formData}
            onChange={setFormData}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isCreating || isUpdating}
          />
        )}

        {loading ? (
          <div className="loading">Loading notes...</div>
        ) : isEmpty ? (
          <div className="empty-state">
            <h2>No notes yet</h2>
            <p>Create your first note to get started!</p>
          </div>
        ) : (
          <NoteList notes={notes} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
}

export default App;
