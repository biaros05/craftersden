import { Canvas, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, Stats } from '@react-three/drei';
import React, { useEffect, useState } from 'react';
import { Block } from './Block';
import { Cuboid, createGeometry } from '../../utils/building_plane_utils';
import { nanoid } from 'nanoid';
import grassTop from '../../assets/grass_top.png';
import oakPlanks from '../../assets/oak_planks.png';
import { BlockType } from './CraftersDen';

const planeRotation = -0.5 * Math.PI;

const tosFroms: Cuboid[] = [
  // {
  //   from: [0, 0, 0],
  //   to: [1, 0.5, 1],
  // },
  // {
  //   from: [0.5, 0.5, 0],
  //   to: [1, 1, 1],
  // }
  {
    from: [0,0,0],
    to: [1,1,1]
  }
];  

export default function BuildPlane({canvasRef, blocks, setBlocks}) {
  const [geometries, setGeometries] = useState<object>({});
  const [highlighted, setHighlighted] = useState<THREE.Vector3 | null>(null);
  const [grassTexture, setGrassTexture] = useState<THREE.Texture>();
  // sample data
  const selectedBlock = {
    parent: 'block',
    cuboids: tosFroms,
    texture: oakPlanks
  };

  useEffect(() => {
    async function loadGrass() {
      const grassTexture = new THREE.TextureLoader().load(grassTop, function (texture) {
        texture.colorSpace = THREE.SRGBColorSpace;
      });
    
      grassTexture.wrapS = THREE.RepeatWrapping;
      grassTexture.wrapT = THREE.RepeatWrapping;
      grassTexture.repeat.set(30, 30);
      grassTexture.magFilter = THREE.NearestFilter;
      grassTexture.minFilter = THREE.NearestFilter;
  
      setGrassTexture(grassTexture);
    }

    loadGrass();
  }, [setGrassTexture]);  

  /**
   * EventHandler for onPointerDown event that places a block
   * relative to the block clicked on.
   * @param {ThreeEvent<PointerEvent>} e Event object for pointerDown.
   * @param {string} id of the block.
   * @param {[number,number,number]} position of the block clicked on.
   */
  function addBlock(e: ThreeEvent<PointerEvent>, id: string, position: [number,number,number]) {
    if (e.button === 2) {
      const normalizedCoords = new THREE.Vector3(...position).add(e.normal!);

      const geometry = getGeometry();
      const newPosition: [number, number, number] = [normalizedCoords.x, normalizedCoords.y, normalizedCoords.z];

      if (blockExists(newPosition)) return;

      const newBlock: BlockType = {
        id: nanoid(),
        position: newPosition,
        geometry: geometry,
        texture: getTexture(oakPlanks)
      };

      setBlocks(b => [...b, newBlock]);
    } else if (e.button === 0) {
      const remainingBlocks = blocks.filter(b => b.id !== id);

      setBlocks([...remainingBlocks]);
    }
    e.stopPropagation();
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

  /**
   * Checks if the geometry for the parent of the selected block
   * has already been built.
   * @returns {THREE.BufferGeometry} geometry for the selected block.
   */
  function getGeometry(): THREE.BufferGeometry {
    let geometry = geometries[selectedBlock.parent];

    if (!geometry) {
      geometry = createGeometry(selectedBlock.cuboids);

      geometries[selectedBlock.parent] = geometry;

      setGeometries({...geometries})
    }

    return geometry;
  }

  /**
   * Event handler to be used with onPointDown. Places a block 
   * where the mouse was clicked.
   * @param {ThreeEvent<PointerEvent>} e Event object of pointerDown
   */
  function addBlockOnPlane(e: ThreeEvent<PointerEvent>) {
    if (e.button === 2) {
      const normalizedCoords = e.point.floor();
  
      const geometry: THREE.BufferGeometry = getGeometry();
      const position: [number, number, number] =  [normalizedCoords.x, 0, normalizedCoords.z];

      if (blockExists(position)) return;

      const newBlock: BlockType = {
        id: nanoid(),
        position: position,
        geometry: geometry,
        texture: getTexture(oakPlanks)
      };

      setBlocks([...blocks, newBlock])
    }
  }

  /**
   * Checks if a block exists at the given position.
   * @param {[number, number, number]} position to check if a block exists
   * @returns {BlockType | undefined}
   */
  function blockExists(position: [number, number, number]): BlockType | undefined {
    return blocks.find(b => b.position.every((val, i) => val === position[i]));
  }

  return <Canvas 
      gl={{ preserveDrawingBuffer: true }}  
      camera={{position: [15,15,15]}} 
      id='build-plane' 
      ref={canvasRef}
      >
    {/* Plane */}
    <mesh rotation={[planeRotation, 0, 0]} onPointerDown={addBlockOnPlane} onPointerMove={(e: ThreeEvent<PointerEvent>) => {
        const planePosition = e.point.floor().addScalar(0.5);
        planePosition.setY(-0.5);
        setHighlighted(planePosition)
       }} name='ground' >
      <planeGeometry args={[30, 30]} />
      <meshBasicMaterial args={[{
            map: grassTexture,
            color: 0x6f946f,
            side: THREE.DoubleSide,
          }]} />
    </mesh>
    {/* Grid */}
    <gridHelper args={[30, 30]} />

    {/* Highlight */}
    {
    highlighted && 
      <mesh position={highlighted} >
        <meshBasicMaterial color={"#BFBFBF"} opacity={0.2} transparent />
        <boxGeometry args={[1.1, highlighted[1] === 0 ? 0.1 : 1.1, 1.1]} />
      </mesh>
    }
    {/* Blocks */}
    {blocks.map(b => <Block position={b.position}
                            geometry={b.geometry} 
                            onPointerDown={(e: ThreeEvent<PointerEvent>) => {
                              e.stopPropagation();
                              addBlock(e, b.id, b.position);
                            }}
                            onPointerMove={(e: ThreeEvent<PointerEvent>) => {
                              e.stopPropagation();
                              setHighlighted(new THREE.Vector3(...b.position).addScalar(0.5));
                            }}
                            >
                              <meshBasicMaterial args={[{map: b.texture}]} />
                            </Block>
                          )}
    <OrbitControls />
    {!import.meta.env.PROD && <Stats />}
  </Canvas>;
}