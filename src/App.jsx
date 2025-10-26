import React from 'react'
import "./App.css"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import NoPage from './pages/NoPage';
import { ThemeProvider } from './contexts/ThemeContext';

const App = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      <ThemeProvider>
        <BrowserRouter>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="*" element={<NoPage />} />
            </Routes>
          </AnimatePresence>
        </BrowserRouter>
      </ThemeProvider>
    </motion.div>
  )
}

export default App