import React from 'react';
import type { Resources } from 'deepslate'
import { BlockDefinition, BlockModel, Identifier, TextureAtlas, upperPowerOfTwo } from 'deepslate'

/* --- Code mostly from deepslatejs demo code --- */
const MCMETA = 'https://raw.githubusercontent.com/misode/mcmeta/';

/**
 * Fetches resources from MCMETA repository and sets a Resources state
 * @param {React.Dispatch<React.SetStateAction<Resources | undefined>>} setResources setState callback for resources
 */
export default async function fetchResources(setResources: React.Dispatch<React.SetStateAction<Resources | undefined>>) {
    Promise.all([
        fetch(`${MCMETA}summary/assets/block_definition/data.min.json`).then(r => r.json()),
        fetch(`${MCMETA}summary/assets/model/data.min.json`).then(r => r.json()),
        fetch(`${MCMETA}atlas/all/data.min.json`).then(r => r.json()),
        new Promise<HTMLImageElement>(res => {
            const image = new Image()
            image.onload = () => res(image)
            image.crossOrigin = 'Anonymous'
            image.src = `${MCMETA}atlas/all/atlas.png`
        }),
    ]).then(([blockstates, models, uvMap, atlas]) => {
        // === Prepare assets for item and structure rendering ===    
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
    
        setResources(resources);
    })
}