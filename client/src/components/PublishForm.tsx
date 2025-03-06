import React, { useState } from 'react'
import {Modal, Button, TextInput} from '@mantine/core';
import { successMessage, errorMessage } from '../utils/notification_utils';


export default function PublishForm({opened, close, buildId}){
  const [description, setDescription] = useState('');

    async function publishPost(buildId: String) {
      const data = new FormData();
      try {
        data.append('buildId', buildId);
        const requestOptions = {
          method: 'POST',
          body: data
        }
        const response = await fetch('/api/post/publish', requestOptions);
        const json = await response.json();
  
        console.log(json);
  
        if (!response.ok) {
          const err = new StatusError(`${json.message}`);
          err.status = json.status;
          throw err;
        }
  
        successMessage(json.message);
  
      } catch (err) {
        console.error(err);
        errorMessage(err.message);
      }
    }

  return(
    <>
      <Modal opened={opened} onClose={close} title="Post Details">
        <form>
          <TextInput
            label='Description:'
            placeholder='Build description'
            value={description}
            onChange={(e) => {setDescription(e.target.value)}}
            required 
          />
          <Button
            variant='filled'
            onClick={() => {
            }}
          >
            Submit
          </Button>
        </form>
      </Modal>
    </>
  )
}