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
    <div className="flex flex-row bg-[#0c0620] justify-between items-center p-4">
      <img
        src={question}
        onClick={() => navigate('/')}
        alt="Logo"
        className="lg:w-44 w-36 cursor-pointer"
      />
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/dashboard')}
          className="border border-cyan-300/40 bg-cyan-300/10 font-bold rounded-full text-cyan-100 hover:bg-cyan-300 hover:text-slate-950 py-2 px-4"
        >
          Dashboard
        </button>
        <button className="bg-white font-bold rounded-full text-black hover:bg-gradient-to-b from-[#13072e] to-[#3f2182] hover:text-white py-2 px-4 border">
          Contact Us
        </button>
        <button
          onClick={onLogout}
          className="border border-white/30 bg-transparent font-bold rounded-full text-white hover:bg-white hover:text-black py-2 px-4"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default NavBar
