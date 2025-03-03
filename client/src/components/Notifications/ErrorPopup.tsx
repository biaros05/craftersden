import { IconX, IconInfoCircle } from '@tabler/icons-react';
import { Alert } from '@mantine/core';
import React from 'react';
import './Popup.css';

export default function ErrorPopup({message, title, setError}) {
  const icon = <IconInfoCircle />;
  return (
    <>
      <Alert variant="light" className="float" withCloseButton color="green" title={title} icon={icon} onClose={() => setError({})}>
        {message}
      </Alert>
    </>
  );
}