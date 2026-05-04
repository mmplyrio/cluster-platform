"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chat_controller_1 = require("../controllers/chat.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Todas as rotas de chat requerem autenticação
router.use(auth_middleware_1.authMiddleware);
router.get('/conversations', chat_controller_1.ChatController.getConversations);
router.get('/conversations/:id/messages', chat_controller_1.ChatController.getMessages);
router.get('/overview', chat_controller_1.ChatController.getOverview);
router.get('/radar', chat_controller_1.ChatController.getRadar);
router.post('/messages', chat_controller_1.ChatController.sendMessage);
router.post('/conversations', chat_controller_1.ChatController.createConversation);
exports.default = router;
