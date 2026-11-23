import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import Steps from './Steps';
import { useContext } from 'react';
import { QuizContext } from '../context/QuizContext';
import { TechIcon, TrophyIcon, FlameIcon } from './TechIcon';
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

  const selectCategory = (cat) => {
    playTactilePop();
    handleCategoryChange(cat);
  };

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Headline & Track Selector */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3.5 py-1 font-mono text-xs font-semibold text-cyan-300 mb-6 shadow-sm">
              <FlameIcon className="w-4 h-4 text-amber-400" />
              <span>Interactive Developer Assessment</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              Master Code.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-200 to-indigo-300">
                Prove Your Skills.
              </span>
            </h1>

            <p className="mt-4 text-base sm:text-lg md:text-xl font-normal leading-relaxed text-slate-300 max-w-2xl mx-auto lg:mx-0">
              Take timed developer challenges, diagnose tricky language edge-cases, and earn verified completion credentials stored directly in your account.
            </p>

            {/* Category Track Selector with Tactile Buttons */}
            <div className="mt-8">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
                <span className="font-mono text-xs uppercase tracking-wider font-semibold text-slate-400">
                  Select Track:
                </span>
                <span className="font-mono text-xs font-bold text-cyan-300">
                  {selectedCategory}
                </span>
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start gap-2.5">
                {categories.map((category) => {
                  const isSelected = selectedCategory === category;
                  return (
                    <button
                      key={category}
                      onClick={() => selectCategory(category)}
                      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all select-none ${
                        isSelected
                          ? 'bg-cyan-400 text-slate-950 border-b-4 border-cyan-600 active:border-b-0 active:translate-y-1 shadow-md'
                          : 'bg-[#151c2e] text-slate-200 border border-white/10 border-b-4 border-slate-900 hover:border-cyan-400/50 hover:bg-[#1a233a] active:border-b-2 active:translate-y-[2px]'
                      }`}
                    >
                      <TechIcon name={category} className="w-4 h-4" />
                      <span>{category}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={openModal}
                className="btn-tactile-primary px-8 py-4 text-base sm:text-lg w-full sm:w-auto shadow-lg"
              >
                <span>Start {selectedCategory} Challenge</span>
                <span className="ml-2 font-mono font-bold">→</span>
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-tactile-dark px-6 py-4 text-sm sm:text-base w-full sm:w-auto"
              >
                View Certificates
              </button>
            </div>

            {/* Stats Row */}
            <div className="mt-10 pt-6 border-t border-white/10 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
              <div>
                <p className="font-mono text-xl sm:text-2xl font-extrabold text-white">60+</p>
                <p className="font-mono text-xs text-slate-400 uppercase tracking-wider">Curated Qs</p>
              </div>
              <div>
                <p className="font-mono text-xl sm:text-2xl font-extrabold text-cyan-300">10s</p>
                <p className="font-mono text-xs text-slate-400 uppercase tracking-wider">Blitz Speed</p>
              </div>
              <div>
                <p className="font-mono text-xl sm:text-2xl font-extrabold text-emerald-400">100%</p>
                <p className="font-mono text-xs text-slate-400 uppercase tracking-wider">Verified Certs</p>
              </div>
            </div>
          </div>

          {/* Right Column: Gamified Live Card Preview (Replaces stock question mark) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md rounded-2xl border-2 border-white/10 bg-[#0f172a] p-6 shadow-2xl relative">
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <TechIcon name={selectedCategory} className="w-6 h-6" />
                  <div>
                    <p className="font-bold text-sm text-white">{selectedCategory} Mastery</p>
                    <p className="font-mono text-[11px] text-slate-400">Track 01 · 10 Questions</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 rounded-lg border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 font-mono text-xs font-bold text-amber-300">
                  <span>⏱</span>
                  <span>10s</span>
                </div>
              </div>

              {/* Sample Live Question Preview */}
              <div className="my-5">
                <p className="font-mono text-[11px] uppercase tracking-wider font-semibold text-cyan-400 mb-1">
                  Question 01 of 10
                </p>
                <h3 className="font-bold text-base text-slate-100 leading-snug">
                  What is the primary purpose of useEffect in modern React?
                </h3>
              </div>

              {/* Interactive Mock Options */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/5 font-medium text-xs text-slate-300">
                  <span className="flex h-5 w-5 items-center justify-center rounded-md border border-white/20 bg-white/10 font-mono text-[10px] font-bold text-slate-400">
                    A
                  </span>
                  <span>Directly mutate DOM nodes on hover</span>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-cyan-400/80 bg-cyan-950/30 font-medium text-xs text-cyan-100">
                  <span className="flex h-5 w-5 items-center justify-center rounded-md bg-cyan-400 font-mono text-[10px] font-bold text-slate-950">
                    B
                  </span>
                  <span>Synchronize side-effects with component state</span>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/5 font-medium text-xs text-slate-300">
                  <span className="flex h-5 w-5 items-center justify-center rounded-md border border-white/20 bg-white/10 font-mono text-[10px] font-bold text-slate-400">
                    C
                  </span>
                  <span>Compile JSX to WebAssembly</span>
                </div>
              </div>

              {/* Badge Preview */}
              <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between font-mono text-xs text-slate-400">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <TrophyIcon className="w-4 h-4 text-amber-400" />
                  <span>Unlocks Credential</span>
                </div>
                <span className="text-[11px]">Server Authenticated</span>
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
