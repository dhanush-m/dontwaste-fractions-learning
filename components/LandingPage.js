'use client'

import { motion } from 'framer-motion'
import { useEnhancedStore } from '@/store/enhancedAppStore'

export default function LandingPage() {
  const { setPhase, setStudent, initializeSession, updateStreak } = useEnhancedStore()

  const handleStartLearning = () => {
    // Initialize session
    initializeSession()
    updateStreak()

    // Go to name input first
    setPhase('name-input')
  }

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
            Master Math with
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block mt-2">DontWaste Education</span>
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            An adaptive, gamified learning platform for Grades 1-8
          </p>
          <p className="text-lg text-gray-500 mb-8">
            Personalized paths • XP & Levels • Streak tracking • Mastery-based progression
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
              4 Complete Math Chapters
            </h2>
            <div className="grid grid-cols-2 gap-4 text-left">
              <div className="flex items-center">
                <span className="text-3xl mr-3">🍕</span>
                <div>
                  <div className="font-semibold text-gray-800">Fractions</div>
                  <div className="text-sm text-gray-500">Parts & wholes</div>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-3xl mr-3">🔢</span>
                <div>
                  <div className="font-semibold text-gray-800">Decimals</div>
                  <div className="text-sm text-gray-500">Place values</div>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-3xl mr-3">📊</span>
                <div>
                  <div className="font-semibold text-gray-800">Percentages</div>
                  <div className="text-sm text-gray-500">Out of 100</div>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-3xl mr-3">🧮</span>
                <div>
                  <div className="font-semibold text-gray-800">Number Sense</div>
                  <div className="text-sm text-gray-500">Mental math</div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600 space-y-2">
                <div className="flex items-center">
                  <span className="text-blue-500 mr-2">⭐</span>
                  <span>Earn XP and level up as you learn</span>
                </div>
                <div className="flex items-center">
                  <span className="text-blue-500 mr-2">🔥</span>
                  <span>Build daily streaks for consistency</span>
                </div>
                <div className="flex items-center">
                  <span className="text-blue-500 mr-2">🎯</span>
                  <span>Complete lessons & activities to unlock chapters</span>
                </div>
                <div className="flex items-center">
                  <span className="text-blue-500 mr-2">🎓</span>
                  <span>Pass mastery quizzes to progress</span>
                </div>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartLearning}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg shadow-lg transition-colors"
          >
            Start Learning Journey
          </motion.button>

          <p className="text-sm text-gray-500 mt-4">
            Jump right in • Learn at your own pace • Track your progress
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

