import mongoose from 'mongoose';

const AdaptiveSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    // Dynamic difficulty level (1.0 = Junior, 5.0 = Architect)
    currentLevel: {
      type: Number,
      default: 1.0,
      min: 1.0,
      max: 5.0,
    },
    // Highest level achieved during this assessment
    peakLevel: {
      type: Number,
      default: 1.0,
    },
    // Consecutive correct answers in this session
    streak: {
      type: Number,
      default: 0,
    },
    // Current active question (Stored server-side so client cannot cheat)
    currentQuestion: {
      questionId: { type: String, required: true },
      chunkId: { type: String, required: true },
      question: { type: String, required: true },
      options: [{ type: String, required: true }],
      correctAnswer: { type: String, required: true },
      explanation: { type: String, required: true },
      level: { type: Number, required: true },
      concept: { type: String, default: '' },
    },
    // Full log of answered questions
    history: [
      {
        questionId: String,
        chunkId: String,
        question: String,
        selectedAnswer: String,
        correctAnswer: String,
        isCorrect: Boolean,
        level: Number,
        concept: String,
        explanation: String,
      },
    ],
    // Avoid re-asking concepts from these knowledge chunks
    usedChunkIds: [{ type: String }],
    questionIndex: {
      type: Number,
      default: 1,
    },
    targetQuestions: {
      type: Number,
      default: 10,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    finalScore: {
      type: Number,
      default: 0,
    },
    // Calculated upon completion (e.g., "Senior Engineer (Level 4.2)")
    masteryTier: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

/**
 * Computes descriptive developer mastery tier based on peak level reached
 */
AdaptiveSessionSchema.methods.calculateMasteryTier = function () {
  const peak = this.peakLevel || 1.0;
  if (peak >= 4.5) return 'Staff / Principal Specialist';
  if (peak >= 3.8) return 'Senior Engineer';
  if (peak >= 2.8) return 'Mid-Level Developer';
  if (peak >= 1.8) return 'Junior Developer';
  return 'Foundational Learner';
};

const AdaptiveSession = mongoose.model('AdaptiveSession', AdaptiveSessionSchema);

export default AdaptiveSession;
