import express from 'express';
import { getConversations, createConversation, getUnreadCount } from '../controllers/conversationController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getConversations);
router.post('/', auth, createConversation);
router.get('/unread', auth, getUnreadCount);

export default router;