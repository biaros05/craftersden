import * as THREE from 'three';
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";

/**
 * Creates an array of cuboids that get merged into a
 * single geometry.
 * 
 * @param {Object[]} tos_froms Array of objects that contain a to and from for each cuboid
 * @returns Merged geometry built from cuboids
 */
function createGeometry(tos_froms) {
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


function createMesh(tos_froms, material) {
  const geometry = createGeometry(tos_froms);
  
  if (!material){
    material = new THREE.MeshStandardMaterial({ color: 0x8B5A2B, wireframe: false });
  }

  const mesh = new THREE.Mesh(geometry, material);
  
  return mesh;
}


export { createMesh };

