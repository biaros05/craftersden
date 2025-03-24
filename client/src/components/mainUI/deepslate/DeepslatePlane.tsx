 
import React, { useEffect, useRef, useState } from 'react';
import fetchResources from './ResourcesFetcher';
import { Mesh, getCameraPosition, checkBlocksForIntersect, computePoint, computeTriangleNormal, computeTrianglesOfCube, screenToWorldRay } from './RaycastUtils';
import { BlockPos, PlacedBlock, Resources } from 'deepslate';
import { mat4, ReadonlyVec3, vec3 } from 'gl-matrix';
import InteractiveCanvas from './InteractiveCanvas';
import InteractiveStructureRenderer from './InteractiveStructureRenderer';
import CloneableStructure from './CloneableStructure';
import '../../../styles/DeepslatePlane.css';
import BlockStatePanel from './BlockStatePanel';

interface PlaneBlock extends Mesh {
	name: string;
	position: [number, number, number];
}

const baseStructure = new CloneableStructure([20, 20, 20]);
for (let x = 0; x < 20; x++) {
  for (let z = 0; z < 20; z++) {
    baseStructure.addBlock([x, 0, z], 'minecraft:grass_block', {snowy: 'false'});
  }
}

const selectedBlock = {
  namespace: 'minecraft',
  name: 'acacia_fence',
};


/**
 * @returns {React.ReactNode} Plane using deepslate
 */
