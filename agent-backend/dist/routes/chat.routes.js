"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chat_controller_1 = require("../controllers/chat.controller");
const router = express_1.default.Router();
const chatController = new chat_controller_1.ChatController();
// Bind methods to maintain context
router.post('/message', chatController.sendMessage.bind(chatController));
router.get('/history/:sessionId', chatController.getHistory.bind(chatController));
router.delete('/history/:sessionId', chatController.clearHistory.bind(chatController));
router.get('/capabilities', chatController.getCapabilities.bind(chatController));
exports.default = router;
