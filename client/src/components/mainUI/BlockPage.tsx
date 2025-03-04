import React from 'react';
import { SimpleGrid, Loader, Notification } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import BlockImage from './BlockImage';
import useSWR from 'swr';
import { BlockType } from '../../../../server/models/BlockType';

const errorIcon = <IconX size="md" />;

/**
 * Paginated view for block panel component
 * @param {object} props - React props
 * @param {number} props.index Page number
 * @returns {React.ReactNode} Page of blocks
 */
export default function BlockPage({ index }: { index: number; }): React.ReactNode {
  
  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const { data, error, isLoading } = useSWR(`/api/blocks?page=${index}`, fetcher);

  if (isLoading) return <Loader/>;

  if (error) {
    console.error(error);
    return (
      <Notification icon={errorIcon} color="red" title="Error!">
          Something went wrong, please try again
      </Notification>
    );
  }

  return (
    <SimpleGrid cols={4} spacing="sm">
      {data?.blocks?.map((block: BlockType, index: number) => 
        <BlockImage src={block.inventoryTexture} alt={block.name} key={index}/>
      )}
    </SimpleGrid>
  );
}