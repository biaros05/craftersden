import React, {useContext, useEffect, useRef, useState} from 'react';
import { InventoryBlockContext } from '../../context/inventoryBlockContext';
import { CurrentBlockContext } from '../../context/currentBlockContext';
import InventoryBlock from './InventoryBlock.tsx';
import {Flex} from '@mantine/core';
/**
 * Component that contains currently stored blocks in inventory
 * @returns {React.ReactNode} - InventoryHotbar component
 */
export default function InventoryHotbar({}) {
  const {
    inventoryBlocks,
    addBlockToInventory
  } = useContext(InventoryBlockContext);

  const {
    storeBlock
  } = useContext(CurrentBlockContext);

  const keyboardControlsRef = useRef<(e: KeyboardEvent) => void>(null);

  const [selectedBlockIndex, setSelectedBlockIndex] = useState<number | null>(null);

  /**
   * Event handler to cycle through different states
   * @param {KeyboardEvent} e - Event object 
   */
  function keyboardControls(e: KeyboardEvent) {
    const keyPressed = Number(e.key);
    if (isNaN(keyPressed)) {
      return;
    }
    const selectedBlock = inventoryBlocks[keyPressed - 1];
    if (selectedBlock) {
      storeBlock(selectedBlock);
      setSelectedBlockIndex(keyPressed - 1);
    }
  }

  useEffect(() => {
    keyboardControlsRef.current = keyboardControls;
  }, [inventoryBlocks]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (keyboardControlsRef.current) {
        keyboardControlsRef.current(e);
      }
    }
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('draggedBlock'));
    addBlockToInventory(data, index);
  }
  return (
    <Flex 
      className='inventory-hotbar'
      direction="row"
      onDragOver={(e) => e.preventDefault()}
      >
      {inventoryBlocks.map((block, index) => 
        <InventoryBlock 
          block={block} 
          key={index} 
          isSelected={index == selectedBlockIndex}
          onClick={() => {
            storeBlock(block);
            setSelectedBlockIndex(index);
          }}
          onDrop={(e) => handleDrop(e, index)}
          />
      )}
    </Flex>
  )
}