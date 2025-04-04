import express from 'express';
import { getBlocks, 
  getBlock, getBlockImage, getPageCount } from '../controllers/block.controller.mjs';
const block = express.Router();


/**
 * @swagger
 * /api/blocks:
 *   get:
 *     summary: Gets a list of blocks
 *     description: Retrieves a paginated list of blocks with an optional search query.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number to retrieve.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: The number of items per page.
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for filtering blocks by name.
 *     responses:
 *       200:
 *         description: A list of blocks with pagination details.
 *       400:
 *         description: Invalid query parameters.
 *       404:
 *         description: Page not found.
 */
block.get('/blocks', getBlocks);

/**
 * @swagger
 * /api/blocks/page-count:
 *   get:
 *     summary: Gets the total number of pages
 *     description: Retrieves the total number of pages based on the specified limit.
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: The number of items per page.
 *     responses:
 *       200:
 *         description: Total number of pages.
 *       400:
 *         description: Invalid query parameter.
 */
block.get('/blocks/page-count', getPageCount);

/**
 * @swagger
 * /api/block/{id}:
 *   get:
 *     summary: Gets a block by ID
 *     description: Retrieves details of a block using its unique identifier.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the block.
 *     responses:
 *       200:
 *         description: Details of the block.
 *       404:
 *         description: Block not found.
 */
block.get('/block/:id', getBlock);

block.get('/block/:name/image', getBlockImage);

export default block;



