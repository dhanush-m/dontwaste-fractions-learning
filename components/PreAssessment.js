'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEnhancedStore } from '@/store/enhancedAppStore'
import confetti from 'canvas-confetti'
import TextToSpeech from '@/components/TextToSpeech'
import AIGuru from '@/components/AIGuru'

const ASSESSMENT_QUESTIONS = [
  {
    id: 1,
    concept: 'fractions-basic',
    question: 'What fraction of the circle is shaded?',
    visual: (
      <div className="flex justify-center">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="50" fill="#e5e7eb" stroke="#374151" strokeWidth="2" />
          <path d="M 60 60 L 60 10 A 50 50 0 0 1 110 60 Z" fill="#3b82f6" />
          <path d="M 60 60 L 110 60 A 50 50 0 0 1 60 110 Z" fill="#3b82f6" />
        </svg>
      </div>
    ),
    options: ['1/4', '1/2', '2/3', '3/4'],
    correct: 1,
    difficulty: 'easy'
  },
  {
    id: 2,
    concept: 'fractions-comparison',
    question: 'Which fraction is larger: 2/3 or 3/5?',
    options: ['2/3', '3/5', 'They are equal', 'Cannot determine'],
    correct: 0,
    difficulty: 'medium'
  },
  {
    id: 3,
    concept: 'fractions-addition',
    question: 'What is 1/4 + 1/4?',
    options: ['1/8', '2/8', '1/2', '2/4'],
    correct: 2,
    difficulty: 'easy'
  },
  {
    id: 4,
    concept: 'decimals-basic',
    question: 'What is 0.5 as a fraction?',
    options: ['1/5', '5/10', '1/2', '2/5'],
    correct: 2,
    difficulty: 'easy'
  },
  {
    id: 5,
    concept: 'percentages-basic',
    question: 'What is 50% as a decimal?',
    options: ['0.05', '0.5', '5.0', '50'],
    correct: 1,
    difficulty: 'easy'
  }
]

