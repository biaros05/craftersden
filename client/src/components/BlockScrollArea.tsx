import React from 'react';
import { ScrollArea, SimpleGrid } from '@mantine/core';
import BlockImage from './BlockImage';

export default function BlockScrollArea({blockList}) {
  return (
    <ScrollArea h={250} type="always" scrollbarSize={12}>
      <SimpleGrid cols={4} spacing="sm">
      {blockList.map((block, index) => 
          <BlockImage src={block.src} alt={block.name} key={index}/>
      )}
      </SimpleGrid>
    </ScrollArea>
  );
}