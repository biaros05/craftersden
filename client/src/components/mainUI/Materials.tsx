import React, {useEffect, useRef, useState} from 'react';
import { ScrollArea } from '@mantine/core';
import { SimpleGrid } from '@mantine/core';
import BlockInfo from './BlockInfo';
import { PlacedBlock } from 'deepslate';
import { BlockType } from '../../../../server/models/BlockType';

/**
 * Scrollable area for displaying grid of BlockImage. Contains BlockSearchBar.
 * @param {style} style - CSS style object
 * @returns {React.ReactNode} Block scroll area component
 */
export default function Materials({ blocks, style = {}}: {blocks: PlacedBlock[]; style?: React.CSSProperties}): React.ReactNode {

  const scrollViewport = useRef<HTMLDivElement>(null);
  const [blockCounts, setBlockCounts] = useState<Map<string, number>>(new Map());
  const [blockData, setBlockData] = useState<BlockType[]>();

  useEffect(() => {
    /**
     * Counts occurences of each block and
     * fetches their inventory texture
     */
    async function getMaterialsData() {
      const newBlockCounts = new Map();
      const blockData: Promise<BlockType>[] = [];
  
      blocks.forEach((block) => {
        console.log(block)
        const name = block.state.getName().path;
        if (newBlockCounts.has(name)) {
          newBlockCounts.set(name, newBlockCounts.get(name) + 1);
        } else {
          newBlockCounts.set(name, 1);
          blockData.push(fetch(`/api/block/${name}/image`).
            then(resp => {
              if (resp.ok) {
                return resp.json()
              }
            }));
          }
      });
  
      setBlockCounts(newBlockCounts);
      setBlockData(await Promise.all(blockData));
    }
    
    getMaterialsData();
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
          {blockData?.map(b => {return <BlockInfo block={b} numberOfBlocks={blockCounts.get(b.name)!} allowSelectBlock={false} />})}
        </SimpleGrid>
      </ScrollArea.Autosize>
    </section>
  );
}