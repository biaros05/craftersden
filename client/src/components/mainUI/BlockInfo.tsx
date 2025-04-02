import React from 'react';
import BlockImage from './BlockImage';
import { BlockType } from '../../../../server/models/BlockType';

/**
 * Scrollable area for displaying grid of BlockImage. Contains BlockSearchBar.
 * @param {style} style - CSS style object
 * @returns {React.ReactNode} Block scroll area component
 */
export default function BlockInfo({ block, numberOfBlocks, allowSelectBlock }: {block: BlockType, numberOfBlocks: number, allowSelectBlock: boolean}): React.ReactNode {

  return (
    <div id="block-box">
      <BlockImage block={block} allowSelectBlock={allowSelectBlock}/>
      <p>x{numberOfBlocks}</p>
    </div>
  );
}