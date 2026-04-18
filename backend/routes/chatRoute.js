import express from 'express';
import { chatHandler } from '../controllers/chatController.js';
const chatRouter = express.Router();

chatRouter.post('/', chatHandler);

export default chatRouter;
