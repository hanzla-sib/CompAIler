import React from 'react';
import Editor from '@monaco-editor/react';
import { IoCopy, IoCloseSharp } from 'react-icons/io5';
import { PiExportBold } from 'react-icons/pi';
import { ImNewTab } from 'react-icons/im';
import { FiRefreshCcw } from 'react-icons/fi';
import { HiOutlinePhotograph } from 'react-icons/hi';
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
 * @param {function} props.onNewTab - Handler for opening in new tab
 * @param {function} props.onRefresh - Handler for refreshing preview
 * @param {function} props.onFixImages - Handler for fixing broken images
 * @param {number} props.refreshKey - Key for forcing iframe refresh
 */
const CodeEditor = ({ 
  code, 
  activeTab, 
  onTabChange, 
  onNewTab, 
  onRefresh, 
  onFixImages,
  refreshKey 
}) => {
  const { isDarkMode } = useTheme();
  // Copy code to clipboard
  const copyCode = async () => {
    if (!code?.trim()) {
      toast.error(ERROR_MESSAGES.NO_CODE);
      return;
    }
    
    try {
      await navigator.clipboard.writeText(code);
      toast.success(SUCCESS_MESSAGES.CODE_COPIED);
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast.error(ERROR_MESSAGES.COPY_FAILED);
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

  return (
    <>
      {/* Tabs */}
      <div className="w-full h-[50px] flex items-center gap-2 sm:gap-3 px-2 sm:px-3" 
           style={{ backgroundColor: 'var(--tertiary-bg)' }}>
        <button
          onClick={() => onTabChange(1)}
          className={`w-1/2 py-2 rounded-lg transition-all text-sm sm:text-base ${
            activeTab === 1 
              ? "bg-purple-600 text-white" 
              : isDarkMode 
                ? "bg-zinc-800 text-gray-300 hover:bg-zinc-700" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Code
        </button>
        <button
          onClick={() => onTabChange(2)}
          className={`w-1/2 py-2 rounded-lg transition-all text-sm sm:text-base ${
            activeTab === 2 
              ? "bg-purple-600 text-white" 
              : isDarkMode 
                ? "bg-zinc-800 text-gray-300 hover:bg-zinc-700" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Preview
        </button>
      </div>

      {/* Toolbar */}
      <div className="w-full h-[50px] flex items-center justify-between px-2 sm:px-4" 
           style={{ backgroundColor: 'var(--tertiary-bg)' }}>
        <p className='font-bold text-sm sm:text-base truncate' 
           style={{ color: 'var(--text-color)' }}>
          {activeTab === 1 ? 'Code Editor' : 'Live Preview'}
        </p>
        <div className="flex items-center gap-1 sm:gap-2">
          {activeTab === 1 ? (
            <>
              <button 
                onClick={copyCode} 
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl border flex items-center justify-center transition-colors text-sm sm:text-base"
                style={{ 
                  borderColor: 'var(--border-color)', 
                  color: 'var(--text-color)',
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--hover-bg)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                title="Copy Code"
              >
                <IoCopy />
              </button>
              <button 
                onClick={downloadFile} 
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl border flex items-center justify-center transition-colors text-sm sm:text-base"
                style={{ 
                  borderColor: 'var(--border-color)', 
                  color: 'var(--text-color)',
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--hover-bg)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                title="Download File"
              >
                <PiExportBold />
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={handleFixImages} 
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl border flex items-center justify-center transition-colors text-sm sm:text-base"
                style={{ 
                  borderColor: 'var(--border-color)', 
                  color: 'var(--text-color)',
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--hover-bg)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                title="Fix Broken Images"
              >
                <HiOutlinePhotograph />
              </button>
              <button 
                onClick={onNewTab} 
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl border flex items-center justify-center transition-colors text-sm sm:text-base"
                style={{ 
                  borderColor: 'var(--border-color)', 
                  color: 'var(--text-color)',
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--hover-bg)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                title="Open in New Tab"
              >
                <ImNewTab />
              </button>
              <button 
                onClick={onRefresh} 
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl border flex items-center justify-center transition-colors text-sm sm:text-base"
                style={{ 
                  borderColor: 'var(--border-color)', 
                  color: 'var(--text-color)',
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--hover-bg)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                title="Refresh Preview"
              >
                <FiRefreshCcw />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Editor / Preview */}
      <div className=" sm:h-[240px] lg:h-[550px]">
        {activeTab === 1 ? (
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
        ) : (
          <iframe 
            key={refreshKey} 
            srcDoc={code} 
            className="w-full h-full bg-white text-black overflow-auto"
            title="Code Preview"
            // style={{ minHeight: '300px' }}
          />
        )}
      </div>
    </>
  );
};

export default CodeEditor;