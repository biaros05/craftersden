import express from 'express';
import { isAuthenticated } from '../utils/auth.mjs';
import { authenticateUser, logoutUser, queryUser } from '../controllers/auth.controller.mjs';

const auth = express.Router();

auth.post('/auth', authenticateUser);
auth.get('/query', isAuthenticated, queryUser);
auth.get('/logout', isAuthenticated, logoutUser);

export default auth;