import React from 'react';
import '../../App.css';
import {Image, ActionIcon} from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';

/**
 * Displays an image with an action icon.
 * @param src image source
 * @param alt image alt text
 * @returns React.JSX.Element
 */
export default function BlockImage({src = null, alt = ''}) {

  return (
    <div className="block-image" style={{ position: 'relative'}}>
    <ActionIcon
      size="sm"
      style={{ position: 'absolute', top: "10px", right: "10px", zIndex: 2 }}
      aria-label="Add to inventory"
    >
      <IconPlus/>
    </ActionIcon>
      <Image
        src={src}
        height={100}
        width="auto"
        alt={alt}
        fallbackSrc="https://placehold.co/600x400?text=Placeholder"
      />
      {alt}
    </div>
    
  )
}