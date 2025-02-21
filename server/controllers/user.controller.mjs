import User from '../models/User.mjs';
import { BlobServiceClient} from '@azure/storage-blob';
import { validationResult } from 'express-validator';
import dotenv from 'dotenv';

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
  // set as single file upload in router
  const file = req.file; 
  //moves the file to the current folder
  const blobName = file.originalname;

  try {
    const blobClient = containerClient.getBlockBlobClient(blobName);
    // set mimetype as determined from browser with file upload control
    const options = { blobHTTPHeaders: { blobContentType: file.mimetype } };
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
      {username: String(req.body.username), avatar: req.url, customized: true}, 
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
