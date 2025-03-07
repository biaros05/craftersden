import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import React from 'react';

class StatusError extends Error {
  status: number | undefined;
}

type Cuboid = {
  from: [number, number, number],
  to: [number, number, number],
  faces : object
};

type SelectedBlock = {
  name: string,
  parent: string,
  cuboids: Cuboid[],
  texture: string
};

/**
 * Creates an array of cuboids that get merged into a
 * single geometry.
 * @param {Cuboid[]} cuboids Array of objects that contain a to and from for each cuboid
 * @returns {THREE.BufferGeometry} Merged geometry built from cuboids
 */
function createGeometry(cuboids: Cuboid[]): THREE.BufferGeometry {
  const geos = cuboids.map(cuboid => {
    const to = new THREE.Vector3(...cuboid.to);
    const from = new THREE.Vector3(...cuboid.from);

    // Calculate size
    const size = new THREE.Vector3().subVectors(to, from);
  
    // Calculate center position
    const center = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);
  
    // Create first box and translate it
    const boxGeom = new THREE.BoxGeometry(size.x, size.y, size.z);

    for (let i = 0; i < 6; i++) {
      boxGeom.addGroup(i * 6, 6, i);
    }
    boxGeom.translate(center.x, center.y, center.z); // Apply translation

    const materials = getMaterials(cuboid);

    const mesh = new THREE.Mesh(boxGeom, materials);

    return mesh.geometry;
  });
  
  const geo = BufferGeometryUtils.mergeGeometries(geos);

  addMaterialGroups(geo, cuboids.length);

  return geo;
}

/**
 * Add the correctly indexed material groups to the geometry. They are missing
 * when creating a new BufferGeometry.
 * @param {THREE.BufferGeometry} geometry The geometry to add the groups to
 * @param {number} cuboidCount The number of cuboids in the geometry
 * @returns {void}
 */
function addMaterialGroups(geometry: THREE.BufferGeometry, cuboidCount: number): void {
  
  // TODO - this effectively makes each cuboid have the same material groups, which will probably not work
  // in long run


  // A cuboid always 6 faces, and a block concists of multiple cuboids
  const faceCount = 6;
  const indecieCountPerFace = 6;

  for (let i = 0, start = 0; i < cuboidCount; i++, start+=faceCount*faceCount) {
    for (let j = 0; j < faceCount; j++) {
      // each face consists of 2 triangles, so 6 indices
      geometry.addGroup(start + j*faceCount, indecieCountPerFace, j + i * faceCount);
    }
  }
}


  /**
   * Generates an array of THREE.Material objects for a given cuboid. 
   *
   * It iterates over the cuboid's faces and creates a new material for each using the texture associated
   * with the face.
   * @param {object} cuboid - The cuboid object containing face texture information.
   * @param {object} cuboid.faces - An object where keys are face directions and values are objects containing texture URLs.
   * @returns {THREE.Material[]} An array of THREE.Material objects corresponding to the cuboid's faces.
   */
  function getMaterials(cuboid: Cuboid) : THREE.Material[] {
    const textureCache : { [url: string]: THREE.Texture} = {};
    const loader = new THREE.TextureLoader();
    const faces = cuboid.faces;
    const materials = Object.keys(faces).map(direction => {
      const textureURL = faces[direction].texture;
      if  (!textureCache[textureURL]) {
        textureCache[textureURL] =  loader.load(textureURL);
      }
      return new THREE.MeshBasicMaterial({map: textureCache[textureURL]});
    });
    return materials;
  }

/**
 * Loads ground texture from string
 * and saves it with given state setter
 * @param {string} groundTexture the current texture url
 * @param {React.Dispatch<React.SetStateAction<THREE.Texture | undefined>>} setGrassTexture callback to set the ground texture
 */
