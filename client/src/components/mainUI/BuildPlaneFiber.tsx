import { Canvas } from '@react-three/fiber';
import grassTop from '../../assets/grass_top.png';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
import React, { JSX, useState } from 'react';
import { createMesh, Cuboid } from './Block';

const planeRotation = -0.5 * Math.PI;

const tosFroms: Cuboid[] = [
  {
    from: [0, 0, 0],
    to: [1, 0.5, 1],
  },
  {
    from: [0.5, 0.5, 0],
    to: [1, 1, 1],
  }
];  


export default function BuildPlaneFiber() {
  const [blocks, setBlocks] = useState<JSX.Element[]>([]);

  const grassTexture = new THREE.TextureLoader().load(grassTop, function (texture) {
      texture.colorSpace = THREE.SRGBColorSpace;
  });

  grassTexture.wrapS = THREE.RepeatWrapping;
  grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(30, 30);
  grassTexture.magFilter = THREE.NearestFilter;
  grassTexture.minFilter = THREE.NearestFilter;

  function addBlock(e) {
    if (e.button === 2) {
      // If the user clicks on the plane use the coordinates of the click, if they click on a block use block pos
      const normalizedCoords = e.intersections[0].object.name === 'ground' ? 
        e.point.floor() : 
        new THREE.Vector3().copy(e.intersections[0].object.position).add(e.normal);

      if (normalizedCoords.y < 0) {
        normalizedCoords.y = 0;
      }

      setBlocks(b => [...b, createMesh(tosFroms, [normalizedCoords.x, normalizedCoords.y, normalizedCoords.z], addBlock)])
    } else if (e.button === 0) {
      // const normalizedCoords = e.point.floor();
      // if (normalizedCoords.y < 0) {
      //   normalizedCoords.y = 0;
      // }
      // setBlocks(b => {
      //   const toRemove = b.findIndex(block => {
      //     block.props.position.x === normalizedCoords.x &&
      //     block.props.position.y === normalizedCoords.y &&
      //     block.props.position.z === normalizedCoords.z
      //   });

      //   if (toRemove === -1) {
      //     return b;
      //   }

      //   b.splice(toRemove, 1);

      //   return [...b];
      // });
    }
    e.stopPropagation();
  }
  // On click add block to setBlocks

  return <Canvas camera-rotation={[planeRotation, 0, 0]} >
    <mesh rotation={[planeRotation, 0, 0]} onPointerDown={addBlock} name='ground' >
      <planeGeometry args={[30, 30]} />
      <meshBasicMaterial args={[{
            map: grassTexture,
            color: 0x6f946f,
            side: THREE.DoubleSide,
          }]} />
    </mesh>
    {blocks}
    <OrbitControls />
  </Canvas>;
}