import React, {useState } from 'react';
import {Image} from '@mantine/core';

type InventoryBlockProps = {
  block: {
    _id: string
    inventoryTexture: string
    name: string
  },
  isSelected: boolean,
  onClick?: () => void,
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void,
}
/**
 * Component that represents a block within the inventory hotbar
 * @param {object} props React props
 * @param {object} props.block Block object
 * @param {boolean} props.isSelected if the block is currently selected
 * @param {VoidFunction} props.onClick
 * @param {VoidFunction} props.onDrop
 * @returns {React.ReactNode} Singular block within intentory
 */
export default function InventoryBlock({ block, isSelected, onClick, onDrop }: InventoryBlockProps): React.ReactNode {
  const [isHovered, setIsHovered] = useState(false);

  return (
  <div 
    className={`inventory-block ${isHovered ? 'hovered': ''} ${isSelected ? 'selected': ''}`}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
    onClick={onClick}
    onDrop={onDrop}
  >
  {block && 
    <Image
    src={block.inventoryTexture}
    alt={block.name}
  />
  }
  </div>
  );
}