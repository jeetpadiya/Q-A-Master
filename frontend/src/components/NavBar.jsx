import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { QuizContext } from '../context/QuizContext';
import { SoundIcon } from './TechIcon';
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
    <nav className="sticky top-0 z-40 border-b border-zinc-800/80 bg-[#09090b]/85 backdrop-blur-md px-4 sm:px-8 py-3">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Brand Mark */}
        <div
          className="flex items-center gap-2.5 cursor-pointer select-none"
          onClick={() => {
            playTactilePop();
            navigate('/');
          }}
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-md border border-zinc-700 bg-zinc-800 text-zinc-100 font-mono text-xs font-bold">
            QA
          </div>
          <span className="font-semibold text-sm sm:text-base tracking-tight text-zinc-100">
            Q-A Master
          </span>
          <span className="hidden sm:inline-block rounded-full border border-zinc-800 bg-zinc-900 px-2 py-0.5 font-mono text-[10px] text-zinc-500 font-medium">
            CAT / RAG
          </span>
        </div>

        {/* Muted Developer Stats */}
        <div className="hidden sm:flex items-center gap-2.5 font-mono text-xs text-zinc-400">
          <div className="flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900/60 px-2.5 py-1">
            <span className="text-amber-400">🔥</span>
            <span>{streak || 1}d streak</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900/60 px-2.5 py-1">
            <span className="text-zinc-500">⚡</span>
            <span>{xp || 120} XP</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={muted ? 'Unmute Audio' : 'Mute Audio'}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-100 transition"
          >
            <SoundIcon muted={muted} className="w-3.5 h-3.5" />
          </button>

          {/* Dashboard Button */}
          <button
            onClick={() => {
              playTactilePop();
              navigate('/dashboard');
            }}
            className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5"
          >
            <span>Certificates</span>
            {earnedCertificates.length > 0 && (
              <span className="rounded-full bg-zinc-800 px-1.5 py-0.2 font-mono text-[10px] text-zinc-300">
                {earnedCertificates.length}
              </span>
            )}
          </button>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="rounded-lg border border-transparent px-2.5 py-1.5 font-mono text-xs text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
