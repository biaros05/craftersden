/* eslint-disable jsdoc/no-undefined-types */
import { Canvas, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, Stats } from '@react-three/drei';
import React, { useEffect, useState, useContext } from 'react';
import { CurrentBlockContext } from '../../context/currentBlockContext';
import { Block } from './Block';
import { blockExists, BlockType, getGeometry, getTextures } from '../../utils/building_plane_utils';
import { loadGround } from '../../utils/building_plane_utils';
import grassTop from '../../assets/grass_top.png';
import { nanoid } from 'nanoid';

const planeRotation = -0.5 * Math.PI;

type BuildPlaneProps = {
  canvasRef: React.RefObject<null>,
  blocks: BlockType[],
  setBlocks: React.Dispatch<React.SetStateAction<BlockType[]>>
  style?: object
  isViewMode: boolean,
  setIsViewMode: React.Dispatch<React.SetStateAction<boolean>>
}

/**
 * Interactive build plane allowing users to 
 * place blocks and break them.
 * @param {object} props - React props
 * @param {React.RefObject<null>} props.canvasRef useRef value for the Canvas
 * @param {BlockType[]} props.blocks blocks to render on plane
 * @param {React.Dispatch<React.SetStateAction<BlockType[]>>} props.setBlocks callback to update the blocks array state
 * @param {object} props.style optional style prop applied to the canvas
 * @param {boolean} props.isViewMode - boolean that indicates if user toggled to view mode.
 * @returns {React.ReactNode} Build plane
 */
export default function BuildPlane({canvasRef, blocks, setBlocks, isViewMode, style = {} }: BuildPlaneProps): React.ReactNode {
  const [geometries, setGeometries] = useState<object>({});
  const [highlighted, setHighlighted] = useState<THREE.Vector3 | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [grassTexture, setGrassTexture] = useState<THREE.Texture>();
  const {currentBlock} = useContext(CurrentBlockContext);

  useEffect(() => {loadGround(grassTop, setGrassTexture)}, [setGrassTexture]);  

  /**
   * Event handler to be used with onPointDown. Places a block 
   * where the mouse was clicked.
   * @param {ThreeEvent<PointerEvent>} e Event object of pointerDown
   */
  function addBlockOnPlane(e: ThreeEvent<PointerEvent>) {
    if (e.button === 2) {
    const normalizedCoords = e.point.floor();

    const geometry: THREE.BufferGeometry = getGeometry(currentBlock, geometries, setGeometries);
    const position: [number, number, number] =  [normalizedCoords.x, 0, normalizedCoords.z];

    if (blockExists(position, blocks)) return;

    const { textures, textureURLs } = getTextures(currentBlock);

    const newBlock: BlockType = {
      id: nanoid(),
      name: currentBlock.name,
      position: position,
      geometry: geometry,
      textures: textures,
      textureURLs: textureURLs
    };

    setBlocks([...blocks, newBlock]);
    }
  }
  
  /**
   * Adds a block on top of the block being hovered with right click and removes it with left click.
   * @param {ThreeEvent<PointerEvent>} e Event object of pointerDown
   * @param {string} id id of the block being hovered
   * @param {[number, number, number]} position position of the block being hovered
   * @returns {void}
   */
  function addBlock(e: ThreeEvent<PointerEvent>, id: string, position: [number, number, number]) {
    if (isViewMode) return;
    if (e.button === 2) {
      const normalizedCoords = new THREE.Vector3(...position).add(e.normal!);
  
      const geometry = getGeometry(currentBlock, geometries, setGeometries);
      const newPosition: [number, number, number] = [normalizedCoords.x, normalizedCoords.y, normalizedCoords.z];
      const {textures, textureURLs} = getTextures(currentBlock);
  
      if (blockExists(newPosition, blocks)) return;
  
      const newBlock: BlockType = {
        id: nanoid(),
        position: newPosition,
        geometry: geometry,
        textures: textures,
        textureURLs: textureURLs,
        name: currentBlock.name
      };
  
      setBlocks(b => [...b, newBlock]);
    } else if (e.button === 0) {
      const remainingBlocks = blocks.filter(b => b.id !== id);
  
      setBlocks([...remainingBlocks]);
    }
    e.stopPropagation();
  }
  /**
   * Rotates block being hovered and computes the
   * world position to offset the rotation
   * @param {KeyboardEvent} e event object
   * @returns {void}
   */
  function rotateBlock(e: React.KeyboardEvent<HTMLDivElement>): void {
    if (e.key.toLowerCase() === 'r') {
      const b = blocks.find(b => b.id === hoveredId);
      if (!b) return;
      if (!b.rotation) {
        b.rotationIndex = 0;
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

      if (e.shiftKey) {
        b.rotationIndex!--;
        if (b.rotationIndex! < 0) {
          b.rotationIndex = transformations.length - 1;
        }
      } else {
        b.rotationIndex! = (b.rotationIndex! + 1) % transformations.length;
      }

      b.rotation = transformations[b.rotationIndex!].rotation;
      b.worldPosition = transformations[b.rotationIndex!].translate ? b.position.map((pos, i) => pos + transformations[b.rotationIndex!].translate![i]) as [number,number,number] : undefined;
      setBlocks([...blocks]);
    }
  }

  return <Canvas 
      gl={{ preserveDrawingBuffer: true }}  
      camera={{position: [15,15,15]}} 
      id='build-plane' 
      ref={canvasRef}
      style={style}
      onKeyDown={isViewMode ? undefined : rotateBlock}
      tabIndex={0}
      >
    {/* Plane */}
    <mesh 
      rotation={[planeRotation, 0, 0]} 
      onPointerDown={(e) => {
        if(!isViewMode){
          addBlockOnPlane(e)
        }}} 
      onPointerMove={(e: ThreeEvent<PointerEvent>) => {
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
    {blocks.map(b => <Block position={b.worldPosition ?? b.position}
                            geometry={b.geometry} 
                            rotation={b.rotation}
                            onPointerDown={(e: ThreeEvent<PointerEvent>) => {
                              e.stopPropagation();
                              if(!isViewMode){
                                addBlock(e, b.id, b.position);
                              }
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
                                      {/* There are supposed to be one texture for each face of each cuboid */}
        {b.textures?.map((texture, index) => {
          if (b.name?.includes('glass')) {
            return <meshBasicMaterial key={index} attach={`material-${index}`} map={texture} transparent={true} opacity={0.7}/>
          } else if (b.textures.length !== b.geometry.groups.length) {
            // Three implicitly uses the same logic as above, but in cases where there
            // are not enough materials, it uses the last used material. Fallback case, gets rid off invalid side errors.
            return <meshBasicMaterial key={index} map={texture}/>
          } else {
            return <meshBasicMaterial key={index} attach={`material-${index}`} map={texture}/>
          }
        }
        )}
                            </Block>
                          )}
    <OrbitControls />
    {!import.meta.env.PROD && <Stats />}
  </Canvas>;
}