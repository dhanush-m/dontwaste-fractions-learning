'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/appStore'
import confetti from 'canvas-confetti'

export default function LessonViewer({ lesson, onComplete }) {
  const { addPoints } = useAppStore()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [completedSlides, setCompletedSlides] = useState(new Set())
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizAnswer, setQuizAnswer] = useState(null)

  const handleSlideComplete = () => {
    setCompletedSlides(prev => new Set([...prev, currentSlide]))
    addPoints(5) // Small XP for completing each slide
  }

  const handleNext = () => {
    if (currentSlide < lesson.slides.length - 1) {
      handleSlideComplete()
      setCurrentSlide(prev => prev + 1)
    } else {
      // Show mini quiz before completion
      setShowQuiz(true)
    }
  }

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1)
    }
  }

  const handleQuizComplete = (isCorrect) => {
    if (isCorrect) {
      addPoints(20) // Lesson completion XP
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
      setTimeout(() => {
        onComplete?.()
      }, 2000)
    } else {
      setQuizAnswer(false)
      setTimeout(() => {
        setQuizAnswer(null)
      }, 2000)
    }
  }

  const slide = lesson.slides[currentSlide]
  const progress = ((currentSlide + 1) / lesson.slides.length) * 100

  if (showQuiz) {
    return (
      <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl p-8"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Quick Check! 🎯
            </h2>

            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <p className="text-xl text-gray-800 mb-6">{lesson.miniQuiz.question}</p>

              <div className="space-y-3">
                {lesson.miniQuiz.options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleQuizComplete(index === lesson.miniQuiz.correctIndex)}
                    disabled={quizAnswer !== null}
                    className={`w-full p-4 rounded-lg text-left font-semibold transition-colors ${
                      quizAnswer === false && index === lesson.miniQuiz.correctIndex
                        ? 'bg-green-200 border-2 border-green-500'
                        : quizAnswer === false
                        ? 'bg-red-100'
                        : 'bg-white hover:bg-blue-100 border-2 border-gray-300'
                    }`}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            </div>

            {quizAnswer === false && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-orange-100 border-l-4 border-orange-500 p-4 rounded"
              >
                <p className="text-orange-800">
                  Not quite! Review the lesson and try again. The correct answer is highlighted in green.
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{lesson.title}</h1>
              <p className="text-gray-600 mt-1">{lesson.subtitle}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Slide {currentSlide + 1} of {lesson.slides.length}</div>
              <div className="text-2xl font-bold text-blue-600">+20 XP</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
            />
          </div>
        </div>

        {/* Slide Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-2xl p-8 md:p-12"
          >
            {/* Slide Type: Concept */}
            {slide.type === 'concept' && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl mb-4">{slide.icon}</div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">{slide.title}</h2>
                </div>

                <div className="prose prose-lg max-w-none">
                  <p className="text-xl text-gray-700 leading-relaxed">{slide.content}</p>
                </div>

                {slide.visual && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8">
                    {slide.visual}
                  </div>
                )}
              </div>
            )}

            {/* Slide Type: Example */}
            {slide.type === 'example' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                  <span className="text-4xl">💡</span>
                  {slide.title}
                </h2>

                <div className="bg-blue-50 rounded-xl p-6">
                  <p className="text-lg text-gray-700 mb-4">{slide.problem}</p>

                  {slide.steps && (
                    <div className="space-y-3">
                      {slide.steps.map((step, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.2 }}
                          className="bg-white rounded-lg p-4 border-l-4 border-blue-500"
                        >
                          <div className="flex items-start gap-3">
                            <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                              {index + 1}
                            </div>
                            <p className="text-gray-800">{step}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {slide.solution && (
                    <div className="mt-6 bg-green-50 rounded-lg p-4 border-2 border-green-500">
                      <p className="text-green-800 font-semibold text-lg">
                        ✓ Answer: {slide.solution}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Slide Type: Interactive */}
            {slide.type === 'interactive' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{slide.title}</h2>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8">
                  {slide.component}
                </div>
              </div>
            )}

            {/* Slide Type: Realworld */}
            {slide.type === 'realworld' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                  <span className="text-4xl">🌍</span>
                  Real-World Application
                </h2>

                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
                  <p className="text-lg text-gray-700 mb-4">{slide.scenario}</p>

                  {slide.visual && (
                    <div className="my-6">
                      {slide.visual}
                    </div>
                  )}

                  <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
                    <p className="text-gray-800 font-semibold">{slide.explanation}</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={handlePrevious}
            disabled={currentSlide === 0}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 text-gray-800 font-semibold rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>

          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">
              {completedSlides.size} / {lesson.slides.length} slides viewed
            </div>
          </div>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-lg shadow-lg transition-colors"
          >
            {currentSlide === lesson.slides.length - 1 ? 'Complete Lesson' : 'Next'}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
