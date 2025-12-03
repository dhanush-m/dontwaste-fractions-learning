'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEnhancedStore } from '@/store/enhancedAppStore'
import confetti from 'canvas-confetti'

export default function AddingFractions({ onComplete, chapterId = 'fractions' }) {
  const { addXP, addBadge, recordAnswer, useHint: trackHintUsage } = useEnhancedStore()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [questions, setQuestions] = useState([])
  const [userAnswer, setUserAnswer] = useState({ numerator: '', denominator: '' })
  const [feedback, setFeedback] = useState(null)
  const [showHint, setShowHint] = useState(false)
  const [attempts, setAttempts] = useState(0)

  const totalQuestions = 8

  useEffect(() => {
    generateQuestions()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const gcd = (a, b) => {
    return b === 0 ? a : gcd(b, a % b)
  }

  const simplifyFraction = (num, den) => {
    const divisor = gcd(Math.abs(num), Math.abs(den))
    return { num: num / divisor, den: den / divisor }
  }

  const generateQuestion = (difficulty) => {
    let frac1, frac2, commonDen

    if (difficulty === 'easy') {
      // Same denominators
      commonDen = [2, 3, 4, 5, 6, 8][Math.floor(Math.random() * 6)]
      frac1 = {
        num: Math.floor(Math.random() * (commonDen - 1)) + 1,
        den: commonDen
      }
      frac2 = {
        num: Math.floor(Math.random() * (commonDen - frac1.num)),
        den: commonDen
      }
    } else {
      // Different denominators
      const dens = [2, 3, 4, 5, 6, 8, 10, 12]
      frac1 = {
        num: Math.floor(Math.random() * 5) + 1,
        den: dens[Math.floor(Math.random() * dens.length)]
      }
      frac2 = {
        num: Math.floor(Math.random() * 5) + 1,
        den: dens[Math.floor(Math.random() * dens.length)]
      }
    }

    // Calculate answer
    if (frac1.den === frac2.den) {
      commonDen = frac1.den
      const answerNum = frac1.num + frac2.num
      const simplified = simplifyFraction(answerNum, commonDen)
      return { frac1, frac2, answer: simplified, commonDen, difficulty }
    } else {
      // Find LCM for common denominator
      const lcm = (frac1.den * frac2.den) / gcd(frac1.den, frac2.den)
      const num1 = frac1.num * (lcm / frac1.den)
      const num2 = frac2.num * (lcm / frac2.den)
      const answerNum = num1 + num2
      const simplified = simplifyFraction(answerNum, lcm)
      return { frac1, frac2, answer: simplified, commonDen: lcm, difficulty }
    }
  }

  const generateQuestions = () => {
    const newQuestions = []
    // First 4 questions: same denominators (easy)
    for (let i = 0; i < 4; i++) {
      newQuestions.push(generateQuestion('easy'))
    }
    // Last 4 questions: different denominators (hard)
    for (let i = 0; i < 4; i++) {
      newQuestions.push(generateQuestion('hard'))
    }
    setQuestions(newQuestions)
  }

  const handleSubmit = () => {
    const num = parseInt(userAnswer.numerator)
    const den = parseInt(userAnswer.denominator)

    if (isNaN(num) || isNaN(den) || den === 0) {
      setFeedback({
        correct: false,
        message: 'Please enter valid numbers for both numerator and denominator!'
      })
      return
    }

    const question = questions[currentQuestion]
    const simplified = simplifyFraction(num, den)
    const isCorrect = simplified.num === question.answer.num && simplified.den === question.answer.den

    setAttempts(prev => prev + 1)

    if (isCorrect) {
      setScore(prev => prev + 1)

      // Record correct answer and award XP
      recordAnswer(true, chapterId, `${question.frac1.num}/${question.frac1.den} + ${question.frac2.num}/${question.frac2.den} = ${question.answer.num}/${question.answer.den}`)
      addXP(15, 'Correct Addition')

      setFeedback({
        correct: true,
        message: `Perfect! ${question.frac1.num}/${question.frac1.den} + ${question.frac2.num}/${question.frac2.den} = ${question.answer.num}/${question.answer.den}`
      })

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      })

      if (score >= 6) {
        addBadge({
          name: 'Addition Master',
          type: 'addition',
          icon: '➕'
        })
      }

      setTimeout(() => {
        if (currentQuestion < totalQuestions - 1) {
          setCurrentQuestion(prev => prev + 1)
          setUserAnswer({ numerator: '', denominator: '' })
          setFeedback(null)
          setShowHint(false)
        } else {
          // Complete
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
    } else {
      // Record wrong answer
      recordAnswer(false, chapterId, `${question.frac1.num}/${question.frac1.den} + ${question.frac2.num}/${question.frac2.den}`)

      setFeedback({
        correct: false,
        message: `Not quite. The correct answer is ${question.answer.num}/${question.answer.den}. Try the next one!`
      })

      setTimeout(() => {
        if (currentQuestion < totalQuestions - 1) {
          setCurrentQuestion(prev => prev + 1)
          setUserAnswer({ numerator: '', denominator: '' })
          setFeedback(null)
          setShowHint(false)
        } else {
          setTimeout(() => {
            onComplete?.()
          }, 2000)
        }
      }, 3000)
    }
  }

  const renderVisualFraction = (frac, color = 'blue') => {
    const segments = []
    for (let i = 0; i < frac.den; i++) {
      segments.push(
        <div
          key={i}
          className={`flex-1 border border-gray-400 ${
            i < frac.num ? `bg-${color}-500` : 'bg-gray-200'
          }`}
          style={{
            minHeight: '30px',
            backgroundColor: i < frac.num ? (color === 'blue' ? '#3b82f6' : '#10b981') : '#e5e7eb'
          }}
        />
      )
    }
    return (
      <div className="flex gap-1 max-w-md mx-auto" style={{ height: '40px' }}>
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
            Adding Fractions Challenge
          </h1>
          <p className="text-gray-600 mb-4">
            Add the fractions and simplify your answer
          </p>

          {/* Progress */}
          <div className="flex items-center justify-between text-sm mb-4">
            <div>
              <span className="font-semibold">Question:</span> {currentQuestion + 1}/{totalQuestions}
            </div>
            <div>
              <span className="font-semibold">Score:</span> {score}/{totalQuestions}
            </div>
            <div>
              <span className={`px-3 py-1 rounded-full text-white ${
                question.difficulty === 'easy' ? 'bg-green-500' : 'bg-orange-500'
              }`}>
                {question.difficulty === 'easy' ? 'Same Denominator' : 'Different Denominators'}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3">
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
                trackHintUsage('adding-fractions', 1)
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
              {question.difficulty === 'easy' ? (
                <p className="text-blue-700">
                  Same denominators: Just add the numerators and keep the denominator!
                  <br />Example: 1/4 + 2/4 = 3/4
                </p>
              ) : (
                <p className="text-blue-700">
                  Different denominators: Find a common denominator first!
                  <br />1. Find the LCM of the denominators
                  <br />2. Convert both fractions to have that denominator
                  <br />3. Add the numerators
                  <br />4. Simplify if possible
                </p>
              )}
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
          {/* Visual representations */}
          <div className="mb-8">
            <div className="mb-4">
              <div className="text-center mb-2 text-sm text-gray-600">
                {question.frac1.num}/{question.frac1.den}
              </div>
              {renderVisualFraction(question.frac1, 'blue')}
            </div>

            <div className="text-center text-3xl font-bold text-gray-400 my-4">+</div>

            <div className="mb-4">
              <div className="text-center mb-2 text-sm text-gray-600">
                {question.frac2.num}/{question.frac2.den}
              </div>
              {renderVisualFraction(question.frac2, 'green')}
            </div>
          </div>

          {/* Equation */}
          <div className="text-center mb-8">
            <div className="text-5xl font-bold text-gray-800 inline-flex items-center gap-4">
              <div>
                <div>{question.frac1.num}</div>
                <div className="border-t-4 border-gray-800">{question.frac1.den}</div>
              </div>
              <div className="text-6xl">+</div>
              <div>
                <div>{question.frac2.num}</div>
                <div className="border-t-4 border-gray-800">{question.frac2.den}</div>
              </div>
              <div className="text-6xl">=</div>
              <div className="text-6xl text-gray-400">?</div>
            </div>
          </div>

          {/* Answer Input */}
          <div className="max-w-md mx-auto">
            <div className="text-center mb-4">
              <label className="text-gray-700 font-semibold">Your Answer:</label>
            </div>

            <div className="flex items-center justify-center gap-4 mb-6">
              <input
                type="number"
                value={userAnswer.numerator}
                onChange={(e) => setUserAnswer({ ...userAnswer, numerator: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="?"
                disabled={feedback !== null}
                className="w-24 p-3 text-2xl text-center border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
              />
              <div className="text-4xl font-bold text-gray-600">—</div>
              <input
                type="number"
                value={userAnswer.denominator}
                onChange={(e) => setUserAnswer({ ...userAnswer, denominator: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="?"
                disabled={feedback !== null}
                className="w-24 p-3 text-2xl text-center border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={feedback !== null || !userAnswer.numerator || !userAnswer.denominator}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-4 rounded-xl text-xl shadow-lg transition-colors"
            >
              {feedback ? 'Next Question...' : 'Submit Answer'}
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
            Remember to simplify your answer to the lowest terms!
          </p>
        </motion.div>
      </div>
    </div>
  )
}
