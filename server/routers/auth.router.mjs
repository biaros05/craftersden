import express from 'express';
import { isAuthenticated } from '../utils/auth.mjs';
import { authenticateUser, logoutUser, queryUser } from '../controllers/auth.controller.mjs';

const auth = express.Router();

/**
 * @swagger
 * /api/auth:
 *   post:
 *     summary: Authenticate user with Google OAuth
 *     tags:
 *       - Authentication
 *     security:
 *       - GoogleOAuth: [email, profile]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Google ID Token obtained from OAuth flow
 *     responses:
 *       200:
 *         description: Successfully authenticated user
 *       400:
 *         description: Missing token
 *       500:
 *         description: Server error
 */
auth.post('/auth', authenticateUser);

/**
 * @swagger
 * /api/query:
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
 * /api/logout:
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