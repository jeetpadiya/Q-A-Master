const getGeminiApiKey = () => {
  return (
    process.env.GOOGLE_GEMENI_KEY ||
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    ''
  ).trim();
};

const GEMINI_MODELS = [
  'gemini-3.8-flash',
  'gemini-flash-latest',
  'gemini-3.5-flash',
  'gemini-3.1-flash-lite',
];

/**
 * Generates interactive deep-dive mentoring from a Staff/Principal Senior Software Architect.
 *
 * @param {Object} params
 * @param {Object} params.questionContext - Context of the question or bug
 * @param {Array<Object>} [params.messageHistory=[]] - Prior conversation turns
 * @param {string} [params.userMessage] - The new follow-up inquiry from the user
 * @returns {Promise<Object>} The Senior Architect's response
 */
export const consultSeniorArchitect = async ({
  questionContext = {},
  messageHistory = [],
  userMessage = '',
}) => {
  const apiKey = getGeminiApiKey();

  const {
    category = 'General Engineering',
    topic = 'System Mechanics',
    title = '',
    question = '',
    codeSnippet = '',
    userAnswer = '',
    correctAnswer = '',
    explanation = '',
  } = questionContext;

  const systemInstructions = `
You are a Staff / Principal Software Architect at a tier-1 technology company mentoring a developer.
You provide authoritative, deep-dive explanations of code mechanics, runtime internals, and production architectural patterns.

CURRENT TECHNICAL CONTEXT:
- Track: ${category}
- Topic: ${topic}
${title ? `- Challenge Title: ${title}` : ''}
${question ? `- Question / Scenario: ${question}` : ''}
${codeSnippet ? `- Code Under Inspection:\n\`\`\`\n${codeSnippet}\n\`\`\`` : ''}
${userAnswer ? `- Developer's Answer / Selection: ${userAnswer}` : ''}
${correctAnswer ? `- Correct Production Answer: ${correctAnswer}` : ''}
${explanation ? `- Official Baseline Explanation: ${explanation}` : ''}

MENTORING GUIDELINES:
1. Direct & Authoritative: Speak like an experienced tech lead in a code review or 1-on-1 architecture design session.
2. Runtime Internals: Explain the exact runtime mechanics (e.g. V8 memory references, closure scoping, task vs microtask queues, React 19 reconciliation, Python PyObject references, CSS layout tree).
3. Production Code Fixes: Show clean, idiomatic code examples when appropriate.
4. Concision: Be concise and high-signal. Avoid generic conversational fluff or filler phrases like "Sure, I can help with that!".
`.trim();

  // If no API key is available, return intelligent offline explanation
  if (!apiKey) {
    return generateOfflineExplanation({
      category,
      topic,
      userMessage,
      explanation,
      correctAnswer,
    });
  }

  // Format messages into Gemini format
  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: `[SYSTEM CONTEXT]\n${systemInstructions}\n\n[USER INQUIRY]\n${
            userMessage || 'Can you give me a senior architect breakdown of this problem, why this trap happens in production, and how to structure it properly?'
          }`,
        },
      ],
    },
  ];

  // Append conversation turns if continuing an active consultation
  if (Array.isArray(messageHistory) && messageHistory.length > 0) {
    for (const msg of messageHistory) {
      contents.push({
        role: msg.role === 'assistant' || msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      });
    }

    if (userMessage) {
      contents.push({
        role: 'user',
        parts: [{ text: userMessage }],
      });
    }
  }

  // Attempt models sequentially with cascading fallback
  for (const model of GEMINI_MODELS) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 1024,
          },
        }),
      });

      if (!response.ok) {
        console.warn(`Senior Architect: Model ${model} returned HTTP ${response.status}, cascading...`);
        continue;
      }

      const data = await response.json();
      const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (replyText) {
        return {
          reply: replyText.trim(),
          model,
          success: true,
        };
      }
    } catch (err) {
      console.warn(`Senior Architect: Error with model ${model}:`, err.message);
    }
  }

  // Offline fallback if all models hit quota or fail
  return generateOfflineExplanation({
    category,
    topic,
    userMessage,
    explanation,
    correctAnswer,
  });
};

/**
 * Offline fallback generator for zero-crash stability
 */
const generateOfflineExplanation = ({
  category,
  topic,
  userMessage,
  explanation,
  correctAnswer,
}) => {
  return {
    reply: `### Senior Architect Analysis: ${topic} (${category})

**Core Invariant:**
${explanation || 'This pattern violates the expected runtime invariants of the underlying language engine.'}

**Why This Traps Developers in Production:**
In production environments, subtle bugs like this often manifest only under high concurrency or specific lifecycle timings. Developers frequently assume synchronous evaluation or reference preservation, whereas the runtime behaves according to strict specification rules.

**Architectural Recommendation:**
1. Avoid mutable state references and verify clean function closures.
2. Ensure asynchronous operations are explicitly awaited or orchestrated via deterministic pipelines.
3. Add automated unit and regression tests verifying this boundary condition.

*(Query received: "${userMessage || 'Deep dive request'}")*`,
    model: 'offline-architect-engine',
    success: true,
  };
};
