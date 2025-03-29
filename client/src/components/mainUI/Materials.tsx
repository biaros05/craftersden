import React, {useEffect, useRef, useState} from 'react';
import { ScrollArea } from '@mantine/core';
import { SimpleGrid } from '@mantine/core';
import BlockInfo from './BlockInfo';
import { PlacedBlock } from 'deepslate';

/**
 * Scrollable area for displaying grid of BlockImage. Contains BlockSearchBar.
 * @param {style} style - CSS style object
 * @returns {React.ReactNode} Block scroll area component
 */
export default function Materials({ blocks, style = {}}: {blocks: PlacedBlock[]; style?: React.CSSProperties}): React.ReactNode {

  const scrollViewport = useRef<HTMLDivElement>(null);
  const [blockCounts, setBlockCounts] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    const newBlockCounts = new Map();

    blocks.forEach((block) => {
      console.log(block)
      const name = block.state.getName();
      if (newBlockCounts.has(name)) {
        newBlockCounts.set(name, newBlockCounts.get(name) + 1);
      } else {
        newBlockCounts.set(name, 1);
      }
    });

    setBlockCounts(newBlockCounts);

    // fetch all textures + store them... right now the pictures arent getting used anywhere...

  }, [blocks]);

  const blockEntries = blockCounts.entries();
  const materialList: React.ReactNode[] = [];
  for (const block of blockEntries) {
    console.log(block)
    materialList.push(<BlockInfo block={block} numberOfBlocks={block[1]} allowSelectBlock={false} key={`materials-${block[0]}`}/>)
  }

  return (
    <section id="block-scroll-area" style={style}>
      <ScrollArea.Autosize 
        mah={500} 
        maw={400} 
        mx="auto" 
        type="always" 
        scrollbarSize={12} 
        style={{ padding: '1em'}} 
        viewportRef={scrollViewport}>
        <SimpleGrid cols={4} spacing="sm">
          {/* NEED TO USE blockCounts HERE, or else you get duplicates (or turn blocks into a Set) */}
          {materialList}
        </SimpleGrid>
      </ScrollArea.Autosize>
    </section>
  );
}