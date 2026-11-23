import jwt from 'jsonwebtoken';
import {
  getAvailableTracks,
  getSanitizedChallenge,
  verifyLineSelection,
} from '../services/spotTheBugService.js';

// Optional token extractor so unauthenticated users can still play, while authenticated users earn XP
const extractUserId = (req) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'qa_master_jwt_secret_key');
    return decoded.userId || decoded.id || null;
  } catch {
    return null;
  }
};

/**
 * GET /api/spot-the-bug/tracks
 * Returns available categories for bug inspection
 */
export const getTracks = (req, res) => {
  try {
    const tracks = getAvailableTracks();
    res.status(200).json({ success: true, tracks });
  } catch (error) {
    console.error('Error in getTracks:', error);
    res.status(500).json({ success: false, message: 'Failed to load tracks' });
  }
};

/**
 * GET /api/spot-the-bug/challenge?category=React&exclude=id1,id2
 * Delivers sanitized code challenge without revealing the buggy line
 */
export const getChallenge = (req, res) => {
  try {
    const { category, exclude } = req.query;
    const excludeIds = exclude ? exclude.split(',').filter(Boolean) : [];

    const challenge = getSanitizedChallenge({
      category: category || 'React',
      excludeIds,
    });

    res.status(200).json({
      success: true,
      challenge,
    });
  } catch (error) {
    console.error('Error in getChallenge:', error);
    res.status(500).json({ success: false, message: 'Failed to load bug challenge' });
  }
};

/**
 * POST /api/spot-the-bug/verify
 * Body: { challengeId, selectedLine }
 * Evaluates line selection, calculates XP, and reveals code fix and senior explanation
 */
export const verifyAnswer = async (req, res) => {
  try {
    const { challengeId, selectedLine } = req.body;

    if (!challengeId || selectedLine === undefined || selectedLine === null) {
      return res.status(400).json({
        success: false,
        message: 'challengeId and selectedLine (1-based index) are required.',
      });
    }

    const userId = extractUserId(req);

    const result = await verifyLineSelection({
      challengeId,
      selectedLine: Number(selectedLine),
      userId,
    });

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Error in verifyAnswer:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to verify line selection',
    });
  }
};
