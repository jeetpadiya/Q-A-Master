import React from 'react'
import question from '../assets/question.png'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { QuizContext } from '../context/QuizContext'

const NavBar = () => {
  const navigate = useNavigate()
  const { handleLogout } = useContext(QuizContext)

  const onLogout = () => {
    handleLogout()
    navigate('/register', { replace: true })
  }

  return (
    <nav className="flex flex-row bg-[#0c0620]/90 backdrop-blur-md border-b border-white/10 justify-between items-center px-6 py-3.5 sticky top-0 z-40">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
        <img
          src={question}
          alt="Q-A Master Logo"
          className="w-28 sm:w-36 brightness-110"
        />
      </div>
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => navigate('/dashboard')}
          className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 font-mono text-xs font-semibold text-cyan-300 hover:bg-cyan-400 hover:text-slate-950 transition"
        >
          Dashboard
        </button>
        <button
          onClick={onLogout}
          className="rounded-full border border-white/20 bg-white/5 px-4 py-1.5 font-mono text-xs font-semibold text-slate-300 hover:bg-rose-500/80 hover:text-white hover:border-transparent transition"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

export default NavBar
