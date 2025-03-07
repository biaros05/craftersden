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

/**
 * Builds component to show list of builds.
 * @param {object} props - React Props
 * @param {Build[]} props.builds List of builds
 * @returns {React.ReactNode} Builds to display
 */
export default function Builds({ builds }: { builds: Build[]; }): React.ReactNode {
  const navigate = useNavigate();
  const { setBuild } = useBuildUpdate();
  const [opened, { open, close }] = useDisclosure(false);
  const [unpublishedBuilds, setUnpublishedBuilds] = useState<string[]>([]); 

  async function unpublishBuild(buildId: string) {
    try {
      const requestBody = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ buildId })
      };
  
      const response = await fetch('/api/post/unpublish', requestBody);
      const json = await response.json();
      console.log(response); 
  
      if (!response.ok) {
        throw new Error(`${json.message}`);
      }
  
      successMessage(json.message);
      setUnpublishedBuilds((prev) => [...prev, buildId]);
  
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
          return (
            <div className="saved-builds" style={{ width: '250px' }}>
              <Image
                key={`build-${i}`}
                radius="md"
                height={125}
                src={build.progressPicture}
                onClick={() => {
                  setBuild(build);
                  navigate('/den');
                }}
              />
              <Button
                key={`build-${i}`}
                variant="outline"
                className='delete-save-button'
                color="rgb(178, 14, 14)"
                onClick={() => { }}
              >
                Delete Save
              </Button>
              {!build.isPublished ? <Button
                key={`build-${i}`}
                variant="outline"
                onClick={open}>
                Publish
              </Button> :
              <>
              {!unpublishedBuilds.includes(build._id) ? (
                <Button
                  key={`build-${i}`}
                  variant='outline'
                  color='orange'
                  onClick={() => {
                    unpublishBuild(build._id);
                  }}
                >
                  Unpublish 
                </Button>
              ) : (
                <p style={{ color: 'gray', fontSize: '14px' }}>Refresh to see changes</p>
              )
              }
              </>
            }
              <PublishForm opened={opened} close={close} buildId={build._id}/>
            </div>
          )
        })
      }
    </section>
  );
}