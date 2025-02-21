import express from 'express';
import { saveBuild } from '../controllers/post.controller.mjs';
import multer from 'multer';

const upload = multer();

const postRouter = express.Router();

postRouter.post('/save', upload.none(), saveBuild);

export default postRouter;