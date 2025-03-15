import { BlockState } from "deepslate";
import CloneableStructure from "./CloneableStructure";

const PLANE_BLOCKS: {pos: [number, number, number], state: number}[] = [];

for (let i = 0; i < 100; i++) {
  PLANE_BLOCKS.push({pos: [Math.floor(i / 10), 0, i % 10], state: 0});
}
  
export const STONE_PLANE = new CloneableStructure([10, 10, 10], [new BlockState('minecraft:grass_block', {snowy: 'false'})], PLANE_BLOCKS);