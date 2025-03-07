import React, { useState } from 'react';
import { useNavigate } from "react-router-dom"
import '../styles/welcome.css';
import { Image, Button } from '@mantine/core';
import '../styles/builds.css';
import { useBuildUpdate } from '../hooks/BuildContext.tsx';
import { useDisclosure } from '@mantine/hooks';
import PublishForm from './PublishForm.tsx';
import { errorMessage, successMessage } from '../utils/notification_utils.ts';

type Build = {
  _id : string,
  progressPicture: string,
  description: string,
  buildJSON: object,
  isPublished: boolean,
  thumnails: [],
}

type propTypes = {
  builds: Build[],
  updateBuildStatus: (buildId : string, isPublished: boolean) => void
}

/**
 * Builds component to show list of builds.
 * @param {object} props - React Props
 * @param {Build[]} props.builds List of builds
 * @returns {React.ReactNode} Builds to display
 */
export default function Builds({ builds, updateBuildStatus }: propTypes): React.ReactNode {
  const navigate = useNavigate();
  const { setBuild } = useBuildUpdate();
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedBuildId, setSelectedBuildId] = useState<string | null>(null);

  async function unpublishBuild(buildId: string) {
    try {
      const requestBody = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ buildId })
      };
      
      console.log(`request body: ${requestBody.body}`);
      const response = await fetch('/api/post/unpublish', requestBody);
      const json = await response.json();
      console.log(response); 
  
      if (!response.ok) {
        throw new Error(`${json.message}`);
      }
  
      successMessage(json.message);
      updateBuildStatus(buildId, false);
    } catch (err) {
      console.error(err);
      errorMessage(err.message);
    }
  }
  

  return (
    <section className="posts">
      {
        builds.map((build, i) => {
          console.log(build.progressPicture)
          console.log(`build ${i} id: ${build._id}`);
          return (
            <div className="saved-builds" style={{ width: '250px' }}>
              <Image
                key={`buildImage-${i}`}
                radius="md"
                height={125}
                src={build.progressPicture}
                onClick={() => {
                  setBuild(build);
                  navigate('/den');
                }}
              />
              <Button
                key={`saveButton-${i}`}
                variant="outline"
                className='delete-save-button'
                color="rgb(178, 14, 14)"
                onClick={() => { }}
              >
                Delete Save
              </Button>
              {!build.isPublished ? <Button
                key={`publishButton-${i}`}
                variant="outline"
                onClick={() => {
                  setSelectedBuildId(build._id);
                  open();
                  }}>
                Publish
              </Button> :
              <Button
                key={`unPublish-${i}`}
                variant='outline'
                color='orange'
                onClick={() => {
                  console.log(`unpublishing build: ${build._id}`)
                  unpublishBuild(build._id);
                }}
              >
                Unpublish 
              </Button>
            }
              <PublishForm opened={opened} close={close} buildId={selectedBuildId}/>
            </div>
          )
        })
      }
    </section>
  );
}