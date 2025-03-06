import React from 'react';
import { useNavigate } from "react-router-dom"
import '../styles/welcome.css';
import { Image, Button } from '@mantine/core';
import '../styles/builds.css';
import { useBuildUpdate } from '../hooks/BuildContext.tsx';
import { successMessage, errorMessage } from '../utils/notification_utils';
import { StatusError } from '../utils/building_plane_utils';

type Build = {
  _id: string,
  progressPicture: string,
  description: string,
  buildJSON: object,
  isPublished: boolean,
  thumnails: [],
}

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
 * @returns {React.ReactNode} Builds to display
 */
export default function Builds({builds, setBuilds}: { builds: Build[], setBuilds: any }): React.ReactNode {
  const navigate = useNavigate();
  const { setBuild } = useBuildUpdate();
  
  return (
    <section className="posts">
      {
        builds.map((build) => {
          return (
          <div key={build._id} className="saved-builds" style={{ width: '250px'}}>
            <Image
              radius="md"
              height={125}
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
                console.log(build);
                const buildId = build._id;
                await deleteBuild(buildId);
                setBuilds(builds.filter(build => build._id !== buildId));
              }}
              >
              Delete
            </Button>
          </div>
          )
        })
      }
    </section>
  );
}