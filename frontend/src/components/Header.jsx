import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import question from '../assets/question.png'
import Modal from './Modal'
import Steps from './Steps'
import { useContext } from 'react'
import { QuizContext } from '../context/QuizContext'

const Header = () => {
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { categories, selectedCategory, handleCategoryChange } = useContext(QuizContext)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)
  const startQuiz = () => {
    setIsModalOpen(false)
    navigate('/quiz')
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-center items-center px-6 lg:px-12 my-12">
        <div className="w-full flex flex-col justify-center p-6 lg:p-12 text-center lg:text-left">
          <h1 className="font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.15] text-white">
            Experience the Ultimate Quiz Challenge, Play and Learn!
          </h1>
          <p className="mt-4 mb-6 text-lg md:text-2xl font-medium leading-relaxed text-slate-300">
            Challenge Your Coding Knowledge &amp; Earn Verified Certificates
          </p>

          <div className="mt-2 mb-6">
            <p className="mb-3 font-mono text-xs uppercase tracking-widest font-semibold text-cyan-300">
              Choose Your Quiz Track
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-2.5">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    selectedCategory === category
                      ? 'border-cyan-300 bg-cyan-300 text-slate-950 shadow-sm'
                      : 'border-white/20 bg-white/5 text-slate-200 hover:border-cyan-300/60'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-center lg:justify-start items-center">
            <button
              onClick={openModal}
              className="mt-2 mb-8 rounded-xl bg-white px-7 py-3.5 text-base sm:text-lg font-bold text-slate-950 transition hover:bg-slate-100 shadow-md"
            >
              Start {selectedCategory} Quiz →
            </button>
          </div>

          <div className="flex flex-col">
            <p className="font-mono text-xs uppercase tracking-widest font-semibold text-slate-400">
              Join Developers Challenging Themselves Daily
            </p>
            <div className="flex justify-center lg:justify-start items-center">
              <p className="mt-1 font-mono text-3xl md:text-4xl font-extrabold text-emerald-400">
                20,000+
              </p>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex justify-center items-center mt-8 lg:mt-0">
          <img
            src={question}
            alt="Question"
            className="w-3/4 md:w-2/3 lg:w-full max-w-lg"
          />
        </div>
      </div>

      <Steps />

      {isModalOpen && (
        <Modal closeModal={closeModal} startQuiz={startQuiz} selectedCategory={selectedCategory} />
      )}
    </>
  )
}

export default Header
