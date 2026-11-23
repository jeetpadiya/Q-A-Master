import React from 'react'
import question from '../assets/question.png'
import { FaFacebook, FaInstagram } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-[#0c0620] text-slate-300 pt-12 pb-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center pb-8 border-b border-white/10 gap-8">
          <div>
            <img src={question} alt="Logo" className="w-40 brightness-110" />
            <p className="mt-3 text-sm font-medium text-slate-400 max-w-xs">
              Interactive coding quizzes and skill certifications for developers.
            </p>
          </div>

          <div className="flex flex-wrap gap-10 sm:gap-16">
            <div>
              <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-slate-200 mb-3">
                Quick Links
              </h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-slate-400 hover:text-white transition">About Us</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition">How to Play</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition">Tracks</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition">Leaderboard</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-slate-200 mb-3">
                Support
              </h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-slate-400 hover:text-white transition">FAQ</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition">Terms &amp; Conditions</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-slate-200 mb-3">
                Community
              </h4>
              <div className="flex space-x-3">
                <a
                  href="#"
                  aria-label="Facebook"
                  className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/10 text-white hover:bg-cyan-400 hover:text-slate-950 transition"
                >
                  <FaFacebook className="text-lg" />
                </a>
                <a
                  href="#"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/10 text-white hover:bg-cyan-400 hover:text-slate-950 transition"
                >
                  <FaInstagram className="text-lg" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-slate-500">
          <p>© 2025 Jeet Padia. All Rights Reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-slate-300 transition">Terms</a>
            <a href="#" className="hover:text-slate-300 transition">Privacy</a>
            <a href="#" className="hover:text-slate-300 transition">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
