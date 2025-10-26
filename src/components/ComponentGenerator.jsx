import React from 'react';
import Select from 'react-select';
import { BsStars } from 'react-icons/bs';
import { ClipLoader } from 'react-spinners';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { FRAMEWORK_OPTIONS } from '../constants/prompts';
import { useTheme } from '../contexts/ThemeContext';

/**
 * ComponentGenerator form for inputting prompt and framework selection
 * @param {Object} props - Component props
 * @param {string} props.prompt - Current prompt value
 * @param {function} props.onPromptChange - Handler for prompt changes
 * @param {Object} props.framework - Selected framework option
 * @param {function} props.onFrameworkChange - Handler for framework changes
 * @param {function} props.onGenerate - Handler for generate button click
 * @param {boolean} props.loading - Loading state
 */
const ComponentGenerator = ({ 
  prompt, 
  onPromptChange, 
  framework, 
  onFrameworkChange, 
  onGenerate, 
  loading 
}) => {
  const { isDarkMode } = useTheme();
  const selectStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: isDarkMode ? "#111" : "#fff",
      borderColor: isDarkMode ? "#333" : "#d1d5db",
      color: isDarkMode ? "#fff" : "#1a202c",
      boxShadow: "none",
      "&:hover": { borderColor: isDarkMode ? "#555" : "#9ca3af" }
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: isDarkMode ? "#111" : "#fff",
      color: isDarkMode ? "#fff" : "#1a202c"
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? isDarkMode ? "#333" : "#e5e7eb"
        : state.isFocused
          ? isDarkMode ? "#222" : "#f3f4f6"
          : isDarkMode ? "#111" : "#fff",
      color: isDarkMode ? "#fff" : "#1a202c",
      "&:active": { backgroundColor: isDarkMode ? "#444" : "#d1d5db" }
    }),
    singleValue: (base) => ({ ...base, color: isDarkMode ? "#fff" : "#1a202c" }),
    placeholder: (base) => ({ ...base, color: isDarkMode ? "#aaa" : "#6b7280" }),
    input: (base) => ({ ...base, color: isDarkMode ? "#fff" : "#1a202c" })
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    idle: { 
      scale: 1,
      boxShadow: "0 4px 15px rgba(139, 92, 246, 0.3)",
      transition: { 
        duration: 0.2,
        ease: "easeOut"
      }
    },
    hover: { 
      scale: 1.05,
      boxShadow: "0 8px 25px rgba(139, 92, 246, 0.4)",
      transition: { 
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    tap: { 
      scale: 0.98,
      transition: { 
        duration: 0.1
      }
    },
    loading: {
      scale: 1,
      boxShadow: "0 4px 15px rgba(139, 92, 246, 0.3)",
      transition: { 
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      className="w-full py-4 sm:py-6 rounded-xl mt-2 sm:mt-5 p-3 sm:p-5 backdrop-blur-sm shadow-lg border border-opacity-20" 
      style={{ 
        backgroundColor: 'var(--secondary-bg)',
        borderColor: 'var(--border-color)'
      }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ 
        y: -2,
        transition: { duration: 0.2 }
      }}
    >
      <motion.div variants={itemVariants}>
        <motion.h3 
          className='text-xl sm:text-[25px] font-semibold sp-text'
          whileHover={{ 
            scale: 1.02,
            textShadow: "0px 0px 8px rgba(192, 132, 252, 0.8)"
          }}
        >
          AI Component Generator
        </motion.h3>
        <motion.p 
          className='mt-2 text-sm sm:text-[16px]' 
          style={{ color: 'var(--text-secondary)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Describe your component and let AI code it for you.
        </motion.p>
      </motion.div>

      <motion.div className="mt-6" variants={itemVariants}>
        <motion.label 
          className='text-[15px] font-[700] block' 
          style={{ color: 'var(--text-color)' }}
          whileHover={{ x: 2 }}
        >
          Framework
        </motion.label>
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileFocus={{ scale: 1.01 }}
        >
          <Select
            className='mt-2'
            options={FRAMEWORK_OPTIONS}
            value={framework}
            styles={selectStyles}
            onChange={onFrameworkChange}
            placeholder="Select a framework..."
            isSearchable
          />
        </motion.div>
      </motion.div>

      <motion.div className="mt-5" variants={itemVariants}>
        <motion.label 
          className='text-[15px] font-[700] block' 
          style={{ color: 'var(--text-color)' }}
          whileHover={{ x: 2 }}
        >
          Describe your component
        </motion.label>
        <motion.textarea
          onChange={(e) => onPromptChange(e.target.value)}
          value={prompt}
          className='w-full min-h-[150px] sm:min-h-[200px] rounded-xl mt-3 p-3 text-sm sm:text-base outline-none focus:ring-2 focus:ring-purple-500 resize-none border transition-all duration-300'
          style={{
            backgroundColor: 'var(--input-bg)',
            color: 'var(--text-color)',
            borderColor: 'var(--border-color)',
          }}
          placeholder="Describe your component in detail and AI will generate it..."
          disabled={loading}
          whileFocus={{ 
            scale: 1.01,
            boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.1)"
          }}
          whileHover={{ 
            borderColor: "#8b5cf6",
            transition: { duration: 0.2 }
          }}
        />
      </motion.div>

      <motion.div 
        className="flex items-center justify-between mt-4" 
        variants={itemVariants}
      >
        <motion.p 
          className='text-sm' 
          style={{ color: 'var(--text-secondary)' }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          Click on generate button to get your code
        </motion.p>
        
        <motion.button
          onClick={onGenerate}
          disabled={loading || !prompt?.trim()}
          className="flex items-center p-3 rounded-lg border-0 bg-gradient-to-r from-purple-400 to-purple-600 px-5 gap-2 text-white font-medium disabled:cursor-not-allowed relative overflow-hidden"
          variants={buttonVariants}
          initial="idle"
          whileHover={!loading && prompt?.trim() ? "hover" : "idle"}
          whileTap={!loading && prompt?.trim() ? "tap" : "idle"}
          animate={loading ? "loading" : "idle"}
          key={loading ? "loading" : "idle"} // Force re-render when loading state changes
        >
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <ClipLoader color='white' size={18} />
              </motion.div>
            ) : (
              <motion.div
                key="stars"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <BsStars />
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.span
            key={loading ? 'loading-text' : 'idle-text'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {loading ? 'Generating...' : 'Generate'}
          </motion.span>
          
          {/* Animated background effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0"
            whileHover={{ opacity: 0.1 }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default ComponentGenerator;