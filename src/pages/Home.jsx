import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
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
    refreshKey,
    handleGenerateCode,
    handleTabChange,
    handleFrameworkChange,
    handlePromptChange,
    handleRefresh,
    handleFixImages,
  } = useComponentGenerator();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen"
      style={{ backgroundColor: 'var(--primary-bg)' }}
    >
      <Navbar />

      {/* Hero Section */}
      <motion.div 
        className="text-center py-8 px-4"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <motion.h1 
          className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
          style={{ color: 'var(--text-color)' }}
          whileHover={{ 
            scale: 1.02,
            textShadow: "0px 0px 20px rgba(192, 132, 252, 0.8)"
          }}
        >
          Build Faster with{' '}
          <span className="sp-text">AI-Powered</span>{' '}
          Components
        </motion.h1>
        <motion.p 
          className="text-lg md:text-xl mb-8 max-w-3xl mx-auto"
          style={{ color: 'var(--text-secondary)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          Describe your component in plain English and watch our AI generate production-ready code
          with live preview and professional styling.
        </motion.p>
      </motion.div>

      {/* Main Layout */}
      <motion.div 
        className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-8 px-4 sm:px-6 lg:px-16 pb-8"
        variants={containerVariants}
      >
        {/* Left Section - Input Form */}
        <motion.div 
          className="w-full"
          variants={sectionVariants}
          whileHover={{ 
            y: -5,
            transition: { duration: 0.2 }
          }}
        >
          <ComponentGenerator 
            prompt={prompt}
            onPromptChange={handlePromptChange}
            framework={framework}
            onFrameworkChange={handleFrameworkChange}
            onGenerate={handleGenerateCode}
            loading={loading}
          />
        </motion.div>

        {/* Right Section - Output Display */}
        <motion.div 
          className="w-full"
          variants={sectionVariants}
          whileHover={{ 
            y: -5,
            transition: { duration: 0.2 }
          }}
        >
          <OutputDisplay 
            code={code}
            hasOutput={outputScreen}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            refreshKey={refreshKey}
            onRefresh={handleRefresh}
            onFixImages={handleFixImages}
          />
        </motion.div>
      </motion.div>

      {/* Background decoration */}
      <motion.div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: -1 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 2 }}
      >
        {/* Animated background elements */}
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-40 right-10 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </motion.div>
    </motion.div>
  )
}

export default Home
