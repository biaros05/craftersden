import React, {CSSProperties, ReactNode} from 'react';
import {Tabs} from '@mantine/core';
import BlockScrollArea from './BlockScrollArea';
import Materials from './Materials';
import CloneableStructure from './deepslate/CloneableStructure';

/**
 * Displays a tabbed block selection area.
 * @param {object} props React props
 * @param {CloneableStructure} props.structure Structure built
 * @param {CSSProperties?} props.style optional style applied to the block selection section
 * @example ```tsx
 * <BlockSelectio style={{width: '30%'}}/>
 * ```
 * @returns {ReactNode} Block selection panel
 */
export default function BlockSelection({structure, style}: {structure: React.RefObject<CloneableStructure>; style?: CSSProperties;}): ReactNode {
  return (
    <div id="block-selection" style={style ?? {}}>
      <Tabs defaultValue="all">
        <Tabs.List>
          <Tabs.Tab value="all">
          All
          </Tabs.Tab>
          <Tabs.Tab value="materials">
          Materials
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="all">
          <BlockScrollArea style={{height:"100%"}}/>
        </Tabs.Panel>
      
        <Tabs.Panel value="materials">
          <Materials structure={structure} planeBlock='minecraft:grass_block' />
        </Tabs.Panel>

      </Tabs>
    </div>
  );
}