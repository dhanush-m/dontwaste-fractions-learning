'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useEnhancedStore } from '@/store/enhancedAppStore'
import ChocolateBarActivity from './ChocolateBarActivity'
import VoiceInput from './VoiceInput'
import Timer from './Timer'
import TextToSpeech from './TextToSpeech'
import AIGuru from './AIGuru'

export default function Introduction() {
  const { setPhase } = useEnhancedStore()
  const [isComplete, setIsComplete] = useState(false)
  const timerRef = useRef(null)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const targetTime = 5 * 60 // 5 minutes in seconds

  useEffect(() => {
    // Start timer
    timerRef.current = setInterval(() => {
      setTimeElapsed((prev) => {
        const newTime = prev + 1
        if (newTime >= targetTime) {
          setIsComplete(true)
          return targetTime
        }
        return newTime
      })
    }, 1000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [targetTime])

  // No need for separate time tracking - using enhanced store's activity logging

  const handleActivityComplete = () => {
    setIsComplete(true)
  }

  const handleContinue = () => {
    setPhase('profile')
  }

  const introText = "Fractions represent parts of a whole. The numerator is the top number showing how many parts we have, and the denominator is the bottom number showing the total equal parts. For example, 3/4 means 3 out of 4 equal parts. Fractions help us share things fairly, like dividing a chocolate bar among friends. Now let's practice by shading 3/4 of the rectangle!"

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Timer timeElapsed={timeElapsed} totalTime={targetTime} />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-xl p-6 md:p-8 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Introduction: Fractions in Everyday Life
            </h1>
            <TextToSpeech
              text={introText}
              rate={0.85}
              pitch={1}
            />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6 border-l-4 border-blue-500">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">What are Fractions? 🤔</h2>
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                <strong className="text-blue-600">Fractions</strong> represent parts of a whole. They help us describe how much of something we have when we divide it into equal parts.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h3 className="font-semibold text-gray-800 mb-2">📊 Parts of a Fraction</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li><strong>Numerator</strong> (top number): How many parts we have</li>
                    <li><strong>Denominator</strong> (bottom number): Total equal parts</li>
                    <li>Example: <strong>3/4</strong> means 3 out of 4 equal parts</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h3 className="font-semibold text-gray-800 mb-2">🌍 Real-World Examples</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>🍕 Pizza slices: 2/8 of a pizza</li>
                    <li>⏰ Time: 1/2 hour (30 minutes)</li>
                    <li>📚 Books: 3/4 of a chapter read</li>
                    <li>🏫 School: 5/8 playground time for sports</li>
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <p className="text-sm text-yellow-800">
                  <strong>💡 Key Concept:</strong> Fractions help us share things fairly! 
                  If you have a chocolate bar and want to share it equally among 4 friends, 
                  each person gets <strong>1/4</strong> of the bar.
                </p>
              </div>
            </div>

            <p className="text-lg md:text-xl text-gray-700 mb-4 leading-relaxed">
              <strong className="text-blue-600">Now let&apos;s practice!</strong> Imagine dividing a chocolate bar among friends—how do you ensure fairness?
            </p>
            <p className="text-base md:text-lg text-gray-600 mb-6">
              Let&apos;s start by exploring fractions visually with an interactive activity!
            </p>
          </motion.div>

          <div className="mb-6">
            <ChocolateBarActivity onComplete={handleActivityComplete} />
          </div>


          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleContinue}
            disabled={!isComplete && timeElapsed < 60}
            className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all ${
              isComplete || timeElapsed >= 60
                ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isComplete 
              ? 'Continue to Activities →' 
              : timeElapsed < 60 
                ? 'Complete the activity first (or wait 1 minute)' 
                : 'Continue to Activities →'}
          </motion.button>
        </motion.div>

        {/* AI Guru Assistant */}
        <AIGuru context={introText} pageType="lesson" />
      </div>
    </div>
  )
}

