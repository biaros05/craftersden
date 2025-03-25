import BlockSelection from './BlockSelection';
import ButtonPanel from './ButtonPanel';
import { useAuth } from '../../hooks/useAuth';
import './CraftersDen.css';
import { useEffect, useState, useRef } from 'react';
import React from 'react';
import { useBuild } from '../../hooks/BuildContext';
import { CurrentBlockContext } from '../../context/currentBlockContext';
import DeepslatePlane from './deepslate/DeepslatePlane.tsx';


/**
 * Crafters den main ui component with build plane and block selecction panel.
 * @returns {React.ReactNode} - A div element with the id 'main-ui' to render the den.
 */
export default function CraftersDen(): React.ReactNode {
  const [isViewMode, setIsViewMode] = useState(false);
  const canvas = useRef(null);
  const {email} = useAuth() ?? {};
  const [blocks,] = useState([]);
  const [currentBlock, setCurrentBlock] = useState(null);

  const build = useBuild();
  // const { setBuild } = useBuildUpdate();

  useEffect(() => {
    // Save blocks went here
  }, []);

  let curBuildId = null;

  if(build?.build){
    curBuildId = build.build._id;
    console.log(curBuildId)
  }

  /**
   * Fetches the complete block data from the api, and stores it in CurrentBlockContext.
   * @param {object} block - block object to fetch from the api
   */
  async function storeBlock(block: object) {
    const response = await fetch(`/api/block/${block._id}`);
    const completeBlockData = await response.json();
    setCurrentBlock(completeBlockData);
  }

  /**
   * Saves the current build in the db
   * @param {string} progressPicture URL
   */
  async function savePost(progressPicture: string) {
    // Save post was here
    console.log(progressPicture)
  }

  return (
    <CurrentBlockContext.Provider value={{currentBlock, storeBlock}}>
      <div id="main-ui">
        <section className="build-tools">
          <DeepslatePlane />
          {!isViewMode && <BlockSelection />}
        </section>
        <ButtonPanel 
        blocks={blocks}
        setIsViewMode={setIsViewMode} 
        canvas={canvas} 
        savePost={savePost} 
        isViewMode={isViewMode}
        email={email}/>
      </div>
    </CurrentBlockContext.Provider>
  );
}