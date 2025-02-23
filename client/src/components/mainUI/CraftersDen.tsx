import BuildPlane from './BuildPlane.tsx';
import BlockSelection from './BlockSelection.tsx';
import './CraftersDen.css';
import { Component } from 'react';
import { useState } from 'react';

const blockList = [
  { name: 'grass', src: 'https://www.filterforge.com/filters/11635.jpg', type: 'overworld' },
  { name: 'dirt', src: 'https://www.filterforge.com/filters/11636.jpg', type: 'overworld' },
  { name: 'stone', src: 'https://www.filterforge.com/filters/11637.jpg', type: 'overworld' },
  { name: 'sand', src: 'https://www.filterforge.com/filters/11638.jpg', type: 'overworld' },
  { name: 'water', src: 'https://www.filterforge.com/filters/11639.jpg', type: 'overworld' },
  { name: 'lava', src: 'https://www.filterforge.com/filters/11640.jpg' },
  { name: 'wood', src: 'https://www.filterforge.com/filters/11641.jpg' },
  { name: 'leaves', src: 'https://www.filterforge.com/filters/11642.jpg' },
  { name: 'glass', src: 'https://www.filterforge.com/filters/11643.jpg' },
  { name: 'brick', src: 'https://www.filterforge.com/filters/11644.jpg' }
];

/**
 * Crafters den main ui component with build plane and block selecction panel.
 * @returns {Component}A div element with the id 'main-ui' to render the den.
 */
export default function CraftersDen() {
  const [isViewMode, setIsViewMode] = useState(false);
  if(!isViewMode)
    {
      return (
        <>
          <div id="main-ui">
            <BuildPlane isViewMode={isViewMode}/>
            <BlockSelection blockList={blockList}/>
          </div>
          <button type="button" onClick={() => setIsViewMode(!isViewMode)}>
            Toggle Mode
          </button>
        </>
      );
    }
    else
    {
      return (
        <>
          <div id="main-ui">
            <BuildPlane isViewMode={isViewMode}/>
          </div>
          <button type="button" onClick={() => setIsViewMode(!isViewMode)}>
            Toggle Mode
          </button>
        </>
      );
    }
}