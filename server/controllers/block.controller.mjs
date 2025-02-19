import Block from '../models/Block.js';

export async function getBlocks(req, res, next) {
  try {
    const { page = 1, limit = 50 } = req.query;

    if (isNaN(page) || isNaN(limit)) {
      return res.status(400).json({ error: 'page and limit parameters must be numbers'});
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