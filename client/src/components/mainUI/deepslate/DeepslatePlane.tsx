/* eslint-disable jsdoc/no-undefined-types */
import React, { useEffect, useRef, useState } from 'react'
import fetchResources from './ResourcesFetcher';
import { Mesh, checkBlocksForIntersect, computePoint, computeTrianglesOfCube, screenToWorldRay } from './RaycastUtils';
import { PlacedBlock, Structure } from 'deepslate';
import { mat4, vec3 } from 'gl-matrix';

interface PlaneBlock extends Mesh {
	name: string;
	position: [number, number, number];
}

/**
 * @returns {React.ReactNode} Plane using deepslate
 */
export default function DeepslatePlane(): React.ReactNode {
	const canvas = useRef<HTMLCanvasElement>(null);
	const [structure, setStructure] = useState<Structure>(new Structure([3, 2, 1]));
	const [blocks, setBlocks] = useState<PlaneBlock[]>([]);
	const [projectionMatrix, setProjectionMatrix] = useState<mat4>();
	const [viewMatrix, setViewMatrix] = useState<mat4>();
	const [cameraPosition, setCameraPosition] = useState<vec3>();
	// When a block is added compute its triangles
	// store the triangles in the state
	// Check the triangles for intersect
	
	// Setup structure on first load
	useEffect(() => {
		structure.addBlock([1, 0, 0], 'minecraft:grass_block', { snowy: 'false' })
		structure.addBlock([2, 0, 0], 'minecraft:stone')
		structure.addBlock([1, 1, 0], 'minecraft:skeleton_skull', { rotation: '15' })
		structure.addBlock([2, 1, 0], 'minecraft:acacia_fence', { waterlogged: 'true', north: 'true' })
		structure.addBlock([0, 0, 0], 'minecraft:wall_torch', { facing: 'west' })
		setStructure(Object.assign({}, structure));
		setBlocks(structureBlockToPlaneBlock(structure.getBlocks()));
	}, [])

	useEffect(() => {console.log(blocks)}, [blocks]);

	useEffect(() => {
		fetchResources(canvas, structure!, setProjectionMatrix, setViewMatrix, setCameraPosition);
	}, [canvas, structure, setProjectionMatrix, setViewMatrix, setCameraPosition]);

	/**
	 * Places a block at click coordinates
	 * @param {React.MouseEvent<HTMLCanvasElement>} e - Mouse event object
	 */
	function placeBlock(e: React.MouseEvent<HTMLCanvasElement>) {
		if (viewMatrix && projectionMatrix && cameraPosition) {
			console.log(e.clientX, e.clientY - 400)
			const ray = screenToWorldRay(e.clientX, e.clientY - 400, viewMatrix, projectionMatrix, {width: 400, height: 400}, cameraPosition);
			const intersect = checkBlocksForIntersect(blocks, ray.direction, ray.origin);
			console.log(intersect);
			if (intersect) {
				const point = computePoint(intersect, ray.origin, ray.direction).map(p => Math.floor(p));
				console.log(point)
				// Correct point using normal vector of triangle.
			}
		}
	}

	return <canvas ref={canvas} width={400} height={400} onMouseDown={placeBlock}></canvas>
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