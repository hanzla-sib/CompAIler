import React from 'react';
import Navbar from '../components/Navbar';
import ComponentGenerator from '../components/ComponentGenerator';
import OutputDisplay from '../components/OutputDisplay';
import { useComponentGenerator } from '../hooks/useComponentGenerator';

const Home = () => {
  const {
    outputScreen,
    activeTab,
    prompt,
    framework,
    code,
    loading,
    isNewTabOpen,
    refreshKey,
    handleGenerateCode,
    handleTabChange,
    handleFrameworkChange,
    handlePromptChange,
    handleNewTabToggle,
    handleRefresh,
    handleFixImages,
  } = useComponentGenerator();

  return (
    <>
      <Navbar />

      {/* Main Layout */}
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 lg:gap-6 px-4 sm:px-6 lg:px-16 pb-6">
        {/* Left Section - Input Form */}
        <div className="w-full">
          <ComponentGenerator 
            prompt={prompt}
            onPromptChange={handlePromptChange}
            framework={framework}
            onFrameworkChange={handleFrameworkChange}
            onGenerate={handleGenerateCode}
            loading={loading}
          />
        </div>

        {/* Right Section - Output Display */}
        <div className="w-full">
          <OutputDisplay 
            code={code}
            hasOutput={outputScreen}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            isNewTabOpen={isNewTabOpen}
            onNewTabToggle={handleNewTabToggle}
            refreshKey={refreshKey}
            onRefresh={handleRefresh}
            onFixImages={handleFixImages}
          />
        </div>
      </div>
    </>
  )
}

export default Home
