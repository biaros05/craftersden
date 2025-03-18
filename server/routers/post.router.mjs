import express from 'express';
import {
  saveBuild,
  uploadValidation,
  updatePostPicture,
  uploadImage,
  deleteBuild, 
  deleteImageFromAzure,
  publishBuild,
  getPublishedBuilds,
  unpublishBuild,
  toggleLikeBuild,
  toggleSaveBuild,
  getLikesSaves
} from '../controllers/post.controller.mjs';
import multer from 'multer';
import { body } from 'express-validator';
import path from 'path';
import { isAuthenticated } from '../utils/auth.mjs';

const upload = multer({

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

/**
 * @swagger
 * /api/post/save:
 *   post:
 *     summary: Save a new build with an image and block data
 *     tags: [Posts]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               png:
 *                 type: string
 *                 format: binary
 *                 description: PNG image of the build (JPG, JPEG, PNG allowed)
 *               blocks:
 *                 type: string
 *                 format: binary
 *                 description: Encoded block data file
 *               email:
 *                 type: string
 *                 description: Email of the user saving the build
 *     responses:
 *       200:
 *         description: Build successfully saved
 *       400:
 *         description: Invalid file format or request error
 *       422:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
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

postRouter.delete('/:buildId', isAuthenticated, deleteBuild, deleteImageFromAzure);

postRouter.post('/unpublish', isAuthenticated, unpublishBuild);

postRouter.post('/publish', isAuthenticated, upload.fields([
  { name: 'png', maxCount: 1 },
  { name: 'blocks', maxCount: 1 }
]),
publishBuild,
);

postRouter.post('/toggle-like', isAuthenticated, toggleLikeBuild);

postRouter.post('/toggle-save', isAuthenticated, toggleSaveBuild);

postRouter.get('/:buildId/likes-saves', isAuthenticated, getLikesSaves);

postRouter.get('/', getPublishedBuilds);

export default postRouter;