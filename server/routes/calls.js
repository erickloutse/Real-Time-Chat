import express from 'express';
import { createCall, updateCallStatus, getCallHistory } from '../controllers/callController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, createCall);
router.put('/:callId', auth, updateCallStatus);
router.get('/history', auth, getCallHistory);

export default router;