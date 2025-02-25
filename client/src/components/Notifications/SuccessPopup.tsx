import { IconX, IconCheck } from '@tabler/icons-react';
import { Notification } from '@mantine/core';
import React from 'react';

function SuccessPopup({message, title}) {
  const checkIcon = <IconCheck size={20} />;

  return (
    <>
      <Notification icon={checkIcon} color="teal" title={title} mt="md">
        {message}
      </Notification>
    </>
  );
}