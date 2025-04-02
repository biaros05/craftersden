/* eslint-disable @typescript-eslint/no-explicit-any */
import { BlockPos, BlockState, Identifier, JsonValue, NbtCompound, NbtFile, NbtInt, NbtList, NbtLong, NbtLongArray, NbtLongPair, NbtString, NbtTag, Structure } from "deepslate";
import { calculateBitWidth } from "./IOUtils";

export default class CloneableStructure extends Structure {

    protected getPalette(): BlockState[] {
        return (this as any).palette;
    }

    protected getPlacedBlocks(): { pos: BlockPos, state: number, nbt?: NbtCompound }[] {
        return (this as any).blocks;
    }

    public clone(size: [number, number, number] = this.getSize()) {
        return new CloneableStructure(size, [...this.getPalette()], [...this.getPlacedBlocks()]);
    }

    public removeBlock(pos: BlockPos) {
        const size = this.getSize();
        this.blocks = this.getPlacedBlocks().filter(b => !BlockPos.equals(b.pos, pos));
        this.blocksMap = this.blocksMap.splice(pos[0] * size[1] * size[2] + pos[1] * size[2] + pos[2], 1)
    }

    public addBlock(pos: BlockPos, name: Identifier | string, properties?: { [key: string]: string; }, nbt?: NbtCompound) {
        if (this.getBlock(pos)) {
            console.error(`Block already at ${pos}`)
        }
        super.addBlock(pos, name, properties, nbt);
    }

    public toJson() {
        return {
            size: [...this.getSize()],
            palette: [...this.getPalette()],
            placedBlocks: [...this.getPlacedBlocks()],
        };
    }

    public static fromStructure(structure: Structure) {
        return new CloneableStructure(structure.getSize(), [...(structure as any).palette], [...(structure as any).blocks]);
    }

    public static fromJson(json: object) {
        const palette = json.palette.map(b => new BlockState(`${b.name.namespace}:${b.name.path}`, b.properties)) as any;

        return new CloneableStructure(json.size, palette, json.placedBlocks);
    }

    public toNbt(author: string, name: string='craftersden.litematic') {
        const structureSize = this.getSize();
        const palette = this.getPalette();
        const placedBlocks = this.getPlacedBlocks();

        const Metadata = new Map<string, NbtTag>();
        Metadata.set('Author', new NbtString(author));
        Metadata.set('RegionCount', new NbtInt(1));
        Metadata.set('totalBlocks', new NbtInt(placedBlocks.length));
        Metadata.set('totalVolume', new NbtInt(structureSize[0] * structureSize[1] * structureSize[2]));

        const MetadataNbt = new NbtCompound(Metadata)
        
        const regionName = 'Unnamed';
        const Regions = new Map<string, NbtTag>();

        const mainRegionsNbt = new NbtCompound(Regions);

        const mainRegion = new Map<string, NbtTag>();

        const position = new Map<string, NbtTag>();
        position.set('x', new NbtInt(0));
        position.set('y', new NbtInt(0));
        position.set('z', new NbtInt(0));
        const positionNbt = new NbtCompound(position);
        mainRegion.set('Position', positionNbt);

        const size = new Map<string, NbtTag>();
        size.set('x', new NbtInt(structureSize[0]));
        size.set('y', new NbtInt(structureSize[1]));
        size.set('z', new NbtInt(structureSize[2]));
        const sizeNbt = new NbtCompound(size);
        mainRegion.set('Size', sizeNbt);

        const paletteNbt: NbtCompound[] = [
            BlockState.AIR,
            ...palette
        ].map(val => {
            const blockMap = new Map<string, NbtTag>();
            blockMap.set('Name', new NbtString(val.getName().toString()));
            const blockProperties = val.getProperties();
            const blockPropertiesKeys = Object.keys(blockProperties);
            if (blockPropertiesKeys.length > 0) {
                const propertiesMap = new Map<string, NbtTag>();

                blockPropertiesKeys.forEach(key => propertiesMap.set(key, new NbtString(blockProperties[key])));
                blockMap.set('Properties', new NbtCompound(propertiesMap));
            }

            return new NbtCompound(blockMap);
        });

        const BlockStatePaletteNbt = new NbtList(paletteNbt);
        mainRegion.set('BlockStatePalette', BlockStatePaletteNbt);

        const BlockStateNbt = new NbtLongArray(this.encodePlacedBlocks());
        mainRegion.set('BlockStates', BlockStateNbt)


        const mainRegionNbt = new NbtCompound(mainRegion);

        Regions.set(regionName, mainRegionNbt)
        
        const root = new Map<string, NbtTag>();
        root.set('Metadata', MetadataNbt)
        root.set('Regions', mainRegionsNbt);

        const rootNbt = new NbtCompound(root);

        const nbt = new NbtFile(name, rootNbt, 'gzip', false, undefined);
        return nbt;
    }


    private encodePlacedBlocks(): [number, number][] {
        const size = this.getSize();
        const palette = [BlockState.AIR, ...this.getPalette()];
        const placedBlocks = this.getPlacedBlocks();
        const nbits = calculateBitWidth(palette.length)

        // Calculate how many bits each block needs based on the palette size
        const mask = (1 << nbits) - 1;
        const [width, height, depth] = size;
        const y_shift = width * depth;
        const z_shift = width;

        // Initialize the region data array (will store the packed 64-bit integers)
        const regionData: [number, number][] = [];

        const blockDataLookup = new Map();
        placedBlocks.forEach(block => {
            const posKey = `${block.pos[0]},${block.pos[1]},${block.pos[2]}`;
            blockDataLookup.set(posKey, block.state);
        });

        // Iterate over all possible positions in the structure
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                for (let z = 0; z < depth; z++) {
                    // Check if this position has block data; default to air if not
                    const posKey = `${x},${y},${z}`;
                    const blockStateIndex = blockDataLookup.get(posKey) || 0;

                    // Ensure the state is within valid bounds
                    if (blockStateIndex === undefined || blockStateIndex >= palette.length) {
                        console.error(`State ${blockStateIndex} is out of bounds in the palette!`);
                        continue;
                    }

                    // Calculate the linear index for this block in the packed data array
                    const index = y * y_shift + z * z_shift + x;

                    // Determine the start and end bit indices for this block
                    const start_offset = index * nbits;
                    const start_arr_index = start_offset >>> 5;  // Divide by 32
                    const start_bit_offset = start_offset & 0x1F; // % 32

                    // We need to determine the half-block of the 64-bit value
                    const half_ind = start_arr_index >>> 1;
                    let blockStart, blockEnd;
                    
                    // If we're in the first half of a 64-bit block
                    if ((start_arr_index & 0x1) === 0) {
                        blockStart = regionData[half_ind]?.[1] || 0;
                        blockEnd = regionData[half_ind]?.[0] || 0;
                    } else {
                        blockStart = regionData[half_ind]?.[0] || 0;
                        blockEnd = regionData[half_ind + 1]?.[1] || 0;
                    }

                    // Shift and mask to insert the block state index
                    const blockState = blockStateIndex & mask;

                    // Apply bit shifts to the corresponding positions in the blockStart and blockEnd
                    if (start_arr_index === start_arr_index) {
                        blockStart |= blockState << start_bit_offset;
                    } else {
                        const end_offset = 32 - start_bit_offset;
                        blockStart |= (blockState >>> end_offset) & mask;
                        blockEnd |= blockState << start_bit_offset;
                    }
                    
                    // Store the packed data back to regionData
                    regionData[half_ind] = [blockEnd, blockStart];  // Update the region data
                }
            }
        }

        return regionData;
    }
}