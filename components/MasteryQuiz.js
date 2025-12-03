'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEnhancedStore } from '@/store/enhancedAppStore'
import confetti from 'canvas-confetti'

// Question bank by chapter
const QUIZ_QUESTIONS = {
  fractions: [
    {
      question: 'What is 1/2 + 1/4?',
      options: ['1/6', '2/6', '3/4', '2/8'],
      correct: 2,
      explanation: '1/2 = 2/4, so 2/4 + 1/4 = 3/4'
    },
    {
      question: 'Which fraction is equivalent to 2/3?',
      options: ['3/4', '4/6', '6/8', '3/6'],
      correct: 1,
      explanation: '2/3 = 4/6 (multiply both by 2)'
    },
    {
      question: 'Which is larger: 2/5 or 3/7?',
      options: ['2/5', '3/7', 'Equal', 'Cannot determine'],
      correct: 1,
      explanation: '2/5 = 0.4, 3/7 ≈ 0.43, so 3/7 is larger'
    },
    {
      question: 'Simplify 6/9',
      options: ['1/3', '2/3', '3/6', '6/9 is simplest'],
      correct: 1,
      explanation: '6/9 = 2/3 (divide both by 3)'
    },
    {
      question: 'What is 3/4 - 1/4?',
      options: ['1/4', '2/4', '1/2', '2/8'],
      correct: 2,
      explanation: '3/4 - 1/4 = 2/4 = 1/2'
    },
    {
      question: 'If you eat 3/8 of a pizza, how much is left?',
      options: ['5/8', '3/5', '8/3', '11/8'],
      correct: 0,
      explanation: '1 - 3/8 = 8/8 - 3/8 = 5/8'
    },
    {
      question: 'What is 1/3 + 1/6?',
      options: ['2/9', '1/2', '2/6', '1/9'],
      correct: 1,
      explanation: '1/3 = 2/6, so 2/6 + 1/6 = 3/6 = 1/2'
    },
    {
      question: 'Which fraction is between 1/4 and 1/2?',
      options: ['1/8', '1/3', '2/3', '3/4'],
      correct: 1,
      explanation: '1/4 = 0.25, 1/3 ≈ 0.33, 1/2 = 0.5, so 1/3 is between them'
    },
    {
      question: 'If a recipe needs 2/3 cup flour and you double it, how much flour?',
      options: ['4/3 cups', '2/6 cups', '4/6 cups', '1 1/3 cups'],
      correct: 3,
      explanation: '2/3 × 2 = 4/3 = 1 1/3 cups'
    },
    {
      question: 'What fraction of an hour is 15 minutes?',
      options: ['1/2', '1/3', '1/4', '1/5'],
      correct: 2,
      explanation: '15 minutes out of 60 minutes = 15/60 = 1/4'
    }
  ]
  // Add more chapters as needed
}

