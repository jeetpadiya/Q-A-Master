import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t border-zinc-800 bg-[#09090b] text-zinc-500 text-xs py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-8 border-b border-zinc-800/80">
          <div className="flex items-center gap-2.5">
            <div className="flex h-6 w-6 items-center justify-center rounded border border-zinc-700 bg-zinc-800 text-zinc-200 font-mono text-[11px] font-bold">
              QA
            </div>
            <span className="font-semibold text-sm text-zinc-200">
              Q-A Master
            </span>
            <span className="text-zinc-600">·</span>
            <span className="text-zinc-400 text-xs">Computerized Adaptive Testing</span>
          </div>

          <div className="flex flex-wrap gap-6 text-zinc-400">
            <a href="#" className="hover:text-zinc-200 transition">Documentation</a>
            <a href="#" className="hover:text-zinc-200 transition">Tracks</a>
            <a href="#" className="hover:text-zinc-200 transition">Verify Credential</a>
            <a href="#" className="hover:text-zinc-200 transition">Privacy</a>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-zinc-500 font-mono text-[11px]">
          <p>© 2025 Q-A Master. Open source engineering assessment.</p>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>Systems Normal</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
