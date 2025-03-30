import express from 'express';
import { getBlocks, 
  getBlock, getBlockImage, getPageCount } from '../controllers/block.controller.mjs';
const block = express.Router();

block.get('/blocks', getBlocks);

block.get('/blocks/page-count', getPageCount);

block.get('/block/:id', getBlock);

block.get('/block/:name/image', getBlockImage);

export default block;



