import express from 'express';
import { isAuthenticated } from '../utils/auth.mjs';
import { authenticateUser, logoutUser, queryUser } from '../controllers/auth.controller.mjs';

const auth = express.Router();

/**
 * @swagger
 * /auth:
 *   post:
 *     summary: Authenticates a user using Google's OAuth.
 *     description: Authenticates the user by verifying the OAuth token and creating a session.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: The OAuth token from Google.
 *     responses:
 *       200:
 *         description: Authentication successful. Returns user details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   description: The authenticated user details.
 *       400:
 *         description: Bad request, token missing.
 *       500:
 *         description: Server error, session creation failed.
 */
auth.post('/auth', authenticateUser);

/**
 * @swagger
 * /query:
 *   get:
 *     summary: Retrieves the authenticated user's details.
 *     description: Returns the currently logged-in user's session data.
 *     tags:
 *       - Authentication
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   description: The authenticated user details.
 *       401:
 *         description: Unauthorized, user not authenticated.
 */
auth.get('/query', isAuthenticated, queryUser);

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Logs out the authenticated user.
 *     description: Destroys the user's session and clears the authentication cookie.
 *     tags:
 *       - Authentication
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Logout successful.
 *       500:
 *         description: Server error, session destruction failed.
 */
auth.get('/logout', isAuthenticated, logoutUser);

export default auth;