import express from 'express';
import {
  addNotification,
  getUserNotifications,
  readAllNotifications,
  clearNotifications
} from '../controllers/notifications.controller.mjs';

import { isAuthenticated } from '../utils/auth.mjs';

const notificationsRouter = express.Router();

/**
 * @swagger
 * /api/notifications/{id}:
 *   get:
 *     summary: Get user notifications
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of user notifications
 *       400:
 *         description: User ID is required
 *       500:
 *         description: Server error
 */
notificationsRouter.get('/:id', isAuthenticated, getUserNotifications);


/**
 * @swagger
 * /api/notifications/post:
 *   post:
 *     summary: Add a new notification
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Notification added successfully
 *       400:
 *         description: Username is required
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

notificationsRouter.post('/post', isAuthenticated, addNotification);


/**
 * @swagger
 * /api/notifications/read-all:
 *   post:
 *     summary: Mark all notifications as read
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Notifications updated successfully
 *       400:
 *         description: User ID is required
 *       500:
 *         description: Server error
 */
notificationsRouter.post('/read-all', isAuthenticated, readAllNotifications);


/**
 * @swagger
 * /api/notifications/clear:
 *   delete:
 *     summary: Clear all user notifications
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Notifications cleared successfully
 *       400:
 *         description: User ID is required
 *       404:
 *         description: No notifications found
 *       500:
 *         description: Server error
 */
notificationsRouter.delete('/clear', isAuthenticated, clearNotifications);

export default notificationsRouter;