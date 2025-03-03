import React from 'react';
import {Tabs} from '@mantine/core';
import BlockScrollArea from './BlockScrollArea';

/**
 * Displays a tabbed block selection area.
 * @param style optional style prop applied to the block selection section
 * @example ```tsx
 * <BlockSelectio style={{width: '30%'}}/>
 * ```
 * @returns React.JSX.Element
 */
export default function BlockSelection({style = {}}) {
  return (
    <div id="block-selection" style={style}>
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
        <BlockScrollArea/>
      </Tabs.Panel>

      <Tabs.Panel value="resources">
        <div> Resources used </div>
      </Tabs.Panel>
      
      <Tabs.Panel value="materials">
        <div> Materials used </div>
      </Tabs.Panel>

    </Tabs>
    </div>
  )
}