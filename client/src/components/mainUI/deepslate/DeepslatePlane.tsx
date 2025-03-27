/* eslint-disable jsdoc/no-undefined-types */
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import fetchResources from './ResourcesFetcher';
import { Mesh, getCameraPosition, checkBlocksForIntersect, computePoint, computeTriangleNormal, computeTrianglesOfCube, screenToWorldRay } from './RaycastUtils';
import { BlockPos, PlacedBlock, Resources } from 'deepslate';
import { mat4, ReadonlyVec3, vec3 } from 'gl-matrix';
import InteractiveCanvas from './InteractiveCanvas';
import InteractiveStructureRenderer from './InteractiveStructureRenderer';
import CloneableStructure from './CloneableStructure';
import '../../../styles/DeepslatePlane.css';
import BlockStatePanel from './BlockStatePanel';

export interface PlaneBlock extends Mesh {
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
 * @param {object} props - React props
 * @param {React.RefObject<HTMLCanvasElement>} props.canvas - canvas of the plane 
 * @param {React.RefObject<CloneableStructure>} props.structure - current structure
 * @param {React.RefObject<PlaneBlock[]>} props.blocks - current blocks within the structure
 * @param {boolean} props.isViewMode - View mode state of plane
 * @returns {React.ReactNode} - Deepslate plane
 */
export default function DeepslatePlane({canvas, structure, blocks, isViewMode}: { canvas: React.RefObject<HTMLCanvasElement | null>; structure: React.RefObject<CloneableStructure>; blocks: React.RefObject<PlaneBlock[]>; isViewMode: boolean; }): React.ReactNode {
  const projectionMatrix = useRef<mat4>(null);
  const viewMatrix = useRef<mat4>(null);
  const cameraPosition = useRef<vec3>(null);
  const interactiveCanvas = useRef<InteractiveCanvas>(null);
  const structureRenderer = useRef<InteractiveStructureRenderer>(null);
  const blockstate = useRef<{[key: string]: string}>({});
  const [resources, setResources] = useState<Resources>();
  const canvasRect = useRef<DOMRect>(null);

  // Layout effect to make sure dom is ready to paint
  useLayoutEffect(() => {
    /**
     * Updates canvas rect when the window is resized
     */
    function resize() {
      if (canvas.current) {
        canvasRect.current = canvas.current.getBoundingClientRect();
      }
    }

    // raf to make sure the first paint happened to have correct size
    requestAnimationFrame(resize);
    window.addEventListener('resize', resize);

    return () => window.removeEventListener('resize', resize);
  }, [])

  useEffect(() => {
    fetchResources(setResources);
  }, []);

/**
 * Creates on render function causing the given renderer to rerender
 * @param {InteractiveStructureRenderer} newRenderer Renderer used for the onRender
 * @returns {(view: mat4) => void} onRender function to draw structure
 */
  function getOnRender(newRenderer: InteractiveStructureRenderer) {
    // function that renders the structure
    const onRender = (view: mat4) => {
      const gl = newRenderer.getGl();
      gl.clearColor(0,0,0,0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      newRenderer.drawStructure(view);
      newRenderer.drawGrid(view);
      viewMatrix.current = view;
      cameraPosition.current = getCameraPosition(view);
    };
    return onRender
  }

  // Initializes structure renderer and Interactive canvas
  useEffect(() => {
    const structureGl = canvas?.current?.getContext('webgl', {preserveDrawingBuffer: true});
    if (structureGl && resources) {
      const newRenderer = new InteractiveStructureRenderer(structureGl, structure.current, resources);
      structureRenderer.current = newRenderer;
      projectionMatrix.current = newRenderer.getPerspectiveMatrix();

      const size = structure.current.getSize();
      const intCanvas = new InteractiveCanvas(canvas.current!, getOnRender(newRenderer), [size[0] / 2, size[1] / 2, size[2] / 2]);
      intCanvas.subscribe();
      interactiveCanvas.current = intCanvas;

      return intCanvas?.cleanup;
    }
  }, [resources]);

  /**
   * Cast a ray to mouse position on canvas and return point and normal.
   * @param {React.MouseEvent<HTMLCanvasElement>} e - Mouse event object
   * @param {mat4} viewMat - View matrix used by the camera
   * @param {mat4} projectionMat - Projection matrix used by the renderer
   * @param {vec3} camPos - Camera position
   * @param {boolean} correct - whether to get the clicked block's position
   * @returns {{point: vec3, normal: vec3} | null} intersect information
   */
  function rayCast(e: React.MouseEvent<HTMLCanvasElement>, viewMat: mat4, projectionMat: mat4, camPos: vec3, correct: boolean = true): {point: [number, number, number], normal: ReadonlyVec3} | null {
    canvasRect.current = canvas.current!.getBoundingClientRect();
    const mouseX = e.clientX - canvasRect.current!.left;
    const mouseY = e.clientY - canvasRect.current!.top;

    console.log(canvasRect.current, 'raycast')
    const canvasSize = {width: canvas.current!.clientWidth, height: canvas.current!.clientHeight}

    const ray = screenToWorldRay(mouseX, mouseY, viewMat, projectionMat, canvasSize, camPos);
    const intersect = checkBlocksForIntersect(blocks.current, ray.direction, ray.origin);

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
    console.log(viewMatrix, projectionMatrix, cameraPosition)
    if (viewMatrix.current && projectionMatrix.current && cameraPosition.current) {
      const {point, normal} = rayCast(e, viewMatrix.current, projectionMatrix.current, cameraPosition.current) ?? {};
      if (point && normal) {
        console.log(point, normal)
        // Point is coordinates of the the block that was clicked on
        const newBlockPosVec = vec3.add(vec3.create(), point, normal);
        const newBlockPos: [number, number, number] = [newBlockPosVec[0], newBlockPosVec[1], newBlockPosVec[2]];
        if (!structure.current.getBlock(newBlockPos) && structure.current.isInside(point)) {
          structure.current.addBlock(newBlockPos, `${selectedBlock.namespace}:${selectedBlock.name}`, {...blockstate.current});
          blocks.current.push(...structureBlockToPlaneBlock([structure.current.getBlock(newBlockPos)!]));

          structureRenderer.current!.setStructure(structure.current);
          interactiveCanvas.current?.setOnRender(getOnRender(structureRenderer.current!))
          interactiveCanvas.current!.redraw();
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
    if (viewMatrix.current && projectionMatrix.current && cameraPosition.current) {
      const {point, normal} = rayCast(e, viewMatrix.current, projectionMatrix.current, cameraPosition.current) ?? {};

      if (point && normal) {
        structure.current = structure.current.removeBlockAndClone(point);
        blocks.current = blocks.current.filter(b => !BlockPos.equals(b.position, point));

        structureRenderer.current!.setStructure(structure.current);
        interactiveCanvas.current!.setOnRender(getOnRender(structureRenderer.current!));
        interactiveCanvas.current?.redraw();
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
		if (e.button === 2) {
			placeBlock(e);
		} else if (e.button === 0) {
			destroyBlock(e);
		}
	}

  return <div className="plane-container">
    <canvas id='deepslate-plane' width={800} height={800} ref={canvas} onMouseDown={!isViewMode ? handleClick : undefined} onContextMenu={(e) => e.preventDefault()}></canvas>
    {!isViewMode && <BlockStatePanel blockName={selectedBlock.name} blockNamespace={selectedBlock.namespace} currentState={blockstate} resources={resources} />}
  </div>;
}

/**
 * Takes an array of placed blocks and converts it to
 * plane blocks with their vertices
 * @param {PlacedBlock[]} sBlocks structure blocks
 * @returns {PlaneBlock[]} plane blocks with vertices
 */
export function structureBlockToPlaneBlock(sBlocks: PlacedBlock[]): PlaneBlock[] {
	return sBlocks.map(b => {
		return {
			name: b.state.getName().toString(),
			position: b.pos,
			geometry: computeTrianglesOfCube(b.pos)
		}
	})
}