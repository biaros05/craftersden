import * as THREE from 'three';
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";

type Cuboid = {
  from: [number, number, number],
  to: [number, number, number]
}

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

  // addMaterialGroups(geo, cuboids.length);

  console.log('geo after merege groups ', geo.groups);

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
    for (let i = 0; i < faceCount; i++) {
      // each face consists of 2 triangles, so 6 indices
      geometry.addGroup(i * indecieCountPerFace + start, indecieCountPerFace, i);
    }
  }
}


  function getMaterials(cuboid): THREE.Material[] {
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


export {Cuboid, createGeometry}
