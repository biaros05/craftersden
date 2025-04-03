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

        let airIndex = -1;
        for (let i = 0; i < palette.length; i++) {
            if (palette[i].equals(BlockState.AIR)) {
                airIndex = i;
                break;
            }
        }
        if (airIndex === -1) {
            palette.splice(0, 0, BlockState.AIR);
        }

        const paletteNbt: NbtCompound[] = palette.map(val => {
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
        // const BlockStateNbt = new NbtLongArray(this.encodePlacedBlocks(airIndex, palette));
        const BlockStateNbt = new NbtLongArray(this.encodeToNBTRegionData(airIndex));
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

    // Code generated by deepseek by asking to reverse decoding process in IOUtils.ts
    private encodeToNBTRegionData(airIndex: number): [number, number][] {
        const nbits = calculateBitWidth(this.getPalette().length); 
        const placedBlocks = this.getPlacedBlocks();
        const [width, height, depth] = this.getSize();
        const mask = (1 << nbits) - 1;
        const y_shift = Math.abs(width * depth);
        const z_shift = Math.abs(width);
        const totalBits = Math.abs(width) * Math.abs(height) * Math.abs(depth) * nbits;
        const totalPairs = Math.ceil(totalBits / 64);
        const regionData: [number, number][] = [];
      
        const blockDataLookup = new Map();
        placedBlocks.forEach(block => {
            const posKey = `${block.pos[0]},${block.pos[1]},${block.pos[2]}`;
            blockDataLookup.set(posKey, block.state);
        });

        for (let i = 0; i < totalPairs; i++) {
          regionData.push([0, 0]);
        }
      
        for (let x = 0; x < Math.abs(width); x++) {
          for (let y = 0; y < Math.abs(height); y++) {
            for (let z = 0; z < Math.abs(depth); z++) {
              const index = y * y_shift + z * z_shift + x;
              const start_offset = index * nbits;
              const start_arr_index = start_offset >>> 5; // divide by 32
              const end_arr_index = ((index + 1) * nbits - 1) >>> 5;
              const start_bit_offset = start_offset & 0x1F; // mod 32
      
              const half_ind = start_arr_index >>> 1; // divide by 2
              const rawIndex = blockDataLookup.get(`${x},${y},${z}`);
              let blockValue;
              if (airIndex === -1) {
                if (rawIndex) {
                  blockValue = rawIndex + 1;
                } else {
                  blockValue = 0;
                }
              } else {
                if (rawIndex) {
                  blockValue = rawIndex;
                } else {
                  blockValue = airIndex;
                }
              }
              blockValue = blockValue & mask;

              if (start_arr_index === end_arr_index) {
                // Value fits within one 32-bit integer
                if ((start_arr_index & 0x1) === 0) {
                  // First 32-bit integer in the pair
                  regionData[half_ind][1] |= (blockValue << start_bit_offset);
                } else {
                  // Second 32-bit integer in the pair
                  regionData[half_ind][0] |= (blockValue << start_bit_offset);
                }
              } else {
                // Value spans two 32-bit integers
                const end_offset = 32 - start_bit_offset;
                const lowerPart = blockValue & ((1 << end_offset) - 1);
                const upperPart = blockValue >>> end_offset;
      
                if ((start_arr_index & 0x1) === 0) {
                  // First part in the first 32-bit integer of the pair
                  regionData[half_ind][1] |= (lowerPart << start_bit_offset);
                  // Second part in the second 32-bit integer of the pair
                  regionData[half_ind][0] |= upperPart;
                } else {
                  // First part in the second 32-bit integer of the pair
                  regionData[half_ind][0] |= (lowerPart << start_bit_offset);
                  // Second part in the first 32-bit integer of the next pair
                  if (half_ind + 1 < regionData.length) {
                    regionData[half_ind + 1][1] |= upperPart;
                  }
                }
              }
            }
          }
        }
        console.log(regionData)
        return regionData;
      }
}