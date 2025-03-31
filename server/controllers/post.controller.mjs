import Post from '../models/Post.mjs';
import User from '../models/User.mjs';
import dotenv from 'dotenv';
import { validationResult } from 'express-validator';
import { decode } from '@msgpack/msgpack';
import BlobServiceProvider from '../utils/BlobService.mjs';

dotenv.config();

const blobService = new BlobServiceProvider();

/**
 * Calls validationResult method to ensure all validation has passed. Throws an error 
 * on account of any failed validation.
 * @param {*} req -  
 * @param {*} res -
 * @param {*} next -
 */
function uploadValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(JSON.stringify({ errors: errors.array() }));
    error.status = 422;
    next(error);

  }
  next();
}

/**
 * Extracts parameters from request body and saves the build in the user's profile as 
 * a non-published post
 * @param {*} req -
 * @param {*} res -
 * @param {*} next -
 * @returns {JSON} - JSON with status code
 */
async function saveBuild(req, res, next) {
  const encoded = req.files['blocks'][0];
  const buffer = Buffer.from(encoded.buffer, encoded.byteOffset, encoded.byteLength);
  const blocks = JSON.parse(decode(buffer));
  const email = req.body.email;
  try {
    if (req.body.buildId !== 'null' && req.body.buildId !== undefined) {
      req.post = await Post.findOneAndUpdate(
        { _id: req.body.buildId },
        { buildJSON: blocks },
        { returnDocument: 'after' }
      );

    } else {
      const user = await User.findOne({ email: email });
      const post = new Post({
        buildJSON: blocks,
        user: user._id,
        description: '',
        thumbnails: [],
        isPublished: false,
        progressPicture: ''
      });

      await post.save();

      req.post = post;
    }
    next();
  } catch (e) {
    e.status = 500;
    next(e);
  }
}

/**
 * This function deletes a build from DB given a buildID. 
 * @param {*} req - Request object 
 * @param {*} res - Respond object
 * @param {*} next - Next 
 * @returns {JSON} - JSON with status code
 */
async function deleteBuild(req, res, next) {
  const buildId = req.params.buildId;
  try {

    const deletedPost = await Post.findByIdAndDelete(
      buildId
    );

    if (!deletedPost) {
      const error = new Error('This post does not exist');
      error.status = 404;
      return next(error);
    }

    req.url = deletedPost.progressPicture;
    next();

  } catch (err) {
    err.status = 500;
    next(err);
  }
}

/**
 * This function takes a build id to update the build's isPublished field to true. 
 * Updates description if there is one.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {*} next - Next
 * @returns {Response} - The response object
 */
async function publishBuild(req, res, next) {
  try {
    if (!req.body.buildId) {
      return res.status(404).json({ message: 'Invalid build ID' });
    }

    const updateData = { isPublished: true };
    if (req.body.description) {
      updateData.description = req.body.description;
    }

    const tags = JSON.parse(req.body.tags || []);
    updateData.tags = tags;

    const publishedBuild = await Post.findOneAndUpdate(
      { _id: req.body.buildId },
      updateData,
      { returnDocument: 'after' }
    );

    if (!publishedBuild) {
      return res.json(404).json({ message: 'Not able to publish build' });
    }

    return res.status(200).json({ message: 'Build published successfully!' });
  } catch (err) {
    err.status = 500;
    next(err);
  }
}

/**
 * Takes the progressPicture from recently deleted post and removes it from azure
 * @param {*} req -
 * @param {*} res -
 * @param {*} next -
 * @returns {JSON} - status of the request
 */
async function deleteImageFromAzure(req, res, next) {
  try {
    const splitLink = req.url.split('/');
    const blobName = splitLink[splitLink.length - 1];
    await blobService.deleteFile(blobName);
    return res.status(204).send();
  } catch (err) {
    err.status = 500;
    next(err);
  }
}

/**
 * This function unpublishes a build using the buildId
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {*} next - Next
 * @returns {Response} - The response object
 */
async function unpublishBuild(req, res, next) {
  try {
    if (!req.body.buildId) {
      return res.status(404).json({ message: 'Invalid build ID' });
    }

    const unpublishedBuild = await Post.findOneAndUpdate(
      { _id: req.body.buildId },
      { isPublished: false },
      { returnDocument: 'after' },
      { tags: []}
    );

    if (!unpublishedBuild) {
      return res.status(404).json({ message: 'Unable to unpublish post' });
    }

    return res.status(200).json({ message: 'Build unpublished successfully!' });

  } catch (err) {
    err.status = 500;
    next(err);
  }
}

