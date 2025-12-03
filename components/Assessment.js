'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/appStore'
import Timer from './Timer'
import confetti from 'canvas-confetti'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function Assessment() {
  const { sessionId, setPhase, points, addPoints, recordAnswer, updateTimeSpent } = useAppStore()
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    loadAssessmentQuestions()
    const timer = setInterval(() => {
      setTimeElapsed((prev) => {
        const newTime = prev + 1
        updateTimeSpent()
        return newTime
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const loadAssessmentQuestions = async () => {
    try {
      // Generate 5 assessment questions
      const questionPromises = []
      for (let i = 0; i < 5; i++) {
        const response = await fetch(`${API_URL}/api/generate-question`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            level: 2, // Assessment uses intermediate level
            sessionId,
            previousPerformance: []
          })
        })
        const data = await response.json()
        if (data.success) {
          questionPromises.push(data.question)
        }
      }
      
      // Fallback questions if API fails
      if (questionPromises.length === 0) {
        setQuestions([
          {
            question: "Is 2/4 equal to 1/2?",
            type: "equivalent",
            correctAnswer: "yes",
            options: ["yes", "no"]
          },
          {
            question: "Add 1/3 + 1/6",
            type: "operation",
            correctAnswer: "1/2",
            options: ["1/2", "2/9", "1/9", "2/3"]
          },
          {
            question: "What is 3/4 - 1/4?",
            type: "operation",
            correctAnswer: "1/2",
            options: ["1/2", "2/4", "1/4", "4/4"]
          },
          {
            question: "If Meru school shares 5/8 of playground time for sports, how much is left for recess?",
            type: "word_problem",
            correctAnswer: "3/8",
            options: ["3/8", "5/8", "1/8", "8/8"]
          },
          {
            question: "Which fraction is equivalent to 1/2?",
            type: "equivalent",
            correctAnswer: "2/4",
            options: ["1/4", "2/4", "3/4", "4/4"]
          }
        ])
      } else {
        setQuestions(questionPromises)
      }
    } catch (error) {
      console.error('Error loading assessment:', error)
      // Use fallback questions
      setQuestions([
        {
          question: "Is 2/4 equal to 1/2?",
          type: "equivalent",
          correctAnswer: "yes",
          options: ["yes", "no"]
        },
        {
          question: "Add 1/3 + 1/6",
          type: "operation",
          correctAnswer: "1/2",
          options: ["1/2", "2/9", "1/9", "2/3"]
        },
        {
          question: "What is 3/4 - 1/4?",
          type: "operation",
          correctAnswer: "1/2",
          options: ["1/2", "2/4", "1/4", "4/4"]
        },
        {
          question: "If Meru school shares 5/8 of playground time for sports, how much is left for recess?",
          type: "word_problem",
          correctAnswer: "3/8",
          options: ["3/8", "5/8", "1/8", "8/8"]
        },
        {
          question: "Which fraction is equivalent to 1/2?",
          type: "equivalent",
          correctAnswer: "2/4",
          options: ["1/4", "2/4", "3/4", "4/4"]
        }
      ])
    }
  }

  const handleAnswerSelect = (answer) => {
    setAnswers({
      ...answers,
      [currentQuestionIndex]: answer
    })
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      submitAssessment()
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const submitAssessment = () => {
    let correctCount = 0
    questions.forEach((q, idx) => {
      const userAnswer = answers[idx]
      const isCorrect = userAnswer && userAnswer.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim()
      if (isCorrect) {
        correctCount++
        recordAnswer(true, q.question, userAnswer)
      } else {
        recordAnswer(false, q.question, userAnswer || '')
      }
    })

    const finalScore = (correctCount / questions.length) * 100
    setScore(finalScore)
    setIsComplete(true)
    setShowResults(true)

    // Save assessment score
    fetch(`${API_URL}/api/update-score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        assessmentScore: finalScore,
        totalPoints: points
      })
    }).catch(console.error)

    if (finalScore >= 70) {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 }
      })
    }
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assessment questions...</p>
        </div>
      </div>
    )
  }

  if (showResults) {
    return (
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full text-center"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Assessment Complete!</h1>
          <div className="mb-6">
            <div className={`text-6xl font-bold mb-2 ${score >= 70 ? 'text-green-600' : 'text-orange-600'}`}>
              {Math.round(score)}%
            </div>
            <p className="text-xl text-gray-600">
              You got {Math.round((score / 100) * questions.length)} out of {questions.length} questions correct
            </p>
          </div>

          {score >= 70 ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mb-6"
            >
              <p className="text-2xl text-green-600 font-semibold mb-4">
                🎉 Excellent Work! You&apos;ve mastered fractions!
              </p>
              <p className="text-gray-600">
                You&apos;re ready to apply fractions in everyday life!
              </p>
            </motion.div>
          ) : (
            <motion.div className="mb-6">
              <p className="text-xl text-orange-600 font-semibold mb-4">
                Good effort! Let&apos;s practice more.
              </p>
              <p className="text-gray-600">
                You can review the activities and try again. Remember, practice makes perfect!
              </p>
            </motion.div>
          )}

          <button
            onClick={() => setPhase('dashboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
          >
            View Dashboard →
          </button>
        </motion.div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Timer timeElapsed={timeElapsed} totalTime={5 * 60} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-xl p-6 md:p-8 mb-6"
        >
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Final Assessment</h1>
            <p className="text-gray-600">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="mb-6"
            >
              <div className="bg-blue-50 rounded-lg p-6 mb-4">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  {currentQuestion.question}
                </h2>

                <div className="space-y-2">
                  {currentQuestion.options && currentQuestion.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswerSelect(option)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        answers[currentQuestionIndex] === option
                          ? 'border-blue-500 bg-blue-100'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className={`py-3 px-6 rounded-lg font-semibold transition-all ${
                currentQuestionIndex === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-600 hover:bg-gray-700 text-white'
              }`}
            >
              ← Previous
            </button>
            <button
              onClick={handleNext}
              className="flex-1 py-3 px-6 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all"
            >
              {currentQuestionIndex === questions.length - 1 ? 'Submit Assessment' : 'Next →'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

