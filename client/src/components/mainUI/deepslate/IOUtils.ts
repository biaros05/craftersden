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

    const litematic = {
        regions: []
    };
    const regions = nbt.root.getCompound('Regions').properties;
    console.log(regions)
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
function getPalette(palette): BlockState[] {
    const blockPalette = palette.items.map(i => BlockState.fromNbt(i));
    return blockPalette;
}

function calculateBitWidth(size) {
    return Math.max(1, Math.ceil(Math.log2(size)));
}

function getBlocks(regionData, nbits, structureSize) {
    const { x: width, y: height, z: depth } = structureSize;
    
    const blocks = processNBTRegionData(regionData.items, nbits, width, height, depth);

    const result: {pos: number[], state: number}[] = [];

    // After extracting, map the palette index to actual block state in the palette
    blocks.forEach((layer: [], x: number) => {
        layer.forEach((row: [], y: number) => {
            row.forEach((blockIndex: number, z: number) => {
                result.push({
                    pos: [x, y, z],
                    state: blockIndex
                });
            });
        });
    });
    return result;
}

function processNBTRegionData(regionData, nbits, width, height, depth) {
    // Function to take the raw array and convert it into a 3D array
    // The raw data is a list of nbits-wide numbers all packed together into a single array of 64-bit* ints
    // I ripped off some python code for this, can't remember where from.
    // (* of course this is javascript so each int is split into an array fo 2 32-bit ints)
    
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
          
          // This bit here is to handle the fact that the 64 bit numbers have to be broken down to
          // 32bit numbers in javascript.
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
              // It seems that sometimes the index can extend past the end of the array, but this fix works (for now)
              blockEnd = 0x0;
            }
          }
          
          if (start_arr_index == end_arr_index) {
              blocks[x][y][z] = (blockStart >>> start_bit_offset) & mask;
          } else {
              const end_offset = 32 - start_bit_offset; // num curtailed bits
              const val = ((blockStart >>> start_bit_offset) & mask) | ((blockEnd << end_offset) & mask);
              blocks[x][y][z] = val;// & mask;
          }
          
        }
      }
    }
    return blocks;
  }