'use client'

import { motion } from 'framer-motion'
import { useEnhancedStore } from '@/store/enhancedAppStore'

export default function LandingPage() {
  const { setPhase } = useEnhancedStore()

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full text-center"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
            Exploring Fractions in
            <span className="text-blue-600 block mt-2">Everyday Life</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            An adaptive learning journey for Grades 5-6
          </p>
          <p className="text-lg text-gray-500 mb-12">
            Meru International School
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              What You'll Learn
            </h2>
            <ul className="text-left space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span>Understanding fractions through visual representations</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span>Equivalent fractions and operations</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span>Real-world applications in everyday life</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span>Interactive activities with instant feedback</span>
              </li>
            </ul>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPhase('introduction')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg shadow-lg transition-colors"
          >
            Start Learning Journey
          </motion.button>

          <p className="text-sm text-gray-500 mt-4">
            Session Duration: 25-30 minutes
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

