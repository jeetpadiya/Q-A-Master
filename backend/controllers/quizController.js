import fs from 'fs';
import crypto from 'crypto';
import User from '../models/userSchema.js';
import Certificate from '../models/certificateSchema.js';
import QuizAttempt from '../models/quizAttemptSchema.js';

const questionsFileUrl = new URL('../questions.json', import.meta.url);

// In-memory cache for questions file
let cachedQuestions = null;

const loadQuestions = () => {
  if (!cachedQuestions) {
    const rawData = fs.readFileSync(questionsFileUrl, 'utf-8');
    cachedQuestions = JSON.parse(rawData);
  }
  return cachedQuestions;
};

/**
 * GET /api/questions
 * Returns questions sanitized WITHOUT `correctAnswer` or `explanation` to prevent client-side inspection.
 */
export const getQuestions = (req, res) => {
  try {
    const allQuestions = loadQuestions();
    const { category } = req.query;

    const filtered = category
      ? allQuestions.filter((q) => q.category.toLowerCase() === category.toLowerCase())
      : allQuestions;

    // SECURITY: Strip out correctAnswer & explanation before sending to the client!
    const sanitized = filtered.map(({ id, category, question, options }) => ({
      id,
      category,
      question,
      options,
    }));

    res.status(200).json({
      success: true,
      count: sanitized.length,
      questions: sanitized,
    });
  } catch (error) {
    console.error('Error in getQuestions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load questions',
    });
  }
};

/**
 * POST /api/quiz/submit
 * Server-side scoring: evaluates answers, computes score, calculates XP & daily streak,
 * persists the attempt, and issues a verified certificate if perfect score.
 */
export const submitQuiz = async (req, res) => {
  try {
    const { category, answers } = req.body;
    const userId = req.user.userId;

    if (!category || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid submission data: category and answers array required.',
      });
    }

    const allQuestions = loadQuestions();
    const categoryQuestions = allQuestions.filter(
      (q) => q.category.toLowerCase() === category.toLowerCase()
    );

    if (categoryQuestions.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No questions found for category: ${category}`,
      });
    }

    // Map questions by ID for quick O(1) lookup
    const questionMap = new Map(allQuestions.map((q) => [q.id, q]));

    let computedScore = 0;
    const results = [];

    // Evaluate answers
    for (const ans of answers) {
      const actualQuestion = questionMap.get(ans.questionId);

      if (actualQuestion) {
        const isCorrect = actualQuestion.correctAnswer === ans.selectedAnswer;
        if (isCorrect) computedScore += 1;

        results.push({
          questionId: actualQuestion.id,
          question: actualQuestion.question,
          selectedAnswer: ans.selectedAnswer || null,
          correctAnswer: actualQuestion.correctAnswer, // Safe to return now
          explanation: actualQuestion.explanation || 'Review official documentation for key concepts.',
          isCorrect,
        });
      }
    }

    const totalQuestions = categoryQuestions.length;
    const passed = computedScore === totalQuestions && totalQuestions > 0;

    // 1. Calculate XP and Daily Streak
    const earnedXP = computedScore * 10 + (passed ? 50 : 20);
    const todayStr = new Date().toISOString().split('T')[0];

    const user = await User.findById(userId);
    let currentStreak = user?.streak || 1;
    const lastActive = user?.lastActiveDate || '';

    if (lastActive && lastActive !== todayStr) {
      const lastDate = new Date(lastActive);
      const currentDate = new Date(todayStr);
      const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        currentStreak += 1; // Maintained streak!
      } else if (diffDays > 1) {
        currentStreak = 1; // Reset streak if missed
      }
    }

    if (user) {
      user.xp = (user.xp || 0) + earnedXP;
      user.streak = currentStreak;
      user.lastActiveDate = todayStr;
      await user.save();
    }

    // 2. Save Quiz Attempt to MongoDB
    await QuizAttempt.create({
      userId,
      category,
      score: computedScore,
      totalQuestions,
      passed,
      answers: results,
    });

    let certificate = null;

    // 3. Award Certificate if 100% score
    if (passed) {
      // Check if user already holds a certificate for this category
      certificate = await Certificate.findOne({ userId, category });

      if (!certificate) {
        const recipientName = user?.name || req.user.email.split('@')[0];
        const cleanCategory = category.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 4);
        const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
        const verificationCode = `QAM-${cleanCategory}-${randomHex}`;

        certificate = await Certificate.create({
          userId,
          recipientName,
          recipientEmail: req.user.email,
          category,
          score: computedScore,
          totalQuestions,
          verificationCode,
          issuedAt: new Date(),
        });
      }
    }

    res.status(200).json({
      success: true,
      category,
      score: computedScore,
      totalQuestions,
      passed,
      certificate,
      earnedXP,
      totalXP: user?.xp || earnedXP,
      streak: currentStreak,
      results,
    });
  } catch (error) {
    console.error('Error in submitQuiz:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit quiz and calculate score',
    });
  }
};

/**
 * GET /api/certificates/my-certificates
 * Fetches all earned certificates for the logged-in user from MongoDB.
 */
export const getUserCertificates = async (req, res) => {
  try {
    const userId = req.user.userId;
    const certificates = await Certificate.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      certificates,
    });
  } catch (error) {
    console.error('Error in getUserCertificates:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch certificates',
    });
  }
};

/**
 * GET /api/certificates/verify/:code
 * Public endpoint to verify certificate authenticity by its unique code.
 */
export const verifyCertificate = async (req, res) => {
  try {
    const { code } = req.params;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Verification code is required',
      });
    }

    const certificate = await Certificate.findOne({
      verificationCode: code.toUpperCase().trim(),
    });

    if (!certificate) {
      return res.status(404).json({
        success: false,
        valid: false,
        message: 'Invalid certificate verification code. No record found.',
      });
    }

    res.status(200).json({
      success: true,
      valid: true,
      certificate: {
        recipientName: certificate.recipientName,
        category: certificate.category,
        score: certificate.score,
        totalQuestions: certificate.totalQuestions,
        verificationCode: certificate.verificationCode,
        issuedAt: certificate.issuedAt,
      },
    });
  } catch (error) {
    console.error('Error in verifyCertificate:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify certificate',
    });
  }
};
