'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/appStore'
import confetti from 'canvas-confetti'

const WORD_PROBLEMS = [
  {
    id: 1,
    story: "Sarah ate 1/4 of a pizza. Her brother ate 1/4 of the same pizza. How much of the pizza did they eat together?",
    visual: { type: 'pizza', parts: 4, used: [0, 1] },
    answer: { num: 2, den: 4 },
    simplified: { num: 1, den: 2 },
    hint: "Add 1/4 + 1/4. When denominators are the same, just add the numerators!",
    difficulty: 'easy'
  },
  {
    id: 2,
    story: "Tom has 2/3 of a chocolate bar. He eats 1/3 of it. How much chocolate bar does he have left?",
    visual: { type: 'bar', parts: 3, used: [0, 1] },
    answer: { num: 1, den: 3 },
    simplified: { num: 1, den: 3 },
    hint: "Subtract 1/3 from 2/3. Same denominators, so subtract the numerators!",
    difficulty: 'easy'
  },
  {
    id: 3,
    story: "Lisa drank 3/8 of a bottle of water in the morning and 2/8 in the afternoon. What fraction of the bottle did she drink in total?",
    visual: { type: 'bottle', parts: 8, used: [0, 1, 2, 3, 4] },
    answer: { num: 5, den: 8 },
    simplified: { num: 5, den: 8 },
    hint: "Add 3/8 + 2/8. Add the numerators: 3 + 2 = 5, keep denominator 8",
    difficulty: 'easy'
  },
  {
    id: 4,
    story: "A recipe calls for 1/2 cup of flour and 1/4 cup of sugar. How much more flour than sugar is needed?",
    visual: { type: 'measuring', parts: 4, flour: 2, sugar: 1 },
    answer: { num: 1, den: 4 },
    simplified: { num: 1, den: 4 },
    hint: "Find 1/2 - 1/4. Convert 1/2 to 2/4, then subtract: 2/4 - 1/4 = 1/4",
    difficulty: 'medium'
  },
  {
    id: 5,
    story: "Emma read 2/5 of a book on Saturday and 1/5 on Sunday. What fraction of the book has she read?",
    visual: { type: 'book', parts: 5, used: [0, 1, 2] },
    answer: { num: 3, den: 5 },
    simplified: { num: 3, den: 5 },
    hint: "Add 2/5 + 1/5. Same denominator, so 2 + 1 = 3. Answer: 3/5",
    difficulty: 'easy'
  },
  {
    id: 6,
    story: "Jack walked 3/4 of a mile to school. His friend walked 1/2 mile. How much farther did Jack walk?",
    visual: { type: 'distance', parts: 4, jack: 3, friend: 2 },
    answer: { num: 1, den: 4 },
    simplified: { num: 1, den: 4 },
    hint: "Find 3/4 - 1/2. Convert 1/2 to 2/4, then: 3/4 - 2/4 = 1/4",
    difficulty: 'medium'
  },
  {
    id: 7,
    story: "A garden has flowers planted in 2/6 of the space and vegetables in 3/6 of the space. What fraction of the garden is planted?",
    visual: { type: 'garden', parts: 6, used: [0, 1, 2, 3, 4] },
    answer: { num: 5, den: 6 },
    simplified: { num: 5, den: 6 },
    hint: "Add 2/6 + 3/6 = 5/6. The garden has 5/6 planted.",
    difficulty: 'easy'
  },
  {
    id: 8,
    story: "Maria practiced piano for 1/3 of an hour in the morning and 1/6 of an hour in the evening. How long did she practice in total?",
    visual: { type: 'clock', parts: 6, morning: 2, evening: 1 },
    answer: { num: 3, den: 6 },
    simplified: { num: 1, den: 2 },
    hint: "Add 1/3 + 1/6. Convert 1/3 to 2/6, then add: 2/6 + 1/6 = 3/6 = 1/2",
    difficulty: 'medium'
  }
]

