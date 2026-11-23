import fs from 'fs';
import User from '../models/userSchema.js';

const challengesFileUrl = new URL('../knowledge/spotTheBugChallenges.json', import.meta.url);

let cachedChallenges = null;

const loadChallenges = () => {
  if (!cachedChallenges) {
    const raw = fs.readFileSync(challengesFileUrl, 'utf-8');
    cachedChallenges = JSON.parse(raw);
  }
  return cachedChallenges;
};

/**
 * Returns list of distinct categories available in Spot the Bug
 */
export const getAvailableTracks = () => {
  const all = loadChallenges();
  return [...new Set(all.map((c) => c.category))];
};

/**
 * Retrieves a challenge sanitized for the client (Zero Answer Leaking)
 *
 * @param {Object} options
 * @param {string} [options.category='React']
 * @param {Array<string>} [options.excludeIds=[]]
 * @returns {Object} Sanitized challenge
 */
export const getSanitizedChallenge = ({ category = 'React', excludeIds = [] }) => {
  const all = loadChallenges();
  const cleanCat = (category || 'React').toLowerCase();

  let pool = all.filter((c) => c.category.toLowerCase() === cleanCat);
  if (pool.length === 0) pool = all;

  const freshPool = pool.filter((c) => !excludeIds.includes(c.id));
  const candidatePool = freshPool.length > 0 ? freshPool : pool;

  const selected = candidatePool[Math.floor(Math.random() * candidatePool.length)];

  // SECURITY: Strip out buggyLine, fixedCode, and explanation!
  return {
    id: selected.id,
    category: selected.category,
    topic: selected.topic,
    level: selected.level,
    title: selected.title,
    description: selected.description,
    codeLines: selected.codeLines,
    totalLines: selected.codeLines.length,
  };
};

/**
 * Server-side verification of user's selected line
 *
 * @param {Object} params
 * @param {string} params.challengeId
 * @param {number} params.selectedLine - 1-based line index
 * @param {string} [params.userId] - Logged in user ID
 * @returns {Promise<Object>} Verification results with explanation, diff, and earned XP
 */
export const verifyLineSelection = async ({ challengeId, selectedLine, userId }) => {
  const all = loadChallenges();
  const challenge = all.find((c) => c.id === challengeId);

  if (!challenge) {
    throw new Error(`Challenge ${challengeId} not found`);
  }

  const isCorrect = Number(selectedLine) === Number(challenge.buggyLine);
  let earnedXP = 0;
  let totalXP = 0;
  let streak = 1;

  if (isCorrect) {
    // Calibrated XP: 20 XP base + 10 XP per level difficulty
    earnedXP = 20 + (challenge.level || 2) * 10;
  } else {
    // Minimal attempt XP for trying
    earnedXP = 5;
  }

  if (userId) {
    try {
      const user = await User.findById(userId);
      if (user) {
        const todayStr = new Date().toISOString().split('T')[0];
        let currentStreak = user.streak || 1;
        const lastActive = user.lastActiveDate || '';

        if (lastActive && lastActive !== todayStr) {
          const lastDate = new Date(lastActive);
          const currentDate = new Date(todayStr);
          const diffDays = Math.round(Math.abs(currentDate - lastDate) / (1000 * 60 * 60 * 24));

          if (diffDays === 1) {
            currentStreak += 1;
          } else if (diffDays > 1) {
            currentStreak = 1;
          }
        }

        user.xp = (user.xp || 0) + earnedXP;
        user.streak = currentStreak;
        user.lastActiveDate = todayStr;
        await user.save();

        totalXP = user.xp;
        streak = user.streak;
      }
    } catch (err) {
      console.warn('Could not update user XP in MongoDB:', err.message);
    }
  }

  return {
    isCorrect,
    selectedLine: Number(selectedLine),
    buggyLine: challenge.buggyLine,
    buggyCode: challenge.buggyCode,
    fixedCode: challenge.fixedCode,
    explanation: challenge.explanation,
    earnedXP,
    totalXP,
    streak,
  };
};