export default function DeepslatePlane(): React.ReactNode {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [structure, setStructure] = useState<CloneableStructure>(baseStructure);
  const [blocks, setBlocks] = useState<PlaneBlock[]>([]);
  const [projectionMatrix, setProjectionMatrix] = useState<mat4>();
  const [viewMatrix, setViewMatrix] = useState<mat4>();
  const [cameraPosition, setCameraPosition] = useState<vec3>();
  const [resources, setResources] = useState<Resources>();
  const [, setInteractiveCanvas] = useState<InteractiveCanvas>();
  const [, setStructureRenderer] = useState<InteractiveStructureRenderer>();
  const [blockstate, setBlockstate] = useState<{[key: string]: string} | undefined>();

  // Setup intial structure on first load. Load the saved structure here or in the useState(HERE)
  useEffect(() => {
    // Strict mode is making the add fire multiple times per click
    fetchResources(setResources);
    setBlocks(structureBlockToPlaneBlock(structure.getBlocks()));
  }, []);

  // Initializes structure renderer and Interactive canvas
  useEffect(() => {
    const structureGl = canvas?.current?.getContext('webgl');
    if (structureGl && resources) {
      const newRenderer = new InteractiveStructureRenderer(structureGl, structure, resources);
      setStructureRenderer(newRenderer);
      setProjectionMatrix(newRenderer.getPerspectiveMatrix());

      // function that renders the structure
      const onRender = (view: mat4) => {
        newRenderer.drawStructure(view);
        newRenderer.drawGrid(view);
        setViewMatrix(view);
        setCameraPosition(getCameraPosition(view));
      };

      const size = structure.getSize();
      setInteractiveCanvas(new InteractiveCanvas(canvas.current!, onRender, [size[0] / 2, size[1] / 2, size[2] / 2]));
    }
  }, [resources]);

  // Update Interactive canvas and Structure renderer
  useEffect(() => {
    const structureGl = canvas?.current?.getContext('webgl');
    if (structureGl && resources && structure) {
      const newRenderer = new InteractiveStructureRenderer(structureGl, structure, resources);
      setStructureRenderer(newRenderer);
      setProjectionMatrix(newRenderer.getPerspectiveMatrix());

      // function that renders the structure
      const onRender = (view: mat4) => {
        newRenderer.drawStructure(view);
        newRenderer.drawGrid(view);
        setViewMatrix(view);
        setCameraPosition(getCameraPosition(view));
      };

      setInteractiveCanvas(interactiveCanvas => {
        interactiveCanvas?.dispose();
        return interactiveCanvas?.clone(canvas.current!, onRender);
      });
    }
  }, [resources, structure]);

  /**
   * Cast a ray to mouse position on canvas and return point and normal.
   * @param {React.MouseEvent<HTMLCanvasElement>} e - Mouse event object
   * @param {mat4} viewMatrix - View matrix used by the camera
   * @param {mat4} projectionMatrix - Projection matrix used by the renderer
   * @param {vec3} camPos - Camera position
   * @param {boolean} correct - whether to get the clicked block's position
   * @returns {{point: vec3, normal: vec3} | null} intersect information
   */
  function rayCast(e: React.MouseEvent<HTMLCanvasElement>, viewMatrix: mat4, projectionMatrix: mat4, camPos: vec3, correct: boolean = true): {point: [number, number, number], normal: ReadonlyVec3} | null {
    const canvasRect = canvas.current!.getBoundingClientRect();
    const mousePos = [e.clientX - canvasRect.left, e.clientY - canvasRect.top];

    const ray = screenToWorldRay(mousePos[0], mousePos[1], viewMatrix, projectionMatrix, {width: 800, height: 800}, camPos);
    const intersect = checkBlocksForIntersect(blocks, ray.direction, ray.origin);

    if (intersect) {
      const point = computePoint(intersect.distance, ray.origin, ray.direction).map(p => Math.floor(p));
      const normal = computeTriangleNormal(...intersect.triangle);

      // Correct point using normal vector of triangle.
      if (correct) {
        if (normal[0] === 1) {
          point[0] -= 1;
        } else if (normal[1] === 1) {
          point[1] -= 1;
        } else if (normal[2] === 1) {
          point[2] -= 1;
        }
      }

      return {
        point: point as [number, number, number],
        normal: normal
      };
    }
    return null;
  }

  /**
   * Places a block at click coordinates
   * @param {React.MouseEvent<HTMLCanvasElement>} e - Mouse event object
   */
  function placeBlock(e: React.MouseEvent<HTMLCanvasElement>) {
    if (viewMatrix && projectionMatrix && cameraPosition) {
      const {point, normal} = rayCast(e, viewMatrix, projectionMatrix, cameraPosition) ?? {};
      if (point && normal) {
        console.log(point, normal)
        // Point is coordinates of the the block that was clicked on
        const newBlockPosVec = vec3.add(vec3.create(), point, normal);
        const newBlockPos: [number, number, number] = [newBlockPosVec[0], newBlockPosVec[1], newBlockPosVec[2]];
        if (!structure.getBlock(newBlockPos) && structure.isInside(point)) {
          const newStructure = structure.clone();
          newStructure.addBlock(newBlockPos, `${selectedBlock.namespace}:${selectedBlock.name}`, {...blockstate});

          setStructure(newStructure);
          setBlocks([...blocks, ...structureBlockToPlaneBlock([newStructure.getBlock(newBlockPos)!])]);
        }
      }
    } else {
      console.log('Canvas is loading');
    }
  }

  /**
   * Destroys blocks at mouse coordinates
   * @param {React.MouseEvent<HTMLCanvasElement>} e - Mouse event object
   */
  function destroyBlock(e: React.MouseEvent<HTMLCanvasElement>) {
    if (viewMatrix && projectionMatrix && cameraPosition) {
      const {point, normal} = rayCast(e, viewMatrix, projectionMatrix, cameraPosition) ?? {};

      if (point && normal) {
        setStructure(structure.removeBlockAndClone(point));
        setBlocks([...blocks.filter(b => !BlockPos.equals(b.position, point))]);
      }
    } else {
      console.log('Canvas is loading');
    }
  }

  /**
   * Destroy block at mouse click
   * @param {React.MouseEvent<HTMLCanvasElement>} e - Mouse event object
   */
  function handleClick(e: React.MouseEvent<HTMLCanvasElement>) {
    console.log('click')
    if (e.button === 2) {
      placeBlock(e);
    } else if (e.button === 0) {
      destroyBlock(e);
    }
  }

  return <div className="plane-container">
    <canvas ref={canvas} width={800} height={800} onMouseDown={handleClick} onContextMenu={(e) => e.preventDefault()}></canvas>
    <BlockStatePanel blockName={selectedBlock.name} blockNamespace={selectedBlock.namespace} currentState={blockstate} resources={resources} setBlockstate={setBlockstate} />
  </div>;
}

/**
 * Takes an array of placed blocks and converts it to
 * plane blocks with their vertices
 * @param {PlacedBlock[]} sBlocks structure blocks
 * @returns {PlaneBlock[]} plane blocks with vertices
 */
function structureBlockToPlaneBlock(sBlocks: PlacedBlock[]): PlaneBlock[] {
  return sBlocks.map(b => {
    return {
      name: b.state.getName().toString(),
      position: b.pos,
      geometry: computeTrianglesOfCube(b.pos)
    };
  });
}