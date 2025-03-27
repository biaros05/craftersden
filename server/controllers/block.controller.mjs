import Block from '../models/Block.js';

/**
 * Gets a list of blocks. Default is page 1 and limit of 50.
 * @param {object} req - Request
 * @param {number} [req.query.page] - Page number
 * @param {number} [req.query.limit] - Number of items per page
 * @param {object} res - Response
 * @param {Function} next - Next
 * @returns {void}
 */
async function getBlocks(req, res, next) {
  try {
    const { page = 1, limit = 50, search } = req.query;

    if (search) {
      return searchBlocks(req, res, next);
    }

    if (isNaN(page) || isNaN(limit)) {
      return res.status(400).json({ message: 'page and limit parameters must be numbers'});
    }

    const totalPages = Math.ceil(await Block.countDocuments() / limit);
    if (page > totalPages) {
      return res.status(404).json({ message: 'Page not found' });
    }
    
    if (!req.query.page && !req.query.limit) {
      const blocks = await Block.find({}, 'name inventoryTexture').sort({ name: 1 });
      return res.status(200).json({
        blocks: blocks,
        totalBlocks: blocks.length
      });
    }

    const blocks = await Block.find({}, 'name inventoryTexture').
      sort({ name: 1 }).
      limit(limit).
      skip((page - 1) * limit);

    return res.status(200).json({
      blocks: blocks,
      currentPage: page,
      totalPages: totalPages
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Searches for blocks by name using an autocomplete search.
 * 
 * @param {object} req - Request
 * @param {string} req.query.search - Search term
 * @param {object} res - Response
 * @param {Function} next - Next
 * @returns {void} - Response object with the list of blocks
 */
async function searchBlocks(req, res, next) {
  try {
    const { search } = req.query;

    const blocks = await Block.aggregate([
      {
        $search: {
          autocomplete: {
            query: search, 
            path: 'name', 
            tokenOrder: 'any', 
          },
          index: 'block-name'
        }
      },
      {
        $project: {
          _id: 0,
          name: 1,
          inventoryTexture: 1,
        }
      },
    ]);

    return res.status(200).json(blocks);
  } catch (error) {
    next(error);
  }
}

/**
 * Gets the total number of pages. Default is 50 items per page.
 * @param {object} req - Request
 * @param {number} [req.query.limit] - Number of items per page
 * @param {object} res - Response
 * @param {Function} next - Next
 * @returns {void}
 */
async function getPageCount(req, res, next) {
  try {
    const { limit = 50 } = req.query;
    const totalPages = Math.ceil(await Block.countDocuments() / limit);
    return res.status(200).json({ totalPages });
  } catch (error) {
    next(error);
  }
}

/**
 * Gets a block by its id.
 * @param {object} req - Request
 * @param {string} req.params.id - Block id
 * @param {object} res - Response
 * @param {Function} next - Next
 * @returns {void}
 */
async function getBlock(req, res, next) {
  try {
    const { id } = req.params;
    const block = await Block.findById(id);
    if (!block) {
      return res.status(404).json({ message: 'Block not found' });
    }
    return res.status(200).json(block);
  } catch (error) {
    next(error);
  }
}

export { getBlocks, getBlock, getPageCount };