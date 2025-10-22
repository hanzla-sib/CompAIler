import { useState } from 'react';
import { toast } from 'react-toastify';
import { generateCode, extractCode } from '../services/geminiService';
import { FRAMEWORK_OPTIONS, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants/prompts';

/**
 * Custom hook for managing component generator state and logic
 * @returns {Object} State and handlers for the component generator
 */
export const useComponentGenerator = () => {
  // State management
  const [outputScreen, setOutputScreen] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [framework, setFramework] = useState(FRAMEWORK_OPTIONS[0]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNewTabOpen, setIsNewTabOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  /**
   * Generate code based on current prompt and framework
   */
  const handleGenerateCode = async () => {
    if (!prompt.trim()) {
      toast.error(ERROR_MESSAGES.NO_PROMPT);
      return;
    }

    try {
      setLoading(true);
      const response = await generateCode(prompt, framework.value);
      const extractedCode = extractCode(response);
      
      setCode(extractedCode);
      setOutputScreen(true);
      setActiveTab(1); // Switch to code tab after generation
      
      toast.success(SUCCESS_MESSAGES.CODE_GENERATED);
    } catch (error) {
      console.error('Generation error:', error);
      toast.error(error.message || ERROR_MESSAGES.GENERATION_FAILED);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle tab change between code and preview
   * @param {number} tabNumber - Tab number (1 or 2)
   */
  const handleTabChange = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  /**
   * Handle framework selection change
   * @param {Object} selectedFramework - Selected framework option
   */
  const handleFrameworkChange = (selectedFramework) => {
    setFramework(selectedFramework);
  };

  /**
   * Handle prompt text change
   * @param {string} newPrompt - New prompt text
   */
  const handlePromptChange = (newPrompt) => {
    setPrompt(newPrompt);
  };

  /**
   * Handle new tab toggle for fullscreen preview
   * @param {boolean} isOpen - Whether to open or close new tab
   */
  const handleNewTabToggle = (isOpen) => {
    setIsNewTabOpen(isOpen);
  };

  /**
   * Handle preview refresh
   */
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  /**
   * Reset generator state
   */
  const resetGenerator = () => {
    setOutputScreen(false);
    setActiveTab(1);
    setPrompt("");
    setFramework(FRAMEWORK_OPTIONS[0]);
    setCode("");
    setLoading(false);
    setIsNewTabOpen(false);
    setRefreshKey(0);
  };

  return {
    // State
    outputScreen,
    activeTab,
    prompt,
    framework,
    code,
    loading,
    isNewTabOpen,
    refreshKey,
    
    // Handlers
    handleGenerateCode,
    handleTabChange,
    handleFrameworkChange,
    handlePromptChange,
    handleNewTabToggle,
    handleRefresh,
    resetGenerator,
  };
};