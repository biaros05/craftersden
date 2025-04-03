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
  getLikesSaves,
  postSearch
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

/**
 * @swagger
 * /api/posts/{buildId}:
 *   delete:
 *     summary: Delete a build post
 *     description: Deletes a specific build post along with its associated images from Azure.
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: buildId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the build to delete.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully deleted the build post.
 *       404:
 *         description: Build post not found.
 *       500:
 *         description: Internal server error.
 */
postRouter.delete('/:buildId', isAuthenticated, deleteBuild, deleteImageFromAzure);

/** 
 * @swagger
 * /api/posts/unpublish:
 *   post:
 *     summary: Unpublish a build post
 *     description: Moves a published build post back to an unpublished state.
 *     tags:
 *       - Posts
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully unpublished the build post.
 *       404:
 *         description: Build post not found.
 *       500:
 *         description: Internal server error.
 */
postRouter.post('/unpublish', isAuthenticated, unpublishBuild);

/**
 * /api/posts/publish:
 * @swagger
 *   post:
 *     summary: Publish a build post
 *     description: Publishes a build post with associated images.
 *     tags:
 *       - Posts
 *     security:
 *       - BearerAuth: []
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
 *                 description: The main image of the post.
 *               blocks:
 *                 type: string
 *                 format: binary
 *                 description: Additional block image file.
 *     responses:
 *       200:
 *         description: Successfully published the post.
 *       400:
 *         description: Invalid file format or missing fields.
 *       500:
 *         description: Internal server error.
 */
postRouter.post('/publish', isAuthenticated, upload.fields([
  { name: 'png', maxCount: 1 },
  { name: 'blocks', maxCount: 1 }
]),
publishBuild,
);

/**
 * @swagger
 * /api/posts/toggle-like:
 *   post:
 *     summary: Toggle like on a post
 *     description: Likes or unlikes a post depending on the user's current like status.
 *     tags:
 *       - Posts
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Like toggled successfully.
 *       404:
 *         description: Post not found.
 *       500:
 *         description: Internal server error.
 */
postRouter.post('/toggle-like', isAuthenticated, toggleLikeBuild);

/**
 * @swagger
 * /api/posts/toggle-save:
 *   post:
 *     summary: Toggle save on a post
 *     description: Saves or unsaves a post depending on the user's current save status.
 *     tags:
 *       - Posts
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Save toggled successfully.
 *       404:
 *         description: Post not found.
 *       500:
 *         description: Internal server error.
 */
postRouter.post('/toggle-save', isAuthenticated, toggleSaveBuild);

/**
 * @swagger
 * /api/posts/{buildId}/likes-saves:
 *   get:
 *     summary: Get likes and saves count for a post
 *     description: Retrieves the total number of likes and saves for a given post.
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: buildId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the build to retrieve stats for.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved likes and saves count.
 *       404:
 *         description: Post not found.
 *       500:
 *         description: Internal server error.
 */
postRouter.get('/:buildId/likes-saves', isAuthenticated, getLikesSaves);

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get all published builds
 *     description: Retrieves a list of all published build posts.
 *     tags:
 *       - Posts
 *     responses:
 *       200:
 *         description: Successfully retrieved published builds.
 *       500:
 *         description: Internal server error.
 */
postRouter.get('/', getPublishedBuilds);

/**
 * @swagger
 * /posts/search:
 *   get:
 *     summary: Search for build posts
 *     description: Searches for build posts based on query parameters.
 *     tags:
 *       - Posts
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: The search term to filter posts.
 *     responses:
 *       200:
 *         description: Successfully retrieved search results.
 *       400:
 *         description: Invalid query parameter.
 *       500:
 *         description: Internal server error.
 */
postRouter.get('/search', isAuthenticated, postSearch);

export default postRouter;