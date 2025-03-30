import React, { useState, useEffect } from 'react';
import { ActionIcon, Modal, Button, Stack, TextInput } from '@mantine/core';
import { IconFlag } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';


export default function ReportButton({ buildId, userId, username }) {
  const [opened, { open, close }] = useDisclosure(false);
  const [formOpened, { open: openForm, close: closeForm }] = useDisclosure(false);
  const [reportType, setReportType] = useState('');
  const [reason, setReason] = useState('');

  const handleReportClick = (type) => {
    setReportType(type);
    openForm();
  }

  async function handleSubmit() {
    const data = {

    }
  }

  return (
    <>
      <ActionIcon onClick={open} variant="light" color="red" size="lg">
        <IconFlag size={24} />
      </ActionIcon>
      <Modal opened={opened} onClose={close} title="Report" centered>
        <Stack gap="md" justify='center'>
          <Button
            onClick={() => {
              handleReportClick('user');
              close();
            }}
            variant="outline"
            color="red">
            Report user
          </Button>
          <Button
            onClick={() => {
              handleReportClick('post')
              close();
            }}
            variant="outline"
            color="red">
            Report post
          </Button>
        </Stack>
      </Modal>

      <Modal
        opened={formOpened}
        onClose={closeForm}
        title={`Report ${reportType === 'user' ? username : ' Post'}`}
        centered
      >
        <form
          className="report-form"
          onSubmit={(e) => {
            e.preventDefault();
            closeForm();
          }}
          style={{ width: "100%" }}
        >
          <Stack gap="md" justify="center" align="center">
            <TextInput
              label="Reason for report:"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={100}
              w="100%" 
            />
            <Button variant="outline" color="red">
              Submit
            </Button>
          </Stack>
        </form>
      </Modal>

    </>
  )
}