import Block from '../models/Block.js';

/**
 * Gets a list of blocks. Default is page 1 and limit of 50.
 * @param {object} req - Request
 * @param {number} [req.query.page] - Page number
 * @param {number} [req.query.limit] - Number of items per page
 * @param {object} res - Response
 * @param {function} next - Next
 * @returns {void}
 */
export async function getBlocks(req, res, next) {
  try {
    const { page = 1, limit = 50 } = req.query;

    if (isNaN(page) || isNaN(limit)) {
      return res.status(400).json({ message: 'page and limit parameters must be numbers'});
    }

    const blocks = await Block.find({}, 'name inventoryTexture')
      .sort({ name: 1 })
      .limit(limit)
      .skip((page - 1) * limit)

    return res.status(200).json({
      blocks: blocks,
      currentPage: page
    })
  } catch (error) {
    next(error);
  }
}

/**
 * Gets a block by its id.
 * @param {object} req - Request
 * @param {string} req.params.id - Block id
 * @param {object} res - Response
 * @param {function} next - Next
 * @returns {void}
 */
export async function getBlock(req, res, next) {
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
