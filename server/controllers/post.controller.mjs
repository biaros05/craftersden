import Post from '../models/Post.js';
import User from '../models/User.mjs';
import dotenv from 'dotenv';
import { validationResult } from 'express-validator';
import { decode } from '@msgpack/msgpack';
import BlobServiceProvider from '../utils/BlobService.mjs';
import { TopologyDescription } from 'mongodb';

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
  console.log(req);
  const encoded = req.files['blocks'][0];
  const buffer = Buffer.from(encoded.buffer, encoded.byteOffset, encoded.byteLength);
  const blocks = decode(buffer);
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
 * This function takes a build id to update the build's isPublished field to true.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {*} next - Next
 * @returns 
 */
async function publishBuild(req, res, next) {
  try{
    if(!req.body.buildId){
      return res.status(404).json({ message: 'Build ID does not exist in DB'});
    }

    const updateData = { isPublished : true }
    if(req.body.description){
      updateData.description = req.body.description;
    }

    const publishedBuild = await Post.findOneAndUpdate(
      {_id: req.body.buildId},
      updateData,
      { returnDocument: 'after'}
    );

    if(!publishedBuild){
      return res.json(404).json({ message: 'Not able to publish build'});
    }

    return res.status(200).json({ message: 'Build published successfully!'});
  }catch(err){
    err.status = 500;
    next(err);
  }
}

// async function updatePostFields(req, res, next){
//   try{

//   }
// }

/**
 * This function deletes a build from DB given a buildID. 
 * @param {*} req - Request object 
 * @param {*} res - Respond object
 * @param {*} next - Next 
 * @returns {JSON} - JSON with status code
 */
async function deleteBuild(req, res, next) {
  try {
    if (!req.body.buildId || req.body.buildId == 'null' || req.body.buildId == undefined) {
      const error = new Error('Invalid build ID');
      error.status = 404;
      return next(error);
    }

    const deletedPost = await Post.findOneAndDelete({ _id: req.body.buildId });

    if (!deletedPost) {
      const error = new Error('Build not found');
      error.status = 404;
      return next(error);
    }

    res.status(200).json({ message: 'Build succesfully deleted' });
  } catch (err) {
    e.status(500);
    next(err);
  }
}

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

    res.status(200).json({ message: 'Build successfully saved!' });
    return;
  } catch (e) {
    e.status = 500;
    next(e);
  }
}

export { saveBuild, uploadValidation, uploadImage, updatePostPicture, publishBuild };