'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useEnhancedStore } from '@/store/enhancedAppStore'

const AVATARS = ['👨‍🎓', '👩‍🎓', '🧑‍🎓', '👦', '👧', '🧒', '👶', '🐶', '🐱', '🦊', '🐼', '🦁', '🐸', '🦉', '🚀', '⭐']

const GRADES = [1, 2, 3, 4, 5, 6, 7, 8]

export default function ProfileSetup({ onComplete }) {
  const { setStudent, initializeSession, updateStreak } = useEnhancedStore()
  const [name, setName] = useState('')
  const [grade, setGrade] = useState(5)
  const [avatar, setAvatar] = useState('👨‍🎓')
  const [step, setStep] = useState(1)

  const handleComplete = () => {
    // Set student profile
    setStudent({
      name: name || 'Student',
      grade,
      avatar
    })

    // Initialize session and streak
    initializeSession()
    updateStreak()

    // Proceed to pre-assessment
    onComplete?.()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-2xl w-full"
      >
        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  s <= step
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`w-16 h-1 mx-2 ${
                    s < step ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Name */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-center"
          >
            <div className="text-6xl mb-6">👋</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Welcome to Your Learning Journey!
            </h1>
            <p className="text-gray-600 mb-8">
              Let's start by getting to know you. What should we call you?
            </p>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full max-w-md mx-auto p-4 text-xl text-center border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none mb-6"
              autoFocus
              onKeyPress={(e) => e.key === 'Enter' && name && setStep(2)}
            />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => name && setStep(2)}
              disabled={!name}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-300 disabled:to-gray-300 text-white font-bold py-4 px-12 rounded-xl text-xl shadow-lg"
            >
              Next →
            </motion.button>
          </motion.div>
        )}

        {/* Step 2: Grade */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-center"
          >
            <div className="text-6xl mb-6">📚</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              What grade are you in, {name}?
            </h2>
            <p className="text-gray-600 mb-8">
              This helps us personalize your learning experience
            </p>

            <div className="grid grid-cols-4 gap-4 max-w-lg mx-auto mb-8">
              {GRADES.map((g) => (
                <motion.button
                  key={g}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setGrade(g)}
                  className={`p-6 rounded-xl font-bold text-2xl transition-all ${
                    grade === g
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {g}
                </motion.button>
              ))}
            </div>

            <div className="flex gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStep(1)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-4 px-8 rounded-xl"
              >
                ← Back
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStep(3)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 px-12 rounded-xl shadow-lg"
              >
                Next →
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Avatar */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-center"
          >
            <div className="text-6xl mb-6">{avatar}</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Choose Your Avatar!
            </h2>
            <p className="text-gray-600 mb-8">
              Pick an avatar that represents you
            </p>

            <div className="grid grid-cols-4 md:grid-cols-8 gap-3 max-w-2xl mx-auto mb-8">
              {AVATARS.map((av) => (
                <motion.button
                  key={av}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setAvatar(av)}
                  className={`p-4 rounded-xl text-4xl transition-all ${
                    avatar === av
                      ? 'bg-blue-500 shadow-lg ring-4 ring-blue-300'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {av}
                </motion.button>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8">
              <h3 className="font-bold text-gray-800 mb-3">Your Profile:</h3>
              <div className="flex items-center justify-center gap-6 text-lg">
                <div>
                  <span className="text-gray-600">Name:</span>{' '}
                  <span className="font-bold">{name}</span>
                </div>
                <div>
                  <span className="text-gray-600">Grade:</span>{' '}
                  <span className="font-bold">{grade}</span>
                </div>
                <div>
                  <span className="text-gray-600">Avatar:</span>{' '}
                  <span className="text-3xl">{avatar}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStep(2)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-4 px-8 rounded-xl"
              >
                ← Back
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleComplete}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-4 px-12 rounded-xl shadow-lg text-xl"
              >
                Start Learning! 🚀
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
