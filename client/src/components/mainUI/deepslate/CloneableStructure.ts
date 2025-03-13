import { BlockPos, BlockState, NbtCompound, Structure } from "deepslate";

export default class CloneableStructure extends Structure {
    protected getPalette(): BlockState[] {
        return (this as any).palette;
    }

    protected getPlacedBlocks(): { pos: BlockPos, state: number, nbt?: NbtCompound }[] {
        return (this as any).blocks;
    }

    public clone(size: [number, number, number] = this.getSize()) {
        return new CloneableStructure(size, this.getPalette(), this.getPlacedBlocks());
    }

    public removeBlockAndClone(pos: BlockPos) {
        const placedBlocks = this.getPlacedBlocks();
        const blockIndex = placedBlocks.findIndex(b => BlockPos.equals(b.pos, pos));
        const blockCount = placedBlocks.reduce((prev, curr) => {
            if (curr.state === placedBlocks[blockIndex].state) {
                return prev + 1;
            }
            return prev;
        }, 0);
        console.log(blockCount);
        if (blockCount === 1) {
            return this.clone();
        }

        // If multiple blocks use same palette entry just remove block from placed blocks
        placedBlocks.splice(blockIndex, 1);
        return new CloneableStructure(this.getSize(), this.getPalette(), placedBlocks)
    }
}