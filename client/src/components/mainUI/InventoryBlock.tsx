import React, {useState } from 'react';
import {Image} from '@mantine/core';

type InventoryBlockProps = {
  block: {
    _id: string
    inventoryTexture: string
    name: string
  }
  onClick?: () => void
}
/**
 * Component that represents a block within the inventory hotbar
 * @param {object} props React props
 * @param {object} props.block Block object
 * @param {VoidFunction} props.onClick
 * @returns {React.ReactNode} Singular block within intentory
 */
export default function InventoryBlock({ block, onClick }: InventoryBlockProps): React.ReactNode {
  const [isHovered, setIsHovered] = useState(false);

  return (
  <div 
    className={`inventory-block ${isHovered ? 'hovered': ''}`}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
    onClick={onClick}
  >
  <Image
    src={block.inventoryTexture}
    alt={block.name}
  />
  </div>
  );
}