import React from 'react'

const Modal = ({ closeModal, startQuiz, selectedCategory }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl rounded-2xl bg-[#0f172a] p-6 sm:p-8 md:p-10 shadow-2xl border-2 border-white/10">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2 text-center">
          Quiz Instructions
        </h2>
        <div className="mb-6 flex justify-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3.5 py-1 font-mono text-xs font-semibold uppercase tracking-wider text-cyan-300">
            Track: {selectedCategory}
          </span>
        </div>
        <ul className="list-decimal pl-5 sm:pl-6 text-sm sm:text-base font-normal leading-relaxed text-slate-200 space-y-2.5">
          <li>Read each question carefully before selecting your answer.</li>
          <li>You have 10 seconds per question to choose an answer.</li>
          <li>You can use keyboard shortcuts <strong>[1-4]</strong> or <strong>[A-D]</strong> to quickly select options.</li>
          <li>Press <strong>[Enter]</strong> to immediately advance to the next question.</li>
          <li>Score 100% on any track to unlock an official verified certificate.</li>
          <li>Answers are evaluated and verified server-side upon completion.</li>
        </ul>
        <p className="text-center mt-6 text-base md:text-lg font-semibold text-slate-100">
          Good Luck!
        </p>
        <div className="mt-6 flex flex-col sm:flex-row justify-between gap-3">
          <button
            onClick={closeModal}
            className="btn-tactile-dark px-6 py-3 text-sm font-semibold w-full sm:w-auto"
          >
            Cancel
          </button>
          <button
            onClick={startQuiz}
            className="btn-tactile-primary px-7 py-3 text-sm sm:text-base font-bold w-full sm:w-auto"
          >
            Start {selectedCategory} Challenge →
          </button>
        </div>
        <p className="mt-5 text-center font-mono text-xs font-medium text-amber-200/90">
          Note: Timer starts immediately upon clicking start.
        </p>
      </div>
    </div>
  )
}

export default Modal
