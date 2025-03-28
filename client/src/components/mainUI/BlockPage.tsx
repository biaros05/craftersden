import React from 'react';
import { SimpleGrid, Notification } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import BlockImage from './BlockImage';
import useSWR from 'swr';
import { BlockType } from '../../../../server/models/BlockType';
import CreeperLoad from '../Loader/CreeperLoad';
const errorIcon = <IconX size="md" />;


const fetcher = (url: string) => fetch(url).then((res) => res.json());

/**
 * Paginated view for block panel component
 * @param {object} props - React props
 * @param {number} props.index Page number
 * @param {string} props.searchValue Value to use in search query
 * @returns {React.ReactNode} Page of blocks
 */
export default function BlockPage({ index, searchValue }: { index: number, searchValue: string }): React.ReactNode {
  
  const { data, error, isLoading } = useSWR(`/api/blocks?page=${index}&search=${searchValue}`, fetcher);

  if (isLoading) return <CreeperLoad/>;

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
      <BlockImage block={block} key={index}/>
    )}
    </SimpleGrid>
  );
}