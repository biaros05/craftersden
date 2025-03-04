import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom"
import '../styles/welcome.css'
import { Carousel } from '@mantine/carousel';
import { Image, Text, Box, ActionIcon } from '@mantine/core';
import '../styles/builds.css';
import { useBuildUpdate } from "../hooks/BuildContext";

export default function Builds({ builds }) {
  const navigate = useNavigate();
  const { setBuild } = useBuildUpdate();

  return (
    <section className="posts">
      {
        builds.map(build => {
          return <Image
            radius="md"
            height={125}
            src={build.progressPicture}
            onClick={() => {
              setBuild(build);
              navigate('/den');
            }}
          />
        })
      }
    </section>
  )
}