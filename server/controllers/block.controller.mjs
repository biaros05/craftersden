import Block from '../models/Block.js';

export async function getBlocks(req, res, next) {
  try {
    const { page = 1, limit = 50 } = req.query;

    if (isNaN(page) || isNaN(limit)) {
      return res.status(400).json({ error: 'Page and limit must be numbers'});
    }

    // const blocks = await Block.find()
    //   .limit(limit)
    //   .skip((page - 1) * limit)


    const blocks = await Block.find({})
    
    return res.status(200).json({
      blocks: blocks,
      currentPage: page
    })
  } catch (error) {
    next(error);
  }
}