import React from 'react';

const stepsData = [
  {
    step: '01',
    title: 'Select Track',
    description: 'Pick from React, JavaScript, Python, CSS, Tailwind, or the MERN full-stack curriculum.',
  },
  {
    step: '02',
    title: 'Adaptive Calibration',
    description: 'Questions scale dynamically. Answer correctly to climb from Junior (L1) to Staff (L5).',
  },
  {
    step: '03',
    title: 'Concept Breakdown',
    description: 'Every answer returns technical grounding referencing language specifications and edge cases.',
  },
  {
    step: '04',
    title: 'Verifiable Proof',
    description: 'Demonstrate technical ceiling and unlock high-resolution cryptographic certificates.',
  },
];

const Steps = () => {
  return (
    <section className="py-16 border-t border-zinc-800/80 bg-[#09090b]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mb-12">
          <p className="font-mono text-xs uppercase tracking-widest font-semibold text-zinc-500 mb-2">
            Assessment Workflow
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
            How evaluation works
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Engineered for engineers. Designed to assess practical depth over trivia.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stepsData.map((step) => (
            <div
              key={step.step}
              className="rounded-xl border border-zinc-800 bg-[#121215] p-5 flex flex-col justify-between transition hover:border-zinc-700"
            >
              <div>
                <span className="font-mono text-xs font-semibold text-zinc-400 rounded-md border border-zinc-700/80 bg-zinc-800 px-2 py-0.5 inline-block mb-4">
                  {step.step}
                </span>
                <h3 className="font-semibold text-sm text-zinc-200 mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Steps;
