import express from 'express';
import { sendMessage, getMessages, markAsRead, toggleFavorite } from '../controllers/messageController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, sendMessage);
router.get('/:conversationId', auth, getMessages);
router.put('/:messageId/read', auth, markAsRead);
router.put('/:messageId/favorite', auth, toggleFavorite);

export default router;