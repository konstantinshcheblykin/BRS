import { useState, useEffect, useCallback } from 'react';
import { notesApi } from '../services/api';

export const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Separate loading states for better UX
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await notesApi.getAll();
      if (response.data.success) {
        setNotes(response.data.data);
      }
    } catch (err) {
      // More detailed error handling
      let errorMessage = 'Failed to load notes. Please try again.';
      
      if (err.isNetworkError) {
        errorMessage = err.message || 'Cannot connect to server. Please check if backend is running.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.errors) {
        const errors = Object.values(err.response.data.errors).flat();
        errorMessage = errors.join(', ');
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      console.error('Error fetching notes:', {
        error: err,
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        isNetworkError: err.isNetworkError,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const createNote = useCallback(async (noteData) => {
    try {
      setIsCreating(true);
      setError(null);
      const response = await notesApi.create(noteData);
      if (response.data.success) {
        setNotes((prev) => [response.data.data, ...prev]);
        return { success: true, data: response.data.data };
      }
      return { success: false };
    } catch (err) {
      let errorMessage = 'Failed to create note.';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (err.errors) {
        errorMessage = Object.values(err.errors).flat().join(', ');
      } else if (err.message) {
        errorMessage = err.message;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      setError(errorMessage);
      console.error('Error creating note:', err);
      return { success: false, error: errorMessage };
    } finally {
      setIsCreating(false);
    }
  }, []);

  const updateNote = useCallback(async (id, noteData) => {
    try {
      setIsUpdating(true);
      setError(null);
      const response = await notesApi.update(id, noteData);
      if (response.data.success) {
        setNotes((prev) =>
          prev.map((note) => (note.id === id ? response.data.data : note))
        );
        return { success: true, data: response.data.data };
      }
      return { success: false };
    } catch (err) {
      let errorMessage = 'Failed to update note.';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (err.errors) {
        errorMessage = Object.values(err.errors).flat().join(', ');
      } else if (err.message) {
        errorMessage = err.message;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      setError(errorMessage);
      console.error('Error updating note:', err);
      return { success: false, error: errorMessage };
    } finally {
      setIsUpdating(false);
    }
  }, []);

  const deleteNote = useCallback(async (id) => {
    try {
      setIsDeleting(true);
      setError(null);
      const response = await notesApi.delete(id);
      if (response.data.success) {
        setNotes((prev) => prev.filter((note) => note.id !== id));
        return { success: true };
      }
      return { success: false };
    } catch (err) {
      let errorMessage = 'Failed to delete note.';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (err.message) {
        errorMessage = err.message;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      setError(errorMessage);
      console.error('Error deleting note:', err);
      return { success: false, error: errorMessage };
    } finally {
      setIsDeleting(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return {
    notes,
    loading,
    error,
    isCreating,
    isUpdating,
    isDeleting,
    createNote,
    updateNote,
    deleteNote,
    refetch: fetchNotes,
  };
};
