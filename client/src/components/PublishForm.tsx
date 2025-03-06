import React, { useState } from 'react'
import {Modal, Button, TextInput} from '@mantine/core';


export default function PublishForm({opened, close}){
  const [description, setDescription] = useState('');

  
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