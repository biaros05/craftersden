import express from 'express';

import {
  createReport, getReports, deleteReport
} from '../controllers/reports.controller.mjs';
import { isAuthenticated } from '../utils/auth.mjs';

const reportsRouter = express.Router();

reportsRouter.post('/', isAuthenticated, createReport);
reportsRouter.get('/reports', isAuthenticated, getReports);
reportsRouter.delete('/', isAuthenticated, deleteReport);

export default reportsRouter;