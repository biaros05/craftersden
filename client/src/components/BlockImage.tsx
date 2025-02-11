import React from 'react';
import '../App.css';
import {Image} from '@mantine/core';

export default function BlockImage({src = null, alt = ''}) {

  return (
    <div className="block-image">
      <Image
        src={src}
        h={200}
        w="auto"
        fit="contain"
        alt={alt}
        fallbackSrc="https://placehold.co/600x400?text=Placeholder"
      />
      {alt}
    </div>
  )
}