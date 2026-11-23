import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import Steps from './Steps';
import { useContext } from 'react';
import { QuizContext } from '../context/QuizContext';
import { TechIcon } from './TechIcon';
import { playTactilePop } from '../utils/sound';

const Header = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { categories, selectedCategory, handleCategoryChange } = useContext(QuizContext);

  const openModal = () => {
    playTactilePop();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    playTactilePop();
    setIsModalOpen(false);
  };

  const startQuiz = () => {
    playTactilePop();
    setIsModalOpen(false);
    navigate('/quiz');
  };

  const startAdaptiveQuiz = () => {
    playTactilePop();
    navigate('/adaptive');
  };

  const selectCategory = (cat) => {
    playTactilePop();
    handleCategoryChange(cat);
  };

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Column: True Minimalist Developer Intro */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1 text-xs text-zinc-400 font-mono mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Computerized Adaptive Testing · Gemini RAG Engine</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-100 leading-[1.08]">
              The developer skill assessment platform.
            </h1>

            <p className="mt-4 text-base sm:text-lg font-normal leading-relaxed text-zinc-400 max-w-xl mx-auto lg:mx-0">
              Interactive code challenges where difficulty scales dynamically with every correct answer. Grounded in language specifications to evaluate real engineering seniority.
            </p>

            {/* Clean Track Selector */}
            <div className="mt-8">
              <p className="font-mono text-xs uppercase tracking-widest font-medium text-zinc-500 mb-3">
                Technical Tracks
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                {categories.map((category) => {
                  const isSelected = selectedCategory === category;
                  return (
                    <button
                      key={category}
                      onClick={() => selectCategory(category)}
                      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium text-xs sm:text-sm transition-all select-none border ${
                        isSelected
                          ? 'border-zinc-600 bg-zinc-800 text-zinc-100 shadow-sm'
                          : 'border-zinc-800/80 bg-zinc-900/40 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                      }`}
                    >
                      <TechIcon name={category} className="w-4 h-4 opacity-90" />
                      <span>{category}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Assessment Mode CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <button
                onClick={startAdaptiveQuiz}
                className="btn-primary w-full sm:w-auto"
              >
                <span>Start AI Adaptive Challenge</span>
                <span className="ml-2 font-mono">→</span>
              </button>

              <button
                onClick={openModal}
                className="btn-secondary w-full sm:w-auto"
              >
                Classic 10s Blitz
              </button>
            </div>

            {/* Minimalist Specs Row */}
            <div className="mt-12 pt-6 border-t border-zinc-800/80 grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0 text-center lg:text-left font-mono">
              <div>
                <p className="text-xl font-bold text-zinc-200">1.0 → 5.0</p>
                <p className="text-[11px] text-zinc-500 uppercase tracking-wider mt-0.5">Dynamic Levels</p>
              </div>
              <div>
                <p className="text-xl font-bold text-zinc-200">Zero Leak</p>
                <p className="text-[11px] text-zinc-500 uppercase tracking-wider mt-0.5">Server Verified</p>
              </div>
              <div>
                <p className="text-xl font-bold text-zinc-200">Instant</p>
                <p className="text-[11px] text-zinc-500 uppercase tracking-wider mt-0.5">PNG Certificate</p>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Code Inspector Terminal */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-[#121215] shadow-2xl overflow-hidden font-mono text-xs">
              {/* Terminal Titlebar */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/70 border-b border-zinc-800">
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                  <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                  <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                </div>
                <span className="text-[11px] text-zinc-400">adaptive-eval.tsx</span>
                <span className="text-[10px] text-emerald-400 font-semibold">● LIVE</span>
              </div>

              {/* Code Snippet */}
              <div className="p-4 space-y-3 leading-relaxed text-zinc-300">
                <div className="text-zinc-500">// Track: {selectedCategory} · Level 3.4 Senior Evaluation</div>
                <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 text-[11px] space-y-1">
                  <div><span className="text-indigo-400">const</span> [state, setState] = <span className="text-cyan-400">useState</span>({`{ count: 0 }`});</div>
                  <div><span className="text-indigo-400">function</span> <span className="text-amber-300">update</span>() {`{`}</div>
                  <div className="pl-4 text-zinc-400">setState(prev =&gt; prev); <span className="text-zinc-600">// Object.is bailout?</span></div>
                  <div>{`}`}</div>
                </div>

                <div className="text-zinc-400 pt-1">
                  <span className="text-zinc-500 font-semibold">Invariant:</span> React compares references. Identical references trigger reconciliation bailout.
                </div>

                <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500">
                  <span>Engine: Gemini 3.8 RAG</span>
                  <span className="text-zinc-300">Target: Staff Engineer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Steps />

      {isModalOpen && (
        <Modal closeModal={closeModal} startQuiz={startQuiz} selectedCategory={selectedCategory} />
      )}
    </>
  );
};

export default Header;
