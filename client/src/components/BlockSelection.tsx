import React from 'react';
import {Tabs} from '@mantine/core';
import BlockScrollArea from './BlockScrollArea';

/**
 * Displays a tabbed block selection area.
 * @param blockList list of blocks to display
 * @returns React.JSX.Element
 */
export default function BlockSelection({ blockList }) {
  return (
    <section id="block-selection">
    <Tabs defaultValue="all">
      <Tabs.List>
        <Tabs.Tab value="all">
          All
        </Tabs.Tab>
        <Tabs.Tab value="overworld">
          Overworld
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="all">
        <BlockScrollArea blockList={blockList}/>
      </Tabs.Panel>

      <Tabs.Panel value="overworld">
        <BlockScrollArea blockList={blockList.filter(block => block.type === 'overworld')}/>
      </Tabs.Panel>

    </Tabs>
    </section>
  )
}