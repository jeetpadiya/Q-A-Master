import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuizContext } from '../context/QuizContext';
import { startAdaptiveSessionApi, submitAdaptiveAnswerApi } from '../services/api';
import { AdaptiveGauge, getLevelTier } from '../components/AdaptiveGauge';
import { TechIcon } from '../components/TechIcon';
import { playTactilePop, playSuccessChime } from '../utils/sound';
import { toast } from 'sonner';

const AdaptiveQuiz = () => {
  const navigate = useNavigate();
  const { selectedCategory } = useContext(QuizContext);

  const [session, setSession] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completionData, setCompletionData] = useState(null);

  const initSession = useCallback(async () => {
    setIsLoading(true);
    setFeedback(null);
    setIsCompleted(false);
    setCompletionData(null);

    try {
      const { data } = await startAdaptiveSessionApi({
        category: selectedCategory,
        targetQuestions: 10,
      });

      if (data.success) {
        setSession({
          sessionId: data.sessionId,
          category: data.category,
          currentLevel: data.currentLevel,
          peakLevel: data.peakLevel,
          streak: data.streak,
          questionIndex: data.questionIndex,
          targetQuestions: data.targetQuestions,
        });
        setCurrentQuestion(data.question);
      }
    } catch (err) {
      console.error('Failed to start adaptive session:', err);
      toast.error('Failed to initialize adaptive session');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    initSession();
  }, [initSession]);

  const handleSelectAnswer = async (selectedOption) => {
    if (isEvaluating || isCompleted || !session) return;
    playTactilePop();
    setIsEvaluating(true);

    try {
      const { data } = await submitAdaptiveAnswerApi({
        sessionId: session.sessionId,
        selectedAnswer: selectedOption,
      });

      if (data.success) {
        setFeedback({
          wasCorrect: data.wasCorrect,
          correctAnswer: data.previousCorrectAnswer,
          explanation: data.previousExplanation,
          concept: data.previousConcept,
        });

        if (data.wasCorrect) {
          toast.success(`Correct · Level up to ${data.currentLevel.toFixed(1)}`);
        } else {
          toast.error(`Mistake · Calibrating to ${data.currentLevel.toFixed(1)}`);
        }

        if (data.isCompleted) {
          playSuccessChime();
          setIsCompleted(true);
          setCompletionData(data);
        } else {
          setSession((prev) => ({
            ...prev,
            currentLevel: data.currentLevel,
            peakLevel: data.peakLevel,
            streak: data.streak,
            questionIndex: data.questionIndex,
            targetQuestions: data.targetQuestions,
          }));
          setCurrentQuestion(data.question);
        }
      }
    } catch (err) {
      console.error('Failed to submit answer:', err);
      toast.error('Failed to evaluate answer');
    } finally {
      setIsEvaluating(false);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (isLoading || isEvaluating || isCompleted || !currentQuestion) return;

    const handleKeyDown = (e) => {
      const key = e.key.toUpperCase();
      const options = currentQuestion.options;

      if (key === 'A' || key === '1') {
        if (options[0]) handleSelectAnswer(options[0]);
      } else if (key === 'B' || key === '2') {
        if (options[1]) handleSelectAnswer(options[1]);
      } else if (key === 'C' || key === '3') {
        if (options[2]) handleSelectAnswer(options[2]);
      } else if (key === 'D' || key === '4') {
        if (options[3]) handleSelectAnswer(options[3]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestion, isEvaluating, isCompleted, isLoading]);

  // Loading
  if (isLoading) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center p-6 text-zinc-100 bg-[#09090b]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-200 border-t-transparent mb-3" />
        <p className="font-mono text-xs text-zinc-400 uppercase tracking-wider">
          Retrieving technical specs for {selectedCategory}...
        </p>
      </div>
    );
  }

  // Final Assessment Summary
  if (isCompleted && completionData) {
    const tier = getLevelTier(completionData.peakLevel);

    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 bg-[#09090b] text-zinc-100">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-zinc-500 mb-2">
            Assessment Completed
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-100 mb-4">
            Adaptive Evaluation
          </h2>

          <div className="p-6 rounded-xl border border-zinc-800 bg-[#121215] text-left mb-6">
            <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-3">
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-zinc-500">Evaluated Tier</p>
                <h3 className="text-xl font-bold text-zinc-100 mt-0.5">
                  {completionData.masteryTier || tier.title}
                </h3>
              </div>
              <div className="text-right font-mono text-xs">
                <span className="text-zinc-500">Peak Difficulty:</span>
                <p className="text-base font-bold text-zinc-100">{completionData.peakLevel.toFixed(1)} / 5.0</p>
              </div>
            </div>

            <div className="flex gap-2 font-mono text-xs">
              <span className="rounded border border-zinc-800 bg-zinc-900 px-3 py-1 text-zinc-300">
                Score: {completionData.finalScore} / {completionData.totalQuestions}
              </span>
              <span className="rounded border border-zinc-800 bg-zinc-900 px-3 py-1 text-emerald-400 font-semibold">
                +⚡ {completionData.earnedXP || 150} XP
              </span>
            </div>

            {completionData.certificate && (
              <div className="mt-4 p-3 rounded-lg border border-zinc-700 bg-zinc-900/80 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-zinc-200">Credential Issued</p>
                  <p className="font-mono text-[11px] text-zinc-500">{completionData.certificate.verificationCode}</p>
                </div>
                <button
                  onClick={() => {
                    playTactilePop();
                    navigate('/dashboard');
                  }}
                  className="btn-primary py-1 px-3 text-xs"
                >
                  View Credential →
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-center gap-3 mb-10">
            <button
              onClick={() => {
                playTactilePop();
                initSession();
              }}
              className="btn-primary"
            >
              Retake Test
            </button>
            <button
              onClick={() => {
                playTactilePop();
                navigate('/');
              }}
              className="btn-secondary"
            >
              Back to Home
            </button>
          </div>

          {/* Trail of questions */}
          <div className="text-left border border-zinc-800 bg-[#121215] rounded-xl p-5 sm:p-6 shadow-sm">
            <h3 className="font-semibold text-sm text-zinc-200 mb-4 font-mono">
              Adaptive Question Trail
            </h3>

            <div className="space-y-3.5">
              {completionData.results.map((ans, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border ${
                    ans.isCorrect
                      ? 'border-emerald-500/20 bg-emerald-500/5'
                      : 'border-rose-500/20 bg-rose-500/5'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2 font-mono text-xs">
                    <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-300 font-bold">
                      Q{idx + 1} · L{ans.level?.toFixed(1) || '1.0'}
                    </span>
                    <span className="text-zinc-500 text-[11px]">
                      {ans.concept}
                    </span>
                  </div>

                  <p className="font-sans text-sm font-medium text-zinc-200 mb-2">
                    {ans.question}
                  </p>

                  <div className="space-y-1 font-mono text-xs pl-1">
                    <p className="text-emerald-400">
                      <span className="text-zinc-500 mr-2">Correct:</span>
                      {ans.correctAnswer}
                    </p>
                    <p className={ans.isCorrect ? 'text-emerald-400' : 'text-rose-400'}>
                      <span className="text-zinc-500 mr-2">Your Answer:</span>
                      {ans.selectedAnswer}
                    </p>
                  </div>

                  {ans.explanation && (
                    <div className="mt-3 p-2.5 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 leading-relaxed font-sans">
                      <span className="font-mono text-zinc-300 font-semibold mr-1">Concept:</span>
                      {ans.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active Adaptive Question
  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center p-4 sm:p-6 bg-[#09090b] text-zinc-100">
      <div className="w-full max-w-xl space-y-4">
        {/* Speedometer Gauge */}
        <AdaptiveGauge
          currentLevel={session?.currentLevel || 1.0}
          peakLevel={session?.peakLevel || 1.0}
          streak={session?.streak || 0}
        />

        {/* Feedback Banner */}
        {feedback && (
          <div
            className={`p-3 rounded-lg border text-xs leading-relaxed font-mono ${
              feedback.wasCorrect
                ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-300'
                : 'border-rose-500/30 bg-rose-500/5 text-rose-300'
            }`}
          >
            <span className="font-bold mr-1.5 uppercase">
              {feedback.wasCorrect ? '✓ Verified:' : '✕ Remediation:'}
            </span>
            <span className="font-sans text-zinc-300">{feedback.explanation}</span>
          </div>
        )}

        {/* Active Question Card */}
        {currentQuestion && (
          <div className="rounded-xl border border-zinc-800 bg-[#121215] p-6 sm:p-7 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-4 font-mono text-xs text-zinc-400">
              <span className="flex items-center gap-1.5 text-zinc-300">
                <TechIcon name={selectedCategory} className="w-3.5 h-3.5 opacity-80" />
                <span>{selectedCategory} RAG</span>
              </span>
              <span>
                {session?.questionIndex || 1} / {session?.targetQuestions || 10}
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-semibold text-zinc-100 text-left mb-6 leading-relaxed">
              {currentQuestion.question}
            </h2>

            <div className="space-y-2.5">
              {currentQuestion.options.map((opt, i) => (
                <button
                  key={i}
                  disabled={isEvaluating}
                  onClick={() => handleSelectAnswer(opt)}
                  className="quiz-option-card group disabled:opacity-50"
                >
                  <span className="kbd mr-3">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-zinc-300 group-hover:text-zinc-100 flex-1 leading-snug">
                    {opt}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between font-mono text-xs text-zinc-500">
              <span>Press [A-D] or [1-4]</span>
              {isEvaluating && (
                <span className="text-zinc-400 animate-pulse flex items-center gap-1.5 text-[11px]">
                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-300 animate-ping" />
                  Adapting difficulty...
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdaptiveQuiz;
