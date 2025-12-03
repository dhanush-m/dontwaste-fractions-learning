'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/appStore'
import EquivalentFractionsMatcher from './activities/EquivalentFractionsMatcher'
import FractionComparison from './activities/FractionComparison'
import AddingFractions from './activities/AddingFractions'
import FractionNumberLine from './activities/FractionNumberLine'
import WordProblems from './activities/WordProblems'
import confetti from 'canvas-confetti'

const ACTIVITIES = [
  {
    id: 'equivalent',
    name: 'Equivalent Fractions',
    description: 'Learn to identify fractions with the same value',
    component: EquivalentFractionsMatcher,
    icon: '🎯',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'comparison',
    name: 'Comparing Fractions',
    description: 'Compare fractions to determine which is larger',
    component: FractionComparison,
    icon: '⚖️',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'addition',
    name: 'Adding Fractions',
    description: 'Learn to add fractions with same and different denominators',
    component: AddingFractions,
    icon: '➕',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'numberline',
    name: 'Number Line',
    description: 'Place fractions correctly on a number line',
    component: FractionNumberLine,
    icon: '📏',
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'wordproblems',
    name: 'Word Problems',
    description: 'Apply fraction skills to solve real-world problems',
    component: WordProblems,
    icon: '🧮',
    color: 'from-indigo-500 to-purple-500'
  }
]

export default function CurriculumFlow() {
  const { setPhase } = useAppStore()
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0)
  const [completedActivities, setCompletedActivities] = useState([])
  const [showMenu, setShowMenu] = useState(true)

  const handleActivityComplete = () => {
    const currentActivity = ACTIVITIES[currentActivityIndex]

    // Mark as completed
    setCompletedActivities(prev => [...prev, currentActivity.id])

    // Celebration
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })

    // Check if all activities completed
    if (currentActivityIndex >= ACTIVITIES.length - 1) {
      // All activities completed!
      setTimeout(() => {
        handleAllComplete()
      }, 2000)
    } else {
      // Show menu to choose next activity
      setTimeout(() => {
        setShowMenu(true)
      }, 1500)
    }
  }

  const handleAllComplete = () => {
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff']
    })

    setTimeout(() => {
      setPhase('assessment')
    }, 3000)
  }

  const startActivity = (index) => {
    setCurrentActivityIndex(index)
    setShowMenu(false)
  }

  const goToMenu = () => {
    setShowMenu(true)
  }

  if (showMenu) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Fractions Learning Curriculum
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Master fractions through 5 engaging activities!
            </p>

            {/* Progress Overview */}
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-700 font-semibold">Overall Progress:</span>
                <span className="text-2xl font-bold text-blue-600">
                  {completedActivities.length} / {ACTIVITIES.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${(completedActivities.length / ACTIVITIES.length) * 100}%` }}
                />
              </div>
            </div>
          </motion.div>

          {/* Activity Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ACTIVITIES.map((activity, index) => {
              const isCompleted = completedActivities.includes(activity.id)
              const isLocked = index > 0 && !completedActivities.includes(ACTIVITIES[index - 1].id)
              const isCurrent = index === currentActivityIndex && !isCompleted

              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={!isLocked ? { scale: 1.05, y: -5 } : {}}
                  className={`relative bg-white rounded-xl shadow-xl overflow-hidden ${
                    isLocked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                  onClick={() => !isLocked && startActivity(index)}
                >
                  {/* Status Badge */}
                  {isCompleted && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="bg-green-500 text-white rounded-full p-2">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}

                  {isLocked && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="bg-gray-500 text-white rounded-full p-2">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* Gradient Header */}
                  <div className={`bg-gradient-to-r ${activity.color} text-white p-6 text-center`}>
                    <div className="text-6xl mb-3">{activity.icon}</div>
                    <h3 className="text-xl font-bold mb-1">Activity {index + 1}</h3>
                    <h2 className="text-2xl font-bold">{activity.name}</h2>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-gray-600 mb-6 min-h-[60px]">
                      {activity.description}
                    </p>

                    {/* Status & Action */}
                    <div className="text-center">
                      {isCompleted ? (
                        <div>
                          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full inline-block mb-3">
                            ✓ Completed
                          </div>
                          <button className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-colors">
                            Play Again
                          </button>
                        </div>
                      ) : isLocked ? (
                        <div className="bg-gray-100 text-gray-600 px-4 py-3 rounded-lg">
                          Complete previous activities first
                        </div>
                      ) : isCurrent ? (
                        <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 rounded-lg transition-colors shadow-lg animate-pulse">
                          Continue →
                        </button>
                      ) : (
                        <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 rounded-lg transition-colors shadow-lg">
                          Start Activity →
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center space-y-4"
          >
            {completedActivities.length === ACTIVITIES.length ? (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  🎉 Congratulations! 🎉
                </h3>
                <p className="text-gray-700 mb-4">
                  You&apos;ve completed all activities! Ready for the final assessment?
                </p>
                <button
                  onClick={handleAllComplete}
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg transition-colors"
                >
                  Take Final Assessment →
                </button>
              </div>
            ) : (
              <div className="text-gray-600">
                <p className="mb-4">
                  {completedActivities.length > 0
                    ? 'Great progress! Keep going to unlock more activities.'
                    : 'Start with Activity 1 to begin your fractions journey!'}
                </p>
              </div>
            )}

            <div className="pt-6 border-t border-gray-200 max-w-2xl mx-auto">
              <button
                onClick={() => setPhase('games')}
                className="text-blue-600 hover:text-blue-800 font-semibold underline"
              >
                Or play mini-games for extra practice →
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  // Render current activity
  const CurrentActivity = ACTIVITIES[currentActivityIndex].component

  return (
    <div className="relative">
      {/* Back to Menu Button */}
      <div className="absolute top-4 left-4 z-50">
        <button
          onClick={goToMenu}
          className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-lg flex items-center gap-2 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Menu
        </button>
      </div>

      {/* Activity Component */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentActivityIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
        >
          <CurrentActivity onComplete={handleActivityComplete} />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
