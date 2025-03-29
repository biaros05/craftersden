import React, {useContext, useEffect} from 'react';
import { InventoryBlockContext } from '../../context/inventoryBlockContext';
import InventoryBlock from './InventoryBlock.tsx';
import {Flex} from '@mantine/core';
/**
 * Component that contains currently stored blocks in inventory
 * @returns {React.ReactNode} - InventoryHotbar component
 */
export default function InventoryHotbar({}) {
  const {
    inventoryBlocks
  } = useContext(InventoryBlockContext);

  useEffect(() => {
    console.log(inventoryBlocks);
  })

  return (
    <Flex 
      className='inventory-hotbar'
      direction="row"
      >
      {inventoryBlocks.map((block, index) => 
        <InventoryBlock block={block} key={index}/>
      )}
    </Flex>
  )
}