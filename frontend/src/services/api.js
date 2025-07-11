export async function fetchQuestions() {
  const res = await fetch(
    'https://your-backend.vercel.app/api/questions'
  );
  if (!res.ok) throw new Error('Failed to load questions');
  const { questions } = await res.json();
  return questions;
}