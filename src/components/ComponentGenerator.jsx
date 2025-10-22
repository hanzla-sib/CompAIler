import React from 'react';
import Select from 'react-select';
import { BsStars } from 'react-icons/bs';
import { ClipLoader } from 'react-spinners';
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

  return (
    <div className="w-full py-4 sm:py-6 rounded-xl mt-2 sm:mt-5 p-3 sm:p-5" 
         style={{ backgroundColor: 'var(--secondary-bg)' }}>
      <h3 className='text-xl sm:text-[25px] font-semibold sp-text'>AI Component Generator</h3>
      <p className='mt-2 text-sm sm:text-[16px]' 
         style={{ color: 'var(--text-secondary)' }}>
        Describe your component and let AI code it for you.
      </p>

      <div className="mt-6">
        <label className='text-[15px] font-[700] block' 
               style={{ color: 'var(--text-color)' }}>Framework</label>
        <Select
          className='mt-2'
          options={FRAMEWORK_OPTIONS}
          value={framework}
          styles={selectStyles}
          onChange={onFrameworkChange}
          placeholder="Select a framework..."
          isSearchable
        />
      </div>

      <div className="mt-5">
        <label className='text-[15px] font-[700] block' 
               style={{ color: 'var(--text-color)' }}>
          Describe your component
        </label>
        <textarea
          onChange={(e) => onPromptChange(e.target.value)}
          value={prompt}
          className='w-full min-h-[150px] sm:min-h-[200px] rounded-xl mt-3 p-3 text-sm sm:text-base outline-none focus:ring-2 focus:ring-purple-500 resize-none border'
          style={{
            backgroundColor: 'var(--input-bg)',
            color: 'var(--text-color)',
            borderColor: 'var(--border-color)',
            '::placeholder': { color: 'var(--text-secondary)' }
          }}
          placeholder="Describe your component in detail and AI will generate it..."
          disabled={loading}
        />
      </div>

      <div className="flex items-center justify-between mt-4">
        <p className='text-sm' style={{ color: 'var(--text-secondary)' }}>
          Click on generate button to get your code
        </p>
        <button
          onClick={onGenerate}
          disabled={loading || !prompt?.trim()}
          className="flex items-center p-3 rounded-lg border-0 bg-gradient-to-r from-purple-400 to-purple-600 px-5 gap-2 transition-all hover:opacity-80 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 text-white"
        >
          {loading ? (
            <ClipLoader color='white' size={18} />
          ) : (
            <BsStars />
          )}
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </div>
    </div>
  );
};

export default ComponentGenerator;