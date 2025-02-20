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
  const [totalPages, setTotalPages] = useState<number>();

  useEffect(() => {
    const getTotalPages = async () => {
      const res = await fetch(`/api/blocks/page-count`);
      if (res.ok) {
        const data = await res.json();
        setTotalPages(data.totalPages);
      } else {
        console.error('Failed to fetch page count ', res.status);
      }
    }
    getTotalPages();
  }, []);

  return (
    <section id="block-scroll-area">
      <BlockSearchBar blockList={blockList}/>
      {/* Cache next page */}
      <div style={{ display: 'none' }}><BlockPage index={ pageIndex + 1 }/></div>
      {totalPages && <Pagination total={totalPages} value={pageIndex} onChange={setPageIndex} withPages={true}/>}
      <ScrollArea h={250} type="always" scrollbarSize={12} style={{ padding: '1em'}}>
        <BlockPage index={pageIndex}/>
      </ScrollArea>
    </section>
  );
}