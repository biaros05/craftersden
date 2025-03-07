import type { ItemRendererResources, NbtTag, Resources } from 'deepslate'
import { BlockDefinition, ItemModel, BlockModel, Identifier, jsonToNbt, Structure, StructureRenderer, TextureAtlas, upperPowerOfTwo } from 'deepslate'
import InteractiveCanvas from './InteractiveCanvas'
import React, { useEffect, useRef } from 'react'

const MCMETA = 'https://raw.githubusercontent.com/misode/mcmeta/'

/**
 * @returns {React.ReactNode} Plane using deepslate
 */
export default function DeepslatePlane(): React.ReactNode {
	const canvas = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		Promise.all([
			fetch(`${MCMETA}registries/item/data.min.json`).then(r => r.json()),
			fetch(`${MCMETA}summary/assets/block_definition/data.min.json`).then(r => r.json()),
			fetch(`${MCMETA}summary/assets/model/data.min.json`).then(r => r.json()),
			fetch(`${MCMETA}summary/assets/item_definition/data.min.json`).then(r => r.json()),
			fetch(`${MCMETA}summary/item_components/data.min.json`).then(r => r.json()),
			fetch(`${MCMETA}atlas/all/data.min.json`).then(r => r.json()),
			new Promise<HTMLImageElement>(res => {
				const image = new Image()
				image.onload = () => res(image)
				image.crossOrigin = 'Anonymous'
				image.src = `${MCMETA}atlas/all/atlas.png`
			}),
		]).then(([items, blockstates, models, item_models, item_components, uvMap, atlas]) => {
			
			// === Prepare assets for item and structure rendering ===
		
			const itemList = document.createElement('datalist')
			itemList.id = 'item-list'
			items.forEach(item => {
				const option = document.createElement('option')
				option.textContent = item
				itemList.append(option)
			})
			document.getElementById('item-input')?.after(itemList)
		
			const blockDefinitions: Record<string, BlockDefinition> = {}
			Object.keys(blockstates).forEach(id => {
				blockDefinitions['minecraft:' + id] = BlockDefinition.fromJson(blockstates[id])
			})
		
			const blockModels: Record<string, BlockModel> = {}
			Object.keys(models).forEach(id => {
				blockModels['minecraft:' + id] = BlockModel.fromJson(models[id])
			})
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			Object.values(blockModels).forEach((m: any) => m.flatten({ getBlockModel: id => blockModels[id] }))
		
		
			const itemModels: Record<string, ItemModel> = {}
			Object.keys(item_models).forEach(id => {
				itemModels['minecraft:' + id] = ItemModel.fromJson(item_models[id].model)
			})
		
			const itemComponents: Record<string, Map<string, NbtTag>> = {}
			Object.keys(item_components).forEach(id => {
				const components = new Map<string, NbtTag>()
				Object.keys(item_components[id]).forEach(c_id => {
					components.set(c_id, jsonToNbt(item_components[id][c_id]))
				})
				itemComponents['minecraft:' + id] = components
			})
		
			const atlasCanvas = document.createElement('canvas')
			const atlasSize = upperPowerOfTwo(Math.max(atlas.width, atlas.height))
			atlasCanvas.width = atlasSize
			atlasCanvas.height = atlasSize
			const atlasCtx = atlasCanvas.getContext('2d')!
			atlasCtx.drawImage(atlas, 0, 0)
			const atlasData = atlasCtx.getImageData(0, 0, atlasSize, atlasSize)
			const idMap = {}
			Object.keys(uvMap).forEach(id => {
				const [u, v, du, dv] = uvMap[id]
				const dv2 = (du !== dv && id.startsWith('block/')) ? du : dv
				idMap[Identifier.create(id).toString()] = [u / atlasSize, v / atlasSize, (u + du) / atlasSize, (v + dv2) / atlasSize]
			})
			const textureAtlas = new TextureAtlas(atlasData, idMap)
		
			const resources: Resources & ItemRendererResources = {
				getBlockDefinition(id) { return blockDefinitions[id.toString()] },
				getBlockModel(id) { return blockModels[id.toString()] },
				getTextureUV(id) { return textureAtlas.getTextureUV(id) },
				getTextureAtlas() { return textureAtlas.getTextureAtlas() },
				getBlockFlags() { return { opaque: false } },
				getBlockProperties() { return null },
				getDefaultBlockProperties() { return null },
				getItemModel(id) { return itemModels[id.toString()] },
				getItemComponents(id) { return itemComponents[id.toString()] },
			}
		
			// === Structure rendering ===
		
			const structure = new Structure([3, 2, 1])
			const size = structure.getSize()
			structure.addBlock([1, 0, 0], 'minecraft:grass_block', { snowy: 'false' })
			structure.addBlock([2, 0, 0], 'minecraft:stone')
			structure.addBlock([1, 1, 0], 'minecraft:skeleton_skull', { rotation: '15' })
			structure.addBlock([2, 1, 0], 'minecraft:acacia_fence', { waterlogged: 'true', north: 'true' })
			structure.addBlock([0, 0, 0], 'minecraft:wall_torch', { facing: 'west' })
		
			const structureGl = canvas?.current?.getContext('webgl');
			if (structureGl) {
				const structureRenderer = new StructureRenderer(structureGl, structure, resources)
			
				new InteractiveCanvas(canvas.current!, view => {
					structureRenderer.drawStructure(view)
				}, [size[0] / 2, size[1] / 2, size[2] / 2])
			}
		})
		
	}, [])

	return <canvas ref={canvas} width={400} height={400}></canvas>
}