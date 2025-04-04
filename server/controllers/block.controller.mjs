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

    if (page < 1 || limit < 1) {
      return res.status(400).json({ message: 'page and limit parameters must be greater than 0'});
    }

    const pipeline = [];

    if (search) {
      pipeline.push(...constructSearchPipeline(search));
    }

    const totalPages = await getTotalPages(limit, search);
    
    if (page > totalPages) {
      return res.status(404).json({ message: 'Page not found' });
    }

    pipeline.push(
      { $sort: { name: 1} },
      { $skip: (page - 1) * limit },
      { $limit: parseInt(limit) },
    );

    pipeline.push(
      {
        $project: {
          _id: 1,
          name: 1,
          inventoryTexture: 1,
        }
      },
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
    const totalPages = await getTotalPages(req.query.limit || 50);
    return res.status(200).json({ totalPages });
  } catch (error) {
    next(error);
  }
}

/**
 * Calculates the total number of pages based on the given limit 
 * and an optional aggregation pipeline
 * @async
 * @function getTotalPages
 * @param {number} limit - The maximum number of items per page
 * @param {string} [search] - An optional MongoDB aggregation pipeline
 * @returns {Promise<number>} The total number of pages.
 */
async function getTotalPages(limit, search) {
  if (search) {
    const count = await Block.countDocuments({name : {$regex: search, $options: 'i'}});
    return Math.ceil(count / limit);
  } else {
    const count = await Block.countDocuments();
    return Math.ceil(count / limit);
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
    const { name } = req.query;

    // If name is passed then use id as name filter
    const block = name ? await Block.findOne({name: id}) : await Block.findById(id);
    if (!block) {
      return res.status(404).json({ message: 'Block not found' });
    }
    return res.status(200).json(block);
  } catch (error) {
    next(error);
  }
}

/**
 * Gets a block image by its name.
 * @param {object} req - Request
 * @param {string} req.params.name - Block name
 * @param {object} res - Response
 * @param {Function} next - Next
 * @returns {void}
 */
async function getBlockImage(req, res, next) {
  try {
    const { name } = req.params;

    // If name is passed then use id as name filter
    const block = await Block.findOne({name: name}, {inventoryTexture: 1, name: 1});
    if (!block) {
      return res.status(404).json({ message: 'Block not found' });
    }
    return res.status(200).json(block);
  } catch (error) {
    next(error);
  }
}

export { getBlocks, getBlock, getBlockImage, getPageCount };