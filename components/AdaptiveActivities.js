'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/appStore'
import Timer from './Timer'
import VoiceInput from './VoiceInput'
import BadgeAnimation from './BadgeAnimation'
import VisualFractionActivity from './activities/VisualFractionActivity'
import confetti from 'canvas-confetti'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function AdaptiveActivities() {
  const {
    sessionId,
    currentLevel,
    setLevel,
    setPhase,
    points,
    addPoints,
    addBadge,
    recordAnswer,
    performance,
    updateTimeSpent,
    questionsAnswered
  } = useAppStore()

  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [isCorrect, setIsCorrect] = useState(false)
  const [questionNumber, setQuestionNumber] = useState(1)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [earnedBadges, setEarnedBadges] = useState([])
  const timerRef = useRef(null)
  const targetTime = 15 * 60 // 15 minutes

  useEffect(() => {
    loadQuestion()
    timerRef.current = setInterval(() => {
      setTimeElapsed((prev) => {
        const newTime = prev + 1
        updateTimeSpent()
        return newTime
      })
    }, 1000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [currentLevel])

  const loadQuestion = async () => {
    try {
      const response = await fetch(`${API_URL}/api/generate-question`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level: currentLevel,
          sessionId,
          previousPerformance: performance.slice(-3) // Last 3 answers
        })
      })
      const data = await response.json()
      if (data.success) {
        setCurrentQuestion(data.question)
        setUserAnswer('')
        setShowFeedback(false)
      }
    } catch (error) {
      console.error('Error loading question:', error)
      // Use fallback question
      setCurrentQuestion({
        question: currentLevel === 1 
          ? "Shade 3/4 of the rectangle below."
          : "Is 2/4 equal to 1/2?",
        type: currentLevel === 1 ? "visual" : "equivalent",
        correctAnswer: currentLevel === 1 ? "3/4" : "yes",
        hint: "Think about equal parts",
        options: currentLevel === 1 ? [] : ["yes", "no"]
      })
    }
  }

  const handleVisualAnswer = async (answer, isCorrect) => {
    setIsCorrect(isCorrect)
    setUserAnswer(answer)
    await processAnswer(answer, isCorrect)
  }

  const processAnswer = async (answerValue, correct) => {
    if (!currentQuestion) return

    const correctAnswer = correct
    setIsCorrect(correctAnswer)

    // Calculate points
    const pointsEarned = correctAnswer ? (currentLevel === 1 ? 10 : 20) : 0
    if (correctAnswer) {
      addPoints(pointsEarned)
    }

    // Record answer
    recordAnswer(correctAnswer, currentQuestion.question, answerValue)

    // Save progress
    try {
      await fetch(`${API_URL}/api/save-progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          level: currentLevel,
          questionNumber,
          question: currentQuestion.question,
          answer: userAnswer,
          isCorrect: correct,
          pointsEarned
        })
      })
    } catch (error) {
      console.error('Error saving progress:', error)
    }

    // Get feedback
    try {
      const response = await fetch(`${API_URL}/api/get-feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQuestion.question,
          userAnswer: answerValue,
          isCorrect: correctAnswer
        })
      })
      const data = await response.json()
      if (data.success) {
        setFeedback(data.feedback)
      }
    } catch (error) {
      console.error('Error getting feedback:', error)
      setFeedback(correctAnswer 
        ? "Well done! Fractions help us share things fairly in everyday life."
        : "Not quite right, but keep trying! Remember to think about equal parts.")
    }

    setShowFeedback(true)

    // Celebrate if correct
    if (correctAnswer) {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 }
      })
    }

    // Check for badge awards
    checkBadges(correctAnswer)
  }

  const checkAnswer = async () => {
    if (!currentQuestion || !userAnswer.trim()) return

    const correct = userAnswer.toLowerCase().trim() === currentQuestion.correctAnswer.toLowerCase().trim()
    await processAnswer(userAnswer, correct)
  }

  const checkBadges = (correct) => {
    const newBadges = []
    
    if (questionsAnswered === 0 && correct) {
      newBadges.push({ name: 'First Step', type: 'bronze' })
    }
    
    if (currentLevel === 1 && questionsAnswered >= 4 && performance.filter(p => p.isCorrect).length >= 4) {
      newBadges.push({ name: 'Level 1 Master', type: 'silver' })
    }
    
    if (currentLevel === 2 && questionsAnswered >= 4 && performance.filter(p => p.isCorrect).length >= 4) {
      newBadges.push({ name: 'Level 2 Master', type: 'gold' })
    }

    newBadges.forEach(badge => {
      addBadge(badge)
      setEarnedBadges(prev => [...prev, badge])
      
      // Save badge
      fetch(`${API_URL}/api/award-badge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          badgeName: badge.name,
          badgeType: badge.type
        })
      }).catch(console.error)
    })
  }

  const handleNext = async () => {
    setQuestionNumber(prev => prev + 1)
    setShowFeedback(false)
    
    // Check if should advance level or move to assessment
    // Note: questionsAnswered is already incremented by recordAnswer in checkAnswer
    if (questionsAnswered >= 5) {
      const accuracy = (performance.filter(p => p.isCorrect).length / performance.length) * 100
      
      if (currentLevel === 1 && accuracy >= 80) {
        try {
          const response = await fetch(`${API_URL}/api/adapt-level`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sessionId,
              currentLevel,
              performance
            })
          })
          const data = await response.json()
          if (data.success && data.recommendation === 'advance') {
            setLevel(2)
            setEarnedBadges([...earnedBadges, { name: 'Level Up!', type: 'gold' }])
            await loadQuestion()
            return
          }
        } catch (error) {
          console.error('Error adapting level:', error)
        }
      }
      
      // If completed Level 2 or enough questions total, move to assessment
      if (currentLevel === 2 || questionsAnswered >= 10 || timeElapsed >= targetTime - 60) {
        // Save final scores
        try {
          await fetch(`${API_URL}/api/update-score`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sessionId,
              totalPoints: points,
              level1Score: currentLevel === 1 ? accuracy : 0,
              level2Score: currentLevel === 2 ? accuracy : 0,
              timeSpent: timeElapsed
            })
          })
        } catch (error) {
          console.error('Error updating score:', error)
        }
        
        setPhase('assessment')
        return
      }
    }
    
    await loadQuestion()
  }

  const handleVoiceAnswer = (text) => {
    // Parse voice input for common fraction answers
    const normalized = text.toLowerCase()
    if (normalized.includes('three fourth') || normalized.includes('3/4')) {
      setUserAnswer('3/4')
    } else if (normalized.includes('one half') || normalized.includes('1/2')) {
      setUserAnswer('1/2')
    } else if (normalized.includes('yes')) {
      setUserAnswer('yes')
    } else if (normalized.includes('no')) {
      setUserAnswer('no')
    } else {
      setUserAnswer(text)
    }
  }

  if (!currentQuestion) {
    return <div className="min-h-screen flex items-center justify-center">Loading question...</div>
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Timer timeElapsed={timeElapsed} totalTime={targetTime} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-xl p-6 md:p-8 mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Level {currentLevel} Activities
              </h1>
              <p className="text-gray-600 mt-1">
                Question {questionNumber} • Points: {points}
              </p>
            </div>
            <div className="flex gap-2">
              {currentLevel === 1 && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                  Basic
                </span>
              )}
              {currentLevel === 2 && (
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                  Intermediate
                </span>
              )}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={questionNumber}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="mb-6"
            >
              {/* Level 1: Use interactive visual activities */}
              {currentLevel === 1 && currentQuestion.type === 'visual' ? (
                <VisualFractionActivity
                  question={currentQuestion.question}
                  correctAnswer={currentQuestion.correctAnswer}
                  hint={currentQuestion.hint}
                  onAnswer={handleVisualAnswer}
                />
              ) : (
                <div className="bg-blue-50 rounded-lg p-6 mb-4">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    {currentQuestion.question}
                  </h2>

                  {currentQuestion.type === 'visual' && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">
                        Use the input below to answer (e.g., "3/4" or "three fourths")
                      </p>
                    </div>
                  )}

                  {currentQuestion.options && currentQuestion.options.length > 0 ? (
                    <div className="space-y-2">
                      {currentQuestion.options.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => setUserAnswer(option)}
                          className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                            userAnswer === option
                              ? 'border-blue-500 bg-blue-100'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Enter your answer..."
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
                      onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                    />
                  )}

                  <div className="mt-4">
                    <VoiceInput onTranscript={handleVoiceAnswer} />
                  </div>
                </div>
              )}

              {currentQuestion.hint && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded">
                  <p className="text-sm text-yellow-800">
                    <strong>Hint:</strong> {currentQuestion.hint}
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <AnimatePresence>
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`p-4 rounded-lg mb-4 ${
                  isCorrect ? 'bg-green-100 border-l-4 border-green-500' : 'bg-red-100 border-l-4 border-red-500'
                }`}
              >
                <p className={`font-semibold mb-2 ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                  {isCorrect ? '✓ Correct!' : '✗ Not quite right'}
                </p>
                <p className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                  {feedback}
                </p>
                {isCorrect && (
                  <p className="text-green-700 mt-2">
                    +{currentLevel === 1 ? 10 : 20} points!
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-4">
            <button
              onClick={checkAnswer}
              disabled={!userAnswer.trim() || showFeedback}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                userAnswer.trim() && !showFeedback
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Check Answer
            </button>
            {showFeedback && (
              <button
                onClick={handleNext}
                className="flex-1 py-3 px-6 rounded-lg font-semibold bg-green-600 hover:bg-green-700 text-white transition-all"
              >
                Next Question →
              </button>
            )}
          </div>
        </motion.div>

        {/* Badge animations */}
        <AnimatePresence>
          {earnedBadges.map((badge, idx) => (
            <BadgeAnimation key={idx} badge={badge} />
          ))}
        </AnimatePresence>

        {/* Progress indicator */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-500">
              {questionsAnswered} questions answered
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${Math.min((questionsAnswered / 10) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Mini-Games Section */}
        {questionsAnswered >= 3 && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg shadow-lg p-6 border-2 border-purple-200">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              🎮 Unlock Mini-Games!
            </h3>
            <p className="text-gray-600 mb-4">
              You've answered {questionsAnswered} questions! Try fun games to practice fractions.
            </p>
            <button
              onClick={() => setPhase('games')}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
            >
              Play Mini-Games →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

