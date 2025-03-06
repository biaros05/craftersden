import React from 'react';
import { useNavigate } from "react-router-dom"
import '../styles/welcome.css';
import { Image, Button } from '@mantine/core';
import '../styles/builds.css';
import { useBuildUpdate } from '../hooks/BuildContext.tsx';
import { useDisclosure } from '@mantine/hooks';
import PublishForm from './PublishForm.tsx';

type Build = {
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
              {!build.isPublished && <Button
                key={`build-${i}`}
                variant="outline"
                onClick={open}>
                Publish
              </Button>}
              <PublishForm opened={opened} close={close} buildId={build._id}/>
            </div>
          )
        })
      }
    </section>
  );
}