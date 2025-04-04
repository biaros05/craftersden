import React, { useState } from 'react';
import useNavigate from "./Navigation/useNavigate.tsx"
import '../styles/welcome.css';
import { Image, Button } from '@mantine/core';
import '../styles/builds.css';
import { useBuildUpdate } from '../hooks/BuildContext.tsx';
import { useDisclosure } from '@mantine/hooks';
import PublishForm from './PublishForm.tsx';
import { errorMessage, successMessage } from '../utils/notification_utils.ts';
import { StatusError } from '../utils/building_plane_utils';

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
  updateBuildStatus: (buildId : string, isPublished: boolean) => void,
  setBuilds: ([]) => void
}

/**
 * Deletes the build and will send either a success or error message.
 * @param {string} buildId - id of the build to delete
 */
async function deleteBuild(buildId: string) {
  try {
    const requestOptions = {
      method: 'DELETE',
    };
    const response = await fetch(`/api/post/${buildId}`, requestOptions);

    if (!response.ok) {
      const err = new StatusError(`Something went wrong!`);
      err.status = response.status;
      throw err;
    }

    successMessage('Build successfully deleted!');
  } catch (e) {
    errorMessage(e.message);
  }

}

/**
 * Builds component to show list of builds.
 * @param {object} props - React Props
 * @param {Build[]} props.builds List of builds
 * @param {Function} props.updateBuildStatus - Updates the buildStatus inside of builds
 * @param {Function} props.setBuilds - Updates the builds inside of builds
 * @returns {React.ReactNode} Builds to display
 */
export default function Builds({ builds, updateBuildStatus, setBuilds }: propTypes): React.ReactNode {
  const navigate = useNavigate();
  const { setBuild } = useBuildUpdate();
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedBuildId, setSelectedBuildId] = useState<string | ''>('');

  /**
   * Takes a build id and fetch /api/post/unpublish to unpublish the chosen post.
   * @param {string} buildId - the build id
   */
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
    <section className="builds">
      {
        builds.map((build) => {
          return (
            <div key={build._id} className="saved-builds" style={{ width: '250px' }}>
              <Image
                radius="md"
                height={150}
                src={build.progressPicture}
                onClick={() => {
                  setBuild(build);
                  navigate('/den');
                }}
              />
              <Button
                variant="outline"
                className='delete-save-button'
                color="rgb(178, 14, 14)"
                onClick={async () => {
                  setBuild(build);
                  const buildId = build._id;
                  await deleteBuild(buildId);
                  setBuilds(builds.filter(build => build._id !== buildId));
                }}
              >
                Delete Save
              </Button>
              {!build.isPublished ? 
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedBuildId(build._id);
                  open();
                  }}>
                Publish
              </Button> :
              <Button
                variant='outline'
                color='orange'
                onClick={() => {
                  unpublishBuild(build._id);
                }}
              >
                Unpublish 
              </Button>
            }
              <PublishForm opened={opened} close={close} buildId={selectedBuildId} updateBuildStatus={updateBuildStatus}/>
            </div>
          )
        })
      }
    </section>
  );
}