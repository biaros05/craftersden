import React from 'react';
import '../App.css';
import {Image, ActionIcon} from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';

export default function BlockImage({src = null, alt = ''}) {

  return (
    <div className="block-image">
    <ActionIcon
      size="xs"
    >
      <IconPlus />
    </ActionIcon>
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