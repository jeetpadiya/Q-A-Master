import crypto from 'crypto';
import { retrieveKnowledgeChunk } from './knowledgeRetriever.js';

/**
 * Resolves the Gemini API key from environment variables
 */
const getGeminiApiKey = () => {
  return (
    process.env.GOOGLE_GEMENI_KEY ||
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    ''
  ).trim();
};

// Priority list of Gemini models matching current Google Gemini API availability
const GEMINI_MODELS = [
  'gemini-3.8-flash',
  'gemini-flash-latest',
  'gemini-3.5-flash',
  'gemini-3.1-flash-lite',
];

/**
 * Generates an adaptive, level-calibrated multiple choice question
 * grounded in official technical documentation using Google Gemini 3.x Flash.
 *
 * @param {Object} params
 * @param {string} params.category - Track name (React, JavaScript, Python, CSS, MERN)
 * @param {number} params.targetLevel - Calibrated difficulty (1.0 to 5.0)
 * @param {Array<string>} [params.avoidIds=[]] - Chunks already asked in this session
 * @param {string} [params.focusKeyword=''] - Concept keyword to probe if user missed a previous question
 * @returns {Promise<Object>} Generated question object (with answer and explanation)
 */
export const generateAdaptiveQuestion = async ({
  category = 'React',
  targetLevel = 1.0,
  avoidIds = [],
  focusKeyword = '',
}) => {
  // 1. RETRIEVAL: Fetch grounding technical documentation chunk
  const docChunk = retrieveKnowledgeChunk({
    category,
    targetLevel,
    avoidIds,
    focusKeyword,
  });

  const apiKey = getGeminiApiKey();

  // If no API key configured, use high-fidelity fallback generator
  if (!apiKey) {
    console.warn('⚠️ No Gemini API key found. Using local knowledge generator.');
    return generateFallbackQuestion({ category, targetLevel, docChunk });
  }

  // 2. AUGMENTED GENERATION: Craft strict prompt with grounding context
  const prompt = `
You are an expert technical assessment engine conducting a Computerized Adaptive Test (CAT).
Your goal is to generate ONE realistic, non-cheatable, production-grade multiple choice question calibrated strictly to Level ${targetLevel.toFixed(1)} of 5.0.

GROUNDING DOCUMENTATION (Strictly base the question on this technical context):
${docChunk.groundingPrompt}

RULES FOR QUESTION CREATION:
1. Grounding: The question MUST test the exact rule or invariant described in the documentation above.
2. Code Snippet: If appropriate for the level, embed a realistic code snippet in markdown inside the question.
3. Options: Provide EXACTLY 4 distinct, plausible options. One must be unambiguously correct according to the specs. The other 3 must be realistic traps based on common developer mistakes.
4. Difficulty Calibration:
   - Level 1.0 - 2.0: Foundational syntax, expected output, basic rules.
   - Level 2.5 - 3.5: Component lifecycle, closures, edge-case behavior, asynchronous race conditions.
   - Level 4.0 - 5.0: Memory leaks, V8/Fiber internals, reconciliation bailouts, performance optimization.
5. Strict JSON Output: You must respond in valid JSON matching the requested schema.

OUTPUT JSON SCHEMA:
{
  "question": "Clear problem statement or code snippet puzzle",
  "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
  "correctAnswer": "Exact string character-for-character matching the correct option in options",
  "concept": "${docChunk.topic}",
  "explanation": "Clear, concise technical reason why the answer is correct citing language behavior",
  "difficulty": ${Number(targetLevel.toFixed(1))}
}
`.trim();

  // 3. ATTEMPT GENERATION WITH GEMINI 3.x FLASH (with multi-model fallback)
  for (const model of GEMINI_MODELS) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.3, // Lower temperature for factual accuracy
          },
        }),
      });

      if (!response.ok) {
        console.warn(`Model ${model} returned HTTP ${response.status}, trying next model...`);
        continue;
      }

      const data = await response.json();
      const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!candidateText) {
        continue;
      }

      const parsed = JSON.parse(candidateText);

      // Validate that correctAnswer is in options
      if (!parsed.options.includes(parsed.correctAnswer)) {
        parsed.correctAnswer = parsed.options[0];
      }

      const cleanCat = category.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 4);
      const questionId = `AI_${cleanCat}_${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

      return {
        questionId,
        chunkId: docChunk.chunkId,
        question: parsed.question,
        options: parsed.options,
        correctAnswer: parsed.correctAnswer,
        explanation: parsed.explanation,
        level: parsed.difficulty || Number(targetLevel.toFixed(1)),
        concept: parsed.concept || docChunk.topic,
        generatedBy: model,
      };
    } catch (err) {
      console.warn(`Error attempting model ${model}:`, err.message);
    }
  }

  // 4. FALLBACK: If Gemini models are experiencing high demand / quota limits, fallback cleanly
  console.warn('⚠️ All Gemini API models busy or limited. Falling back to local knowledge engine.');
  return generateFallbackQuestion({ category, targetLevel, docChunk });
};

/**
 * High-fidelity fallback generator if Gemini API key runs out of quota or encounters network issues.
 * Ensures the quiz engine NEVER crashes during an active user session.
 */
const generateFallbackQuestion = ({ category, targetLevel, docChunk }) => {
  const cleanCat = category.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 4);
  const questionId = `FB_${cleanCat}_${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

  return {
    questionId,
    chunkId: docChunk.chunkId,
    question: `In ${category} (${docChunk.topic}), which of the following statements is technically accurate?`,
    options: [
      docChunk.concept,
      `It is purely determined at compile-time and has zero runtime overhead in production.`,
      `It mutates the underlying memory buffer and bypasses garbage collection.`,
      `It throws a synchronous TypeError in non-strict mode.`,
    ],
    correctAnswer: docChunk.concept,
    explanation: `${docChunk.concept} Edge-case note: ${docChunk.edgeCases}`,
    level: docChunk.level || Number(targetLevel.toFixed(1)),
    concept: docChunk.topic,
    generatedBy: 'knowledge-engine',
  };
};

export default generateAdaptiveQuestion;
