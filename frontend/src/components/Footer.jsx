import React from 'react'
import question from '../assets/question.png'
import { FaFacebook, FaInstagram } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-[#13072e] to-[#3f2182] text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-white pb-8">
          <div className="mb-6 lg:mb-0">
            <img src={question} alt="Logo" className="w-56" />
          </div>

          <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-24 mb-6 lg:mb-0">
            <div>
              <h4 className="font-semibold mb-2 underline">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">About Us</a></li>
                <li><a href="#" className="hover:underline">How to Play</a></li>
                <li><a href="#" className="hover:underline">Blog</a></li>
                <li><a href="#" className="hover:underline">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 underline">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">FAQ</a></li>
                <li><a href="#" className="hover:underline">Terms & Conditions</a></li>
                <li><a href="#" className="hover:underline">Privacy Policy</a></li>
                <li><a href="#" className="hover:underline">Contact Support</a></li>
              </ul>
            </div>
            <div className="flex flex-col">
              <p className="mb-2 underline text-center lg:text-left">Connect with us</p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center bg-white text-[#13072e]">
                  <FaFacebook className="text-2xl" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center bg-white text-[#13072e]">
                  <FaInstagram className="text-2xl" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col lg:flex-row justify-between items-center">
          <p className="text-sm text-center lg:text-left">
            © 2025 Jeet Padia. All Rights Reserved.
          </p>
          <div className="flex space-x-6 mt-4 lg:mt-0">
            <a href="#" className="text-sm hover:underline">Terms & Conditions</a>
            <a href="#" className="text-sm hover:underline">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer