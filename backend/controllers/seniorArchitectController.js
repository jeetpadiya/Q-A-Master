import { consultSeniorArchitect } from '../services/seniorArchitectService.js';

/**
 * POST /api/senior-architect/explain
 * Request Body:
 * {
 *   questionContext: {
 *     category: string,
 *     topic: string,
 *     title?: string,
 *     question?: string,
 *     codeSnippet?: string,
 *     userAnswer?: string,
 *     correctAnswer?: string,
 *     explanation?: string
 *   },
 *   messageHistory?: Array<{ role: 'user' | 'assistant', content: string }>,
 *   userMessage?: string
 * }
 */
export const askSeniorArchitect = async (req, res) => {
  try {
    const { questionContext, messageHistory, userMessage } = req.body;

    if (!questionContext) {
      return res.status(400).json({
        success: false,
        message: 'questionContext object is required',
      });
    }

    const result = await consultSeniorArchitect({
      questionContext,
      messageHistory: Array.isArray(messageHistory) ? messageHistory : [],
      userMessage: userMessage || '',
    });

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Error in askSeniorArchitect controller:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to consult Senior Architect',
    });
  }
};
