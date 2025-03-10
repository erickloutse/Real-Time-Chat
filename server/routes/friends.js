import express from 'express';
import { sendFriendRequest, respondToFriendRequest, getFriendRequests } from '../controllers/friendController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/request', auth, sendFriendRequest);
router.put('/request/:requestId', auth, respondToFriendRequest);
router.get('/requests', auth, getFriendRequests);

export default router;