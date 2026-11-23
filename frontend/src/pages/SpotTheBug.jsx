import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { QuizContext } from '../context/QuizContext';
import { TechIcon } from '../components/TechIcon';
import SeniorArchitectDrawer from '../components/SeniorArchitectDrawer';
import { playTactilePop } from '../utils/sound';
import {
  getSpotTheBugTracksApi,
  getSpotTheBugChallengeApi,
  verifySpotTheBugAnswerApi,
} from '../services/api';

const TRACK_FILENAMES = {
  React: 'src/components/Counter.jsx',
  JavaScript: 'lib/async-runner.js',
  Python: 'services/event_logger.py',
  CSS: 'styles/layout.css',
  MERN: 'server/controllers/auth.js',
};

const SpotTheBug = () => {
  const navigate = useNavigate();
  const { streak } = useContext(QuizContext);

  const [tracks, setTracks] = useState(['React', 'JavaScript', 'Python', 'CSS', 'MERN']);
  const [selectedTrack, setSelectedTrack] = useState('React');
  const [challenge, setChallenge] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedLine, setSelectedLine] = useState(null);
  const [hoveredLine, setHoveredLine] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [architectContext, setArchitectContext] = useState(null);
  const [isArchitectOpen, setIsArchitectOpen] = useState(false);

  const openArchitect = (ctx) => {
    playTactilePop();
    setArchitectContext(ctx);
    setIsArchitectOpen(true);
  };

  const [solvedIds, setSolvedIds] = useState([]);
  const [sessionBugsCaught, setSessionBugsCaught] = useState(0);

  // Fetch available tracks on mount
  useEffect(() => {
    getSpotTheBugTracksApi()
      .then(({ data }) => {
        if (data.success && Array.isArray(data.tracks) && data.tracks.length > 0) {
          setTracks(data.tracks);
        }
      })
      .catch((err) => console.warn('Using default tracks:', err));
  }, []);

  // Fetch a challenge for the selected track
  const loadChallenge = useCallback(
    async (track = selectedTrack) => {
      setIsLoading(true);
      setSelectedLine(null);
      setHoveredLine(null);
      setVerificationResult(null);

      try {
        const { data } = await getSpotTheBugChallengeApi({
          category: track,
          exclude: solvedIds.join(','),
        });

        if (data.success && data.challenge) {
          setChallenge(data.challenge);
        } else {
          toast.error('Could not load bug challenge');
        }
      } catch (err) {
        console.error('Failed to load challenge:', err);
        toast.error('Failed to load challenge. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [selectedTrack, solvedIds]
  );

  useEffect(() => {
    loadChallenge(selectedTrack);
  }, [selectedTrack, loadChallenge]);

  const handleTrackChange = (track) => {
    if (track === selectedTrack) return;
    playTactilePop();
    setSelectedTrack(track);
  };

  const handleLineClick = (lineIndex) => {
    if (verificationResult || isVerifying) return;
    playTactilePop();
    setSelectedLine(lineIndex);
  };

  const handleVerify = async () => {
    if (!challenge || selectedLine === null || isVerifying || verificationResult) return;
    playTactilePop();
    setIsVerifying(true);

    try {
      const { data } = await verifySpotTheBugAnswerApi({
        challengeId: challenge.id,
        selectedLine,
      });

      if (data.success) {
        setVerificationResult(data);
        setSolvedIds((prev) => [...prev, challenge.id]);

        if (data.isCorrect) {
          setSessionBugsCaught((prev) => prev + 1);
          toast.success(`Spot On! +${data.earnedXP} XP earned`);
        } else {
          toast.error(`Misdiagnosed line. Bug was on Line ${data.buggyLine}`);
        }
      }
    } catch (err) {
      console.error('Verification error:', err);
      toast.error('Verification failed. Please retry.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleNextChallenge = () => {
    playTactilePop();
    loadChallenge(selectedTrack);
  };

  // Keyboard Navigation: Enter to verify, N for next bug
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'Enter' && selectedLine !== null && !verificationResult && !isVerifying) {
        e.preventDefault();
        handleVerify();
      } else if ((e.key === 'n' || e.key === 'N') && verificationResult) {
        e.preventDefault();
        handleNextChallenge();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedLine, verificationResult, isVerifying]);

  const currentFilename =
    TRACK_FILENAMES[challenge?.category || selectedTrack] || 'src/index.js';

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-zinc-500 mb-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="uppercase tracking-widest font-semibold text-rose-400">
              Spot the Bug Mode
            </span>
            <span>·</span>
            <span>Interactive Code Inspection</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight">
            Find the Exact Buggy Line
          </h1>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-2.5 font-mono text-xs self-start sm:self-center">
          <div className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-zinc-300">
            <span className="text-rose-400">🐞</span>
            <span>{sessionBugsCaught} caught</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-zinc-300">
            <span className="text-amber-400">🔥</span>
            <span>{streak || 1}d streak</span>
          </div>

          <button
            onClick={() => {
              playTactilePop();
              navigate('/');
            }}
            className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition"
          >
            Esc
          </button>
        </div>
      </div>

      {/* Track Selector Pills */}
      <div className="mt-6 flex flex-wrap gap-2 items-center">
        <span className="font-mono text-xs uppercase tracking-wider text-zinc-500 mr-2">
          Track:
        </span>
        {tracks.map((track) => {
          const isSelected = track === selectedTrack;
          return (
            <button
              key={track}
              onClick={() => handleTrackChange(track)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs transition border ${
                isSelected
                  ? 'border-zinc-500 bg-zinc-800 text-zinc-100 font-semibold'
                  : 'border-zinc-800/80 bg-zinc-900/40 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              <TechIcon name={track} className="w-3.5 h-3.5 opacity-90" />
              <span>{track}</span>
            </button>
          );
        })}
      </div>

      {/* Main Challenge Workspace */}
      {isLoading ? (
        <div className="mt-8 rounded-xl border border-zinc-800 bg-[#121215] p-12 text-center">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-zinc-700 border-t-zinc-200 mb-3" />
          <p className="font-mono text-xs text-zinc-500">Loading code inspection challenge...</p>
        </div>
      ) : challenge ? (
        <div className="mt-8 space-y-6">
          {/* Bug Symptom / Context Banner */}
          <div className="rounded-xl border border-zinc-800 bg-[#121215] p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 font-mono text-xs">
              <span className="text-zinc-400 font-semibold">{challenge.topic}</span>
              <span className="text-zinc-500">Level {challenge.level}.0 · Senior Assessment</span>
            </div>

            <h2 className="text-base sm:text-lg font-bold text-zinc-100 mb-1.5">
              {challenge.title}
            </h2>

            <p className="text-sm leading-relaxed text-zinc-400">
              <span className="font-semibold text-zinc-300">Observed Behavior: </span>
              {challenge.description}
            </p>
          </div>

          {/* Interactive Code Editor Pane */}
          <div className="rounded-xl border border-zinc-800 bg-[#0c0c0e] shadow-2xl overflow-hidden font-mono text-xs sm:text-sm">
            {/* Editor Window Header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/80 border-b border-zinc-800 text-xs">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                  <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                  <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                </div>
                <span className="text-zinc-400 pl-2 font-mono">{currentFilename}</span>
              </div>

              <div className="text-[11px] text-zinc-500 font-mono">
                {selectedLine ? (
                  <span className="text-amber-400">Selected Line {selectedLine}</span>
                ) : (
                  <span>Click any line to tag bug</span>
                )}
              </div>
            </div>

            {/* Code Lines Container */}
            <div className="py-3 overflow-x-auto select-none">
              {challenge.codeLines.map((line, idx) => {
                const lineNumber = idx + 1;
                const isSelected = selectedLine === lineNumber;
                const isHovered = hoveredLine === lineNumber && !verificationResult;

                // Status highlighting after verification
                const isCorrectBug =
                  verificationResult && lineNumber === verificationResult.buggyLine;
                const isWrongSelection =
                  verificationResult &&
                  !verificationResult.isCorrect &&
                  lineNumber === verificationResult.selectedLine;

                let rowBgClass = 'hover:bg-zinc-800/40';
                let indicatorColor = 'text-zinc-600';

                if (isCorrectBug) {
                  rowBgClass = 'bg-emerald-500/15 border-l-2 border-emerald-500';
                  indicatorColor = 'text-emerald-400 font-bold';
                } else if (isWrongSelection) {
                  rowBgClass = 'bg-rose-500/15 border-l-2 border-rose-500';
                  indicatorColor = 'text-rose-400 font-bold';
                } else if (isSelected) {
                  rowBgClass = 'bg-amber-500/10 border-l-2 border-amber-500';
                  indicatorColor = 'text-amber-400 font-bold';
                } else if (isHovered) {
                  rowBgClass = 'bg-zinc-800/40 border-l-2 border-zinc-600';
                }

                return (
                  <div
                    key={lineNumber}
                    onClick={() => handleLineClick(lineNumber)}
                    onMouseEnter={() => setHoveredLine(lineNumber)}
                    onMouseLeave={() => setHoveredLine(null)}
                    className={`flex items-center px-4 py-1.5 transition-colors cursor-pointer group ${rowBgClass}`}
                  >
                    {/* Line Gutter Number */}
                    <div
                      className={`w-10 sm:w-12 text-right pr-4 font-mono text-xs tabular-nums select-none ${indicatorColor}`}
                    >
                      {String(lineNumber).padStart(2, '0')}
                    </div>

                    {/* Code Content */}
                    <div className="flex-1 font-mono text-zinc-200 whitespace-pre">
                      {line || ' '}
                    </div>

                    {/* Trailing Selection Pill */}
                    {!verificationResult && (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity pl-2">
                        <span
                          className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded ${
                            isSelected
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                          }`}
                        >
                          {isSelected ? 'Targeted' : `Line ${lineNumber}`}
                        </span>
                      </div>
                    )}

                    {/* Result Line Badge */}
                    {isCorrectBug && (
                      <div className="pl-2">
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          Culprit Line
                        </span>
                      </div>
                    )}
                    {isWrongSelection && (
                      <div className="pl-2">
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                          False Positive
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions Bar */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-zinc-900/60 border-t border-zinc-800">
              <div className="font-mono text-xs text-zinc-400 flex items-center gap-2">
                <span>Selected:</span>
                {selectedLine ? (
                  <span className="rounded bg-zinc-800 px-2 py-0.5 text-zinc-200 font-semibold">
                    Line {selectedLine}
                  </span>
                ) : (
                  <span className="text-zinc-600">None</span>
                )}
              </div>

              {!verificationResult ? (
                <button
                  onClick={handleVerify}
                  disabled={selectedLine === null || isVerifying}
                  className={`btn-primary py-2 px-5 text-xs sm:text-sm font-mono flex items-center gap-2 ${
                    selectedLine === null || isVerifying
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                >
                  {isVerifying ? (
                    <span>Verifying Line...</span>
                  ) : (
                    <>
                      <span>Inspect Line</span>
                      <kbd className="hidden sm:inline-block rounded bg-zinc-900 px-1.5 py-0.5 text-[10px] border border-zinc-700">
                        ↵ Enter
                      </kbd>
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleNextChallenge}
                  className="btn-primary py-2 px-5 text-xs sm:text-sm font-mono flex items-center gap-2"
                >
                  <span>Next Bug</span>
                  <kbd className="hidden sm:inline-block rounded bg-zinc-900 px-1.5 py-0.5 text-[10px] border border-zinc-700">
                    N
                  </kbd>
                  <span>→</span>
                </button>
              )}
            </div>
          </div>

          {/* Post-Verification Senior Developer Review */}
          {verificationResult && (
            <div
              className={`rounded-xl border p-6 font-mono space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                verificationResult.isCorrect
                  ? 'border-emerald-500/30 bg-emerald-950/20'
                  : 'border-zinc-800 bg-[#121215]'
              }`}
            >
              {/* Verdict Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">
                    {verificationResult.isCorrect ? '✅' : '❌'}
                  </span>
                  <h3
                    className={`text-base font-bold ${
                      verificationResult.isCorrect
                        ? 'text-emerald-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {verificationResult.isCorrect
                      ? `Bug Caught on Line ${verificationResult.buggyLine}!`
                      : `Root cause was on Line ${verificationResult.buggyLine}`}
                  </h3>
                </div>

                <div className="text-xs text-zinc-400">
                  +{verificationResult.earnedXP} XP Earned
                </div>
              </div>

              {/* Code Diff Box */}
              <div className="rounded-lg border border-zinc-800/80 bg-zinc-950 p-4 space-y-1.5 text-xs">
                <div className="text-zinc-500 text-[11px] uppercase tracking-wider mb-2 font-semibold">
                  Production Code Patch:
                </div>
                <div className="flex items-center gap-2 text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded">
                  <span className="font-bold select-none">-</span>
                  <span className="text-zinc-300 whitespace-pre">
                    {verificationResult.buggyCode}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded">
                  <span className="font-bold select-none">+</span>
                  <span className="text-zinc-100 whitespace-pre">
                    {verificationResult.fixedCode}
                  </span>
                </div>
              </div>

              {/* Technical Explanation */}
              <div className="pt-2 text-xs sm:text-sm leading-relaxed text-zinc-300">
                <span className="font-semibold text-zinc-200">
                  Senior Architect Review:{' '}
                </span>
                {verificationResult.explanation}
              </div>

              {/* Next CTA */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  onClick={() =>
                    openArchitect({
                      category: challenge.category,
                      topic: challenge.topic,
                      title: challenge.title,
                      question: challenge.description,
                      codeSnippet: challenge.codeLines.join('\n'),
                      userAnswer: `Line ${verificationResult.selectedLine}`,
                      correctAnswer: `Line ${verificationResult.buggyLine}: ${verificationResult.buggyCode}`,
                      explanation: verificationResult.explanation,
                    })
                  }
                  className="w-full sm:w-auto rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-2 font-mono text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
                >
                  <span>🔍 Ask Senior Architect</span>
                </button>

                <button
                  onClick={handleNextChallenge}
                  className="btn-primary w-full sm:w-auto text-xs py-2 px-4"
                >
                  Continue to Next Challenge →
                </button>
              </div>
            </div>
          )}
        </div>
      ) : null}

      <SeniorArchitectDrawer
        isOpen={isArchitectOpen}
        onClose={() => setIsArchitectOpen(false)}
        questionContext={architectContext}
      />
    </div>
  );
};

export default SpotTheBug;
