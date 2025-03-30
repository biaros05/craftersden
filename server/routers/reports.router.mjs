import express from 'express';

import {
  createReport, getReports
} from '../controllers/reports.controller.mjs';
import { isAuthenticated } from '../utils/auth.mjs';

const reportsRouter = express.Router();

reportsRouter.post('/', isAuthenticated, createReport);
reportsRouter.get('/reports', isAuthenticated, getReports);

export default reportsRouter;