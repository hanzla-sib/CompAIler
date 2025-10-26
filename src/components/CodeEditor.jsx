import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { IoCopy, IoCheckmark, IoCodeSlash, IoEyeOutline } from 'react-icons/io5';
import { PiExportBold } from 'react-icons/pi';
import { FiRefreshCcw } from 'react-icons/fi';
import { HiOutlinePhotograph } from 'react-icons/hi';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../constants/prompts';
import { fixBrokenImages, addImageErrorHandling } from '../utils/imageUtils';
import { useTheme } from '../contexts/ThemeContext';

/**
 * CodeEditor component for displaying and editing code
 * @param {Object} props - Component props
 * @param {string} props.code - Code content to display
 * @param {number} props.activeTab - Active tab (1 for code, 2 for preview)
 * @param {function} props.onTabChange - Handler for tab changes
 * @param {function} props.onRefresh - Handler for refreshing preview
 * @param {function} props.onFixImages - Handler for fixing broken images
 * @param {number} props.refreshKey - Key for forcing iframe refresh
 */
const CodeEditor = ({ 
  code, 
  activeTab, 
  onTabChange, 
  onRefresh, 
  onFixImages,
  refreshKey 
}) => {
  const { isDarkMode } = useTheme();
  const [isCoying, setIsCoying] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  // Copy code to clipboard with animation
  const copyCode = async () => {
    if (!code?.trim()) {
      toast.error(ERROR_MESSAGES.NO_CODE);
      return;
    }
    
    setIsCoying(true);
    
    try {
      await navigator.clipboard.writeText(code);
      setCopySuccess(true);
      toast.success(SUCCESS_MESSAGES.CODE_COPIED);
      
      // Reset states after animation
      setTimeout(() => {
        setCopySuccess(false);
        setIsCoying(false);
      }, 2000);
      
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast.error(ERROR_MESSAGES.COPY_FAILED);
      setIsCoying(false);
      setCopySuccess(false);
    }
  };

  // Download code as file
  const downloadFile = () => {
    if (!code?.trim()) {
      toast.error(ERROR_MESSAGES.NO_CODE_DOWNLOAD);
      return;
    }

    const fileName = "CompAIler-Generated-Code.html";
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(SUCCESS_MESSAGES.FILE_DOWNLOADED);
  };

  // Fix broken images in current code
  const handleFixImages = async () => {
    if (!code?.trim()) {
      toast.error("No code to fix images for");
      return;
    }

    try {
      const result = await fixBrokenImages(code);
      const fixedCode = addImageErrorHandling(result.html);
      
      if (result.fixedCount > 0) {
        onFixImages(fixedCode);
        toast.success(`Fixed ${result.fixedCount} broken image${result.fixedCount > 1 ? 's' : ''}`);
      } else {
        toast.info("No broken images found");
      }
    } catch (error) {
      console.error('Error fixing images:', error);
      toast.error("Failed to fix images");
    }
  };

  const tabVariants = {
    inactive: { 
      scale: 1,
      opacity: 0.75,
      y: 0,
      filter: "brightness(0.9)"
    },
    active: { 
      scale: 1.02,
      opacity: 1,
      y: -3,
      filter: "brightness(1.1)",
      transition: { 
        duration: 0.3,
        ease: "easeOut",
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    hover: {
      scale: 1.01,
      y: -1,
      filter: "brightness(1.05)",
      transition: { 
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  const toolbarVariants = {
    hidden: { opacity: 0, y: -30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.5,
        ease: "easeOut",
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.7, y: -10 },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 400,
        damping: 25,
        mass: 0.8
      }
    },
    hover: { 
      scale: 1.1,
      y: -2,
      transition: { 
        duration: 0.2,
        ease: "easeOut"
      }
    },
    tap: { 
      scale: 0.95,
      y: 0,
      transition: {
        duration: 0.1
      }
    }
  };

  const editorContainerVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { 
        duration: 0.6,
        ease: "easeOut",
        delay: 0.2
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-opacity-20 backdrop-blur-md bg-gradient-to-br from-white/10 to-transparent"
      style={{ 
        borderColor: isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)',
        boxShadow: isDarkMode 
          ? '0 25px 60px -15px rgba(139, 92, 246, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)' 
          : '0 25px 60px -15px rgba(139, 92, 246, 0.3), 0 0 0 1px rgba(139, 92, 246, 0.1)',
        background: isDarkMode 
          ? 'linear-gradient(135deg, rgba(17, 24, 39, 0.8) 0%, rgba(31, 41, 55, 0.6) 100%)' 
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)'
      }}
      whileHover={{ 
        scale: 1.01,
        transition: { duration: 0.3, ease: "easeInOut" }
      }}
    >
      {/* Enhanced Tabs */}
      <motion.div 
        className="w-full h-[60px] flex items-center gap-3 sm:gap-4 px-4 sm:px-6 backdrop-blur-xl relative overflow-hidden" 
        style={{ 
          background: isDarkMode 
            ? 'linear-gradient(135deg, rgba(31, 41, 55, 0.9) 0%, rgba(17, 24, 39, 0.8) 100%)' 
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)',
          borderBottom: `1px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.15)'}`
        }}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {/* Animated background pattern */}
        <motion.div
          className="absolute inset-0 opacity-5"
          style={{
            background: `radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 50%), 
                        radial-gradient(circle at 80% 50%, rgba(236, 72, 153, 0.3) 0%, transparent 50%)`
          }}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.button
          onClick={() => onTabChange(1)}
          className={`w-1/2 py-3 px-6 rounded-xl text-sm sm:text-base font-semibold relative overflow-hidden backdrop-blur-sm border transition-all duration-300 ${
            activeTab === 1 
              ? "text-white shadow-2xl border-purple-400/50" 
              : isDarkMode 
                ? "text-gray-300 border-gray-600/30 hover:border-purple-400/40" 
                : "text-gray-700 border-gray-300/40 hover:border-purple-400/40"
          }`}
          style={{
            background: activeTab === 1 
              ? 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #c084fc 100%)' 
              : isDarkMode 
                ? 'linear-gradient(135deg, rgba(31, 41, 55, 0.6) 0%, rgba(17, 24, 39, 0.4) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.6) 100%)'
          }}
          variants={tabVariants}
          initial="inactive"
          animate={activeTab === 1 ? "active" : "inactive"}
          whileHover={activeTab !== 1 ? "hover" : { scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.span
            className="relative z-10 flex items-center gap-2"
            animate={activeTab === 1 ? { 
              textShadow: "0 0 20px rgba(255,255,255,0.6)",
              filter: "brightness(1.1)"
            } : {}}
          >
            <motion.span
              animate={activeTab === 1 ? { 
                scale: [1, 1.1, 1],
                rotate: [0, -2, 2, 0]
              } : {}}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="flex items-center"
            >
              <IoCodeSlash className="text-lg" />
            </motion.span>
            Code
          </motion.span>
          
          {/* Enhanced gradient overlay */}
          <AnimatePresence>
            {activeTab === 1 && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-600/20"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4 }}
                style={{ zIndex: 1 }}
              />
            )}
          </AnimatePresence>
          
          {/* Sparkle effect for active tab */}
          {activeTab === 1 && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ zIndex: 2 }}
            >
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    left: `${20 + i * 30}%`,
                    top: `${30 + i * 20}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.5,
                  }}
                />
              ))}
            </motion.div>
          )}
        </motion.button>
        
        <motion.button
          onClick={() => onTabChange(2)}
          className={`w-1/2 py-3 px-6 rounded-xl text-sm sm:text-base font-semibold relative overflow-hidden backdrop-blur-sm border transition-all duration-300 ${
            activeTab === 2 
              ? "text-white shadow-2xl border-purple-400/50" 
              : isDarkMode 
                ? "text-gray-300 border-gray-600/30 hover:border-purple-400/40" 
                : "text-gray-700 border-gray-300/40 hover:border-purple-400/40"
          }`}
          style={{
            background: activeTab === 2 
              ? 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #c084fc 100%)' 
              : isDarkMode 
                ? 'linear-gradient(135deg, rgba(31, 41, 55, 0.6) 0%, rgba(17, 24, 39, 0.4) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.6) 100%)'
          }}
          variants={tabVariants}
          initial="inactive"
          animate={activeTab === 2 ? "active" : "inactive"}
          whileHover={activeTab !== 2 ? "hover" : { scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.span
            className="relative z-10 flex items-center gap-2"
            animate={activeTab === 2 ? { 
              textShadow: "0 0 20px rgba(255,255,255,0.6)",
              filter: "brightness(1.1)"
            } : {}}
          >
            <motion.span
              animate={activeTab === 2 ? { 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              } : {}}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="flex items-center"
            >
              <IoEyeOutline className="text-lg" />
            </motion.span>
            Preview
          </motion.span>
          
          {/* Enhanced gradient overlay */}
          <AnimatePresence>
            {activeTab === 2 && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-600/20"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4 }}
                style={{ zIndex: 1 }}
              />
            )}
          </AnimatePresence>
          
          {/* Sparkle effect for active tab */}
          {activeTab === 2 && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ zIndex: 2 }}
            >
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    left: `${20 + i * 30}%`,
                    top: `${30 + i * 20}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.5,
                  }}
                />
              ))}
            </motion.div>
          )}
        </motion.button>
      </motion.div>

      {/* Enhanced Toolbar */}
      <motion.div 
        className="w-full h-[60px] flex items-center justify-between px-4 sm:px-6 backdrop-blur-xl border-b relative overflow-hidden" 
        style={{ 
          background: isDarkMode 
            ? 'linear-gradient(135deg, rgba(17, 24, 39, 0.9) 0%, rgba(31, 41, 55, 0.8) 100%)' 
            : 'linear-gradient(135deg, rgba(248, 250, 252, 0.9) 0%, rgba(255, 255, 255, 0.8) 100%)',
          borderColor: isDarkMode ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.1)'
        }}
        variants={toolbarVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Animated gradient line */}
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
        />
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <motion.div
            className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg"
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(34, 197, 94, 0.4)",
                "0 0 0 8px rgba(34, 197, 94, 0)",
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.h3 
            className='font-bold text-base sm:text-lg truncate bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent' 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {activeTab === 1 ? '✨ Code Editor' : '🚀 Live Preview'}
          </motion.h3>
        </motion.div>
        
        <motion.div 
          className="flex items-center gap-1 sm:gap-2"
          variants={toolbarVariants}
        >
          <AnimatePresence mode="wait">
            {activeTab === 1 ? (
              <motion.div
                key="code-buttons"
                className="flex items-center gap-1 sm:gap-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ 
                  duration: 0.3,
                  staggerChildren: 0.1,
                  delayChildren: 0.1
                }}
              >
                <motion.button 
                  onClick={copyCode} 
                  disabled={isCoying}
                  className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl border-2 flex items-center justify-center text-base sm:text-lg font-semibold overflow-hidden backdrop-blur-sm transition-all duration-300
                    ${copySuccess ? 'border-emerald-400/60 text-emerald-400' : 'border-purple-400/40 text-purple-400'} 
                    ${isCoying ? 'animate-pulse' : ''} 
                  `}
                  style={{ 
                    background: copySuccess 
                      ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.1) 100%)' 
                      : isDarkMode 
                        ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)'
                        : 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(168, 85, 247, 0.03) 100%)',
                    boxShadow: copySuccess 
                      ? '0 8px 25px -8px rgba(16, 185, 129, 0.4)' 
                      : '0 8px 25px -8px rgba(139, 92, 246, 0.3)'
                  }}
                  variants={buttonVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ 
                    scale: 1.1,
                    transition: { duration: 0.2, ease: "easeOut" }
                  }}
                  whileTap={{ scale: 0.95 }}
                  title={copySuccess ? "Copied!" : isCoying ? "Copying..." : "Copy Code"}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={copySuccess ? 'success' : isCoying ? 'loading' : 'copy'}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{ duration: 0.2 }}
                    >
                      {copySuccess ? (
                        <IoCheckmark className="text-green-500" />
                      ) : (
                        <IoCopy className={`${isCoying ? 'animate-spin' : ''}`} />
                      )}
                    </motion.div>
                  </AnimatePresence>
                  
                  {/* Enhanced ripple effect */}
                  {isCoying && (
                    <motion.div 
                      className="absolute inset-0 rounded-lg overflow-hidden"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <motion.div 
                        className="ripple-effect"
                        animate={{
                          scale: [0, 1],
                          opacity: [1, 0]
                        }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity
                        }}
                      />
                    </motion.div>
                  )}
                </motion.button>
                
                <motion.button 
                  onClick={downloadFile} 
                  className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl border-2 border-blue-400/40 flex items-center justify-center text-base sm:text-lg text-blue-400 font-semibold overflow-hidden backdrop-blur-sm transition-all duration-300"
                  style={{ 
                    background: isDarkMode 
                      ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)'
                      : 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(37, 99, 235, 0.03) 100%)',
                    boxShadow: '0 8px 25px -8px rgba(59, 130, 246, 0.3)'
                  }}
                  variants={buttonVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ 
                    scale: 1.1,
                    transition: { duration: 0.2, ease: "easeOut" }
                  }}
                  whileTap={{ scale: 0.95 }}
                  title="Download File"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <PiExportBold />
                  </motion.div>
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="preview-buttons"
                className="flex items-center gap-1 sm:gap-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ 
                  duration: 0.3,
                  staggerChildren: 0.1,
                  delayChildren: 0.1
                }}
              >
                <motion.button 
                  onClick={handleFixImages} 
                  className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl border-2 border-amber-400/40 flex items-center justify-center text-base sm:text-lg text-amber-400 font-semibold overflow-hidden backdrop-blur-sm transition-all duration-300"
                  style={{ 
                    background: isDarkMode 
                      ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.05) 100%)'
                      : 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(217, 119, 6, 0.03) 100%)',
                    boxShadow: '0 8px 25px -8px rgba(245, 158, 11, 0.3)'
                  }}
                  variants={buttonVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ 
                    scale: 1.1,
                    transition: { duration: 0.2, ease: "easeOut" }
                  }}
                  whileTap={{ scale: 0.95 }}
                  title="Fix Broken Images"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <HiOutlinePhotograph />
                  </motion.div>
                </motion.button>
                
                <motion.button 
                  onClick={onRefresh} 
                  className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl border-2 border-emerald-400/40 flex items-center justify-center text-base sm:text-lg text-emerald-400 font-semibold overflow-hidden backdrop-blur-sm transition-all duration-300"
                  style={{ 
                    background: isDarkMode 
                      ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)'
                      : 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.03) 100%)',
                    boxShadow: '0 8px 25px -8px rgba(16, 185, 129, 0.3)'
                  }}
                  variants={buttonVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ 
                    scale: 1.1,
                    transition: { duration: 0.2, ease: "easeOut" }
                  }}
                  whileTap={{ scale: 0.95 }}
                  title="Refresh Preview"
                >
                  <motion.div
                    whileHover={{ rotate: 180 }}
                    whileTap={{ rotate: 90 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <FiRefreshCcw />
                  </motion.div>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Enhanced Editor / Preview Container */}
      <motion.div 
        className="sm:h-[80vh] relative overflow-hidden rounded-b-2xl"
        style={{
          background: isDarkMode 
            ? 'linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(31, 41, 55, 0.9) 100%)' 
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)'
        }}
        variants={editorContainerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Animated border glow */}
        <motion.div
          className="absolute inset-0 rounded-b-2xl"
          style={{
            background: `linear-gradient(135deg, 
              ${isDarkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)'} 0%, 
              transparent 50%, 
              ${isDarkMode ? 'rgba(236, 72, 153, 0.1)' : 'rgba(236, 72, 153, 0.05)'} 100%)`,
            zIndex: 1,
            pointerEvents: 'none'
          }}
          animate={{
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <AnimatePresence mode="wait">
          {activeTab === 1 ? (
            <motion.div
              key="editor"
              className="w-full h-full relative z-10 rounded-b-2xl overflow-hidden"
              initial={{ opacity: 0, x: -50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}
            >
              {/* Editor loading overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 z-20 pointer-events-none"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
              
              <Editor 
                value={code} 
                height="100%" 
                theme={isDarkMode ? 'vs-dark' : 'light'} 
                language="html"
                options={{
                  minimap: { enabled: false },
                  fontSize: 15,
                  fontFamily: 'JetBrains Mono, Fira Code, Consolas, monospace',
                  wordWrap: 'on',
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  padding: { top: 20, bottom: 20 },
                  lineHeight: 1.6,
                  cursorBlinking: 'smooth',
                  cursorSmoothCaretAnimation: true,
                  smoothScrolling: true,
                  fontLigatures: true,
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              className="w-full h-full relative z-10"
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {/* Preview frame with enhanced styling */}
              <motion.div
                className="w-full h-full rounded-b-2xl overflow-hidden relative"
                style={{
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 20px rgba(0, 0, 0, 0.1)'
                }}
              >
                {/* Loading shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent z-30 pointer-events-none"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 1.5, delay: 0.2, ease: "easeInOut" }}
                />
                
                <motion.iframe 
                  key={refreshKey} 
                  srcDoc={code} 
                  className="w-full h-full bg-white text-black overflow-auto border-0"
                  title="Code Preview"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                  style={{
                    borderRadius: '0 0 1rem 1rem',
                    filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1))'
                  }}
                />
                
                {/* Preview overlay effects */}
                <motion.div
                  className="absolute inset-0 pointer-events-none rounded-b-2xl"
                  style={{
                    background: `linear-gradient(45deg, 
                      transparent 0%, 
                      rgba(139, 92, 246, 0.02) 25%, 
                      transparent 50%, 
                      rgba(236, 72, 153, 0.02) 75%, 
                      transparent 100%)`
                  }}
                  animate={{
                    backgroundPosition: ['0% 0%', '100% 100%'],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default CodeEditor;