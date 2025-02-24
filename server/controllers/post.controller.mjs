import Post from '../models/Post.js';
import User from '../models/User.mjs';
import dotenv from 'dotenv';
import { validationResult } from 'express-validator';
import { BlobServiceClient} from '@azure/storage-blob';

dotenv.config();

const sasToken = process.env.AZURE_SAS;
const containerName = process.env.AZURE_BLOB_CONTAINER || 'imageblob';
const storageAccountName = process.env.AZURE_STORAGE_ACCOUNT || 'nameofyourstorageaccount';
const blobPublicUrl = `https://${storageAccountName}.blob.core.windows.net/${containerName}/`;

const blobService = new BlobServiceClient(
  `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`
);
const containerClient = blobService.getContainerClient(containerName);

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
  const build = JSON.parse(req.body.build);
  const email = req.body.email;
  try {
    if (req.body.buildId !== 'null' && req.body.buildId !== undefined) {
      req.post = await Post.findOneAndUpdate(
        {_id: req.body.buildId}, 
        {buildJSON: build},
        {returnDocument: 'after'}
      );

    } else {
      const user = await User.findOne({email: email});
      const post = new Post({
        buildJSON: build, 
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

/**
 * Obtains the file content and stores it in azure blob.
 * Passes the returned azure blob URL to next middleware for processing.
 * @param {*} req -
 * @param {*} res -
 * @param {*} next -
 */
async function uploadImage(req, res, next) {
  // set as single file upload in router
  const file = req.file; 
  //moves the file to the current folder
  const blobName = `${req.post._id}.png`;

  try {
    const blobClient = containerClient.getBlockBlobClient(blobName);
    // set mimetype as determined from browser with file upload control
    const options = { blobHTTPHeaders: { blobContentType: file.mimetype }, overwrite: true };
    await blobClient.uploadData(file.buffer, options);
    const fullUrl = blobPublicUrl + blobName;
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

    res.status(200).json({status : 'success'});
    return;
  } catch (e){
    e.status = 500;
    next(e);
  }
}

export {saveBuild, uploadValidation, uploadImage, updatePostPicture};