import * as THREE from 'three';
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";

type Cuboid = {
  from: [number, number, number],
  to: [number, number, number]
}

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
 * Function to create a mesh from an array of cuboids.
 * @param {object[]} tos_froms - Array of objects that contain a to and from for each cuboid
 * @param {THREE.MeshStandardMaterial} material - Material to apply to the mesh
 * @returns {THREE.Mesh} Mesh.
 */
function createMesh(tos_froms, material) {
  const geometry = createGeometry(tos_froms);
  
  if (!material){
    material = new THREE.MeshStandardMaterial({ color: 0x8B5A2B, wireframe: false });
  }

  const mesh = new THREE.Mesh(geometry, material);
  
  return mesh;
}


export { createMesh };

export {Cuboid, createGeometry}
