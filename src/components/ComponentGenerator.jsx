import React from 'react';
import Select from 'react-select';
import { BsStars } from 'react-icons/bs';
import { ClipLoader } from 'react-spinners';
import { FRAMEWORK_OPTIONS } from '../constants/prompts';

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
  const selectStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: "#111",
      borderColor: "#333",
      color: "#fff",
      boxShadow: "none",
      "&:hover": { borderColor: "#555" }
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#111",
      color: "#fff"
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#333"
        : state.isFocused
          ? "#222"
          : "#111",
      color: "#fff",
      "&:active": { backgroundColor: "#444" }
    }),
    singleValue: (base) => ({ ...base, color: "#fff" }),
    placeholder: (base) => ({ ...base, color: "#aaa" }),
    input: (base) => ({ ...base, color: "#fff" })
  };

  return (
    <div className="w-full py-4 sm:py-6 rounded-xl bg-[#141319] mt-2 sm:mt-5 p-3 sm:p-5">
      <h3 className='text-xl sm:text-[25px] font-semibold sp-text'>AI Component Generator</h3>
      <p className='text-gray-400 mt-2 text-sm sm:text-[16px]'>
        Describe your component and let AI code it for you.
      </p>

      <div className="mt-6">
        <label className='text-[15px] font-[700] block'>Framework</label>
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
        <label className='text-[15px] font-[700] block'>
          Describe your component
        </label>
        <textarea
          onChange={(e) => onPromptChange(e.target.value)}
          value={prompt}
          className='w-full min-h-[150px] sm:min-h-[200px] rounded-xl bg-[#09090B] mt-3 p-3 text-sm sm:text-base text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500 resize-none'
          placeholder="Describe your component in detail and AI will generate it..."
          disabled={loading}
        />
      </div>

      <div className="flex items-center justify-between mt-4">
        <p className='text-gray-400 text-sm'>
          Click on generate button to get your code
        </p>
        <button
          onClick={onGenerate}
          disabled={loading || !prompt?.trim()}
          className="flex items-center p-3 rounded-lg border-0 bg-gradient-to-r from-purple-400 to-purple-600 px-5 gap-2 transition-all hover:opacity-80 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
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