import React from 'react';
import { HiOutlineCode } from 'react-icons/hi';
import { IoCloseSharp } from 'react-icons/io5';
import CodeEditor from './CodeEditor';

/**
 * OutputDisplay component for showing generated code and preview
 * @param {Object} props - Component props
 * @param {string} props.code - Generated code content
 * @param {boolean} props.hasOutput - Whether there is generated output
 * @param {number} props.activeTab - Active tab (1 for code, 2 for preview)
 * @param {function} props.onTabChange - Handler for tab changes
 * @param {boolean} props.isNewTabOpen - Whether preview is open in new tab
 * @param {function} props.onNewTabToggle - Handler for new tab toggle
 * @param {number} props.refreshKey - Key for forcing preview refresh
 * @param {function} props.onRefresh - Handler for refreshing preview
 * @param {function} props.onFixImages - Handler for fixing broken images
 */
const OutputDisplay = ({ 
  code, 
  hasOutput, 
  activeTab, 
  onTabChange, 
  isNewTabOpen, 
  onNewTabToggle,
  refreshKey,
  onRefresh,
  onFixImages
}) => {
  return (
    <>
      <div className="relative mt-4 w-full h-full  bg-[#141319] rounded-xl overflow-hidden">
        {!hasOutput ? (
          <div className="w-full h-full flex items-center flex-col justify-center">
            <div className="p-5 w-[70px] flex items-center justify-center text-[30px] h-[70px] rounded-full bg-gradient-to-r from-purple-400 to-purple-600">
              <HiOutlineCode />
            </div>
            <p className='text-[16px] text-gray-400 mt-3'>
              Your component & code will appear here.
            </p>
          </div>
        ) : (
          <CodeEditor
            code={code}
            activeTab={activeTab}
            onTabChange={onTabChange}
            onNewTab={() => onNewTabToggle(true)}
            onRefresh={onRefresh}
            onFixImages={onFixImages}
            refreshKey={refreshKey}
          />
        )}
      </div>

      {/* Fullscreen Preview Overlay */}
      {isNewTabOpen && (
        <div className="fixed inset-0 bg-white w-screen h-screen overflow-auto z-50">
          <div className="text-black w-full h-[60px] flex items-center justify-between px-5 bg-gray-100 border-b">
            <p className='font-bold'>Preview - CompAIler Generated Component</p>
            <button 
              onClick={() => onNewTabToggle(false)} 
              className="w-10 h-10 rounded-xl border border-zinc-300 flex items-center justify-center hover:bg-gray-200 transition-colors"
              title="Close Preview"
            >
              <IoCloseSharp />
            </button>
          </div>
          <iframe 
            srcDoc={code} 
            className="w-full h-[calc(100vh-60px)]"
            title="Full Screen Preview"
          />
        </div>
      )}
    </>
  );
};

export default OutputDisplay;