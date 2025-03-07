import React, { useState } from 'react'
import {Modal, Button, TextInput} from '@mantine/core';
import { successMessage, errorMessage,  } from '../utils/notification_utils';
import { useNavigate } from 'react-router-dom';


export default function PublishForm({opened, close, buildId}){
  const [description, setDescription] = useState(''); 
  const navigate = useNavigate();

    async function publishPost(buildId: String) {
      const data = new FormData();
      try {
        data.append('buildId', buildId);
        
        if(description !== ''){
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
              publishPost(buildId);
            }}
          >
            Submit
          </Button>
        </form>
      </Modal>
    </>
  )
}