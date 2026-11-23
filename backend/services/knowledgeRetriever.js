import fs from 'fs';

const knowledgeBaseUrl = new URL('../knowledge/knowledgeBase.json', import.meta.url);

let cachedKnowledge = null;

/**
 * Loads and caches the technical documentation base
 */
const getKnowledgeBase = () => {
  if (!cachedKnowledge) {
    const raw = fs.readFileSync(knowledgeBaseUrl, 'utf-8');
    cachedKnowledge = JSON.parse(raw);
  }
  return cachedKnowledge;
};

/**
 * Retrieves the most relevant documentation chunk for a given category and level.
 *
 * @param {Object} options
 * @param {string} options.category - e.g. "React", "JavaScript", "Python"
 * @param {number} options.targetLevel - Dynamic level from 1.0 to 5.0
 * @param {Array<string>} [options.avoidIds=[]] - Chunks already tested in this session
 * @param {string} [options.focusKeyword=''] - Keyword to probe if user missed a previous concept
 * @returns {Object} Grounding context chunk for Gemini RAG
 */
export const retrieveKnowledgeChunk = ({
  category,
  targetLevel = 1.0,
  avoidIds = [],
  focusKeyword = '',
}) => {
  const allDocs = getKnowledgeBase();
  const cleanCat = (category || 'React').toLowerCase();

  // 1. Filter by category
  let categoryDocs = allDocs.filter((doc) =>
    doc.category.toLowerCase().includes(cleanCat) || cleanCat.includes(doc.category.toLowerCase())
  );

  // Fallback to all docs if category is not found
  if (categoryDocs.length === 0) {
    categoryDocs = allDocs;
  }

  // 2. Filter out already asked chunks if candidates remain
  const freshDocs = categoryDocs.filter((doc) => !avoidIds.includes(doc.id));
  const candidatePool = freshDocs.length > 0 ? freshDocs : categoryDocs;

  // 3. Score candidates based on level calibration and focus keyword
  const scored = candidatePool.map((doc) => {
    let score = 10;

    // Penalty for distance from target level (Level 1 to 5)
    const levelDiff = Math.abs(doc.level - targetLevel);
    score -= levelDiff * 2.5;

    // Bonus for matching focus keywords (diagnosing a weak spot)
    if (focusKeyword) {
      const kw = focusKeyword.toLowerCase();
      if (doc.keywords.some((k) => k.toLowerCase().includes(kw)) || doc.topic.toLowerCase().includes(kw)) {
        score += 5;
      }
    }

    return { doc, score };
  });

  // Sort by highest score
  scored.sort((a, b) => b.score - a.score);

  // Pick top candidate (or randomly among the top 2 for variety)
  const topCandidates = scored.slice(0, 2);
  const selected = topCandidates[Math.floor(Math.random() * topCandidates.length)].doc;

  return {
    chunkId: selected.id,
    category: selected.category,
    level: selected.level,
    topic: selected.topic,
    concept: selected.concept,
    codeSnippet: selected.codeSnippet,
    edgeCases: selected.edgeCases,
    groundingPrompt: `
TECHNICAL REFERENCE FOR QUESTION CREATION:
- Track: ${selected.category} (Target Difficulty: Level ${Math.min(5, Math.max(1, Math.round(targetLevel)))} of 5)
- Subject: ${selected.topic}
- Core Rule: ${selected.concept}
- Production Code Context:
\`\`\`
${selected.codeSnippet}
\`\`\`
- Trap / Edge Case to Test: ${selected.edgeCases}
    `.trim(),
  };
};
