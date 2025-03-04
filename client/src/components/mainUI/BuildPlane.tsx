/* eslint-disable jsdoc/no-undefined-types */
import { Canvas, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, Stats } from '@react-three/drei';
import React, { useEffect, useState } from 'react';
import { Block } from './Block';
import { Cuboid, blockExists, getTexture, BlockType, getGeometry, SelectedBlock } from '../../utils/building_plane_utils';
import { loadGround } from '../../utils/building_plane_utils';
import grassTop from '../../assets/grass_top.png';
import oakPlanks from '../../assets/oak_planks.png';
import { nanoid } from 'nanoid';

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
  // {
  //   from: [0,0,0],
  //   to: [1,1,1]
  // }
];  

type BuildPlaneProps = {
  canvasRef: React.RefObject<null>,
  blocks: BlockType[],
  setBlocks: React.Dispatch<React.SetStateAction<BlockType[]>>
}

/**
 * Interactive build plane allowing users to 
 * place blocks and break them.
 * @param {object} props - React props
 * @param {React.RefObject<null>} props.canvasRef useRef value for the Canvas
 * @param {BlockType[]} props.blocks blocks to render on plane
 * @param {React.Dispatch<React.SetStateAction<BlockType[]>>} props.setBlocks callback to update the blocks array state
 * @returns {React.ReactNode} Build plane
 */
export default function BuildPlane({canvasRef, blocks, setBlocks}: BuildPlaneProps): React.ReactNode {
  const [geometries, setGeometries] = useState<object>({});
  const [highlighted, setHighlighted] = useState<THREE.Vector3 | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [grassTexture, setGrassTexture] = useState<THREE.Texture>();
  // sample data
  const selectedBlock: SelectedBlock = {
    name: 'oak_planks',
    parent: 'block',
    cuboids: tosFroms,
    texture: oakPlanks
  };

  useEffect(() => {loadGround(grassTop, setGrassTexture)}, [setGrassTexture]);  

  /**
   * Event handler to be used with onPointDown. Places a block 
   * where the mouse was clicked.
   * @param {ThreeEvent<PointerEvent>} e Event object of pointerDown
   */
  function addBlockOnPlane(e: ThreeEvent<PointerEvent>) {
    if (e.button === 2) {
    const normalizedCoords = e.point.floor();

    const geometry: THREE.BufferGeometry = getGeometry(selectedBlock, geometries, setGeometries);
    const position: [number, number, number] =  [normalizedCoords.x, 0, normalizedCoords.z];

    if (blockExists(position, blocks)) return;

    const newBlock: BlockType = {
      id: nanoid(),
      position: position,
      geometry: geometry,
      texture: getTexture(selectedBlock.texture),
      textureURL: selectedBlock.texture
    };

    setBlocks([...blocks, newBlock]);
    }
  }
  
  /**
   * EventHandler for onPointerDown event that places a block
   * relative to the block clicked on.
   * @param {ThreeEvent<PointerEvent>} e Event object for pointerDown.
   * @param {string} id of the block.
   * @param {[number,number,number]} position of the block clicked on.
   */
  function addBlock(e: ThreeEvent<PointerEvent>, id: string, position: [number, number, number]) {
    if (e.button === 2) {
      const normalizedCoords = new THREE.Vector3(...position).add(e.normal!);
  
      const geometry = getGeometry(selectedBlock, geometries, setGeometries);
      const newPosition: [number, number, number] = [normalizedCoords.x, normalizedCoords.y, normalizedCoords.z];
  
      if (blockExists(newPosition, blocks)) return;
  
      const newBlock: BlockType = {
        id: nanoid(),
        position: newPosition,
        geometry: geometry,
        texture: getTexture(oakPlanks),
        textureURL: oakPlanks
      };
  
      setBlocks(b => [...b, newBlock]);
    } else if (e.button === 0) {
      const remainingBlocks = blocks.filter(b => b.id !== id);
  
      setBlocks([...remainingBlocks]);
    }
    e.stopPropagation();
  }

  function rotateBlock(e): void {
    if (e.key === 'r') {
      const b = blocks.find(b => b.id === hoveredId);
      if (!b) return;
      if (!b.rotation) {
        b.rotationIndex = 1;
      }
      
      const ra = Math.PI / 2;
      const transformations: {rotation: [number,number,number], translate?: [number,number,number]}[] = [
        {rotation: [0, 0, 0], translate: undefined},
        {rotation: [0, ra, 0], translate: [0, 0, 1]},
        {rotation: [0, 2 * ra, 0], translate: [1, 0, 1]},
        {rotation: [0, 3 * ra, 0], translate: [1, 0, 0]},
        {rotation: [2 * ra, 0, 0], translate: [0, 1, 1]},
        {rotation: [2 * ra, ra, 0], translate: [0, 1, 0]},
        {rotation: [2 * ra, 2 * ra, 0], translate: [1, 1, 0]},
        {rotation: [2 * ra, 3 * ra, 0], translate: [1, 1, 1]},
      ];
      
      b.rotation = transformations[b.rotationIndex!].rotation;
      b.translate = transformations[b.rotationIndex!].translate;
      b.rotationIndex! = (b.rotationIndex! + 1) % transformations.length;
      setBlocks([...blocks]);
    }
  }

  return <Canvas 
      gl={{ preserveDrawingBuffer: true }}  
      camera={{position: [15,15,15]}} 
      id='build-plane' 
      ref={canvasRef}
      onKeyDown={rotateBlock}
      tabIndex={0}
      >
    {/* Plane */}
    <mesh rotation={[planeRotation, 0, 0]} onPointerDown={addBlockOnPlane} onPointerMove={(e: ThreeEvent<PointerEvent>) => {
      const planePosition = e.point.floor().addScalar(0.5);
      planePosition.setY(-0.5);
      setHighlighted(planePosition);
    }} name="ground" >
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
        <meshBasicMaterial color={'#BFBFBF'} opacity={0.2} transparent />
        <boxGeometry args={[1.1, highlighted[1] === 0 ? 0.1 : 1.1, 1.1]} />
      </mesh>
    }

    {/* Blocks */}
    {blocks.map(b => <Block position={b.translate ? b.position.map((pos, i) => pos + b.translate![i]) as [number,number,number] : b.position}
                            geometry={b.geometry} 
                            rotation={b.rotation}
                            onPointerDown={(e: ThreeEvent<PointerEvent>) => {
                              e.stopPropagation();
                              addBlock(e, b.id, b.position);
                            }}
                            onPointerMove={(e: ThreeEvent<PointerEvent>) => {
                              e.stopPropagation();
                              setHighlighted(new THREE.Vector3(...b.position).addScalar(0.5));
                              setHoveredId(b.id);
                            }}
                            onPointerEnter={(e: ThreeEvent<PointerEvent>) => {
                              e.stopPropagation();
                              setHighlighted(new THREE.Vector3(...b.position).addScalar(0.5));
                              setHoveredId(b.id);
                            }}
                            key={b.id}
                            >
                              <meshBasicMaterial args={[{map: b.texture}]} />
                            </Block>
                          )}
    <OrbitControls />
    {!import.meta.env.PROD && <Stats />}
  </Canvas>;
}