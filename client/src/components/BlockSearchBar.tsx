import React, {useState} from 'react';
import { Autocomplete } from '@mantine/core';

export default function BlockSearchBar({blockList, style={}}) {
  // data in Autocomplete cannot have duplicate values, so use a set, better solution possible??
  const [blockHistory, setBlockHistory] = useState(new Set<string>());
  const [searchValue, setSearchValue] = useState('');

  const filteredData = searchValue.length > 0 ? blockList : Array.from(blockHistory);
  return (
      <Autocomplete
        label="Search"
        placeholder="grass_block"
        data={filteredData.map(block => block.name)}
        value={searchValue}
        onChange={setSearchValue}
        limit={5}
        onOptionSubmit={(value) => {
          setBlockHistory(new Set([...blockHistory, value]));
          setSearchValue('');
        }}
        style={style}
      />
  );
}