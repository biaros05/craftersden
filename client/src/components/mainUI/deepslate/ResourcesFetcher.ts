import React from 'react';
import type { NbtTag, Resources } from 'deepslate'
import { BlockDefinition, ItemModel, BlockModel, Identifier, jsonToNbt, Structure, TextureAtlas, upperPowerOfTwo } from 'deepslate'
import InteractiveCanvas from "./InteractiveCanvas";
import InteractiveStructureRenderer from './InteractiveStructureRenderer';

const MCMETA = 'https://raw.githubusercontent.com/misode/mcmeta/';

/**
 *
 * @param {React.RefObject<HTMLCanvasElement | null>} canvas html canvas
 * @param {Structure} structure the structure to render
 */
export default async function fetchResources(canvas: React.RefObject<HTMLCanvasElement | null>, structure: Structure) {
    if (!canvas?.current) return;
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
    
        const resources: Resources = {
            getBlockDefinition(id) { return blockDefinitions[id.toString()] },
            getBlockModel(id) { return blockModels[id.toString()] },
            getTextureUV(id) { return textureAtlas.getTextureUV(id) },
            getTextureAtlas() { return textureAtlas.getTextureAtlas() },
            getBlockFlags() { return { opaque: false } },
            getBlockProperties() { return null },
            getDefaultBlockProperties() { return null },
        }
    
        // === Structure rendering ===
    
        const structureGl = canvas?.current?.getContext('webgl');
        if (structureGl) {
            const structureRenderer = new InteractiveStructureRenderer(structureGl, structure, resources)
            console.log(structure.getBlocks());
            console.log(structure.isInside([0,2,0]))
		    const size = structure.getSize()
            
            new InteractiveCanvas(canvas.current!, view => {
                structureRenderer.drawStructure(view); // 2
                structureRenderer.drawGrid(view);
            }, [size[0] / 2, size[1] / 2, size[2] / 2])
        }
    })
}