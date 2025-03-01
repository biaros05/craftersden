import React from 'react';
import '../styles/welcome.css';
import { Image } from '@mantine/core';
import '../styles/builds.css';

// TODO update type to reflect what is stored.
type Build = {
  progressPicture: string,
  description: String,
  buildJSON: {},
  isPublished: Boolean,
  thumnails: [],
}

/**
 * Builds component to show list of builds.
 * @param {object} props - React Props
 * @param {Build[]} props.builds List of builds
 * @returns {React.ReactNode} Builds to display
 */
export default function Builds({builds}: { builds: Build[]; }): React.ReactNode {
  return (
    <section className="posts">
      {
        builds.map((build, i) => {
          return <Image
            key={`build-${i}`}
            radius="md"
            height={125}
            src={build.progressPicture}
          />;
        })
      }
    </section>
  );
}