export default function PreAssessment({ onComplete }) {
  const { recordAnswer, adjustDifficulty, addXP, setPhase, setLearningLevel, updateConceptMastery } = useEnhancedStore()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const question = ASSESSMENT_QUESTIONS[currentQuestion]
  const progress = ((currentQuestion + 1) / ASSESSMENT_QUESTIONS.length) * 100

  const handleAnswer = (index) => {
    if (showFeedback) return

    const isCorrect = index === question.correct
    setSelectedAnswer(index)
    setShowFeedback(true)

    // Record answer
    recordAnswer(isCorrect, question.concept, question.question)

    // Add to answers array
    setAnswers(prev => [...prev, { questionId: question.id, correct: isCorrect, concept: question.concept }])

    // Move to next question after delay
    setTimeout(() => {
      if (currentQuestion < ASSESSMENT_QUESTIONS.length - 1) {
        setCurrentQuestion(prev => prev + 1)
        setSelectedAnswer(null)
        setShowFeedback(false)
      } else {
        // Show results
        calculateResults()
      }
    }, 1500)
  }

  const calculateResults = () => {
    const totalCorrect = answers.filter(a => a.correct).length + (selectedAnswer === question.correct ? 1 : 0)
    const percentage = (totalCorrect / ASSESSMENT_QUESTIONS.length) * 100

    // Adjust difficulty based on performance
    adjustDifficulty(percentage)

    // Set learning level based on pre-assessment performance
    if (percentage >= 80) {
      setLearningLevel('advanced')
    } else if (percentage >= 40) {
      setLearningLevel('intermediate')
    } else {
      setLearningLevel('beginner')
    }

    // Award XP for completing assessment
    addXP(30, 'Pre-Assessment Complete')

    // Analyze strengths and weaknesses
    const conceptScores = {}
    const allAnswers = [...answers, { questionId: question.id, correct: selectedAnswer === question.correct, concept: question.concept }]

    allAnswers.forEach(answer => {
      if (!conceptScores[answer.concept]) {
        conceptScores[answer.concept] = { correct: 0, total: 0 }
      }
      conceptScores[answer.concept].total++
      if (answer.correct) conceptScores[answer.concept].correct++
    })

    // Update concept mastery for each concept tested
    Object.entries(conceptScores).forEach(([concept, scores]) => {
      const conceptPercentage = (scores.correct / scores.total) * 100
      updateConceptMastery(concept, conceptPercentage)
    })

    setShowResults({
      totalCorrect,
      percentage,
      conceptScores
    })
  }

  const getRecommendation = () => {
    if (!showResults) return null

    const { percentage } = showResults

    if (percentage >= 80) {
      return {
        level: 'Advanced',
        message: 'Excellent! You\'re ready for advanced concepts. We\'ll use real-world examples and challenging problems to keep you engaged.',
        description: '✨ Expect: Complex scenarios, multi-step problems, and creative applications',
        color: 'green'
      }
    } else if (percentage >= 40) {
      return {
        level: 'Intermediate',
        message: 'Great start! We\'ll explain concepts with clear examples and gradually increase difficulty as you improve.',
        description: '🎯 Expect: Step-by-step guidance, practical examples, and supportive hints',
        color: 'blue'
      }
    } else {
      return {
        level: 'Beginner',
        message: 'Perfect! We\'ll start from scratch with super simple, fun examples (think pizza slices and chocolate bars!) and build your confidence step by step.',
        description: '🌟 Expect: Visual aids, silly examples, lots of practice, and unlimited retakes',
        color: 'purple'
      }
    }
  }

  const handleStartLearning = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })

    setTimeout(() => {
      if (onComplete) {
        onComplete(showResults)
      } else {
        setPhase('activities')
      }
    }, 500)
  }

  if (showResults) {
    const recommendation = getRecommendation()

    return (
      <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl p-8"
          >
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🎯</div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Assessment Complete!</h1>
              <p className="text-xl text-gray-600">Here are your results</p>
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
                    stroke={recommendation.color === 'green' ? '#10b981' : recommendation.color === 'blue' ? '#3b82f6' : '#8b5cf6'}
                    strokeWidth="16"
                    strokeDasharray={`${(showResults.percentage / 100) * 502} 502`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-5xl font-bold text-gray-800">{showResults.totalCorrect}</div>
                  <div className="text-sm text-gray-600">out of {ASSESSMENT_QUESTIONS.length}</div>
                  <div className="text-2xl font-bold text-gray-700 mt-2">{Math.round(showResults.percentage)}%</div>
                </div>
              </div>
            </div>

            {/* Recommendation */}
            <div className={`bg-${recommendation.color}-50 border-l-4 border-${recommendation.color}-500 rounded-lg p-6 mb-6`}>
              <div className="flex items-start gap-4">
                <div className="text-4xl">💡</div>
                <div>
                  <h3 className={`text-xl font-bold text-${recommendation.color}-800 mb-2`}>
                    Your Level: {recommendation.level}
                  </h3>
                  <p className={`text-${recommendation.color}-700 mb-3`}>{recommendation.message}</p>
                  <p className="text-sm text-gray-600 italic">{recommendation.description}</p>
                </div>
              </div>
            </div>

            {/* Adaptive Learning Info */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-2xl">🎓</span>
                Adaptive Learning Enabled
              </h3>
              <p className="text-gray-700 text-sm">
                Our system will automatically adjust the difficulty and examples based on your performance.
                If you struggle with a concept, we'll provide simpler explanations and more practice.
                When you master a topic, we'll challenge you with harder problems!
              </p>
            </div>

            {/* Concept Breakdown */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Performance by Concept</h3>
              <div className="space-y-3">
                {Object.entries(showResults.conceptScores).map(([concept, scores]) => {
                  const percentage = (scores.correct / scores.total) * 100
                  return (
                    <div key={concept} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-700 capitalize">
                          {concept.replace(/-/g, ' ')}
                        </span>
                        <span className="text-gray-600">
                          {scores.correct}/{scores.total} correct
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            percentage >= 80 ? 'bg-green-500' :
                            percentage >= 60 ? 'bg-blue-500' :
                            'bg-orange-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Start Button */}
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartLearning}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 px-12 rounded-xl text-xl shadow-lg"
              >
                Start Learning Journey →
              </motion.button>
              <p className="text-sm text-gray-600 mt-4">
                Your personalized curriculum is ready!
              </p>
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
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-800">Pre-Assessment</h1>
            <TextToSpeech
              text={question.question + ' Options: ' + question.options.join(', ')}
              rate={0.85}
              key={currentQuestion}
            />
          </div>
          <p className="text-gray-600 mb-4">
            Let&apos;s see what you already know! This helps us personalize your learning.
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
              {currentQuestion + 1} / {ASSESSMENT_QUESTIONS.length}
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
            className="bg-white rounded-xl shadow-2xl p-8"
          >
            <div className="mb-8">
              <div className="text-sm text-blue-600 font-semibold mb-2">
                Question {currentQuestion + 1}
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {question.question}
              </h2>

              {question.visual && (
                <div className="mb-6">
                  {question.visual}
                </div>
              )}
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
          </motion.div>
        </AnimatePresence>

        {/* AI Guru Assistant */}
        <AIGuru
          context={question.question + ' Options: ' + question.options.join(', ')}
          pageType="assessment"
        />
      </div>
    </div>
  )
}
