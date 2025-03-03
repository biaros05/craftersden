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

    const uvAttr = new Float32Array([
      // UVs for each face in correct order
      5/16,  6/16,  11/16, 6/16,  11/16, 10/16,  5/16, 10/16,  // Down
      5/16,  6/16,  11/16, 6/16,  11/16, 10/16,  5/16, 10/16,  // Up
      5/16, 14/16,  11/16, 14/16,  11/16, 15/16,  5/16, 15/16,  // North
      5/16, 14/16,  11/16, 14/16,  11/16, 15/16,  5/16, 15/16,  // South
      5/16, 14/16,  11/16, 14/16,  11/16, 15/16,  5/16, 15/16,  // West
      5/16, 14/16,  11/16, 14/16,  11/16, 15/16,  5/16, 15/16,  // East
    ]);

    boxGeom.setAttribute('uv', new THREE.BufferAttribute(uvAttr, 2)); // Apply UVs

    
    boxGeom.translate(center.x, center.y, center.z); // Apply translation
    
    return boxGeom;
  });
  
  const geo = BufferGeometryUtils.mergeGeometries(geos);
  return geo;
}

export {Cuboid, createGeometry}
