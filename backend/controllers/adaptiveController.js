import crypto from 'crypto';
import AdaptiveSession from '../models/adaptiveSessionSchema.js';
import Certificate from '../models/certificateSchema.js';
import User from '../models/userSchema.js';
import { generateAdaptiveQuestion } from '../services/geminiRAGService.js';

/**
 * POST /api/adaptive/start
 * Initializes a new adaptive testing session, generates Question 1 at Level 1.0,
 * and saves state server-side.
 */
export const startAdaptiveSession = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { category = 'React', targetQuestions = 10 } = req.body;

    // 1. Generate first question at foundational Level 1.0
    const initialQuestion = await generateAdaptiveQuestion({
      category,
      targetLevel: 1.0,
      avoidIds: [],
    });

    // 2. Create the adaptive session in MongoDB
    const session = await AdaptiveSession.create({
      userId,
      category,
      currentLevel: 1.0,
      peakLevel: 1.0,
      streak: 0,
      currentQuestion: initialQuestion,
      usedChunkIds: [initialQuestion.chunkId],
      questionIndex: 1,
      targetQuestions: Number(targetQuestions) || 10,
      isCompleted: false,
      finalScore: 0,
    });

    // 3. Return sanitized question to client (NO correctAnswer or explanation leaked!)
    res.status(201).json({
      success: true,
      sessionId: session._id,
      category: session.category,
      questionIndex: session.questionIndex,
      targetQuestions: session.targetQuestions,
      currentLevel: session.currentLevel,
      peakLevel: session.peakLevel,
      streak: session.streak,
      question: {
        questionId: initialQuestion.questionId,
        question: initialQuestion.question,
        options: initialQuestion.options,
        level: initialQuestion.level,
        concept: initialQuestion.concept,
      },
    });
  } catch (error) {
    console.error('Error starting adaptive session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start adaptive quiz session',
    });
  }
};

/**
 * POST /api/adaptive/submit
 * Evaluates current answer, adjusts difficulty level, updates streak/XP,
 * and generates the next level-calibrated question (or finalizes the assessment).
 */
export const submitAdaptiveAnswer = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { sessionId, selectedAnswer } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'sessionId is required',
      });
    }

    const session = await AdaptiveSession.findOne({ _id: sessionId, userId });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Adaptive session not found',
      });
    }

    if (session.isCompleted) {
      return res.status(400).json({
        success: false,
        message: 'This adaptive session has already been completed',
      });
    }

    const currentQ = session.currentQuestion;
    const isCorrect = selectedAnswer === currentQ.correctAnswer;

    // 1. DYNAMIC DIFFICULTY ADJUSTMENT (Item Response / CAT Logic)
    let nextLevel = session.currentLevel;
    let nextStreak = session.streak;

    if (isCorrect) {
      nextStreak += 1;
      // Streak accelerator: +0.7 if on a streak, otherwise +0.4
      const levelBoost = nextStreak >= 2 ? 0.7 : 0.4;
      nextLevel = Math.min(5.0, Number((session.currentLevel + levelBoost).toFixed(2)));
      session.finalScore += 1;
    } else {
      nextStreak = 0;
      // Difficulty drop on mistake: -0.4 (floored at 1.0)
      nextLevel = Math.max(1.0, Number((session.currentLevel - 0.4).toFixed(2)));
    }

    const peakLevel = Math.max(session.peakLevel, nextLevel);

    // 2. Record answer history
    session.history.push({
      questionId: currentQ.questionId,
      chunkId: currentQ.chunkId,
      question: currentQ.question,
      selectedAnswer: selectedAnswer || 'Not Answered',
      correctAnswer: currentQ.correctAnswer,
      isCorrect,
      level: currentQ.level,
      concept: currentQ.concept,
      explanation: currentQ.explanation,
    });

    session.currentLevel = nextLevel;
    session.peakLevel = peakLevel;
    session.streak = nextStreak;

    // 3. CHECK FOR ASSESSMENT COMPLETION
    if (session.questionIndex >= session.targetQuestions) {
      session.isCompleted = true;
      session.masteryTier = session.calculateMasteryTier();

      // Award XP based on peak level achieved
      const earnedXP = Math.round(session.finalScore * 15 + peakLevel * 20);
      const user = await User.findById(userId);
      if (user) {
        user.xp = (user.xp || 0) + earnedXP;
        await user.save();
      }

      // Award Adaptive Mastery Certificate if high proficiency demonstrated (Score >= 7 or Peak >= 3.0)
      let certificate = null;
      if (session.finalScore >= 7 || peakLevel >= 3.0) {
        const recipientName = user?.name || req.user.email.split('@')[0];
        const cleanCat = session.category.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 4);
        const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
        const verificationCode = `QAM-ADAPT-${cleanCat}-${randomHex}`;

        certificate = await Certificate.create({
          userId,
          recipientName,
          recipientEmail: req.user.email,
          category: `${session.category} (${session.masteryTier})`,
          score: session.finalScore,
          totalQuestions: session.targetQuestions,
          verificationCode,
          issuedAt: new Date(),
        });
      }

      await session.save();

      return res.status(200).json({
        success: true,
        isCompleted: true,
        wasCorrect: isCorrect,
        previousCorrectAnswer: currentQ.correctAnswer,
        previousExplanation: currentQ.explanation,
        finalScore: session.finalScore,
        totalQuestions: session.targetQuestions,
        peakLevel: session.peakLevel,
        masteryTier: session.masteryTier,
        earnedXP,
        certificate,
        results: session.history,
      });
    }

    // 4. GENERATE NEXT LEVEL-CALIBRATED QUESTION VIA RAG
    session.questionIndex += 1;

    // If previous was wrong, probe the missed concept; otherwise target new higher difficulty
    const nextQuestion = await generateAdaptiveQuestion({
      category: session.category,
      targetLevel: nextLevel,
      avoidIds: session.usedChunkIds,
      focusKeyword: isCorrect ? '' : currentQ.concept,
    });

    session.currentQuestion = nextQuestion;
    session.usedChunkIds.push(nextQuestion.chunkId);
    await session.save();

    res.status(200).json({
      success: true,
      isCompleted: false,
      wasCorrect: isCorrect,
      previousCorrectAnswer: currentQ.correctAnswer,
      previousExplanation: currentQ.explanation,
      previousConcept: currentQ.concept,
      currentLevel: session.currentLevel,
      peakLevel: session.peakLevel,
      streak: session.streak,
      questionIndex: session.questionIndex,
      targetQuestions: session.targetQuestions,
      question: {
        questionId: nextQuestion.questionId,
        question: nextQuestion.question,
        options: nextQuestion.options,
        level: nextQuestion.level,
        concept: nextQuestion.concept,
      },
    });
  } catch (error) {
    console.error('Error submitting adaptive answer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to evaluate answer and generate next question',
    });
  }
};

/**
 * GET /api/adaptive/history
 * Returns past adaptive assessment attempts for the user
 */
export const getAdaptiveSessionHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const sessions = await AdaptiveSession.find({ userId, isCompleted: true })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      sessions,
    });
  } catch (error) {
    console.error('Error fetching adaptive history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch adaptive history',
    });
  }
};
