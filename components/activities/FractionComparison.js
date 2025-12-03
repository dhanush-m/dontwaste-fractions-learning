'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEnhancedStore } from '@/store/enhancedAppStore'
import confetti from 'canvas-confetti'

export default function FractionComparison({ onComplete, chapterId = 'fractions' }) {
  const { addXP, addBadge, recordAnswer, useHint: trackHintUsage } = useEnhancedStore()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [questions, setQuestions] = useState([])
  const [feedback, setFeedback] = useState(null)
  const [showHint, setShowHint] = useState(false)
  const [streak, setStreak] = useState(0)

  const totalQuestions = 10

  useEffect(() => {
    generateQuestions()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const generateQuestions = () => {
    const newQuestions = []
    for (let i = 0; i < totalQuestions; i++) {
      newQuestions.push(generateQuestion())
    }
    setQuestions(newQuestions)
  }

  const generateQuestion = () => {
    // Generate two fractions
    const frac1 = {
      num: Math.floor(Math.random() * 7) + 1,
      den: Math.floor(Math.random() * 8) + 2
    }

    const frac2 = {
      num: Math.floor(Math.random() * 7) + 1,
      den: Math.floor(Math.random() * 8) + 2
    }

    const val1 = frac1.num / frac1.den
    const val2 = frac2.num / frac2.den

    let correctAnswer
    if (val1 > val2) correctAnswer = '>'
    else if (val1 < val2) correctAnswer = '<'
    else correctAnswer = '='

    return { frac1, frac2, correctAnswer, value1: val1, value2: val2 }
  }

  const handleAnswer = (answer) => {
    const question = questions[currentQuestion]
    const isCorrect = answer === question.correctAnswer

    if (isCorrect) {
      setScore(prev => prev + 1)
      setStreak(prev => prev + 1)

      // Record correct answer and award XP
      recordAnswer(true, chapterId, `${question.frac1.num}/${question.frac1.den} ${question.correctAnswer} ${question.frac2.num}/${question.frac2.den}`)
      addXP(10, 'Correct Comparison')

      setFeedback({
        correct: true,
        message: `Correct! ${question.frac1.num}/${question.frac1.den} ${question.correctAnswer} ${question.frac2.num}/${question.frac2.den}`
      })

      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.6 }
      })

      if (streak >= 4) {
        addBadge({
          name: 'Comparison Champion',
          type: 'comparison',
          icon: '🏆'
        })
      }
    } else {
      setStreak(0)

      // Record wrong answer
      recordAnswer(false, chapterId, `${question.frac1.num}/${question.frac1.den} ${answer} ${question.frac2.num}/${question.frac2.den}`)

      setFeedback({
        correct: false,
        message: `Not quite. ${question.frac1.num}/${question.frac1.den} ${question.correctAnswer} ${question.frac2.num}/${question.frac2.den}`
      })
    }

    setTimeout(() => {
      if (currentQuestion < totalQuestions - 1) {
        setCurrentQuestion(prev => prev + 1)
        setFeedback(null)
        setShowHint(false)
      } else {
        // Game complete
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        })

        setTimeout(() => {
          onComplete?.()
        }, 2000)
      }
    }, 2000)
  }

  const renderVisualFraction = (frac) => {
    const segments = []
    for (let i = 0; i < frac.den; i++) {
      segments.push(
        <div
          key={i}
          className={`flex-1 border border-gray-400 ${
            i < frac.num ? 'bg-blue-500' : 'bg-gray-200'
          }`}
          style={{ minHeight: '30px' }}
        />
      )
    }
    return (
      <div className="flex gap-1" style={{ height: '40px' }}>
        {segments}
      </div>
    )
  }

  if (questions.length === 0) {
    return <div className="text-center p-8">Loading...</div>
  }

  const question = questions[currentQuestion]

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-xl p-6 mb-6"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Fraction Comparison Challenge
          </h1>
          <p className="text-gray-600 mb-4">
            Which fraction is larger? Use &gt;, &lt;, or = symbols
          </p>

          {/* Progress */}
          <div className="flex items-center justify-between text-sm">
            <div>
              <span className="font-semibold">Question:</span> {currentQuestion + 1}/{totalQuestions}
            </div>
            <div>
              <span className="font-semibold">Score:</span> {score}/{totalQuestions}
            </div>
            <div>
              <span className="font-semibold">Streak:</span> 🔥 {streak}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </motion.div>

        {/* Hint Button */}
        <div className="text-center mb-4">
          <button
            onClick={() => {
              if (!showHint) {
                trackHintUsage('fraction-comparison', 1)
              }
              setShowHint(!showHint)
            }}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg"
          >
            {showHint ? 'Hide Hint' : 'Need Help?'}
          </button>
        </div>

        {/* Hint */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-6"
            >
              <p className="text-blue-800 font-semibold mb-2">💡 Hint:</p>
              <p className="text-blue-700">
                To compare fractions:
                <br />1. If denominators are same, compare numerators (bigger numerator = bigger fraction)
                <br />2. If denominators are different, find common denominator or use visual comparison
                <br />3. Look at the colored bars below - more blue means bigger fraction!
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feedback */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`text-center p-4 rounded-lg mb-6 ${
                feedback.correct
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              <p className="text-lg font-bold">{feedback.message}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Question */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg shadow-xl p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Fraction 1 */}
            <div className="text-center">
              <div className="text-6xl font-bold text-blue-600 mb-4">
                {question.frac1.num}
                <div className="w-full h-1 bg-blue-600 my-2"></div>
                {question.frac1.den}
              </div>
              <div className="mb-2 text-sm text-gray-600">Visual:</div>
              {renderVisualFraction(question.frac1)}
            </div>

            {/* Comparison Symbol */}
            <div className="text-center">
              <div className="text-8xl font-bold text-gray-400">?</div>
              <div className="mt-4 text-gray-600">Which is correct?</div>
            </div>

            {/* Fraction 2 */}
            <div className="text-center">
              <div className="text-6xl font-bold text-green-600 mb-4">
                {question.frac2.num}
                <div className="w-full h-1 bg-green-600 my-2"></div>
                {question.frac2.den}
              </div>
              <div className="mb-2 text-sm text-gray-600">Visual:</div>
              {renderVisualFraction(question.frac2)}
            </div>
          </div>

          {/* Answer Buttons */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAnswer('<')}
              disabled={feedback !== null}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white py-6 rounded-xl text-4xl font-bold shadow-lg transition-colors"
            >
              &lt;
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAnswer('=')}
              disabled={feedback !== null}
              className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white py-6 rounded-xl text-4xl font-bold shadow-lg transition-colors"
            >
              =
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAnswer('>')}
              disabled={feedback !== null}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white py-6 rounded-xl text-4xl font-bold shadow-lg transition-colors"
            >
              &gt;
            </motion.button>
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 text-center"
        >
          <p className="text-gray-700">
            Click &lt; if left is smaller, = if equal, or &gt; if right is larger
          </p>
        </motion.div>
      </div>
    </div>
  )
}
