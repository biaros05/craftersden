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
import {scene} from './scene';
import { successMessage, errorMessage } from '../../utils/notification_utils';
import { BlockType, SerializedBlockType } from '../../utils/building_plane_utils';



// TODO verify if we still need this
// const blockList = [
//   { name: 'grass', src: 'https://www.filterforge.com/filters/11635.jpg', type: 'overworld' },
//   { name: 'dirt', src: 'https://www.filterforge.com/filters/11636.jpg', type: 'overworld' },
//   { name: 'stone', src: 'https://www.filterforge.com/filters/11637.jpg', type: 'overworld' },
//   { name: 'sand', src: 'https://www.filterforge.com/filters/11638.jpg', type: 'overworld' },
//   { name: 'water', src: 'https://www.filterforge.com/filters/11639.jpg', type: 'overworld' },
//   { name: 'lava', src: 'https://www.filterforge.com/filters/11640.jpg' },
//   { name: 'wood', src: 'https://www.filterforge.com/filters/11641.jpg' },
//   { name: 'leaves', src: 'https://www.filterforge.com/filters/11642.jpg' },
//   { name: 'glass', src: 'https://www.filterforge.com/filters/11643.jpg' },
//   { name: 'brick', src: 'https://www.filterforge.com/filters/11644.jpg' }
// ];

/**
 * Takes an array of objects and takes care of serializing their THREE objects
 * into JSON, which is readable and storable by the database. It converts this new array
 * to a buffer to be sent through the fetch request.
 * @param {BlockType[]} blocks - array of blocks with THREE objects.
 * @returns {SerializedBlockType[]} - a buffer containing the newly serialized blocks. 
 */
function serializeBlocks(blocks: BlockType[]): SerializedBlockType[] {
  return encode(blocks.map(block => {
    const geomJSON = block.geometry.toNonIndexed().toJSON();
    const textureJSON = block.texture.toJSON();
    return {
      id: block.id,
      position: block.position,
      geometry: geomJSON,
      texture: textureJSON,
      textureURL: block.textureURL
    };
  }));
}

/**
 * Takes an array of blocks which has JSON objects for Geometry and Textures and converts
 * them back to proper THREE objects so they are usable by the BuildPlane
 * @param {SerializedBlockType[]} blocks - array of blocks fetched from the database
 * @returns {BlockType[]} - Array of blocks which contain THREE objects
 */
function deserializeBlocks(blocks: SerializedBlockType[]): BlockType[] {
  return blocks.map(block => {
    console.log(block.texture);
    block.texture.image = block.textureURL
    return {
      id: block.id,
      position: block.position,
      geometry: new THREE.BufferGeometryLoader().parse(block.geometry),
      texture: new THREE.TextureLoader().load(block.textureURL),
      textureURL: block.textureURL
    };
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
  const [error, setError] = useState({});
  const [blocks, setBlocks] = useState<BlockType[]>([]);

  useEffect(() => {
    setBlocks(deserializeBlocks(scene));
  }, []);

  // PLEASE CHANGE!!!!!!
  const curBuildId = null;

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
      data.append('buildId', curBuildId);
      data.append('email', email);
      const requestOptions = {
        method: 'POST',
        // TODO: change id to be not null if the build exists!!!
        body: data
        // use ID to find pre-existing build if it exists, if not leave it null.
      };
      const response = await fetch('/api/post/save', requestOptions);
      const json = await response.json();
      
      if (!response.ok) {
        const err = new Error(`${json.message}`);
        error.status = json.status;
        throw err;
      }

      successMessage(json.message);
    } catch (e) {
      console.error(e);
      errorMessage(e.message);
    }
  }

  return (
    <>
      <div id="main-ui">
        <section className="build-tools">
          <BuildPlane canvasRef={canvas} blocks={blocks} setBlocks={setBlocks}/>
          {!isViewMode && <BlockSelection />}
        </section>
        <ButtonPanel 
          setIsViewMode={setIsViewMode} 
          canvas={canvas} 
          savePost={savePost} 
          isViewMode={isViewMode}
        />
      </div>
    </>
  );
}