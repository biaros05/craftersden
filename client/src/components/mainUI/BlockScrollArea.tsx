import React, {useState, useRef} from 'react';
import { ScrollArea, Pagination } from '@mantine/core';
import BlockSearchBar from './BlockSearchBar';
import BlockPage from './BlockPage';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

/**
 * Scrollable area for displaying grid of BlockImage. Contains BlockSearchBar.
 * @param {style} style - CSS style object
 * @returns {React.ReactNode} Block scroll area component
 */
export default function BlockScrollArea({ style = {}}): React.ReactNode {

  const scrollViewport = useRef<HTMLDivElement>(null);
  const [pageIndex, setPageIndex] = useState<number>(1);

  const scrollToTop = () => scrollViewport.current!.scrollTo({ top: 0, behavior: 'smooth' });

  const handlePageChange = (index: number) => {
    setPageIndex(index);
    scrollToTop();
  };

  const { data: pageCountData } = useSWR('/api/blocks/page-count', fetcher);
  const { data: blockData } = useSWR('/api/blocks', fetcher);

  const pageCount = pageCountData?.totalPages;

  return (
    <section id="block-scroll-area" style={style}>
      <BlockSearchBar blockList={blockData?.blocks}/>
      {/* Cache next page */}
      {pageIndex < pageCount &&
        <div style={{ display: 'none' }}><BlockPage index={ pageIndex + 1 }/></div> }
      {pageCount && <Pagination total={pageCount} value={pageIndex} onChange={handlePageChange} withPages={true}/>}
      <ScrollArea.Autosize mah={300} maw={400} mx="auto" type="always" scrollbarSize={12} style={{ padding: '1em'}} viewportRef={scrollViewport}>
        <BlockPage index={pageIndex}/>
      </ScrollArea.Autosize>
    </section>
  );
}