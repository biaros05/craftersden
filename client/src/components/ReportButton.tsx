import React, { useState, useEffect } from 'react';
import { ActionIcon, Modal, Button, Stack } from '@mantine/core';
import { IconFlag } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';


export default function ReportButton({buildId, userId}){
  const [opened, { open, close }] = useDisclosure(false);
  
  return(
    <>
    <ActionIcon onClick={open} variant="light" color="red" size="lg">
      <IconFlag size={24}/>
    </ActionIcon>
    <Modal opened={opened} onClose={close} title="Report" centered>
        <Stack gap="md" justify='center'>
          <Button variant="outline" color="red">
            Report user
          </Button>
          <Button variant="outline" color="red">
            Report post
          </Button>
        </Stack>
      </Modal>
    </>
  )
}