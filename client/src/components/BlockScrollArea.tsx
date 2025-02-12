import React, {useState} from 'react';
import { ScrollArea, SimpleGrid, Autocomplete } from '@mantine/core';
import BlockImage from './BlockImage';

export default function BlockScrollArea({blockList}) {

  // data in Autocomplete cannot have duplicate values, better solution possible??
  const [blockHistory, setBlockHistory] = useState(new Set<string>());
  const [searchValue, setSearchValue] = useState('');
  
  const filteredData = searchValue
    ? blockList.map(block => block.name).filter(name => name.includes(searchValue))
    : Array.from(blockHistory);
  return (
    <section id="block-scroll-area">
    <Autocomplete
      label="Search"
      placeholder="grass_block"
      data={filteredData}
      value={searchValue}
      onChange={setSearchValue}
      limit={5}
      onOptionSubmit={(value) => {
        setBlockHistory(new Set([...blockHistory, value]));
        setSearchValue('');
      }}
    />
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