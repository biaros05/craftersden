import React, {useState} from 'react';
import { ScrollArea, SimpleGrid, Autocomplete } from '@mantine/core';
import BlockImage from './BlockImage';
import BlockSearchBar from './BlockSearchBar';

export default function BlockScrollArea({blockList}) {

  return (
    <section id="block-scroll-area">
      <BlockSearchBar blockList={blockList}/>
      <ScrollArea h={250} type="always" scrollbarSize={12} style={{ padding: '1em'}}>
        <SimpleGrid cols={4} spacing="sm">
        {blockList.map((block, index) => 
            <BlockImage src={block.src} alt={block.name} key={index}/>
        )}
        </SimpleGrid>
      </ScrollArea>
    </section>
  );
}