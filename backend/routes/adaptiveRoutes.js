import express from 'express';
import auth from '../middleware/auth.js';
import {
  startAdaptiveSession,
  submitAdaptiveAnswer,
  getAdaptiveSessionHistory,
} from '../controllers/adaptiveController.js';

const router = express.Router();

// Protected: Initialize an adaptive test session
router.post('/start', auth, startAdaptiveSession);

// Protected: Submit an answer, adapt difficulty, retrieve & generate next question
router.post('/submit', auth, submitAdaptiveAnswer);

// Protected: View completed adaptive assessment history
router.get('/history', auth, getAdaptiveSessionHistory);

export default router;
