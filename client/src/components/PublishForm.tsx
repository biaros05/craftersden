import React, { useState } from 'react'
import { Modal, Button, TextInput } from '@mantine/core';
import { successMessage, errorMessage, } from '../utils/notification_utils';
import { useNavigate } from 'react-router-dom';

type propTypes = {
  opened: boolean,
  close: () => void,
  buildId: string, 
  updateBuildStatus: (buildId :string, isPublished: boolean) => void
}

export default function PublishForm({ opened, close, buildId, updateBuildStatus } :  propTypes) {
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  async function publishPost(buildId: string) {
    const data = new FormData();
    try {
      data.append('buildId', buildId);

      if (description !== '') {
        data.append('description', description);
      }

      const requestOptions = {
        method: 'POST',
        body: data
      }
      const response = await fetch('/api/post/publish', requestOptions);
      const json = await response.json();

      console.log(json);

      if (!response.ok) {
        const err = new Error(`${json.message}`);
        throw err;
      }

      successMessage(json.message);
      updateBuildStatus(buildId, true);

    } catch (err) {
      console.error(err);
      errorMessage(err.message);
    }
  }

  return (
    <>
      <Modal opened={opened} onClose={close} title="Post Details" overlayProps={{
          backgroundOpacity: 0.22,
          blur: 3,
        }} centered>
        <form>
          <TextInput
            label='Description:'
            placeholder='Build description'
            value={description}
            onChange={(e) => { setDescription(e.target.value) }}
            maxLength={50}
          />
          <Button
            variant='filled'
            onClick={() => {
              publishPost(buildId);
              close();
            }}
          >
            Submit
          </Button>
        </form>
      </Modal>
    </>
  )
}