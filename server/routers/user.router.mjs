import express from 'express';
import 
{ 
  uploadImage,
  storeImageWithName,
  uploadValidation,
  getUsersSavedBuilds,
  getUserSavedPosts
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


/**
 * @swagger
 * /api/user/:
 *   put:
 *     summary: Update user profile with avatar upload
 *     tags: [Users]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: User's avatar image (JPG, JPEG, PNG)
 *               username:
 *                 type: string
 *                 description: New username
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *       400:
 *         description: Invalid file format or request error
 *       422:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
userRouter.put('/', isAuthenticated,
  upload.single('avatar'), userUpdateValidation, uploadValidation, uploadImage, storeImageWithName);

/**
 * @swagger
 * /api/user/{email}/builds:
 *   get:
 *     summary: Get user's saved builds
 *     tags: [Users]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: User's email
 *     responses:
 *       200:
 *         description: List of saved builds
 *       404:
 *         description: User not found
 */
userRouter.get('/:email/builds', isAuthenticated,
  upload.none(), getUsersSavedBuilds);

userRouter.get('/:email/saved-posts', isAuthenticated, upload.none(), getUserSavedPosts);

export default userRouter;