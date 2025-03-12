import { Structure } from "deepslate";

export default class CloneableStructure extends Structure {
    public clone(size: [number, number, number] = this.getSize()) {
        return new CloneableStructure(size, (this as any).palette, (this as any).blocks);
    }
}