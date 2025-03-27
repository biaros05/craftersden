import express from 'express';
import {
  addNotification,
  getUserNotifications,
  readAllNotifications,
  clearNotifications
} from '../controllers/notifications.controller.mjs'

import { isAuthenticated } from '../utils/auth.mjs';

const notificationsRouter = express.Router();

notificationsRouter.get('/', isAuthenticated, getUserNotifications);
notificationsRouter.post('/post', isAuthenticated, addNotification);
notificationsRouter.post('/read-all', isAuthenticated, readAllNotifications);
notificationsRouter.delete('/clear', isAuthenticated, clearNotifications);
