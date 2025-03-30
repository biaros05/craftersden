import BlockSelection from './BlockSelection';
import ButtonPanel from './ButtonPanel';
import { useAuth } from '../../hooks/useAuth';
import './CraftersDen.css';
import { useState, useRef } from 'react';
import React from 'react';
import {toByteArray} from 'base64-js';
import {encode} from '@msgpack/msgpack'; 
import { useBuild, useBuildUpdate } from '../../hooks/BuildContext';
import { successMessage, errorMessage } from '../../utils/notification_utils';
import { StatusError } from '../../utils/building_plane_utils';
import { CurrentBlockContext } from '../../context/currentBlockContext';
import { InventoryBlockContext } from '../../context/inventoryBlockContext';
import { isMobile } from 'react-device-detect';
import CloneableStructure from './deepslate/CloneableStructure';
import { GRASS_PLANE } from './deepslate/PlanePresets';
import DeepslatePlane from './deepslate/DeepslatePlane.tsx';

/**
 * Takes an array of objects and takes care of serializing their THREE objects
 * into JSON, which is readable and storable by the database. It converts this new array
 * to a buffer to be sent through the fetch request.
 * @param {CloneableStructure} structure - array of blocks with THREE objects.
 * @returns {Uint8Array<ArrayBufferLike>} - a buffer containing the newly serialized blocks. 
 */
export function serializeBlocks(structure: CloneableStructure): Uint8Array<ArrayBufferLike> {
  return encode(JSON.stringify(structure.toJson()));
}

/**
 * Crafters den main ui component with build plane and block selecction panel.
 * @returns {React.ReactNode} - A div element with the id 'main-ui' to render the den.
 */
export default function CraftersDen(): React.ReactNode {
  const build = useBuild();
  const canvas = useRef<HTMLCanvasElement>(null);
  const structure = useRef<CloneableStructure>(loadStructure(build?.build));

  const {id, email} = useAuth() ?? {};
  const [isViewMode, setIsViewMode] = useState(false);
  const [currentBlock, setCurrentBlock] = useState({name: 'stone'});
  const [inventoryBlocks, setInventoryBlocks] = useState<Array<object | null>>(Array(9).fill(null));

  const { setBuild } = useBuildUpdate();
  console.log(id, build?.user)
  console.log(build)
  const [isBuildOwner,] = useState<boolean>(build?.user === id || build?.build === null);

  // A null build signifies a new build

  let curBuildId = null;
  
  if(build && isBuildOwner) {
    curBuildId = build._id;
  }


  async function getFullBlockData(block: {_id: string}) {
    const response = await fetch(`/api/block/${block._id}`); 
    return await response.json();
  }
  /**
   * Fetches the complete block data from the api, and stores it in CurrentBlockContext.
   * @param {object} block - block object to fetch from the api
   * @param {{_id: string}} block._id - Blockid of the block
   */
  async function storeBlock(block: {_id: string}) {
    const completeBlockData = await getFullBlockData(block);
    setCurrentBlock(completeBlockData);
  }

  /**
   * Adds a block to InventoryBlockContext. Makes sure there are no more than 9 blocks currently stored..
   * @param {object} block - block object being added  to inventory
   * @param {string} block._id - BlockIf do of the block
   * @param {number} index - index of inventory to overwrite
   */
  async function addBlockToInventory(block: {_id: string}, index?: number) {
    const completeBlockData = await getFullBlockData(block);
    if (index) {
      setInventoryBlocks(currentInventory => {
        currentInventory[index] = completeBlockData;
        return [...currentInventory];
      })
      return;
    }
    setInventoryBlocks(currentInventory => {
      const nullIndex = currentInventory.findIndex(block => block === null);
      if (nullIndex !== -1) {
        currentInventory[nullIndex] = completeBlockData;
      } else {
        currentInventory.shift();
        currentInventory.push(completeBlockData);
      }
      return [...currentInventory]
    }) 
  };

  /**
   * Saves the current build in the db
   * @param {string} progressPicture URL
   */
  async function savePost(progressPicture: string) {
    // fetch dataURL to get the blob
    const arrayBufferBlocks = serializeBlocks(structure.current);
    const serializedBlocks = new Blob([arrayBufferBlocks], { type: 'application/octet-stream' });
    try {
      const base64Data = progressPicture.split(',')[1];
      const byteArray = toByteArray(base64Data);
      const blob = new Blob([byteArray], { type: 'image/png' });
      const data = new FormData();
      data.append('png', blob, 'blob.png');
      data.append('blocks', serializedBlocks, 'build.json');
      if (curBuildId) { data.append('buildId', curBuildId); }
      data.append('email', email!);
      const requestOptions = {
        method: 'POST',
        body: data
      };
      const response = await fetch('/api/post/save', requestOptions);
      const json = await response.json();
      
      if (!response.ok) {
        const err = new StatusError(`${json.message}`);
        err.status = json.status;
        throw err;
      }

      setBuild({...{'_id': json.id, buildJSON: structure.current.toJson(), user: id}})
      successMessage(json.message);
    } catch (e) {
      errorMessage(e.message);
    }
  }

  if (isMobile) {
    return (
      <div id="main-ui">
        <h1>You must be on a computer to use the den.</h1>
      </div>
    )
  }

  return (
    <CurrentBlockContext.Provider value={{currentBlock, storeBlock}}>
      <InventoryBlockContext.Provider value={{inventoryBlocks, addBlockToInventory}}>
        <div id="main-ui">
          <section className="build-tools">
              <DeepslatePlane 
              canvas={canvas} 
              structure={structure} 
              isViewMode={isViewMode}
              />
            {!isViewMode && <BlockSelection />}
          </section>
          <ButtonPanel 
          canvas={canvas}
          structure={structure.current}
          setIsViewMode={setIsViewMode} 
          savePost={savePost} 
          isViewMode={isViewMode}
          isUserLoggedIn={id !== null}
          isBuildOwner={isBuildOwner} />
        </div>
      </InventoryBlockContext.Provider>
    </CurrentBlockContext.Provider>
  );
}


/**
 * Loads initial structure
 * @param {object} build - Build from build context
 * @returns {CloneableStructure} initial structure to use
 */
function loadStructure(build) {
  const serializedBlocks = JSON.parse(localStorage.getItem("build") ?? "{}");
  
  if ( serializedBlocks.structure !== "{}" && serializedBlocks.structure) {
    const newStructure = CloneableStructure.fromJson(serializedBlocks.structure);
    localStorage.clear();
    return newStructure;
  } else if (build && build.buildJSON) {
    const newStructure = CloneableStructure.fromJson(build.buildJSON);
    return newStructure;
  } else {
    return GRASS_PLANE.clone();
  }
}
