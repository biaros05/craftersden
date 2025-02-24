import { InferSchemaType } from 'mongoose';
import Block from './Block.js';

type BlockType = InferSchemaType<typeof Block.schema>;

export type { BlockType };
