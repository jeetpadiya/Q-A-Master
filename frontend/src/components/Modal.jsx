import React from 'react'

const Modal = ({ closeModal, startQuiz, selectedCategory }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl rounded-2xl bg-gradient-to-r from-[#13072e] to-[#3f2182] p-6 sm:p-8 md:p-10 shadow-2xl border border-white/10">
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
          <li>You must complete the quiz within the allotted time.</li>
          <li>Each question has only one correct answer unless stated otherwise.</li>
          <li>Do not refresh the page or press the back button during the quiz.</li>
          <li>Your score will be displayed at the end of the quiz.</li>
          <li>Click the &quot;Submit&quot; button once you have answered all questions.</li>
          <li>Use a stable internet connection to avoid interruptions.</li>
        </ul>
        <p className="text-center mt-6 text-base md:text-lg font-semibold text-slate-100">
          All The Best!
        </p>
        <div className="mt-6 flex flex-col sm:flex-row justify-between gap-4">
          <button
            onClick={closeModal}
            className="w-full sm:w-auto rounded-full bg-white/10 px-6 py-2.5 text-sm sm:text-base font-semibold text-slate-200 transition hover:bg-rose-500/80 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={startQuiz}
            className="w-full sm:w-auto rounded-full bg-cyan-400 px-6 py-2.5 text-sm sm:text-base font-bold text-slate-950 transition hover:bg-cyan-300"
          >
            Start {selectedCategory} Quiz →
          </button>
        </div>
        <p className="mt-5 text-center font-mono text-xs font-medium text-amber-200/90">
          Note: Timer will start automatically once you begin.
        </p>
      </div>
    </div>
  )
}

export default Modal
