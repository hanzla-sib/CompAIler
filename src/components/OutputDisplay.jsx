import React from 'react';
import { HiOutlineCode } from 'react-icons/hi';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import CodeEditor from './CodeEditor';

/**
 * OutputDisplay component for showing generated code and preview
 * @param {Object} props - Component props
 * @param {string} props.code - Generated code content
 * @param {boolean} props.hasOutput - Whether there is generated output
 * @param {number} props.activeTab - Active tab (1 for code, 2 for preview)
 * @param {function} props.onTabChange - Handler for tab changes
 * @param {number} props.refreshKey - Key for forcing preview refresh
 * @param {function} props.onRefresh - Handler for refreshing preview
 * @param {function} props.onFixImages - Handler for fixing broken images
 */
const OutputDisplay = ({ 
  code, 
  hasOutput, 
  activeTab, 
  onTabChange, 
  refreshKey,
  onRefresh,
  onFixImages
}) => {
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const emptyStateVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: { 
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4
      }
    }
  };



  return (
    <>
      <motion.div 
        className="relative mt-2 w-full h-[50vh] sm:h-[60vh] lg:h-[80vh] rounded-xl overflow-hidden shadow-lg border border-opacity-20"
        style={{ 
          backgroundColor: 'var(--secondary-bg)',
          borderColor: 'var(--border-color)'
        }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="wait">
          {!hasOutput ? (
            <motion.div 
              key="empty-state"
              className="w-full h-full flex items-center flex-col justify-center"
              variants={emptyStateVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <motion.div 
                className="p-5 w-[70px] flex items-center justify-center text-[30px] h-[70px] rounded-full bg-gradient-to-r from-purple-400 to-purple-600 shadow-lg"
                variants={iconVariants}
                whileHover={{ 
                  scale: 1.1,
                  rotate: 360,
                  transition: { duration: 0.6 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <HiOutlineCode />
                </motion.div>
              </motion.div>
              
              <motion.p 
                className='text-[16px] mt-3 text-center max-w-xs'
                style={{ color: 'var(--text-secondary)' }}
                variants={textVariants}
              >
                Your component & code will appear here.
              </motion.p>
              
              <motion.div
                className="mt-4 flex space-x-2"
                variants={textVariants}
              >
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-purple-400"
                    animate={{ 
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="code-editor"
              className="w-full h-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
            >
              <CodeEditor
                code={code}
                activeTab={activeTab}
                onTabChange={onTabChange}
                onRefresh={onRefresh}
                onFixImages={onFixImages}
                refreshKey={refreshKey}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* No overlay needed - we're opening in a new tab/window */}
    </>
  );
};

export default OutputDisplay;