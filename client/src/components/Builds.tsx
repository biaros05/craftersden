import React from "react";
import '../styles/welcome.css'
import { Image } from '@mantine/core';
import '../styles/builds.css';

export default function Builds({builds}) {
    return (
      <section className="posts">
        {
          builds.map(build => {
            return <Image
            radius="md"
            height={125}
            src={build.progressPicture}
          />
          })
        }
      </section>
    )
}