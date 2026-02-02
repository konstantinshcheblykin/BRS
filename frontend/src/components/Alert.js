import React from 'react';

export const Alert = ({ type, message, onClose }) => {
  if (!message) return null;

  return (
    <div className={type === 'error' ? 'error' : 'success'}>
      {message}
      {onClose && (
        <button
          onClick={onClose}
          style={{
            float: 'right',
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '1.2rem',
            padding: '0 10px',
          }}
        >
          ×
        </button>
      )}
    </div>
  );
};
