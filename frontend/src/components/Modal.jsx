import React from 'react'

const Modal = ({ closeModal, startQuiz }) => {
  return (
    <div className='fixed inset-0 flex items-center justify-center bg=[#0c0620] bg-opacity-90 z-50'>
      <div className="bg-gradient-to-r from-[#13072e] to-[#3f2182] =-6 sm:p-8 md:p-10 rounded-lg w-full max-w-md sm:max-w-lg md:max-w-2xl mx-4">
        <h2 className='text=xl sm:text-2xl md:text-3x; font-bold mb-4 text-center'>
          Quzi Instruction
        </h2>
        <ul className='list-decimal pl-4 sm:pl-6 text-sm sm:text-base md:text-lg space-y-2'>
          <li>Read each question carefully before selecting your answer.</li>
          <li>You must complete the quiz within the allotted time.</li>
          <li>Each question has only one correct answer unless stated otherwise.</li>
          <li>Do not refresh the page or press the back button during the quiz.</li>
          <li>Your score will be displayed at the end of the quiz.</li>
          <li>Click the "Submit" button once you have answered all questions.</li>
          <li>Use a stable internet connection to avoid interruptions.</li>
        </ul>
        <p className='text-center  mt-3 text-base  md:text-lg  font-semibold'>
          All The Best
        </p>
        <div className='mt-6 flex flex-col  sm:flex-row  justrify-between  gap-4'>
          <button onClick={closeModal} className='bg-gray-400 text-black py-2 px-6  rounded-full hover:bg-red-500 transition  w-full  sm:w-auto'>
            Cancel
          </button>
          <button onClick={startQuiz} className='bg-blue-500 text-white py-2 px-6  rounded-full hover:bg-blue-400 transition  w-full  sm:w-auto'>
            Are you Ready ?  Start Quiz     
          </button>
        </div>
        <p className='text-xs  text-center  mt-4 '>
          <span className='underline'>
            Note:
              Timing will Start Automatically once the start Quiz button  is Clicked
          </span>
        </p>
      </div>

    </div>
  )
}

export default Modal
