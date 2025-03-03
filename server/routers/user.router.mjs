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
import { isAuthenticated } from '../utils/auth.mjs';

const upload = multer({
  limits: {
    fileSize: 1024 * 1024
  }
});

const userRouter = express.Router();

const userUpdateValidation = [
  body().custom((_, { req }) => {
    if (!req.file) {
      return true;
    }

    const extension = path.extname(req.file.originalname).toLowerCase();
    if (!['.jpg', '.jpeg', '.png'].includes(extension)) {
      throw new Error('Invalid file format. Only JPG, JPEG, and PNG are allowed.');
    }

    return true;
  }),
  body('username', 'Username must be a string').optional().isString(),
];

userRouter.put('/', isAuthenticated,
  upload.single('avatar'), userUpdateValidation, uploadValidation, uploadImage, storeImageWithName);

userRouter.get('/:email/builds', isAuthenticated,
  upload.none(), getUsersSavedBuilds);

export default userRouter;