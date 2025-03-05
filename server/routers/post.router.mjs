import express from 'express';
import { 
  saveBuild,
  uploadValidation,
  updatePostPicture,
  uploadImage
} from '../controllers/post.controller.mjs';
import multer from 'multer';
import { body } from 'express-validator';
import path from 'path';
import { isAuthenticated } from '../utils/auth.mjs';

const upload = multer({
  limits: {
    fileSize: 1024 * 1024
  }
});


const imageFormValidation = [
  body().custom((_, { req }) => {
    if (!req.files['png'] || !req.files['blocks']) {
      throw new Error('File is required');
    }

    const extension = path.extname(req.files['png'][0].originalname).toLowerCase();
    if (!['.jpg', '.jpeg', '.png'].includes(extension)) {
      throw new Error('Invalid file format. Only JPG, JPEG, and PNG are allowed.');
    }

    return true;
  }),
  body('email', 'Email is required').notEmpty(),
  body('email', 'Email must be a string').isString(),
];

const postRouter = express.Router();

postRouter.post('/save', isAuthenticated, upload.fields([
  { name: 'png', maxCount: 1 },
  { name: 'blocks', maxCount: 1 }
]),
imageFormValidation, 
uploadValidation, 
saveBuild, 
uploadImage,
updatePostPicture
);

export default postRouter;