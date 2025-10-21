import express from 'express';
import { ChatController } from '../controllers/chat.controller';

const router = express.Router();
const chatController = new ChatController();

// Bind methods to maintain context
router.post('/message', chatController.sendMessage.bind(chatController));
router.get('/history/:sessionId', chatController.getHistory.bind(chatController));
router.delete('/history/:sessionId', chatController.clearHistory.bind(chatController));
router.get('/capabilities', chatController.getCapabilities.bind(chatController));

export default router;