export default function MasteryQuiz({ chapterId, onComplete }) {
  const { addXP, recordAnswer, setMastery } = useEnhancedStore()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const questions = QUIZ_QUESTIONS[chapterId] || QUIZ_QUESTIONS.fractions
  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  const handleAnswer = (index) => {
    if (showFeedback) return

    const isCorrect = index === question.correct
    setSelectedAnswer(index)
    setShowFeedback(true)

    // Record answer
    recordAnswer(isCorrect, chapterId, question.question)

    // Add to answers array
    setAnswers(prev => [...prev, {
      questionIndex: currentQuestion,
      correct: isCorrect,
      selectedIndex: index
    }])

    // Move to next question after delay
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1)
        setSelectedAnswer(null)
        setShowFeedback(false)
      } else {
        // Show results
        calculateResults()
      }
    }, 2500)
  }

  const calculateResults = () => {
    const allAnswers = [...answers, {
      questionIndex: currentQuestion,
      correct: selectedAnswer === question.correct,
      selectedIndex: selectedAnswer
    }]

    const totalCorrect = allAnswers.filter(a => a.correct).length
    const percentage = Math.round((totalCorrect / questions.length) * 100)

    // Award XP
    if (percentage >= 80) {
      addXP(100, 'Mastery Quiz Passed!')
    } else {
      addXP(30, 'Mastery Quiz Attempted')
    }

    // Set mastery score
    setMastery(chapterId, percentage)

    setShowResults({ totalCorrect, percentage, answers: allAnswers })
  }

  const handleRetry = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setSelectedAnswer(null)
    setShowFeedback(false)
    setShowResults(false)
  }

  if (showResults) {
    const passed = showResults.percentage >= 80

    if (passed) {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.5 }
      })
    }

    return (
      <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-8"
          >
            <div className="text-center mb-8">
              <div className="text-8xl mb-4">{passed ? '🎓' : '📚'}</div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                {passed ? 'Mastery Achieved!' : 'Keep Practicing!'}
              </h1>
              <p className="text-xl text-gray-600">
                {passed ? 'You\'ve mastered this chapter!' : 'Review the material and try again'}
              </p>
            </div>

            {/* Score Circle */}
            <div className="flex justify-center mb-8">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="16"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    fill="none"
                    stroke={passed ? '#10b981' : '#f59e0b'}
                    strokeWidth="16"
                    strokeDasharray={`${(showResults.percentage / 100) * 502} 502`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-5xl font-bold text-gray-800">
                    {showResults.totalCorrect}
                  </div>
                  <div className="text-sm text-gray-600">out of {questions.length}</div>
                  <div className="text-3xl font-bold text-gray-700 mt-2">
                    {showResults.percentage}%
                  </div>
                </div>
              </div>
            </div>

            {/* Message */}
            <div className={`${
              passed ? 'bg-green-50 border-green-500' : 'bg-orange-50 border-orange-500'
            } border-l-4 rounded-lg p-6 mb-8`}>
              <p className={`text-lg ${
                passed ? 'text-green-800' : 'text-orange-800'
              }`}>
                {passed
                  ? `Congratulations! You scored ${showResults.percentage}% and unlocked the next chapter. +100 XP!`
                  : `You scored ${showResults.percentage}%. You need 80% to pass. Review the lessons and activities, then try again. +30 XP for trying!`
                }
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              {!passed && (
                <button
                  onClick={handleRetry}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-xl"
                >
                  Retry Quiz
                </button>
              )}
              <button
                onClick={() => onComplete?.(showResults.percentage)}
                className={`${
                  passed
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600'
                    : 'bg-gray-500 hover:bg-gray-600'
                } text-white font-bold py-4 px-12 rounded-xl shadow-lg`}
              >
                {passed ? 'Continue →' : 'Back to Chapter'}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Mastery Quiz</h1>
          <p className="text-gray-600 mb-4">
            Answer all questions to test your mastery. You need 80% to pass!
          </p>

          {/* Progress Bar */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                />
              </div>
            </div>
            <div className="text-sm font-semibold text-gray-600">
              {currentQuestion + 1} / {questions.length}
            </div>
          </div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-white rounded-2xl shadow-2xl p-8"
          >
            <div className="mb-8">
              <div className="text-sm text-blue-600 font-semibold mb-2">
                Question {currentQuestion + 1}
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {question.question}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={!showFeedback ? { scale: 1.02, x: 5 } : {}}
                  whileTap={!showFeedback ? { scale: 0.98 } : {}}
                  onClick={() => handleAnswer(index)}
                  disabled={showFeedback}
                  className={`w-full p-4 rounded-lg text-left font-semibold transition-all ${
                    showFeedback && index === question.correct
                      ? 'bg-green-100 border-2 border-green-500 text-green-800'
                      : showFeedback && index === selectedAnswer
                      ? 'bg-red-100 border-2 border-red-500 text-red-800'
                      : 'bg-gray-50 hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-300 text-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      showFeedback && index === question.correct
                        ? 'bg-green-500 text-white'
                        : showFeedback && index === selectedAnswer
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span>{option}</span>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Explanation */}
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-6 p-4 rounded-lg ${
                  selectedAnswer === question.correct
                    ? 'bg-green-50 border-l-4 border-green-500'
                    : 'bg-blue-50 border-l-4 border-blue-500'
                }`}
              >
                <p className={`font-semibold mb-1 ${
                  selectedAnswer === question.correct ? 'text-green-800' : 'text-blue-800'
                }`}>
                  {selectedAnswer === question.correct ? '✓ Correct!' : '💡 Explanation:'}
                </p>
                <p className={selectedAnswer === question.correct ? 'text-green-700' : 'text-blue-700'}>
                  {question.explanation}
                </p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
