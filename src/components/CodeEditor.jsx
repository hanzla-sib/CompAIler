import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { IoCopy, IoCheckmark } from 'react-icons/io5';
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
      opacity: 0.7,
      y: 0
    },
    active: { 
      scale: 1.02,
      opacity: 1,
      y: -2,
      transition: { 
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    hover: {
      scale: 1.01,
      y: -1,
      transition: { 
        duration: 0.1
      }
    }
  };

  const toolbarVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
        staggerChildren: 0.05
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    hover: { 
      scale: 1.1,
      rotate: [0, -5, 5, 0],
      transition: { 
        duration: 0.2
      }
    },
    tap: { scale: 0.95 }
  };

  const editorContainerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-xl overflow-hidden shadow-lg border border-opacity-20"
      style={{ borderColor: 'var(--border-color)' }}
    >
      {/* Tabs */}
      <motion.div 
        className="w-full h-[50px] flex items-center gap-2 sm:gap-3 px-2 sm:px-3 backdrop-blur-sm" 
        style={{ backgroundColor: 'var(--tertiary-bg)' }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.button
          onClick={() => onTabChange(1)}
          className={`w-1/2 py-2 rounded-lg text-sm sm:text-base font-medium relative overflow-hidden ${
            activeTab === 1 
              ? "bg-purple-600 text-white shadow-lg" 
              : isDarkMode 
                ? "bg-zinc-800 text-gray-300" 
                : "bg-gray-200 text-gray-700"
          }`}
          variants={tabVariants}
          initial="inactive"
          animate={activeTab === 1 ? "active" : "inactive"}
          whileHover={activeTab !== 1 ? "hover" : {}}
          whileTap={{ scale: 0.98 }}
        >
          <motion.span
            animate={activeTab === 1 ? { textShadow: "0 0 8px rgba(255,255,255,0.5)" } : {}}
          >
            Code
          </motion.span>
          {activeTab === 1 && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{ zIndex: -1 }}
            />
          )}
        </motion.button>
        
        <motion.button
          onClick={() => onTabChange(2)}
          className={`w-1/2 py-2 rounded-lg text-sm sm:text-base font-medium relative overflow-hidden ${
            activeTab === 2 
              ? "bg-purple-600 text-white shadow-lg" 
              : isDarkMode 
                ? "bg-zinc-800 text-gray-300" 
                : "bg-gray-200 text-gray-700"
          }`}
          variants={tabVariants}
          initial="inactive"
          animate={activeTab === 2 ? "active" : "inactive"}
          whileHover={activeTab !== 2 ? "hover" : {}}
          whileTap={{ scale: 0.98 }}
        >
          <motion.span
            animate={activeTab === 2 ? { textShadow: "0 0 8px rgba(255,255,255,0.5)" } : {}}
          >
            Preview
          </motion.span>
          {activeTab === 2 && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{ zIndex: -1 }}
            />
          )}
        </motion.button>
      </motion.div>

      {/* Toolbar */}
      <motion.div 
        className="w-full h-[50px] flex items-center justify-between px-2 sm:px-4 backdrop-blur-sm border-b border-opacity-10" 
        style={{ 
          backgroundColor: 'var(--tertiary-bg)',
          borderColor: 'var(--border-color)'
        }}
        variants={toolbarVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.p 
          className='font-bold text-sm sm:text-base truncate' 
          style={{ color: 'var(--text-color)' }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {activeTab === 1 ? 'Code Editor' : 'Live Preview'}
        </motion.p>
        
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
                transition={{ duration: 0.2 }}
              >
                <motion.button 
                  onClick={copyCode} 
                  disabled={isCoying}
                  className={`copy-button w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl border flex items-center justify-center text-sm sm:text-base relative overflow-hidden
                    ${copySuccess ? 'copy-success' : ''} 
                    ${isCoying ? 'copy-loading' : ''} 
                  `}
                  style={{ 
                    borderColor: copySuccess ? '#10b981' : 'var(--border-color)', 
                    color: copySuccess ? '#10b981' : 'var(--text-color)',
                    backgroundColor: copySuccess ? 'rgba(16, 185, 129, 0.1)' : 'transparent'
                  }}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
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
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl border flex items-center justify-center text-sm sm:text-base"
                  style={{ 
                    borderColor: 'var(--border-color)', 
                    color: 'var(--text-color)',
                    backgroundColor: 'transparent'
                  }}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  title="Download File"
                >
                  <PiExportBold />
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="preview-buttons"
                className="flex items-center gap-1 sm:gap-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <motion.button 
                  onClick={handleFixImages} 
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl border flex items-center justify-center text-sm sm:text-base"
                  style={{ 
                    borderColor: 'var(--border-color)', 
                    color: 'var(--text-color)',
                    backgroundColor: 'transparent'
                  }}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  title="Fix Broken Images"
                >
                  <HiOutlinePhotograph />
                </motion.button>
                
                <motion.button 
                  onClick={onRefresh} 
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl border flex items-center justify-center text-sm sm:text-base"
                  style={{ 
                    borderColor: 'var(--border-color)', 
                    color: 'var(--text-color)',
                    backgroundColor: 'transparent'
                  }}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  title="Refresh Preview"
                >
                  <motion.div
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FiRefreshCcw />
                  </motion.div>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Editor / Preview */}
      <motion.div 
        className="sm:h-[240px] lg:h-[550px] relative overflow-hidden"
        variants={editorContainerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="wait">
          {activeTab === 1 ? (
            <motion.div
              key="editor"
              className="w-full h-full"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
            >
              <Editor 
                value={code} 
                height="100%" 
                theme={isDarkMode ? 'vs-dark' : 'light'} 
                language="html"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: 'on',
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              className="w-full h-full"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <motion.iframe 
                key={refreshKey} 
                srcDoc={code} 
                className="w-full h-full bg-white text-black overflow-auto rounded-b-xl"
                title="Code Preview"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default CodeEditor;