import React, {useState, useEffect} from 'react';
import { ScrollArea, Pagination } from '@mantine/core';
import BlockImage from './BlockImage';
import BlockSearchBar from './BlockSearchBar';
import BlockPage from './BlockPage';
import useSWR from 'swr';

/**
 * Scrollable area for displaying grid of BlockImage. Contains BlockSearchBar.
 * @param blockList list of blocks/entities to display
 * @returns React.JSX.Element
 */
export default function BlockScrollArea({blockList}) {

  const [pageIndex, setPageIndex] = useState<number>(1);

  return (
    <section id="block-scroll-area">
      <BlockSearchBar blockList={blockList}/>
      {/* Cache next page */}
      <div style={{ display: 'none' }}><BlockPage index={ pageIndex + 1 }/></div>
      <Pagination total={50} value={pageIndex} onChange={setPageIndex} withPages={true}/>
      <ScrollArea h={250} type="always" scrollbarSize={12} style={{ padding: '1em'}}>
        <BlockPage index={pageIndex}/>
      </ScrollArea>
    </section>
  );
}