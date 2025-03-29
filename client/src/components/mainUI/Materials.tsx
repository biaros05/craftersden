import React, {useEffect, useRef, useState} from 'react';
import { ScrollArea } from '@mantine/core';
import { SimpleGrid } from '@mantine/core';
import { BlockType } from '../../utils/building_plane_utils';
import BlockInfo from './BlockInfo';


/**
 * Scrollable area for displaying grid of BlockImage. Contains BlockSearchBar.
 * @param {style} style - CSS style object
 * @returns {React.ReactNode} Block scroll area component
 */
export default function Materials({ blocks, style = {}}): React.ReactNode {

  const scrollViewport = useRef<HTMLDivElement>(null);
  const [blockCounts, setBlockCounts] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    const newBlockCounts = new Map();

    blocks.forEach((block) => {
      if (newBlockCounts.has(block.name)) {
        newBlockCounts.set(block.name, newBlockCounts.get(block.name)! + 1);
      }
      else {
        newBlockCounts.set(block.name, 0);
      }
    });

    setBlockCounts(newBlockCounts);

    // fetch all textures + store them... right now the pictures arent getting used anywhere...

  }, [blocks]);

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
          {blocks?.map((block: BlockType, index: number) => 
            <BlockInfo block={block} numberOfBlocks={blockCounts.get(block.name)} allowSelectBlock={false} key={index}/>
          )}
        </SimpleGrid>
      </ScrollArea.Autosize>
    </section>
  );
}