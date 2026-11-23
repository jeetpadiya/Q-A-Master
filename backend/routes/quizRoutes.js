import express from 'express';
import auth from '../middleware/auth.js';
import {
  getQuestions,
  submitQuiz,
  getUserCertificates,
  verifyCertificate,
} from '../controllers/quizController.js';

const router = express.Router();

// Public: Get sanitized questions (answers stripped)
router.get('/questions', getQuestions);

// Protected: Submit quiz answers for server-side evaluation & certificate award
router.post('/quiz/submit', auth, submitQuiz);

// Protected: Get user's certificates from MongoDB
router.get('/certificates/my-certificates', auth, getUserCertificates);

// Public: Verify certificate by code
router.get('/certificates/verify/:code', verifyCertificate);

export default router;
