import express from 'express';
import {
  getTracks,
  getChallenge,
  verifyAnswer,
} from '../controllers/spotTheBugController.js';

const router = express.Router();

router.get('/tracks', getTracks);
router.get('/challenge', getChallenge);
router.post('/verify', verifyAnswer);

export default router;
