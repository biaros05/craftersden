import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';

class StatusError extends Error {
  status: number | undefined;
}

type Cuboid = {
  from: [number, number, number],
  to: [number, number, number]
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
 * @param {tos_froms[]} tos_froms Array of objects that contain a to and from for each cuboid
 * @returns {THREE.BufferGeometry} Merged geometry built from cuboids
 */
function createGeometry(tos_froms: Cuboid[]): THREE.BufferGeometry {
  const geos = tos_froms.map(tf => {
    const to = new THREE.Vector3(...tf.to);
    const from = new THREE.Vector3(...tf.from);

    // Calculate size
    const size = new THREE.Vector3().subVectors(to, from);
  
    // Calculate center position
    const center = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);
  
    // Create first box and translate it
    const boxGeom = new THREE.BoxGeometry(size.x, size.y, size.z);
    boxGeom.translate(center.x, center.y, center.z); // Apply translation

    return boxGeom;
  });
  
  const geo = BufferGeometryUtils.mergeGeometries(geos);
  return geo;
}

/**
 * Loads ground texture from string
 * and saves it with given state setter
 * @param {string} groundTexture path or url to ground texture
 * @param {Function} setGrassTexture callback to set groundTexture state
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
  position: [number, number, number],
  geometry: THREE.BufferGeometry,
  texture: THREE.Texture,
  textureURL: string,
  rotation?: [number, number, number] | undefined
}

type SerializedBlockType = {
  id: string,
  position: [number, number, number],
  geometry: object,
  texture: object,
  textureURL: string
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
  let geometry = geometries[selectedBlock.parent];

  if (!geometry) {
    geometry = createGeometry(selectedBlock.cuboids);

    geometries[selectedBlock.parent] = geometry;

    setGeometries({...geometries});
  }

  return geometry;
}

export {Cuboid, createGeometry, loadGround, blockExists, getTexture, getGeometry, BlockType, SerializedBlockType, SelectedBlock, StatusError};