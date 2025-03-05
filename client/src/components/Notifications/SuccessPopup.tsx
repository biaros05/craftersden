import { IconInfoCircle } from '@tabler/icons-react';
import { Alert } from '@mantine/core';
import React from 'react';
import './Popup.css'; 

/**
 * Success popup to inform user of positive information
 * @param {object} props - React props
 * @param {string} props.message Message to display in popup
 * @param {string} props.title Title to give to the popup
 * @returns {React.ReactNode} Success popup
 */
export default function SuccessPopup({message, title}: { message: string; title: string; }): React.ReactNode {
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