import express from 'express';
import 
{ 
  uploadImage,
  storeImageWithName,
  uploadValidation,
  getUsersSavedBuilds,
  getUserSavedPosts,
  getUser
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

/**
 * @swagger
 * /api/user/{email}/saved-posts:
 *   get:
 *     summary: Retrieve saved posts for a specific user
 *     description: Retrieves all posts saved by the user with the specified email.
 *     tags:
 *       - Users
 *     parameters:
 *       - name: email
 *         in: path
 *         required: true
 *         description: Email of the user to retrieve saved posts for.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved saved posts.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Saved builds retrieved!
 *                 savedBuilds:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 605c72f65a8f5a7b7c3c86a9
 *                       title:
 *                         type: string
 *                         example: "Amazing Wildlife Capture"
 *                       description:
 *                         type: string
 *                         example: "A rare sighting of a wild fox."
 *                       imageUrl:
 *                         type: string
 *                         example: "https://example.com/image.jpg"
 *                       username:
 *                         type: string
 *                         example: "john_doe"
 *       401:
 *         description: Unauthorized - User is not authenticated.
 *       404:
 *         description: User does not exist.
 *       500:
 *         description: Internal server error.
 */
userRouter.get('/:email/saved-posts', isAuthenticated, upload.none(), getUserSavedPosts);

userRouter.get('/:id', isAuthenticated, upload.none(), getUser);

export default userRouter;