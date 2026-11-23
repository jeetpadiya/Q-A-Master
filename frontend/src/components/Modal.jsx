import React from 'react';

const Modal = ({ closeModal, startQuiz, selectedCategory }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md sm:max-w-lg rounded-xl bg-[#121215] border border-zinc-800 p-6 sm:p-7 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-4">
          <h2 className="text-lg font-bold text-zinc-100">
            Classic 10s Blitz Mode
          </h2>
          <span className="font-mono text-xs px-2.5 py-0.5 rounded border border-zinc-700 bg-zinc-800 text-zinc-300">
            {selectedCategory}
          </span>
        </div>

        <ul className="text-xs sm:text-sm text-zinc-300 space-y-2.5 leading-relaxed">
          <li className="flex items-start gap-2">
            <span className="text-zinc-500 font-mono">01.</span>
            <span>10 fast-paced questions with a strict 10-second countdown per question.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-zinc-500 font-mono">02.</span>
            <span>Press keys <strong className="font-mono text-zinc-200">[A-D]</strong> or <strong className="font-mono text-zinc-200">[1-4]</strong> to lock in your answer.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-zinc-500 font-mono">03.</span>
            <span>Score 10/10 to unlock your permanent verified certificate.</span>
          </li>
        </ul>

        <div className="mt-7 flex items-center justify-end gap-2.5 pt-4 border-t border-zinc-800">
          <button
            onClick={closeModal}
            className="btn-secondary py-2 px-4 text-xs font-medium"
          >
            Cancel
          </button>
          <button
            onClick={startQuiz}
            className="btn-primary py-2 px-5 text-xs font-semibold"
          >
            Begin Blitz Quiz →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
