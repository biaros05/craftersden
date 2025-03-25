import React, { useState } from 'react'
import { Modal, Button, TextInput, MultiSelect } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { successMessage, errorMessage, } from '../utils/notification_utils';
import '../styles/Post.css'
import MinecraftButton from './Custom/MinecraftButton';

type propTypes = {
  opened: boolean,
  close: () => void,
  buildId: string, 
  updateBuildStatus: (buildId :string, isPublished: boolean) => void
}

/**
 * This component represents the publish form in which user can input their description to describe their build.
 * @param {boolean} opened - Decides if Modal is opened.
 * @returns {React.ReactNode}- The publish form component.
 */
export default function PublishForm({ opened, close, buildId, updateBuildStatus } :  propTypes) {
  const [description, setDescription] = useState('');
  /**
   *
   * @param {string} buildId - The build id to be published.
   */
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
        <form className='publish-form'
          onSubmit={(e) => {
            e.preventDefault(); 
            publishPost(buildId);
            close();
          }}
          style={{display: 'flex', flexDirection: 'column'}}
        >
          <TextInput
            label="Description:"
            placeholder="Build description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            maxLength={50}
          />
{/* 
          <Select
            placeholder="Search Tags.."
            data={[
              { group: 'General', items: ['Survival Base', 'Creative Base', 'Hardcore'] },
              { group: 'Structure', items: ['Hut', 'House', 'Mansion', 'Farm', 'Village', 'Barn'] },
              { group: 'Themes', items: ['Medieval', 'Cottage', 'Fantasy', 'Minimalistic', 'Modern', 'Rustic'] }
            ]}
          /> */}
          <MultiSelect
            checkIconPosition="right"
            label='Build Tags'
            placeholder='Search Tags..'
            data={[
              { group: 'General', items: ['Survival Base', 'Creative Base', 'Hardcore'] },
              { group: 'Structure', items: ['Hut', 'House', 'Mansion', 'Farm', 'Village', 'Barn'] },
              { group: 'Themes', items: ['Medieval', 'Cottage', 'Fantasy', 'Minimalistic', 'Modern', 'Rustic'] }
            ]}
            searchable
            maxValues={5}
            clearable
            styles={{
              pill: {
                backgroundColor: '#4CAF50', 
                color: 'white', 
                fontWeight: 'bold',
              },
            }}
          />
          <MinecraftButton
            type="submit" 
            variant="filled"
          >
            Submit
          </MinecraftButton>
        </form>
      </Modal>
    </>
  )
}