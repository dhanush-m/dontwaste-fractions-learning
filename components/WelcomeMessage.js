'use client'

import { motion } from 'framer-motion'
import { useEnhancedStore } from '@/store/enhancedAppStore'

export default function WelcomeMessage({ onComplete }) {
  const { student } = useEnhancedStore()

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-2xl w-full text-center"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="text-8xl mb-6"
        >
          🎉
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
        >
          Welcome, {student.name}!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-xl text-gray-600 mb-8"
        >
          You&apos;re all set to begin your learning journey! 🚀
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8"
        >
          <h3 className="font-bold text-gray-800 mb-4 text-lg">What&apos;s Next?</h3>
          <div className="space-y-3 text-left">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📚</span>
              <div>
                <div className="font-semibold text-gray-800">Choose Your Chapter</div>
                <div className="text-sm text-gray-600">Pick from Fractions, Decimals, Percentages, or Number Sense</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🎯</span>
              <div>
                <div className="font-semibold text-gray-800">Complete Activities</div>
                <div className="text-sm text-gray-600">Practice with interactive lessons and earn XP</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🏆</span>
              <div>
                <div className="font-semibold text-gray-800">Master Topics</div>
                <div className="text-sm text-gray-600">Take quizzes to unlock new chapters</div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onComplete}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-12 rounded-xl text-xl shadow-lg"
        >
          Start Learning →
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-sm text-gray-400 mt-6"
        >
          Your progress will be saved automatically
        </motion.p>
      </motion.div>
    </div>
  )
}