/**
 * This function gets all the published builds and returns them.
 * If there are no published builds, then it returns a 100 with a neutral message.
 * @param {object} req  - The request object.
 * @param {object} res - The respond object.
 * @param {*} next - Next
 * @returns {Response} - The response of the function.
 */
async function getPublishedBuilds(req, res, next) {
  try {
    const { page = 1, limit = 50, username, description } = req.query;
    
    if (isNaN(page) || isNaN(limit)) {
      return res.status(400).json({ message: 'page and limit parameters must be numbers'});
    }
    
    const totalPages = Math.ceil(await Post.countDocuments({isPublished: true}) / limit);

    if (page > totalPages) {
      return res.status(404).json({ message: 'Page not found' });
    }

    let publishedBuilds = [];

    if(username){
      const user = await User.findOne({ username: username});
      if(!user){
        const err = new Error('Cannot find user in database');
        err.status = 404;
        next(err);
      }
      publishedBuilds = await Post.find(
        { isPublished: true,
          user: user._id}
      ).
        sort({_id: 1}).
        limit(limit).
        skip((page - 1) * limit);
      
      if(publishedBuilds.length === 0){
        return res.status(200).json({
          message: 'No builds from this user!',
          total: totalPages,
        });
      }

    } else if(description){
      publishedBuilds = await Post.find({
        description: { $regex: description, $options: 'i'},
        isPublished: true
      }).
        sort({_id: 1}).
        limit(limit).
        skip((page - 1) * limit);   
        
    } else{
      publishedBuilds = await Post.find({ isPublished: true }).
        sort({_id: 1}).
        limit(limit).
        skip((page - 1) * limit);
    }

    if (publishedBuilds.length === 0) {
      return res.status(100).json({ message: 'There are no published builds at this moment.' });
    };

    const publishBuildsWithUsername = await Promise.all(
      publishedBuilds.map(async (build) => {
        const user = await User.findOne(
          { _id: build.user }).
          select({ username: 1, avatar: 1, _id: 0 });
        return {
          ...build.toObject(),
          username: user ? user.username : 'Unknown',
          avatar: user.avatar
        };
      })
    );

    return res.status(200).json({
      message: 'Published builds fetched!',
      builds: publishBuildsWithUsername,
      total: totalPages,
    });

  } catch (err) {
    err.status = 500;
    next(err);
  }
};

/**
 * Obtains the file content and stores it in azure blob.
 * Passes the returned azure blob URL to next middleware for processing.
 * @param {*} req -
 * @param {*} res -
 * @param {*} next -
 */
async function uploadImage(req, res, next) {
  // set as single file upload in router
  const file = req.files['png'][0];
  //moves the file to the current folder
  const blobName = `${req.post._id}.png`;

  try {
    const fullUrl = await blobService.overrideFile(file, blobName);
    req.url = fullUrl;
    next();
  } catch (e) {
    e.status = 500;
    next(e);
  }
}

/**
 * Updates the Post's progressPicture in mongo for retrieval
 * @param {*} req -
 * @param {*} res -
 * @param {*} next -
 * @returns {JSON} - JSON response with status code
 */
async function updatePostPicture(req, res, next) {
  try {
    await Post.findOneAndUpdate({ _id: req.post._id },
      { progressPicture: req.url }
    );

    res.status(200).json({ message: 'Build successfully saved!', id: req.post._id });
    return;
  } catch (e) {
    e.status = 500;
    next(e);
  }
}

/**
 * This function toggles the likes on a post using the uesr id, buildId, and the isLiked condition
 * @param {object} req  - The request object.
 * @param {object} res - The respond object.
 * @param {*} next - Next
 * @returns {Response} - The response of the function.
 */
async function toggleLikeBuild(req, res, next) {
  try {
    const user = await User.findOne({ _id: req.body.id });

    if (!user) {
      const error = new Error('User does not exist in database.');
      error.status = 404;
      next(error);
    }

    const post = await Post.findOne({ _id: req.body.buildId });

    if (!post) {
      const error = new Error('Post does not exist in the database');
      error.status = 404;
      next(error);
    }

    const updateUserLiked = req.body.isLiked
      ? { $addToSet: { liked: req.body.buildId } }
      : { $pull: { liked: req.body.buildId } };

    const updatePostLikes = req.body.isLiked
      ? { $addToSet: { likedBy: req.body.id } }
      : { $pull: { likedBy: req.body.id } };

    await User.findOneAndUpdate(
      { _id: req.body.id },
      updateUserLiked
    );

    await Post.findOneAndUpdate(
      { _id: req.body.buildId },
      updatePostLikes
    );
    //Ternary operator to decide on message to be returned.
    const message = req.body.isLiked ? 'Liked post' : 'Unliked post';
    return res.status(200).json({ message: message });

  } catch (e) {
    e.status = 500;
    next(e);
  }
};

