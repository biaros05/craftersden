import React, {useState, useContext, useEffect} from 'react';
import {Image} from '@mantine/core';
import { CurrentBlockContext } from '../../context/currentBlockContext';

type InventoryBlockProps = {
  block: {
    _id: string
    inventoryTexture: string
    name: string
  }
}
/**
 * Component that represents a block within the inventory hotbar
 * @param {object} props React props
 * @param {object} props.block Block object
 * @returns {React.ReactNode} Singular block within intentory
 */
export default function InventoryBlock({ block }: InventoryBlockProps): React.ReactNode {
  const [isHovered, setIsHovered] = useState(false);

  const {
    storeBlock
  } = useContext(CurrentBlockContext);

  return (
  <div 
    className={`inventory-block ${isHovered ? 'hovered': ''}`}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
    onClick={() => storeBlock(block)}
  >
  <Image
    src={block.inventoryTexture}
    alt={block.name}
  />
  </div>
  );
}