async function loadGround(groundTexture: string, setGrassTexture: React.Dispatch<React.SetStateAction<THREE.Texture | undefined>>) {
  const grassTexture = new THREE.TextureLoader().load(groundTexture, function (texture) {
    texture.colorSpace = THREE.SRGBColorSpace;
  });

  grassTexture.wrapS = THREE.RepeatWrapping;
  grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(30, 30);
  grassTexture.magFilter = THREE.NearestFilter;
  grassTexture.minFilter = THREE.NearestFilter;

  setGrassTexture(grassTexture);
}

/**
 * Takes a texture url and creates a THREE texture with it.
 * @param {string} url to the texture image.
 * @returns {THREE.Texture} corresponding to given url.
 */
function getTexture(url: string): THREE.Texture {
  const texture = new THREE.TextureLoader().load(url);
  
  return texture;
}

type BlockType = {
  id: string,
  name: string,
  position: [number, number, number],
  worldPosition?: [number, number, number] | undefined,
  geometry: THREE.BufferGeometry,
  textures: THREE.Texture[],
  textureURLs: string[],
  rotation?: [number, number, number] | undefined,
  rotationIndex?: number | undefined
}

type SerializedBlockType = {
  id: string,
  name: string,
  position: [number, number, number],
  geometry: object,
  textures: object[],
  textureURLs: string[]
}

/**
 * Checks if a block exists at the given position.
 * @param {[number, number, number]} position to check if a block exists
 * @param {BlockType[]} blocks list of blocks to check
 * @returns {BlockType | undefined} Block if it exists
 */
function blockExists(position: [number, number, number], blocks: BlockType[]): BlockType | undefined {
  return blocks.find(b => b.position.every((val: number, i: number) => val === position[i]));
}

/**
 * Checks if the geometry for the parent of the selected block
 * has already been built.
 * @param {SelectedBlock} selectedBlock block selected by the user.
 * @param {object} geometries cached geometries
 * @param {Function} setGeometries callback to set the cached geometries.
 * @returns {THREE.BufferGeometry} geometry for the selected block.
 */
function getGeometry(selectedBlock: SelectedBlock, geometries: object, setGeometries: React.Dispatch<React.SetStateAction<object>>): THREE.BufferGeometry {
  let geometry = geometries[selectedBlock.name];

  if (!geometry) {
    geometry = createGeometry(selectedBlock.cuboids);

    geometries[selectedBlock.parent] = geometry;

    setGeometries({...geometries});
  }

  return geometry;
}
  /**
   * Takes a texture url and creates a THREE texture with it.
   * @param {SelectedBlock} currentBlock Currently selected block by user
   * @returns {{textures: THREE.Texture[], textureURLs: string[]}} An object containing the textures and their URLs.
   */
  function getTextures(currentBlock: SelectedBlock): { textures: THREE.Texture[], textureURLs: string[] } {
    const textureCache : { [url: string]: THREE.Texture} = {};
    const loader = new THREE.TextureLoader();
    const cuboids = currentBlock.cuboids;
    const textureList: THREE.Texture[] = [];
    const textureURLs: string[] = [];

    cuboids.forEach(cuboid => {
      const faces = cuboid.faces;
      Object.keys(faces).forEach(direction => {
        const textureURL = faces[direction].texture;
        if  (!textureCache[textureURL]) {
          textureCache[textureURL] =  loader.load(textureURL);
        }
        textureList.push(textureCache[textureURL]);
        textureURLs.push(textureURL);
      });
    });
    return { textures: textureList, textureURLs: textureURLs };
  }

/**
 * jsonifies the array of blocks for storage
 * @param {BlockType[]} blocks - array of blocks to jsonify
 * @returns {JSON} - new json of blocks
 */
function jsonifyBlocks(blocks: BlockType[]) {
  return blocks.map(block => {
    const geomJSON = block.geometry.toNonIndexed().toJSON();
    const b = {
      id: block.id,
      name: block.name,
      position: block.position,
      geometry: geomJSON,
      textureURLs: block.textureURLs,
    };
    return b;
  })
}

export {Cuboid, jsonifyBlocks, createGeometry, loadGround, 
  blockExists, getTexture, getGeometry, BlockType, SerializedBlockType, SelectedBlock, StatusError, getTextures};
