import express from 'express';
import { getBlocks, getBlock } from '../controllers/block.controller.mjs';
const block = express.Router();

block.get('/blocks', getBlocks);

block.get('/block/:id', getBlock);

export default block;



