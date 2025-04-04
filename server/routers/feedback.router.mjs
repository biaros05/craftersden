import express from 'express';
import { isAuthenticated } from '../utils/auth.mjs';

import { 
  createFeedback, 
  getFeedbacks, 
  deleteFeedback } from '../controllers/feedback.controller.mjs';

const feedbackRouter = express.Router();

feedbackRouter.post('/', isAuthenticated, createFeedback);
feedbackRouter.get('/feedbacks', isAuthenticated, getFeedbacks);
feedbackRouter.delete('/', isAuthenticated, deleteFeedback);

export default feedbackRouter;
