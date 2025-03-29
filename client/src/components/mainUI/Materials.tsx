import React, {useRef, useState} from 'react';
import { ScrollArea } from '@mantine/core';
import { SimpleGrid } from '@mantine/core';
import BlockInfo from './BlockInfo';
import { BlockType } from '../../../../server/models/BlockType';
import MinecraftButton from '../Custom/MinecraftButton';
import CloneableStructure from './deepslate/CloneableStructure';

/**
 * Scrollable area for displaying grid of BlockImage. Contains BlockSearchBar.
 * @param {style} style - CSS style object
 * @returns {React.ReactNode} Block scroll area component
 */
export default function Materials({ structure, planeBlock, style = {}}: {structure: React.RefObject<CloneableStructure>; planeBlock?: string, style?: React.CSSProperties}): React.ReactNode {
  // const scrollViewport = useRef<HTMLDivElement>(null);
  const includePlane = useRef(false);
  const [blockCounts, setBlockCounts] = useState<Map<string, number>>(new Map());
  const [blockData, setBlockData] = useState<BlockType[]>();

  /**
   * Counts occurences of each block and
   * fetches their inventory texture
   */
  async function getMaterialsData() {
    const newBlockCounts = new Map();
    const blockData: Promise<BlockType>[] = [];

    structure.current.getBlocks().forEach((block) => {
      const name = block.state.getName().path;
      if (!includePlane.current) {
        if (`${block.state.getName().namespace}:${name}` === planeBlock && block.pos[1] === 0) {
          return;
        }
      }
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

  return (
    <section id="block-scroll-area" style={style}>
      <div className='calculate-materials-wrapper'>
        <MinecraftButton className='calculate-materials' onClick={getMaterialsData}>Calculate Materials</MinecraftButton>
        <label htmlFor="include-plane">Include Plane </label>
        <input type="checkbox" name='include-plane' id='include-plane' onChange={(e) => includePlane.current = e.target.checked} />
      </div>
      <ScrollArea.Autosize 
        mah={500} 
        maw={400} 
        mx="auto" 
        type="always" 
        scrollbarSize={12} 
        style={{ padding: '1em'}} 
        >
        <SimpleGrid cols={4} spacing="sm">
          {blockData?.map(b => {return <BlockInfo block={b} numberOfBlocks={blockCounts.get(b.name)!} allowSelectBlock={false} />})}
        </SimpleGrid>
      </ScrollArea.Autosize>
    </section>
  );
}