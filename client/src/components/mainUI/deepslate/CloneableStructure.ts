/* eslint-disable @typescript-eslint/no-explicit-any */
import { BlockPos, BlockState, Identifier, NbtCompound, Structure } from "deepslate";

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
        const blocks = this.getPlacedBlocks().filter(b => !BlockPos.equals(b.pos, pos));

        return new CloneableStructure(this.getSize(), this.getPalette(), blocks)
    }

    public isBlockAt(pos: BlockPos) {
        const blocks = this.getPlacedBlocks().find(b => BlockPos.equals(b.pos, pos));

        return blocks !== undefined;
    }

    public addBlock(pos: BlockPos, name: Identifier | string, properties?: { [key: string]: string; }, nbt?: NbtCompound): this {
        if (this.isBlockAt(pos)) {
            console.error(`Block already at ${pos}`)
        }
        return super.addBlock(pos, name, properties, nbt);
    }
}