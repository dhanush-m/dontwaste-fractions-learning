'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEnhancedStore } from '@/store/enhancedAppStore'
import confetti from 'canvas-confetti'

export default function FractionNumberLine({ onComplete, chapterId = 'fractions' }) {
  const { addXP, addBadge, recordAnswer, useHint: trackHintUsage } = useEnhancedStore()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [questions, setQuestions] = useState([])
  const [selectedPosition, setSelectedPosition] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [showHint, setShowHint] = useState(false)
  const [draggedItem, setDraggedItem] = useState(null)

  const totalQuestions = 8

  useEffect(() => {
    generateQuestions()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const generateQuestion = () => {
    const denominators = [2, 3, 4, 5, 6, 8]
    const den = denominators[Math.floor(Math.random() * denominators.length)]
    const num = Math.floor(Math.random() * den) + 1

    // Generate some distractor positions
    const correctValue = num / den
    const distractors = []

    for (let i = 0; i < 3; i++) {
      let distractor
      do {
        const dNum = Math.floor(Math.random() * den) + 1
        distractor = dNum / den
      } while (Math.abs(distractor - correctValue) < 0.1 || distractors.includes(distractor))
      distractors.push(distractor)
    }

    return {
      fraction: { num, den },
      value: correctValue,
      distractors,
      type: Math.random() > 0.5 ? 'place' : 'identify' // place fraction or identify position
    }
  }

  const generateQuestions = () => {
    const newQuestions = []
    for (let i = 0; i < totalQuestions; i++) {
      newQuestions.push(generateQuestion())
    }
    setQuestions(newQuestions)
  }

  const handlePositionClick = (position) => {
    if (feedback) return

    const question = questions[currentQuestion]
    const tolerance = 0.05 // 5% tolerance
    const isCorrect = Math.abs(position - question.value) < tolerance

    setSelectedPosition(position)

    if (isCorrect) {
      setScore(prev => prev + 1)

      // Record correct answer and award XP
      recordAnswer(true, chapterId, `Placed ${question.fraction.num}/${question.fraction.den} at ${position.toFixed(2)}`)
      addXP(12, 'Number Line Placement')

      setFeedback({
        correct: true,
        message: `Excellent! ${question.fraction.num}/${question.fraction.den} is correctly placed at ${position.toFixed(2)}`
      })

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      })

      if (score >= 6) {
        addBadge({
          name: 'Number Line Navigator',
          type: 'numberline',
          icon: '📏'
        })
      }
    } else {
      // Record wrong answer
      recordAnswer(false, chapterId, `Placed ${question.fraction.num}/${question.fraction.den} at ${position.toFixed(2)} (should be ${question.value.toFixed(2)})`)

      setFeedback({
        correct: false,
        message: `Not quite. ${question.fraction.num}/${question.fraction.den} should be at ${question.value.toFixed(2)}, not ${position.toFixed(2)}`
      })
    }

    setTimeout(() => {
      if (currentQuestion < totalQuestions - 1) {
        setCurrentQuestion(prev => prev + 1)
        setSelectedPosition(null)
        setFeedback(null)
        setShowHint(false)
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
  }

  const renderNumberLine = () => {
    const question = questions[currentQuestion]
    const markers = []

    // Create 11 markers (0 to 1 in increments of 0.1)
    for (let i = 0; i <= 10; i++) {
      const value = i / 10
      const isSelected = selectedPosition === value
      const isCorrect = Math.abs(value - question.value) < 0.05

      markers.push(
        <div
          key={i}
          onClick={() => handlePositionClick(value)}
          className={`absolute cursor-pointer transition-all ${
            isSelected
              ? feedback?.correct
                ? 'bg-green-500 scale-150'
                : 'bg-red-500 scale-150'
              : feedback && isCorrect
              ? 'bg-green-500 scale-125'
              : 'bg-gray-400 hover:bg-blue-500 hover:scale-125'
          }`}
          style={{
            left: `${i * 10}%`,
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            top: '50%'
          }}
        >
          {/* Label */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap">
            {value.toFixed(1)}
          </div>
        </div>
      )
    }

    return markers
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
            Fraction Number Line Challenge
          </h1>
          <p className="text-gray-600 mb-4">
            Place fractions correctly on the number line from 0 to 1
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
              <span className="font-semibold">Accuracy:</span> {currentQuestion > 0 ? Math.round((score / currentQuestion) * 100) : 100}%
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
                trackHintUsage('number-line', 1)
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
                To place a fraction on a number line:
                <br />1. Divide the numerator by the denominator to get a decimal
                <br />2. For {question.fraction.num}/{question.fraction.den}: {question.fraction.num} ÷ {question.fraction.den} = {question.value.toFixed(2)}
                <br />3. Find that position between 0 and 1
                <br />Tip: 1/2 = 0.5 (middle), 1/4 = 0.25 (quarter way), 3/4 = 0.75 (three-quarters)
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
          {/* Fraction to place */}
          <div className="text-center mb-12">
            <p className="text-gray-700 text-lg mb-4">Place this fraction on the number line:</p>
            <div className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl p-6 shadow-lg">
              <div className="text-6xl font-bold">
                <div>{question.fraction.num}</div>
                <div className="border-t-4 border-white my-2"></div>
                <div>{question.fraction.den}</div>
              </div>
            </div>
          </div>

          {/* Number Line */}
          <div className="mb-16">
            <p className="text-center text-gray-600 mb-6">Click on the correct position:</p>

            <div className="relative bg-gradient-to-r from-red-200 via-yellow-200 via-green-200 to-blue-200 h-4 rounded-full mx-8">
              {/* Markers */}
              {renderNumberLine()}

              {/* Start and End Labels */}
              <div className="absolute -left-2 -top-1 text-2xl font-bold text-gray-800">0</div>
              <div className="absolute -right-2 -top-1 text-2xl font-bold text-gray-800">1</div>

              {/* Show correct position after feedback */}
              {feedback && !feedback.correct && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute bg-green-500 border-4 border-green-700"
                  style={{
                    left: `${question.value * 100}%`,
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    transform: 'translate(-50%, -50%)',
                    top: '50%'
                  }}
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-green-700 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                    Correct: {question.value.toFixed(2)}
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Visual Representation */}
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-center text-gray-600 mb-4">Visual representation:</p>
            <div className="flex gap-1 max-w-md mx-auto">
              {Array.from({ length: question.fraction.den }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 border-2 border-gray-400 h-12 rounded ${
                    i < question.fraction.num ? 'bg-blue-500' : 'bg-white'
                  }`}
                />
              ))}
            </div>
            <p className="text-center text-gray-600 mt-4">
              {question.fraction.num} out of {question.fraction.den} parts shaded = {question.value.toFixed(2)}
            </p>
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
            Click on a marker to place the fraction on the number line
          </p>
        </motion.div>
      </div>
    </div>
  )
}
