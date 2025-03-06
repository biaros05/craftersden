import React from 'react';
import { useNavigate } from "react-router-dom"
import '../styles/welcome.css';
import { Image } from '@mantine/core';
import '../styles/builds.css';
import { useBuildUpdate } from '../hooks/BuildContext.tsx';
import { Button } from '@mantine/core';

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
export default function Builds({builds}: { builds: Build[]; }): React.ReactNode {
  const navigate = useNavigate();
  const { setBuild } = useBuildUpdate();
  
  return (
    <section className="posts">
      {
        builds.map((build, i) => {
          console.log(build.progressPicture);
          return (
          <div className="saved-builds" style={{ width: '250px'}}>
            <Image
              key={`build-${i}`}
              radius="md"
              height={125}
              src={build.progressPicture}
              onClick={() => {
                setBuild(build);
                navigate('/den');
              }}
            />;
            <Button 
              variant="filled"
              onClick={() => {}}
              >
              Delete Save
            </Button>
          </div>
          );
        })
      }
    </section>
  );
}