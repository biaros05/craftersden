import BuildPlane from './BuildPlane';
import BlockSelection from './BlockSelection';
import ButtonPanel from './ButtonPanel';
import { useAuth } from '../../hooks/useAuth';
import './CraftersDen.css';
import { useEffect, useState, useRef } from 'react';
import React from 'react';
import {toByteArray} from 'base64-js';
import * as THREE from 'three';
import {encode} from '@msgpack/msgpack'; 
import { CurrentBlockContext } from '../../context/currentBlockContext';
import { useBuild } from '../../hooks/BuildContext';
import { successMessage, errorMessage } from '../../utils/notification_utils';
import { BlockType, SerializedBlockType, StatusError } from '../../utils/building_plane_utils';
import {jsonifyBlocks} from '../../utils/building_plane_utils.ts';

/**
 * Takes an array of objects and takes care of serializing their THREE objects
 * into JSON, which is readable and storable by the database. It converts this new array
 * to a buffer to be sent through the fetch request.
 * @param {BlockType[]} blocks - array of blocks with THREE objects.
 * @returns {SerializedBlockType[]} - a buffer containing the newly serialized blocks. 
 */
export function serializeBlocks(blocks: BlockType[]): Uint8Array<ArrayBufferLike> {
  return encode(jsonifyBlocks(blocks));
}

/**
 * Takes an array of blocks which has JSON objects for Geometry and Textures and converts
 * them back to proper THREE objects so they are usable by the BuildPlane
 * @param {SerializedBlockType[]} blocks - array of blocks fetched from the database
 * @returns {BlockType[]} - Array of blocks which contain THREE objects
 */
function deserializeBlocks(blocks: SerializedBlockType[]): BlockType[] {
  const textureLoader = new THREE.TextureLoader();
  const geoLoader = new THREE.BufferGeometryLoader();
  console.log('blocks in deserializeBlocks', blocks);
  return blocks.map(block => {
    return {
      id: block.id,
      name: block.name,
      position: block.position,
      geometry: geoLoader.parse(block.geometry),
      textureURLs: block.textureURLs,
      textures: (block.textureURLs || []).map(url => textureLoader.load(url)),
    }
  });
}

/**
 * Crafters den main ui component with build plane and block selecction panel.
 * @returns {React.ReactNode} - A div element with the id 'main-ui' to render the den.
 */
export default function CraftersDen(): React.ReactNode {
  const canvas = useRef(null);
  const {email} = useAuth() ?? {};
  const [isViewMode, setIsViewMode] = useState(false);
  const [blocks, setBlocks] = useState<BlockType[]>([]);
  const [currentBlock, setCurrentBlock] = useState(null);

  const build = useBuild();

  useEffect(() => {
    const serializedBlocks = JSON.parse(localStorage.getItem("build") ?? "{}");

    if (Object.keys(serializedBlocks).length && Object.keys(serializedBlocks.blocks).length) {
      setBlocks(deserializeBlocks(serializedBlocks.blocks))
      localStorage.clear();
    }
    else if (build.build !== undefined && build.build !== null) {
      setBlocks(deserializeBlocks(build.build.buildJSON));
    }
    else{
      setBlocks(deserializeBlocks([]));
    }
  }, []);

  let curBuildId = null;

  if (build.build !== undefined && build.build !== null) {
    curBuildId = build.build._id;
  }

    /**
     * Fetches the complete block data from the api, and stores it in CurrentBlockContext.
     * @param {object} block - block object to fetch from the api
     */
    async function storeBlock(block) {
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
    const arrayBufferBlocks = serializeBlocks(blocks);
    const serializedBlocks = new Blob([arrayBufferBlocks], { type: 'application/octet-stream' });
    try {
      console.log(progressPicture);
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
        // TODO: change id to be not null if the build exists!!!
        body: data
        // use ID to find pre-existing build if it exists, if not leave it null.
      };
      const response = await fetch('/api/post/save', requestOptions);
      const json = await response.json();
      
      if (!response.ok) {
        const err = new StatusError(`${json.message}`);
        err.status = json.status;
        throw err;
      }

      successMessage(json.message);
    } catch (e) {
      errorMessage(e.message);
    }
  }

  return (
    <CurrentBlockContext.Provider value={{currentBlock, storeBlock}}>
      <div id="main-ui">
        <section className="build-tools">
          <BuildPlane 
            canvasRef={canvas} 
            blocks={blocks} 
            setBlocks={setBlocks} 
            isViewMode={isViewMode} 
            setIsViewMode={setIsViewMode}
            style={{width: "80%"}}
            />
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