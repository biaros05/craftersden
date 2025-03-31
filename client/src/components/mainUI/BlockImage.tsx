import React, { useContext } from 'react';
import '../../App.css';
import {Image, ActionIcon} from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { CurrentBlockContext } from '../../context/currentBlockContext';
import { InventoryBlockContext } from '../../context/inventoryBlockContext';
import { BlockType } from '../../../server/models/BlockType';

/**
 * Displays an image with an action icon.
 * @param {object} props - React props
 * @param {BlockType} props.block Block to render
 * @param {boolean} props.allowSelectBlock Whether to show the add button
 * @returns {React.ReactNode} Image of block with action button
 */
export default function BlockImage({block, allowSelectBlock = true}: { block: BlockType; allowSelectBlock: boolean }): React.ReactNode {

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('draggedBlock', JSON.stringify(block))
  }

  const {
    storeBlock
  } = useContext(CurrentBlockContext);

  const  {
    addBlockToInventory
  } = useContext(InventoryBlockContext);

  return (
    <div 
      className="block-image" 
      draggable={true}
      onDragStart={handleDrag}
      style={{ position: 'relative'}}>
    <ActionIcon
      size="sm"
      style={{ position: 'absolute', top: "10px", right: "10px", zIndex: 2 }}
      aria-label="Add to inventory"
      onClick={() => addBlockToInventory(block)}
    >
      <IconPlus/>
    </ActionIcon>}
      <Image
        src={block.inventoryTexture}
        alt={block.name}
        fallbackSrc="https://placehold.co/600x400?text=Placeholder"
        onClick={() => storeBlock(block)}
      />
      <div className="block-name"> {block.name} </div>
    </div>
    
  );
}