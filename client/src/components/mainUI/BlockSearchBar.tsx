import React, {CSSProperties, useState, useContext } from 'react';
import { Autocomplete } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { CurrentBlockContext } from '../../context/currentBlockContext';

const SEARCH_ICON = <IconSearch/>;

// TODO replace this type with the correct type (or add missing info for this type and move to utils)
type BlockListItem = {
  name: string,
}

/**
 * Search bar for blocks/entities. Shows history when no search value is present.
 * @param {object} props - React props
 * @param {BlockListItem[]} props.blockList list of blocks/entities to search
 * @param {CSSProperties?} props.style optional style prop applied to search bar
 * @returns {React.ReactNode} Block search bar
 */
export default function BlockSearchBar({blockList, style}: { blockList: BlockListItem[]; style?: CSSProperties | undefined; }): React.ReactNode {

  // data in Autocomplete cannot have duplicate values, so use a set, better solution possible??
  const [blockHistory, setBlockHistory] = useState(new Set<string>());
  const [searchValue, setSearchValue] = useState('');

  const { storeBlock } = useContext(CurrentBlockContext);

  const filteredData = searchValue.length > 0 
    ? blockList.map(block => block.name)
    : Array.from(blockHistory);
  
  /**
   * 
   * @param {string} value submit value
   */
  function handleOptionSubmit(value: string) {
    setBlockHistory(new Set([...blockHistory, value]));
    storeBlock(blockList.find(block => block.name === value));
  }
  return (
    <Autocomplete
      label="Search"
      placeholder="grass_block"
      clearable={true}
      data={filteredData}
      value={searchValue}
      onChange={setSearchValue}
      onOptionSubmit={handleOptionSubmit}
      leftSection={SEARCH_ICON}
      style={{
        width: '50%',
        margin: '1em',
        ...style
      }}
    />
  );
}