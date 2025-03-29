import React, {CSSProperties, ReactNode} from 'react';
import {Tabs} from '@mantine/core';
import BlockScrollArea from './BlockScrollArea';
import Materials from './Materials';
import { PlacedBlock } from 'deepslate';

/**
 * Displays a tabbed block selection area.
 * @param {object} props React props
 * @param {PlacedBlock[]} props.blocks Blocks used
 * @param {CSSProperties?} props.style optional style applied to the block selection section
 * @example ```tsx
 * <BlockSelectio style={{width: '30%'}}/>
 * ```
 * @returns {ReactNode} Block selection panel
 */
export default function BlockSelection({blocks, style}: {blocks: PlacedBlock[]; style?: CSSProperties;}): ReactNode {
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
          <Materials blocks={blocks} />
        </Tabs.Panel>

      </Tabs>
    </div>
  );
}