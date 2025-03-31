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
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void,
  draggable?: true
}
/**
 * Component that represents a block within the inventory hotbar
 * @param {object} props React props
 * @param {object} props.block Block object
 * @param {boolean} props.isSelected if the block is currently selected
 * @param {Function} props.onClick optional callback
 * @param {Function} props.onDrop optional callback
 * @param {Function} props.onDragStart optional callback
 * @param {boolean} props.draggable needed if onDragStart is provided
 * @returns {React.ReactNode} Singular block within intentory
 */
export default function InventoryBlock({ block, isSelected, onClick, onDrop, onDragStart, draggable}: InventoryBlockProps): React.ReactNode {
  const [isHovered, setIsHovered] = useState(false);

  return (
  <div 
    className={`inventory-block ${isHovered ? 'hovered': ''} ${isSelected ? 'selected': ''}`}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
    onClick={onClick}
    onDrop={onDrop}
    onDragStart={onDragStart}
    draggable={draggable}
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