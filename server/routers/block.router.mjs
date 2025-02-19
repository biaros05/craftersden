import express from 'express';
import { getBlocks } from '../controllers/block.controller.mjs';
const block = express.Router();

block.get('/blocks', getBlocks);

block.get('/blocks/:id', (req, res) => {
  res.json({});
});

export default block;



