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

const upload = multer({
  limits: {
    fileSize: 1024 * 1024
  }
});


const imageFormValidation = [
  body().custom((_, { req }) => {
    if (!req.file) {
      throw new Error('File is required');
    }

    const extension = path.extname(req.file.originalname).toLowerCase();
    if (!['.jpg', '.jpeg', '.png'].includes(extension)) {
      throw new Error('Invalid file format. Only JPG, JPEG, and PNG are allowed.');
    }

    return true;
  }),
  body('email', 'Email is required').notEmpty(),
  body('email', 'Email must be a string').isString(),
];

const postRouter = express.Router();

postRouter.post('/save', upload.single('file'), 
  imageFormValidation, 
  uploadValidation, 
  saveBuild, 
  uploadImage,
  updatePostPicture
);

export default postRouter;