/**
 * This function toggles the saving of a post using the user id, build id,
 * and the isSaved condition 
 * passed in via the request body.
 * @param {object} req  - The request object.
 * @param {object} res - The respond object.
 * @param {*} next - Next
 * @returns {Response} - The response of the function.
 */
async function toggleSaveBuild(req, res, next) {
  try {
    const user = User.findOne({ _id: req.body.user_id });

    if (!user) {
      const error = new Error('User does not exist in database.');
      error.status = 404;
      next(error);
    }

    const post = Post.findOne({ _id: req.body.buildId });

    if (!post) {
      const error = new Error('Post does not exist in the database');
      error.status = 404;
      next(error);
    }

    const updateUserSaved = req.body.isSaved
      ? { $addToSet: { saved: req.body.buildId } }
      : { $pull: { saved: req.body.buildId } };

    const updatePostSaves = req.body.isSaved
      ? { $addToSet: { savedBy: req.body.id } }
      : { $pull: { savedBy: req.body.id } };

    await User.findOneAndUpdate(
      { _id: req.body.id },
      updateUserSaved
    );

    await Post.findOneAndUpdate(
      { _id: req.body.buildId },
      updatePostSaves
    );

    const message = req.body.isSaved ? 'Saved successfully!' : 'Unsaved successfully!';
    return res.status(200).json({ message: message });

  } catch (e) {
    e.status = 500;
    next(e);
  }
}

/**
 * This function returns the likedBy and savedBy of the post.
 * @param {object} req  - The request object.
 * @param {object} res - The respond object.
 * @param {*} next - Next
 * @returns {Response} - The response of the function.
 */
async function getLikesSaves(req, res, next) {
  try {
    const post = await Post.findOne({ _id: req.params.buildId }).
      select({ likedBy: 1, savedBy: 1, _id: 0 });

    if (!post) {
      const error = new Error('Cannot find post in the database');
      error.status = 404;
      next(error);
    }

    return res.status(200).json({
      message: 'Likes and saves retrieved successfully',
      likedBy: post.likedBy,
      savedBy: post.savedBy
    });
  } catch (error) {
    error.status = 500;
    next(error);
  }
};

/**
 * Handles user's query search in forum search, posts descriptions and usernames.
 * @param {object} req  - The request object.
 * @param {object} res - The respond object.
 * @param {*} next - Next
 * @returns {Response} - The response of the function.
 */
async function postSearch(req, res, next){
  try{
    const { query } = req.query;

    const descriptions = await Post.find({
      description: { $regex: query, $options: 'i'}
    }).select({description: 1, _id: 0});

    const users = await User.find({
      username: { $regex: query, $options: 'i'}}).
      select({username: 1, avatar: 1, _id: 1});

    return res.status(200).json({
      message: 'Search results fetched', 
      descriptions: descriptions, 
      users: users});

  } catch(err){
    err.status = 500;
    next(err);
  }
};

/**
 *Gets post by id 
 * @param {object} req  - The request object.
 * @param {object} res - The respond object.
 * @param {*} next - Next
 * @returns {Response}- Response object with status code and message.
 */
async function getPost(req, res, next){
  try{ 

    if(!req.params.id){
      return res.status(403).json({message: 'Build Id required'});
    }

    const post = await Post.findOne({_id: req.params.id});
    if(!post){
      const err = new Error('Cannot find post in database');
      err.status = 404;
      return next(err);
    };

    const username = await User.findOne({_id: post.user}).select({username: 1, _id: 0});

    const postWithUsername = {
      ...post.toObject(),
      username: username.username
    };

    return res.status(200).json({message: 'Post retrieved', post: postWithUsername});
  } catch(err){
    err.status = 500;
    next(err);
  }
}

export {
  saveBuild,
  uploadValidation,
  uploadImage,
  updatePostPicture,
  deleteBuild,
  deleteImageFromAzure,
  publishBuild,
  getPublishedBuilds,
  unpublishBuild,
  toggleLikeBuild,
  toggleSaveBuild,
  getLikesSaves,
  postSearch,
  getPost
};
