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
  } = useComponentGenerator();

  return (
    <>
      <Navbar />

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 lg:px-16">
        {/* Left Section - Input Form */}
        <ComponentGenerator 
          prompt={prompt}
          onPromptChange={handlePromptChange}
          framework={framework}
          onFrameworkChange={handleFrameworkChange}
          onGenerate={handleGenerateCode}
          loading={loading}
        />

        {/* Right Section - Output Display */}
        <OutputDisplay 
          code={code}
          hasOutput={outputScreen}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          isNewTabOpen={isNewTabOpen}
          onNewTabToggle={handleNewTabToggle}
          refreshKey={refreshKey}
          onRefresh={handleRefresh}
        />
      </div>
    </>
  )
}

export default Home
