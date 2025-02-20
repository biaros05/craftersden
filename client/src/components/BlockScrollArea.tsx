import React, {useState, useEffect} from 'react';
import { ScrollArea, Pagination } from '@mantine/core';
import BlockImage from './BlockImage';
import BlockSearchBar from './BlockSearchBar';
import BlockPage from './BlockPage';
import useSWR from 'swr';
import { BlockType } from '../../../server/models/BlockType';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

/**
 * Scrollable area for displaying grid of BlockImage. Contains BlockSearchBar.
 * @param blockList list of blocks/entities to display
 * @returns React.JSX.Element
 */
export default function BlockScrollArea({blockList}) {

  const [pageIndex, setPageIndex] = useState<number>(1);

  const { data: pageCountData, error: pageCountError } = useSWR('/api/blocks/page-count', fetcher);
  const { data: blockData, error: blockDataError } = useSWR('/api/blocks', fetcher);

  const pageCount = pageCountData?.totalPages;

  return (
    <section id="block-scroll-area">
      <BlockSearchBar blockList={blockData?.blocks}/>
      {/* Cache next page */}
      {pageIndex < pageCount &&
        <div style={{ display: 'none' }}><BlockPage index={ pageIndex + 1 }/></div> }
      {pageCount && <Pagination total={pageCount} value={pageIndex} onChange={setPageIndex} withPages={true}/>}
      <ScrollArea h={250} type="always" scrollbarSize={12} style={{ padding: '1em'}}>
        <BlockPage index={pageIndex}/>
      </ScrollArea>
    </section>
  );
}