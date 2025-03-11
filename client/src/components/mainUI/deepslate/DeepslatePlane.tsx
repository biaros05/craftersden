import React, { useEffect, useRef, useState } from 'react'
import fetchResources from './ResourcesFetcher';
import { Geometry, computeTrianglesOfCube, screenToWorldRay } from './RaycastUtils';
import { PlacedBlock, Structure } from 'deepslate';

type PlaneBlock = {
	name: string;
	position: [number, number, number];
	geometry: Geometry;
}

/**
 * @returns {React.ReactNode} Plane using deepslate
 */
export default function DeepslatePlane(): React.ReactNode {
	const canvas = useRef<HTMLCanvasElement>(null);
	const [structure, setStructure] = useState<Structure>(new Structure([3, 2, 1]));
	const [blocks, setBlocks] = useState<PlaneBlock[]>([]);
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
		fetchResources(canvas, structure!);
	}, [canvas, structure]);

	function placeBlock(e: React.MouseEvent<HTMLCanvasElement>) {
		screenToWorldRay(e.clientX, e.clientY, )
	}

	return <canvas ref={canvas} width={400} height={400} onMouseDown={placeBlock}></canvas>
}

function structureBlockToPlaneBlock(sBlocks: PlacedBlock[]): PlaneBlock[] {
	return sBlocks.map(b => {
		return {
			name: b.state.getName().toString(),
			position: b.pos,
			geometry: computeTrianglesOfCube()
		}
	})
}