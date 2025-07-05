import React from 'react'
import question from '../assets/question.png'
import { useNavigate } from 'react-router-dom'

const NavBar = () => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-row bg-[#0c0620] justify-between items-center p-4">
      <img
        src={question}
        onClick={() => navigate('/')}
        alt="Logo"
        className="lg:w-44 w-36 cursor-pointer"
      />
      <button className="bg-white font-bold rounded-full text-black hover:bg-gradient-to-b from-[#13072e] to-[#3f2182] hover:text-white py-2 px-4 border">
        Contact Us
      </button>
    </div>
  )
}

export default NavBar