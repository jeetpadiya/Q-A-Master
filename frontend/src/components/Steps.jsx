import React from 'react'

const stepsData = [
  {
    step: 'step1',
    title: 'Read the Questions Carefully',
  },
  {
    step: 'step2',
    title: 'Select the Correct Answer from the Options Provided',
  },
  {
    step: 'step3',
    title: 'Submit Your Answer Before the Time Runs Out',
  },
  {
    step: 'step4',
    title: 'Repeat for All Questions in the Quiz',
  },
]

const Steps = () => {
  return (
    <section className="text-white py-10 border-t border-gray-600 mb-5">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-3xl font-bold mb-12 underline">
          How To Play
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {stepsData.map((step, index) => (
            <div
              key={step.step}
              className="bg-gradient-to-l from-[#13072e] to-[#3f2182] rounded-lg p-6 shadow-md flex flex-col items-center"
            >
              <div className="w-12 h-12 bg-white text-black border border-black rounded-full flex items-center justify-center mb-4 font-bold text-lg">
                {index + 1}
              </div>
              <p className="text-center text-xl">{step.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Steps