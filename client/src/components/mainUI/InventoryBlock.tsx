import React, {useState} from 'react';
import {Image, ActionIcon} from '@mantine/core';

/**
 * Component that represents a block within the inventory hotbar
 * @param {object} props React props
 * @param {string} props.inventoryTexture src to use for block
 * @param {string} props.alt alt text for block image
 * @returns {React.ReactNode} Singular block within intentory
 */
export default function InventoryBlock({inventoryTexture, alt}: { inventoryTexture: string; alt: string; }): React.ReactNode {
  const [isHovered, setIsHovered] = useState(false);

  return (
  <div 
    className={`inventory-block ${isHovered ? 'hovered': ''}`}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
  >
  <Image
    src={inventoryTexture}
    alt={alt}
  />
  </div>
  );
}