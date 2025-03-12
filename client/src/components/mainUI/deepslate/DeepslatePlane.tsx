/* eslint-disable jsdoc/no-undefined-types */
import React, { useEffect, useRef, useState } from 'react'
import fetchResources from './ResourcesFetcher';
import { Mesh, getCameraPosition, checkBlocksForIntersect, computePoint, computeTriangleNormal, computeTrianglesOfCube, screenToWorldRay } from './RaycastUtils';
import { PlacedBlock, Resources, StructureRenderer } from 'deepslate';
import { mat4, ReadonlyVec3, vec3 } from 'gl-matrix';
import InteractiveCanvas from './InteractiveCanvas';
import InteractiveStructureRenderer from './InteractiveStructureRenderer';
import CloneableStructure from './CloneableStructure';

interface PlaneBlock extends Mesh {
	name: string;
	position: [number, number, number];
}

/**
 * @returns {React.ReactNode} Plane using deepslate
 */
export default function DeepslatePlane(): React.ReactNode {
	const canvas = useRef<HTMLCanvasElement>(null);
	const [structure, setStructure] = useState<CloneableStructure>(new CloneableStructure([5, 5, 5]));
	const [blocks, setBlocks] = useState<PlaneBlock[]>([]);
	const [projectionMatrix, setProjectionMatrix] = useState<mat4>();
	const [viewMatrix, setViewMatrix] = useState<mat4>();
	const [cameraPosition, setCameraPosition] = useState<vec3>();
	const [resources, setResources] = useState<Resources>();
	const [interactiveCanvas, setInteractiveCanvas] = useState<InteractiveCanvas>();
	const [structureRenderer, setStructureRenderer] = useState<InteractiveStructureRenderer>();
	
	// Setup structure on first load
	useEffect(() => {
		structure.addBlock([1, 0, 0], 'minecraft:grass_block', { snowy: 'false' })
		structure.addBlock([2, 0, 0], 'minecraft:stone')
		structure.addBlock([1, 1, 0], 'minecraft:skeleton_skull', { rotation: '15' })
		structure.addBlock([2, 1, 0], 'minecraft:acacia_fence', { waterlogged: 'true', north: 'true' })
		structure.addBlock([0, 0, 0], 'minecraft:wall_torch', { facing: 'west' })
		setStructure(structure.clone());
		setBlocks(structureBlockToPlaneBlock(structure.getBlocks()));
	}, [])

	useEffect(() => {console.log(blocks)}, [blocks]);

	useEffect(() => {
		fetchResources(setResources);
	}, [setResources]);

	useEffect(() => {
		const structureGl = canvas?.current?.getContext('webgl');
        if (structureGl && resources) {
			setStructureRenderer(new InteractiveStructureRenderer(structureGl, structure, resources));
        }
	}, [canvas, structure, resources])

	useEffect(() => {
		if (structureRenderer) {
			// function that renders the structure
			const onRender = (view: mat4) => {
				structureRenderer.drawStructure(view);
				structureRenderer.drawGrid(view);
				setViewMatrix(view);
				setProjectionMatrix(structureRenderer.getPerspectiveMatrix());
				setCameraPosition(getCameraPosition(view));
			}
			
			if (!interactiveCanvas) {
				const size = structure.getSize()
				setInteractiveCanvas(new InteractiveCanvas(canvas.current!, onRender, [size[0] / 2, size[1] / 2, size[2] / 2]));
			} else {
				setInteractiveCanvas(interactiveCanvas.cloneAndDelete(onRender));
			}
		}
	}, [structureRenderer])

	/**
	 * Places a block at click coordinates
	 * @param {React.MouseEvent<HTMLCanvasElement>} e - Mouse event object
	 */
	function placeBlock(e: React.MouseEvent<HTMLCanvasElement>) {
		if (viewMatrix && projectionMatrix && cameraPosition) {
			const canvasRect = canvas.current!.getBoundingClientRect();
			const mousePos = [e.clientX - canvasRect.left, e.clientY - canvasRect.top];

			const ray = screenToWorldRay(mousePos[0], mousePos[1], viewMatrix, projectionMatrix, {width: 800, height: 800}, cameraPosition);
			const intersect = checkBlocksForIntersect(blocks, ray.direction, ray.origin);

			if (intersect) {
				const point = computePoint(intersect.distance, ray.origin, ray.direction).map(p => Math.floor(p));
				const normal = computeTriangleNormal(...intersect.triangle);
				// Correct point using normal vector of triangle.
				if (normal[0] === 1) {
					point[0] -= 1;
				}
				if (normal[1] === 1) {
					point[1] -= 1;
				}
				if (normal[2] === 1) {
					point[2] -= 1;
				}
				
				// Point is coordinates of the the block that was clicked on
				const newBlockPosVec = vec3.add(vec3.create(), point as ReadonlyVec3, normal);
				const newBlockPos: [number, number, number] = [newBlockPosVec[0], newBlockPosVec[1], newBlockPosVec[2]];
				if (structure.isInside(newBlockPos)) {
					structure.addBlock(newBlockPos, 'minecraft:stone')
					setStructure(structure.clone());
					setBlocks([...blocks, ...structureBlockToPlaneBlock([structure.getBlock(newBlockPos)!])])
				}
			}
		} else {
			console.log('Canvas is loading')
		}
	}

	return <canvas ref={canvas} width={800} height={800} onMouseDown={placeBlock}></canvas>
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
		}
	})
}