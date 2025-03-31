import React, { useState } from 'react';
import { ActionIcon, Modal, Button, Stack, TextInput } from '@mantine/core';
import { IconFlag } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { errorMessage, successMessage } from '../utils/notification_utils';
import { useAuth } from '../hooks/useAuth';

type Data = {
  reporter: string | null | undefined,
  reason: string, 
  userId: string | undefined, 
  postId: string | undefined
}

/**
 *Is the report button that prompts user for reporting selection, user or build, 
 *and then prompts for the report message.
   @param {object} props - React props
 * @param {string} props.buildId - The post's id to be reported
 * @param {string} props.userId - The user id to be reported
 * @param {string} props.username - The username of the user to be reported
 * @returns {React.ReactNode} - The ReportButton with the pop ups.
 */
export default function ReportButton({ buildId, userId, username }) {
  const [opened, { open, close }] = useDisclosure(false);
  const [formOpened, { open: openForm, close: closeForm }] = useDisclosure(false);
  const [reportType, setReportType] = useState('');
  const [reason, setReason] = useState('');
  const {id} = useAuth() ?? {};

  const handleReportClick = (type) => {
    setReportType(type);
    openForm();
  }

  /**
   *Handles the user's report submission
   * @returns {Function} - The error message with pop up
   */
  async function handleSubmit() {
    try {
      const data: Data = {
        userId: undefined,
        postId: undefined,
        reporter: id, 
        reason
      };
      
      if (reportType === 'user') {
        data.userId = userId;
      } else {
        data.postId = buildId;
      }
      

      const requestOptions = {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(data), 
      };

      console.log(requestOptions);

      const response = await fetch('/api/report/', requestOptions);
      const json = await response.json();
  
      if (!response.ok) {
        return errorMessage(json.message);
      }
  
      successMessage(json.message);
    } catch (err) {
      errorMessage(err.message);
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
            handleSubmit();
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
            <Button variant="outline" color="red" type='submit'>
              Submit
            </Button>
          </Stack>
        </form>
      </Modal>

    </>
  )
}