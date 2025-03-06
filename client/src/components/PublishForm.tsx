import React, { useState } from 'react'
import {Modal, Button} from '@mantine/core';


export default function PublishForm({opened, close}){
  const [description, setDescription] = useState('');

  //function to update fields here.

  return(
    <>
      <Modal opened={opened} onClose={close} title="Post Details">
        <form>
          <div id="publish-form">
            <label htmlFor="description">Description:</label>
            <input type="text" name="description" id="description" required />
          </div>
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