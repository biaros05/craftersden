import React from 'react';
import '../../App.css';
import {Image, ActionIcon} from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';

/**
 * Displays an image with an action icon.
 * @param src.src
 * @param src image source
 * @param alt image alt text
 * @param src.alt
 * @returns React.JSX.Element
 */
export default function BlockImage({ src = null, alt = undefined }: { src?: string | null; alt?: string | undefined}) {

  return (
    <div className="block-image" style={{ position: 'relative'}}>
      <ActionIcon
        size="sm"
        style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 2 }}
        aria-label="Add to inventory"
      >
        <IconPlus/>
      </ActionIcon>
      <Image
        src={src}
        alt={alt}
        fallbackSrc="https://placehold.co/600x400?text=Placeholder"
      />
      {alt}
    </div>
    
  );
}