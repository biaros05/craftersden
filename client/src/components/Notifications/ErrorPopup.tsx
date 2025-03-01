import { IconX, IconCheck } from '@tabler/icons-react';
import { Notification } from '@mantine/core';
import React from 'react';

function ErrorPopup({message, title}) {
  const xIcon = <IconX size={20} />;

  return (
    <>
      <Notification icon={xIcon} color="red" title={title}>
        {message}
      </Notification>
    </>
  );
}