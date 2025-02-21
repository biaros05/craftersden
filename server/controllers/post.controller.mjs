import Post from '../models/Post.js';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Extracts parameters from request body and saves the build in the user's profile as 
 * a non-published post
 * @param {*} req -
 * @param {*} res -
 * @param {*} next -
 * @returns {JSON} - JSON with status code
 */
async function saveBuild(req, res, next) {
  try {
    const build = req.body.build;
    const email = req.body.email;
    const user = await User.findOne({email: email});
    const post = new Post({
      buildJSON: build, 
      user: user._id, 
      description: '',
      thumbnails: [],
      isPublished: false
    });

    await post.save();

    res.status(200).json({status : 'success'});
    return;
  } catch (e){
    e.status = 500;
    next(e);
  }
}

export {saveBuild};