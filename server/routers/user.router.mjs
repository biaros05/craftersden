import express from 'express';
import 
{ 
  uploadImage,
  storeImageWithName,
  uploadValidation,
  getUsersSavedBuilds
} from '../controllers/user.controller.mjs';
import { body } from 'express-validator';
import multer from 'multer';
import path from 'path';

const upload = multer({
  limits: {
    fileSize: 1024 * 1024
  }
});

const userRouter = express.Router();

const userUpdateValidation = [
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
  body('username', 'Username is required').notEmpty(),
  body('username', 'Username must be a string').isString(),
];

userRouter.put('/', 
  upload.single('avatar'), userUpdateValidation, uploadValidation, uploadImage, storeImageWithName);

userRouter.get('/builds', 
  upload.none(), getUsersSavedBuilds);

export default userRouter;