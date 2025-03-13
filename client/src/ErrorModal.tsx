import { createPortal } from 'react-dom';
import React from 'react';
import './styles/ErrorModal.css';


/**
 * Modal to show errors to user
 * @param {object} props - React Props
 * @param {Error} props.error Error to display
 * @param {Function} props.onConfirm Callback to trigger when the user clicks on confirm button
 * @returns {React.ReactNode} Error modal
 */
export default function ErrorModal({error, onConfirm}: { error: Error; onConfirm: () => void }): React.ReactNode {
  return createPortal(
    <div className="backdrop">
      <div className="modal">
        <h2 className="title">{error.title}</h2>
        <p className="message">{error.message}</p>
        <button onClick={onConfirm}>Okay</button>
      </div>
    </div>,
    document.getElementById('error-modal') !
  );
};
