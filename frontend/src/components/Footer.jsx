import React from 'react'

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-[#070a12] text-slate-400 pt-12 pb-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center pb-8 border-b border-white/10 gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-slate-950 font-mono font-bold text-sm shadow-sm">
                QA
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white">
                Q-A <span className="text-cyan-400">Master</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-400 max-w-xs leading-relaxed">
              Tactile coding quizzes, server-verified scoring, and developer skill certifications.
            </p>
          </div>

          <div className="flex flex-wrap gap-10 sm:gap-16">
            <div>
              <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-slate-200 mb-3">
                Tracks
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li><a href="#" className="hover:text-white transition">React Track</a></li>
                <li><a href="#" className="hover:text-white transition">JavaScript Track</a></li>
                <li><a href="#" className="hover:text-white transition">Python Track</a></li>
                <li><a href="#" className="hover:text-white transition">Tailwind CSS Track</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-slate-200 mb-3">
                Platform
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li><a href="#" className="hover:text-white transition">Verify Certificate</a></li>
                <li><a href="#" className="hover:text-white transition">How It Works</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-slate-500">
          <p>© 2025 Jeet Padia. All Rights Reserved.</p>
          <div className="flex space-x-6">
            <span className="text-emerald-400">● Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
