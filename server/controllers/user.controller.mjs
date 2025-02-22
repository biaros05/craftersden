import User from '../models/User.mjs';
import BlobServiceProvider from '../utils/BlobService.mjs';
import { validationResult } from 'express-validator';

const blobService = new BlobServiceProvider();

/**
 * Checks that the request contains all required data.
 * @param {Request} req - Request
 * @param {Response} res - Response
 * @param {Function} next - Next
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
 * Uploads image to Azure Blobstorage
 * @param {Request} req - Request
 * @param {Response} res - Response
 * @param {Function} next - Next
 */
async function uploadImage(req, res, next) {
  try {
    req.blobUrl = await blobService.saveFile(req.file);
    next();
  } catch (e){
    e.status = 500;
    next(e);
  }
}

/**
 * Adds image to the user
 * @param {Request} req - Request
 * @param {Response} res - Response
 * @param {Function} next - Next
 * @returns {void}
 */
async function storeImageWithName(req, res, next) {
  try {
    const user = await User.findOneAndUpdate(
      {email: req.session.user.email}, 
      {username: String(req.body.username), avatar: req.blobUrl, customized: true}, 
      {returnDocument: 'after'}
    );
    req.session.user = user;
    res.status(200).json({status : 'success'});
    return;
  } catch (e){
    e.status = 500;
    next(e);
  }
}

export {uploadImage, storeImageWithName, uploadValidation};
