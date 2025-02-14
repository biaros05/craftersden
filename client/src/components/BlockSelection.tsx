import React from 'react';
import {Tabs} from '@mantine/core';
import BlockScrollArea from './BlockScrollArea';

/**
 * Displays a tabbed block selection area.
 * @param blockList list of blocks to display
 * @param style optional style prop applied to the block selection section
 * @returns React.JSX.Element
 */
export default function BlockSelection({ blockList, style}) {
  return (
    <section id="block-selection" style={style}>
    <Tabs defaultValue="all">
      <Tabs.List>
        <Tabs.Tab value="all">
          All
        </Tabs.Tab>
        <Tabs.Tab value="resources">
          Resources
        </Tabs.Tab>
        <Tabs.Tab value="materials">
          Materials
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="all">
        <BlockScrollArea blockList={blockList}/>
      </Tabs.Panel>

      <Tabs.Panel value="resources">
        <BlockScrollArea blockList={blockList.filter(block => block.type === 'overworld')}/>
      </Tabs.Panel>
      
      <Tabs.Panel value="materials">
        <BlockScrollArea blockList={blockList}/>
      </Tabs.Panel>

    </Tabs>
    </section>
  )
}