export default function WordProblems({ onComplete }) {
  const { addPoints, addBadge } = useAppStore()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [userAnswer, setUserAnswer] = useState({ numerator: '', denominator: '' })
  const [feedback, setFeedback] = useState(null)
  const [showHint, setShowHint] = useState(false)
  const [showVisual, setShowVisual] = useState(true)

  const problem = WORD_PROBLEMS[currentQuestion]

  const simplifyFraction = (num, den) => {
    const gcd = (a, b) => b === 0 ? a : gcd(b, a % b)
    const divisor = gcd(Math.abs(num), Math.abs(den))
    return { num: num / divisor, den: den / divisor }
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

    const simplified = simplifyFraction(num, den)
    const isCorrect =
      (simplified.num === problem.answer.num && simplified.den === problem.answer.den) ||
      (simplified.num === problem.simplified.num && simplified.den === problem.simplified.den)

    if (isCorrect) {
      setScore(prev => prev + 1)
      addPoints(20)

      setFeedback({
        correct: true,
        message: `Perfect! The answer is ${problem.simplified.num}/${problem.simplified.den}. Great problem-solving! 🎉`
      })

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      })

      if (score >= 6) {
        addBadge({
          name: 'Problem Solver Pro',
          type: 'wordproblems',
          icon: '🧮'
        })
      }

      setTimeout(() => {
        if (currentQuestion < WORD_PROBLEMS.length - 1) {
          setCurrentQuestion(prev => prev + 1)
          setUserAnswer({ numerator: '', denominator: '' })
          setFeedback(null)
          setShowHint(false)
          setShowVisual(true)
        } else {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          })
          setTimeout(() => {
            onComplete?.()
          }, 2000)
        }
      }, 2500)
    } else {
      setFeedback({
        correct: false,
        message: `Not quite. The correct answer is ${problem.simplified.num}/${problem.simplified.den}. Think about the story again!`
      })

      setTimeout(() => {
        setFeedback(null)
      }, 3000)
    }
  }

  const renderVisual = () => {
    const { visual } = problem

    if (!showVisual) return null

    switch (visual.type) {
      case 'pizza':
      case 'bar':
      case 'garden':
        return (
          <div className="flex gap-1 max-w-md mx-auto">
            {Array.from({ length: visual.parts }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 border-2 border-gray-400 h-16 rounded ${
                  visual.used.includes(i) ? 'bg-blue-500' : 'bg-white'
                }`}
              />
            ))}
          </div>
        )

      case 'book':
        return (
          <div className="flex gap-1 max-w-md mx-auto">
            {Array.from({ length: visual.parts }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 border-2 border-gray-600 h-20 rounded ${
                  visual.used.includes(i) ? 'bg-green-500' : 'bg-gray-200'
                }`}
              >
                <div className="text-xs text-center mt-1">📖</div>
              </div>
            ))}
          </div>
        )

      case 'bottle':
        return (
          <div className="flex flex-col-reverse gap-1 max-w-xs mx-auto">
            {Array.from({ length: visual.parts }).map((_, i) => (
              <div
                key={i}
                className={`w-full border-2 border-gray-400 h-8 rounded ${
                  visual.used.includes(i) ? 'bg-blue-400' : 'bg-white'
                }`}
              />
            ))}
          </div>
        )

      case 'measuring':
        return (
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <div>
              <p className="text-center mb-2 font-semibold">Flour (1/2)</p>
              <div className="flex gap-1">
                {Array.from({ length: visual.parts }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 border-2 border-gray-400 h-16 ${
                      i < visual.flour ? 'bg-yellow-300' : 'bg-white'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="text-center mb-2 font-semibold">Sugar (1/4)</p>
              <div className="flex gap-1">
                {Array.from({ length: visual.parts }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 border-2 border-gray-400 h-16 ${
                      i < visual.sugar ? 'bg-pink-300' : 'bg-white'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )

      case 'distance':
        return (
          <div className="space-y-4 max-w-md mx-auto">
            <div>
              <p className="text-center mb-2 font-semibold">Jack: 3/4 mile</p>
              <div className="flex gap-1">
                {Array.from({ length: visual.parts }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 border-2 border-gray-400 h-12 ${
                      i < visual.jack ? 'bg-blue-400' : 'bg-white'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="text-center mb-2 font-semibold">Friend: 1/2 mile</p>
              <div className="flex gap-1">
                {Array.from({ length: visual.parts }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 border-2 border-gray-400 h-12 ${
                      i < visual.friend ? 'bg-green-400' : 'bg-white'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )

      case 'clock':
        return (
          <div className="space-y-4 max-w-md mx-auto">
            <div>
              <p className="text-center mb-2 font-semibold">Morning: 1/3 hour</p>
              <div className="flex gap-1">
                {Array.from({ length: visual.parts }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 border-2 border-gray-400 h-12 ${
                      i < visual.morning ? 'bg-orange-400' : 'bg-white'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="text-center mb-2 font-semibold">Evening: 1/6 hour</p>
              <div className="flex gap-1">
                {Array.from({ length: visual.parts }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 border-2 border-gray-400 h-12 ${
                      i < visual.evening ? 'bg-purple-400' : 'bg-white'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

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
            Fraction Word Problems
          </h1>
          <p className="text-gray-600 mb-4">
            Solve real-world problems using fractions!
          </p>

          {/* Progress */}
          <div className="flex items-center justify-between text-sm mb-4">
            <div>
              <span className="font-semibold">Problem:</span> {currentQuestion + 1}/{WORD_PROBLEMS.length}
            </div>
            <div>
              <span className="font-semibold">Score:</span> {score}/{WORD_PROBLEMS.length}
            </div>
            <div>
              <span className={`px-3 py-1 rounded-full text-white ${
                problem.difficulty === 'easy' ? 'bg-green-500' : 'bg-orange-500'
              }`}>
                {problem.difficulty}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / WORD_PROBLEMS.length) * 100}%` }}
            />
          </div>
        </motion.div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-4">
          <button
            onClick={() => setShowHint(!showHint)}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg"
          >
            {showHint ? 'Hide Hint' : 'Show Hint'}
          </button>
          <button
            onClick={() => setShowVisual(!showVisual)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            {showVisual ? 'Hide Visual' : 'Show Visual'}
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
              <p className="text-blue-700">{problem.hint}</p>
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

        {/* Problem */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg shadow-xl p-8 mb-6"
        >
          {/* Story */}
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-6 mb-6">
            <p className="text-xl text-gray-800 leading-relaxed">
              {problem.story}
            </p>
          </div>

          {/* Visual */}
          <AnimatePresence>
            {showVisual && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-gray-50 rounded-lg p-6 mb-6"
              >
                <p className="text-center text-gray-600 mb-4 font-semibold">Visual Helper:</p>
                {renderVisual()}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Answer Input */}
          <div className="max-w-md mx-auto">
            <div className="text-center mb-4">
              <label className="text-gray-700 font-semibold text-lg">Your Answer:</label>
            </div>

            <div className="flex items-center justify-center gap-4 mb-6">
              <input
                type="number"
                value={userAnswer.numerator}
                onChange={(e) => setUserAnswer({ ...userAnswer, numerator: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="?"
                disabled={feedback?.correct}
                className="w-24 p-3 text-2xl text-center border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
              />
              <div className="text-4xl font-bold text-gray-600">—</div>
              <input
                type="number"
                value={userAnswer.denominator}
                onChange={(e) => setUserAnswer({ ...userAnswer, denominator: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="?"
                disabled={feedback?.correct}
                className="w-24 p-3 text-2xl text-center border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={feedback?.correct || !userAnswer.numerator || !userAnswer.denominator}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-300 text-white font-bold py-4 rounded-xl text-xl shadow-lg transition-colors"
            >
              {feedback?.correct ? 'Moving to next problem...' : 'Submit Answer'}
            </motion.button>
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 text-center"
        >
          <p className="text-gray-700">
            Read the problem carefully, use the visual if needed, and simplify your answer!
          </p>
        </motion.div>
      </div>
    </div>
  )
}
