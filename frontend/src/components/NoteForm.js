import React, { useCallback, useMemo } from 'react';

export const NoteForm = React.memo(({ note, formData, onChange, onSubmit, onCancel, isLoading = false }) => {
  // Memoize form title
  const formTitle = useMemo(() => (note ? 'Edit Note' : 'Create New Note'), [note]);
  const submitButtonText = useMemo(() => (note ? 'Update' : 'Create'), [note]);

  // Memoize input handlers
  const handleTitleChange = useCallback(
    (e) => {
      onChange({ ...formData, title: e.target.value });
    },
    [formData, onChange]
  );

  const handleContentChange = useCallback(
    (e) => {
      onChange({ ...formData, content: e.target.value });
    },
    [formData, onChange]
  );

  return (
    <div className="form-container">
      <h2>{formTitle}</h2>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={handleTitleChange}
            required
            maxLength={255}
            placeholder="Enter note title"
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content *</label>
          <textarea
            id="content"
            value={formData.content}
            onChange={handleContentChange}
            required
            placeholder="Enter note content"
          />
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn-save" disabled={isLoading}>
            {isLoading ? 'Saving...' : submitButtonText}
          </button>
        </div>
      </form>
    </div>
  );
});

NoteForm.displayName = 'NoteForm';
