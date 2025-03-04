import React from "react";
import { Link } from "react-router-dom";
import { createContext } from "react";
import { useNavigate } from "react-router-dom"
import '../styles/welcome.css'
import { Carousel } from '@mantine/carousel';
import { Image, Text, Box, ActionIcon } from '@mantine/core';
import '../styles/builds.css';



export default function Builds({ builds }) {
  function goToBuild(e) {
    const navigate = useNavigate();
    const savedBuild = createContext(e.buildJSON);
    console.log(savedBuild);
    navigate('/den');
  }

  return (
    <section className="posts">
      {
        builds.map(build => {
          return <Image
            radius="md"
            height={125}
            src={build.progressPicture}
            onClick={() => goToBuild(build)}
          />
        })
      }
    </section>
  )
}