import React from 'react'
import { FaUser } from 'react-icons/fa'
import { HiSun, HiMoon } from 'react-icons/hi'
import { RiSettings3Fill } from 'react-icons/ri'
import { useTheme } from '../contexts/ThemeContext'

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <>
      <div className="nav flex items-center justify-between px-[100px] h-[90px] border-b-[1px] border-gray-800 dark:border-gray-800 bg-transparent">
        <div className="logo">
         <h3 className='text-[25px] font-[700] sp-text'>CompAller</h3>
        </div>
        <div className="icons flex items-center gap-[15px]">
          <div 
            className="icon theme-toggle transition-all duration-200 hover:scale-105" 
            onClick={toggleTheme}
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <HiSun className="text-yellow-400" /> : <HiMoon className="text-blue-400" />}
          </div>
          <div className="icon"><FaUser /></div>
          <div className="icon"><RiSettings3Fill /></div>
        </div>
      </div>
    </>
  )
}

export default Navbar