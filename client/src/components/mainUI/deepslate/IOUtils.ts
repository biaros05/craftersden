import { BlockState, NbtFile } from "deepslate";
import CloneableStructure from "./CloneableStructure";

/**
 * Reads an nbt file and parses it into a cloneable structure
 * @param {Uint8Array} file to parse
 * @returns {CloneableStructure} the structure from the file
 * @see https://github.com/EndingCredits/litematic-viewer/blob/main/src/litematic-utils.js
 */
export function importStructure(file: Uint8Array): CloneableStructure {
    const nbt = NbtFile.read(file);

<<<<<<< HEAD
    const litematic: {
        regions: {
            size: [number, number, number], 
            blockPalette: BlockState[], 
            blocks: {
                pos: [number, number, number], 
                state: number
            }[]
        }[] 
    } = {
        regions: []
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const regions = (nbt.root.getCompound('Regions') as any).properties;

=======
    const litematic = {
        regions: []
    };
    const regions = nbt.root.getCompound('Regions').properties;
    console.log(regions)
>>>>>>> 2556fb1970bde5ceb042beffd6b90c346d6ad333
    regions.forEach((value) => {
        const region = value.properties;
        console.log('l', region.get('BlockStates'))
        
        const size = region.get('Size');

        const x = Math.abs(size.get('x').value)
        const y = Math.abs(size.get('y').value)
        const z = Math.abs(size.get('z').value)

        const blockPalette = getPalette(region.get('BlockStatePalette'));
        const nbits = calculateBitWidth(blockPalette.length)
        const blocks = getBlocks(region.get('BlockStates'), nbits, {x, y, z})

        litematic.regions.push({size: [x, y, z], blockPalette: blockPalette, blocks: blocks});
    })

    return new CloneableStructure(litematic.regions[0].size, litematic.regions[0].blockPalette, litematic.regions[0].blocks);
}

/**
 * Parses block palette from nbt file into BlockStates
 * @param {object} palette blockPalette as given by BlockStatePalette
 * @returns {BlockState[]} blockstates from nbt
 */
function getPalette(palette: object): BlockState[] {
    const blockPalette = palette.items.map(i => BlockState.fromNbt(i));
    return blockPalette;
}

/**
 * Calculates the smallest power of 2 to hold the given value
 * @param {number} size number to hold
 * @returns {number} smallest power of 2 > size 
 */
function calculateBitWidth(size: number): number {
    return Math.max(1, Math.ceil(Math.log2(size)));
}

/**
 * @param {{items: object}} regionData - region data corresponding to BlockStates 
 * @param {object} regionData.items - Arrays of block information
 * @param {number} nbits - Smallest power of 2 > blockpallete.length
 * @param {{x: number, y: number, z: number}} structureSize - x, y, z object with of the structure size
 * @param {number} structureSize.x - Structure size parameter
 * @param {number} structureSize.y - Structure size parameter
 * @param {number} structureSize.z - Structure size parameter
 * @returns {{pos: [number, number, number], state: number}[]} block positions and their states
 */
function getBlocks(regionData: {items: object}, nbits: number, structureSize: {x: number, y: number, z: number}): { pos: [number, number, number]; state: number; }[] {
  const { x: width, y: height, z: depth } = structureSize;
  
  const blocks = processNBTRegionData(regionData.items, nbits, width, height, depth);

  const result: {pos: [number, number, number], state: number}[] = [];

  // After extracting, map the palette index to actual block state in the palette
  blocks.forEach((layer: [[number]], x: number) => {
    layer.forEach((row: [number], y: number) => {
      row.forEach((blockIndex: number, z: number) => {
        if (blockIndex !== 0) {
          result.push({
            pos: [x, y, z],
            state: blockIndex
          });
        }
      });
    });
  });
  return result;
}

/**
 * @param {{value: number[]}[]} regionData data from BlockStates
 * @param {number} nbits smallest power able to hold blockpalette.length
 * @param {number} width size of the structure
 * @param {number} height size of the structure
 * @param {number} depth size of the structure
 * @returns {[[[number]]]} position of each block and its palette index
 */
function processNBTRegionData(regionData: { value: []; }[], nbits: number, width: number, height: number, depth: number): [[[number]]] {
  const mask = (1 << nbits) - 1;
  
  const y_shift = Math.abs(width * depth);
  const z_shift = Math.abs(width);
  const blocks = [];
  for (let x=0; x < Math.abs(width); x++) {
    blocks[x] = [];
    for (let y=0; y < Math.abs(height); y++) {
      blocks[x][y] = [];
      for (let z=0; z < Math.abs(depth); z++) {
        
        const index = y * y_shift + z * z_shift + x;
        
        const start_offset = index * nbits;
        
        const start_arr_index = start_offset >>> 5; /// divide by 32
        const end_arr_index = ((index + 1) * nbits - 1) >>> 5;
        const start_bit_offset = start_offset & 0x1F; // % 32

        const half_ind = start_arr_index >>> 1;
        let blockStart, blockEnd
        if ((start_arr_index & 0x1) == 0) {
          blockStart = regionData[half_ind].value[1];
          blockEnd = regionData[half_ind].value[0];
        } else {
          blockStart = regionData[half_ind].value[0];
          if (half_ind+1 < regionData.length) {
            blockEnd = regionData[half_ind+1].value[1];
          } else {
            blockEnd = 0x0;
          }
        }
        
        if (start_arr_index == end_arr_index) {
            blocks[x][y][z] = (blockStart >>> start_bit_offset) & mask;
        } else {
            const end_offset = 32 - start_bit_offset;
            const val = ((blockStart >>> start_bit_offset) & mask) | ((blockEnd << end_offset) & mask);
            blocks[x][y][z] = val;
        }
      }
    }
  }
  return blocks;
}
