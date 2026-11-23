import React from 'react'

const stepsData = [
  {
    step: 'step1',
    title: 'Select a Track',
    description: 'Choose from React, JavaScript, Python, MERN, CSS, or Tailwind CSS.',
  },
  {
    step: 'step2',
    title: 'Answer Timed Questions',
    description: 'Read each problem carefully and lock in your answer before the timer expires.',
  },
  {
    step: 'step3',
    title: 'Review Your Performance',
    description: 'Inspect detailed explanations for correct answers and track improvement.',
  },
  {
    step: 'step4',
    title: 'Claim Your Certificate',
    description: 'Score full marks in any category to unlock and showcase your verified certificate.',
  },
]

const Steps = () => {
  return (
    <section className="text-white py-14 border-t border-white/10 mb-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <p className="font-mono text-xs uppercase tracking-widest font-semibold text-cyan-300 mb-2">
            Quick Guide
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            How It Works
          </h2>
          <p className="mt-2 text-sm sm:text-base font-medium text-slate-300 max-w-md mx-auto">
            Four simple steps to test your skills and earn proof of mastery.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stepsData.map((step, index) => (
            <div
              key={step.step}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm flex flex-col items-start transition hover:border-cyan-300/40"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-400 text-slate-950 flex items-center justify-center mb-5 font-mono font-bold text-base shadow-sm">
                0{index + 1}
              </div>
              <h3 className="font-bold text-lg text-white mb-2 tracking-tight">
                {step.title}
              </h3>
              <p className="text-sm font-normal text-slate-300 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Steps
