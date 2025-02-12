import React from 'react';
import '../App.css';
import {Image, ActionIcon} from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';

export default function BlockImage({src = null, alt = ''}) {

  return (
    <div className="block-image" style={{ position: 'relative'}}>
    <ActionIcon
      size="lg"
      style={{ position: 'absolute', top: "2em", right: "1em", zIndex: 2 }}
      aria-label="Add to inventory"
    >
      <IconPlus/>
    </ActionIcon>
      <Image
        src={src}
        height={200}
        width="auto"
        fit="contain"
        alt={alt}
        fallbackSrc="https://placehold.co/600x400?text=Placeholder"
      />
      {alt}
    </div>
    
  )
}