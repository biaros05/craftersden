import React, {useState} from 'react';
import { Autocomplete } from '@mantine/core';

export default function BlockSearchBar({blockList, style={}}) {
  // data in Autocomplete cannot have duplicate values, so use a set, better solution possible??
  const [blockHistory, setBlockHistory] = useState(new Set<string>());
  const [searchValue, setSearchValue] = useState('');

  const filteredData = searchValue.length > 0 
  ? blockList.map(block => block.name) 
  : Array.from(blockHistory);
  
  function handleOptionSubmit(value: string) {
    setBlockHistory(new Set([...blockHistory, value]));
    setSearchValue('');
    //TODO: add block to inventory/call func to select it
  }
  return (
      <Autocomplete
        label="Search"
        placeholder="grass_block"
        data={filteredData}
        value={searchValue}
        onChange={setSearchValue}
        limit={5}
        onOptionSubmit={handleOptionSubmit}
        style={style}
      />
  );
}