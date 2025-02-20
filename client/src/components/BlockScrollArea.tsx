import React, {useState} from 'react';
import { ScrollArea, SimpleGrid, Autocomplete } from '@mantine/core';
import BlockImage from './BlockImage';
import BlockSearchBar from './BlockSearchBar';
import BlockPage from './BlockPage';

/**
 * Scrollable area for displaying grid of BlockImage. Contains BlockSearchBar.
 * @param blockList list of blocks/entities to display
 * @returns React.JSX.Element
 */
export default function BlockScrollArea({blockList}) {

  return (
    <section id="block-scroll-area">
      <BlockSearchBar blockList={blockList}/>
      <ScrollArea h={250} type="always" scrollbarSize={12} style={{ padding: '1em'}}>
        <BlockPage index={1}/>
      </ScrollArea>
    </section>
  );
}