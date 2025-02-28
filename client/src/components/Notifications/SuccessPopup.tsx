import { IconInfoCircle } from '@tabler/icons-react';
import { Alert } from '@mantine/core';
import React from 'react';
import './Popup.css'; 

export default function SuccessPopup({message, title}) {
  const icon = <IconInfoCircle />;

  return (
    <>
      <Alert 
      className="float" 
      variant="light" 
      withCloseButton 
      color="teal" 
      title={title} 
      icon={icon}
      >
        {message}
      </Alert>
    </>
  );
}