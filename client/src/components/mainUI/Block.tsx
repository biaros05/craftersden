import { ThreeElements } from '@react-three/fiber';
import React, { JSX, useState } from 'react';
import * as THREE from 'three';
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";

type Cuboid = {
  from: [number, number, number],
  to: [number, number, number]
}

type Coordinates = {
  x: number,
  y: number,
  z: number
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
 * @param {Cuboid[]} tos_froms - Array of objects that contain a to and from for each cuboid
 * @param {THREE.MeshStandardMaterial} material - Material to apply to the mesh as jsx
 * @returns {JSX.Element} mesh with a material and geometry for the given tos_froms.
 */
function createMesh(tos_froms: Cuboid[], position: number[], addBlock: any, material: JSX.Element | undefined = undefined): JSX.Element {
  const geometry = createGeometry(tos_froms);
  
  if (!material) {
    material = <meshBasicMaterial color={'#FAFAFA'} />
  }
  
  return <Block position={position} geometry={geometry} onPointerDown={addBlock} >
    {material}
  </Block>;
}


function Block(props: ThreeElements['mesh']) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <mesh {...props}
      onClick={(e) => {console.log('check button and remove block')}}
      onPointerOver={() => setIsHovering(true)}
      onPointerOut={() => setIsHovering(false)}>

    </mesh>
  )
}

export { createMesh, Cuboid };
