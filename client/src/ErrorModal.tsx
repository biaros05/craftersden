import { createPortal } from 'react-dom';
import React from 'react';
import './styles/ErrorModal.css';


/**
 *
 * @param root0
 * @param root0.error
 * @param root0.onConfirm
 */
export default function ErrorModal({error, onConfirm}) {
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
