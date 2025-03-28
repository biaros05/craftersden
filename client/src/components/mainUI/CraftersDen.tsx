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
  console.log(build)
  const canvas = useRef<HTMLCanvasElement>(null);
  const structure = useRef<CloneableStructure>(loadStructure(build?.build));

  const {email} = useAuth() ?? {};
  const [isViewMode, setIsViewMode] = useState(false);
  // const [blocks, setBlocks] = useState<BlockType[]>([]);
  const [currentBlock, setCurrentBlock] = useState(null);

  const { setBuild } = useBuildUpdate();

  let curBuildId = null;

  if(build?.build){
    curBuildId = build.build._id;
    console.log(curBuildId)
  }

  /**
   * Fetches the complete block data from the api, and stores it in CurrentBlockContext.
   * @param {object} block - block object to fetch from the api
   * @param {{_id: string}} block._id - Blockid of the block
   */
  async function storeBlock(block: {_id: string}) {
    const response = await fetch(`/api/block/${block._id}`);
    const completeBlockData = await response.json();
    setCurrentBlock(completeBlockData);
  }

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

      setBuild({...{'_id': json.id, buildJSON: structure.current.toJson()}})
      successMessage(json.message);
    } catch (e) {
      errorMessage(e.message);
    }
  }

  return (
    <CurrentBlockContext.Provider value={{currentBlock, storeBlock}}>
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
        email={email}/>
      </div>
    </CurrentBlockContext.Provider>
  );
}


function loadStructure(build) {
  const serializedBlocks = JSON.parse(localStorage.getItem("build") ?? "{}");
  
  if ( serializedBlocks.structure !== "{}" && serializedBlocks.structure) {
    const newStructure = CloneableStructure.fromJson(serializedBlocks.structure);
    localStorage.clear();
    console.log('local')
    return newStructure;
  } else if (build && build.buildJSON) {
    console.log('build')
    const newStructure = CloneableStructure.fromJson(build.buildJSON);
    return newStructure;
  } else {
    return GRASS_PLANE.clone();
  }
}
