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
    const { page = 1, limit = 50, search = ''} = req.query;

    if (isNaN(page) || isNaN(limit)) {
      return res.status(400).json({ message: 'page and limit parameters must be numbers'});
    }

    const totalPages = Math.ceil(await Block.countDocuments() / limit);
    if (page > totalPages) {
      return res.status(404).json({ message: 'Page not found' });
    }

    const pipeline = [];

    if (search) {
      pipeline.push(...constructSearchPipeline(search));
    } else {
      pipeline.push({ $match: {} });
    }
    
    pipeline.push(
      {
        $project: {
          _id: 0,
          name: 1,
          inventoryTexture: 1,
        }
      },
      { $limit: limit },
      { $skip: (page - 1) * limit },
      { $sort: { name: 1} },
    );

    const blocks = await Block.aggregate(pipeline);

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
 * Returns a search pipeline for the given search value.
 * @param {string} searchValue - Search value
 * @returns {object} - object containing the search pipeline
 */
function constructSearchPipeline(searchValue) {
  return [
    {
      $search: {
        autocomplete: {
          query: searchValue, 
          path: 'name', 
          tokenOrder: 'any', 
        },
        index: 'block-name'
      }
    },
  ];
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