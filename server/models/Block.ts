import { Schema, model, InferSchemaType } from 'mongoose';

const UVSchema = new Schema({
  uv: [],
  texture: String,
});

const CuboidSchema = new Schema({
  from: {
    type: [],
    validate: [(value) => value.length === 3, 'from must have 3 elements'],
  },
  to: {
    type: [],
    validate: [(value) => value.length === 3, 'to must have 3 elements'],
  },
  faces: {
    down: UVSchema,
    up: UVSchema,
    north: UVSchema,
    south: UVSchema,
    west: UVSchema,
    east: UVSchema,
  }
});

const BlockSchema = new Schema({
  name: String,
  cuboids: [CuboidSchema],
  inventoryTexture: String
});

const Block = model('blocks', BlockSchema);

type BlockType = InferSchemaType<typeof BlockSchema>;

export default Block;
export type { BlockType };