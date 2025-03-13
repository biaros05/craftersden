import { IconInfoCircle } from '@tabler/icons-react';
import { Alert } from '@mantine/core';
import React from 'react';
import './Popup.css';

type ErrorPopupProps = {
  message: string,
  title: string,
  setError: React.Dispatch<React.SetStateAction<object>>
}

/**
 * Popup to inform users of errors
 * @param {object} props - React props
 * @param {string} props.message Message to display in the popup
 * @param {string} props.title Title to give the popup
 * @param {React.Dispatch<React.SetStateAction<{}>>} props.setError Callback to set error state
 * @returns {React.ReactNode} error popup
 */
export default function ErrorPopup({message, title, setError}: ErrorPopupProps): React.ReactNode {
  const icon = <IconInfoCircle />;
  return (
    <>
      <Alert variant="light" className="float" withCloseButton color="green" title={title} icon={icon} onClose={() => setError({})}>
        {message}
      </Alert>
    </>
  );
}