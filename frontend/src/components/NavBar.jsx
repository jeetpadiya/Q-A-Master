import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { QuizContext } from '../context/QuizContext';
import { SoundIcon, TrophyIcon, FlameIcon } from './TechIcon';
import { isAudioMuted, setAudioMuted, playTactilePop } from '../utils/sound';

const NavBar = () => {
  const navigate = useNavigate();
  const { handleLogout, earnedCertificates, xp, streak } = useContext(QuizContext);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    setMuted(isAudioMuted());
  }, []);

  const toggleSound = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    setAudioMuted(nextMuted);
    if (!nextMuted) playTactilePop();
  };

  const onLogout = () => {
    playTactilePop();
    handleLogout();
    navigate('/register', { replace: true });
  };

  return (
    <nav className="flex flex-row bg-[#0b0f19]/90 backdrop-blur-md border-b border-white/10 justify-between items-center px-4 sm:px-8 py-3.5 sticky top-0 z-40">
      {/* Brand Mark */}
      <div
        className="flex items-center gap-2.5 cursor-pointer select-none"
        onClick={() => {
          playTactilePop();
          navigate('/');
        }}
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-slate-950 font-mono font-bold text-base shadow-sm">
          QA
        </div>
        <span className="font-extrabold text-base sm:text-lg tracking-tight text-white">
          Q-A <span className="text-cyan-400">Master</span>
        </span>
      </div>

      {/* Gamification Stats: Streak & XP */}
      <div className="hidden sm:flex items-center gap-2 font-mono text-xs">
        <div
          title="Daily Streak"
          className="flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 font-bold text-amber-300 shadow-sm"
        >
          <FlameIcon className="w-3.5 h-3.5 text-amber-400" />
          <span>{streak || 1}d Streak</span>
        </div>

        <div
          title="Total Experience Points"
          className="flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 font-bold text-cyan-300 shadow-sm"
        >
          <span>⚡</span>
          <span>{xp || 120} XP</span>
        </div>
      </div>

      {/* Navigation Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          title={muted ? 'Unmute Audio' : 'Mute Audio'}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:border-cyan-400/50 hover:text-white transition"
        >
          <SoundIcon muted={muted} className="w-4 h-4" />
        </button>

        {/* Dashboard Link with Certificate Count */}
        <button
          onClick={() => {
            playTactilePop();
            navigate('/dashboard');
          }}
          className="btn-tactile-dark px-3.5 py-1.5 text-xs font-semibold gap-1.5"
        >
          <TrophyIcon className="w-3.5 h-3.5 text-amber-400" />
          <span>Dashboard</span>
          {earnedCertificates.length > 0 && (
            <span className="ml-1 rounded-full bg-cyan-400/20 px-1.5 py-0.2 font-mono text-[10px] font-bold text-cyan-300">
              {earnedCertificates.length}
            </span>
          )}
        </button>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs font-semibold text-slate-300 hover:bg-rose-500/80 hover:text-white hover:border-transparent transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
