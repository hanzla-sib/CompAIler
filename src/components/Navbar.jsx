import React from 'react'
import { FaUser } from 'react-icons/fa'
import { HiSun, HiMoon } from 'react-icons/hi'
import { RiSettings3Fill } from 'react-icons/ri'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import { useTheme } from '../contexts/ThemeContext'

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  const navbarVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const logoVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { 
        duration: 0.8,
        delay: 0.2,
        ease: "easeOut"
      }
    }
  };

  const iconContainerVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { 
        duration: 0.8,
        delay: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    hover: { 
      scale: 1.1,
      rotate: [0, -10, 10, 0],
      transition: { 
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    tap: { scale: 0.95 }
  };

  const themeIconVariants = {
    ...iconVariants,
    hover: {
      scale: 1.2,
      rotate: isDarkMode ? 180 : -180,
      transition: { 
        duration: 0.4,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div 
      className="nav flex items-center justify-between px-4 sm:px-8 lg:px-[100px] h-[90px] border-b-[1px] backdrop-blur-md bg-opacity-80"
      style={{ 
        backgroundColor: 'var(--primary-bg)',
        borderColor: 'var(--border-color)'
      }}
      variants={navbarVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="logo"
        variants={logoVariants}
      >
        <motion.h3 
          className='text-[25px] font-[700] sp-text cursor-pointer'
          whileHover={{ 
            scale: 1.05,
            textShadow: "0px 0px 8px rgba(192, 132, 252, 0.8)"
          }}
          whileTap={{ scale: 0.98 }}
        >
          CompAIler
        </motion.h3>
      </motion.div>
      
      <motion.div 
        className="icons flex items-center gap-[15px]"
        variants={iconContainerVariants}
      >
        <motion.div 
          className="icon theme-toggle relative overflow-hidden"
          variants={themeIconVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={toggleTheme}
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <motion.div
            key={isDarkMode ? 'sun' : 'moon'}
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {isDarkMode ? (
              <HiSun className="text-yellow-400" />
            ) : (
              <HiMoon className="text-blue-400" />
            )}
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="icon"
          variants={iconVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <FaUser />
        </motion.div>
        
        <motion.div 
          className="icon"
          variants={iconVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <RiSettings3Fill />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default Navbar