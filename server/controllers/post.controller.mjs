import Post from '../models/Post.js';
import User from '../models/User.mjs';
import dotenv from 'dotenv';
import { validationResult } from 'express-validator';
import {decode} from '@msgpack/msgpack';
import BlobServiceProvider from '../utils/BlobService.mjs';

dotenv.config();

const blobService = new BlobServiceProvider();

/**
 * Calls validationResult method to ensure all validation has passed. Throws an error 
 * on account of any failed validation.
 */
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
    const error = new Error();
    error.status = 422;
    error.message = { errors: errors.array() };
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
  const blocks = decode(buffer);
  const email = req.body.email;
  try {
    if (req.body.buildId !== 'null' && req.body.buildId !== undefined) {
      req.post = await Post.findOneAndUpdate(
        {_id: req.body.buildId}, 
        {buildJSON: blocks},
        {returnDocument: 'after'}
      );

    } else {
      const user = await User.findOne({email: email});
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
  } catch (e){
    e.status = 500;
    next(e);
  }
}

// /**
//  * This function deletes a build from DB given a buildID. 
//  * @param {*} req - Request object 
//  * @param {*} res - Respond object
//  * @param {*} next - Next 
//  * @returns {JSON} - JSON with status code
//  */
// async function deleteBuild(req, res, next){
//   try{
//     if(!req.body.buildId || req.body.buildId == 'null' || req.body.buildId == undefined){
//       const error = new Error('Invalid build ID');
//       error.status = 404;
//       return next(error);
//     }

//     await Post.findOneAndDelete({_id : req.body.buildId});

//     req.status(200).json({ message: 'Build succesfully deleted'});
//   }catch(err){
//     e.status(500);
//     next(err);
//   }
// }

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
  } catch (e){
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
    await Post.findOneAndUpdate({_id: req.post._id},
      {progressPicture: req.url}
    );

    res.status(200).json({message : 'Build successfully saved!'});
    return;
  } catch (e){
    e.status = 500;
    next(e);
  }
}

export {saveBuild, uploadValidation, uploadImage, updatePostPicture};