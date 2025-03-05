import React, { useContext } from 'react';
import '../../App.css';
import {Image, ActionIcon} from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { CurrentBlockContext } from '../../context/currentBlockContext';
import { BlockType } from '../../../server/models/BlockType';

/**
 * Displays an image with an action icon.
 * @param {object} props - React props
 * @param {string} props.src image source
 * @param {string} props.alt image alt text
 * @returns {React.ReactNode} Image of block with action button
 */
export default function BlockImage({ block }) {

  const {
    currentBlock,
    storeBlock
  } = useContext(CurrentBlockContext);


  return (
    <div className="block-image" style={{ position: 'relative'}}>
    <ActionIcon
      size="sm"
      style={{ position: 'absolute', top: "10px", right: "10px", zIndex: 2 }}
      aria-label="Add to inventory"
      onClick={() => storeBlock(block)}
    >
      <IconPlus/>
    </ActionIcon>
      <Image
        src={block.inventoryTexture}
        alt={block.name}
        fallbackSrc="https://placehold.co/600x400?text=Placeholder"
      />
      {block.name}
    </div>
    
  );
}