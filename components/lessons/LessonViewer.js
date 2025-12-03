'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/appStore'
import { useEnhancedStore } from '@/store/enhancedAppStore'
import confetti from 'canvas-confetti'
import TextToSpeech from '@/components/TextToSpeech'
import AIGuru from '@/components/AIGuru'

export default function LessonViewer({ lesson, onComplete }) {
  const { addPoints } = useAppStore()
  const { learningLevel } = useEnhancedStore()
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

  // Extract text content from current slide for text-to-speech
  const getSlideText = () => {
    let text = slide.title ? slide.title + '. ' : ''

    if (slide.content) {
      text += slide.content + ' '
    }

    if (slide.hyderabadExample) {
      text += slide.hyderabadExample.scenario + ' '
      if (slide.hyderabadExample.question) {
        text += slide.hyderabadExample.question + ' '
      }
      if (slide.hyderabadExample.answer) {
        text += 'Answer: ' + slide.hyderabadExample.answer + ' '
      }
    }

    if (slide.realWorldConnection) {
      text += slide.realWorldConnection.scenario + ' '
    }

    if (slide.problem) {
      text += ' Problem: ' + slide.problem + ' '
    }

    if (slide.steps && slide.steps.length > 0) {
      text += ' Steps: ' + slide.steps.join('. ') + ' '
    }

    if (slide.solution) {
      text += ' Solution: ' + slide.solution + ' '
    }

    if (slide.scenario) {
      if (typeof slide.scenario === 'string') {
        text += ' Scenario: ' + slide.scenario + ' '
      } else if (slide.scenario.context) {
        text += ' Scenario: ' + slide.scenario.context + ' '
      }
    }

    if (slide.explanation) {
      text += ' ' + slide.explanation + ' '
    }

    if (slide.instruction) {
      text += slide.instruction + ' '
    }

    return text.trim()
  }

  if (showQuiz) {
    return (
      <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-800">
                Quick Check! 🎯
              </h2>
              <TextToSpeech
                text={lesson.miniQuiz.question + ' Options: ' + lesson.miniQuiz.options.join(', ')}
                rate={0.85}
              />
            </div>

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

        {/* AI Guru Assistant */}
        <AIGuru
          context={lesson.miniQuiz.question + ' Options: ' + lesson.miniQuiz.options.join(', ')}
          pageType="quiz"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800">{lesson.title}</h1>
              <p className="text-gray-600 mt-1">{lesson.subtitle}</p>
            </div>
            <div className="flex items-center gap-4">
              <TextToSpeech
                text={getSlideText()}
                rate={0.85}
                key={currentSlide}
              />
              <div className="text-right">
                <div className="text-sm text-gray-600">Slide {currentSlide + 1} of {lesson.slides.length}</div>
                <div className="text-2xl font-bold text-blue-600">+20 XP</div>
              </div>
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

        {/* Adaptive Learning Level Indicator */}
        {currentSlide === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl p-4 mb-6 ${
              learningLevel === 'beginner' ? 'bg-gradient-to-r from-purple-100 to-pink-100' :
              learningLevel === 'intermediate' ? 'bg-gradient-to-r from-blue-100 to-cyan-100' :
              'bg-gradient-to-r from-green-100 to-emerald-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="text-3xl">
                {learningLevel === 'beginner' ? '🌟' : learningLevel === 'intermediate' ? '🎯' : '✨'}
              </div>
              <div>
                <p className="font-bold text-gray-800">
                  {learningLevel === 'beginner' ? 'Beginner Level' :
                   learningLevel === 'intermediate' ? 'Intermediate Level' :
                   'Advanced Level'}
                </p>
                <p className="text-sm text-gray-700">
                  {learningLevel === 'beginner'
                    ? 'Super simple examples with Hyderabad favorites! 🍛'
                    : learningLevel === 'intermediate'
                    ? 'Practical Hyderabad examples with clear guidance 📚'
                    : 'Complex real-world Hyderabad scenarios 🎓'
                  }
                </p>
              </div>
            </div>
          </motion.div>
        )}

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
                  {slide.icon && <div className="text-6xl mb-4">{slide.icon}</div>}
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">{slide.title}</h2>
                </div>

                {slide.content && (
                  <div className="prose prose-lg max-w-none">
                    <p className="text-xl text-gray-700 leading-relaxed">{slide.content}</p>
                  </div>
                )}

                {/* Hyderabad Example Section */}
                {slide.hyderabadExample && (
                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6 border-2 border-orange-200">
                    <h3 className="text-xl font-bold text-orange-900 mb-3 flex items-center gap-2">
                      🍛 {slide.hyderabadExample.title}
                    </h3>
                    <div className="space-y-4">
                      <p className="text-gray-800">{slide.hyderabadExample.scenario}</p>

                      {slide.hyderabadExample.question && (
                        <div className="bg-white rounded-lg p-4 border-l-4 border-orange-500">
                          <p className="font-semibold text-gray-800 mb-2">Question:</p>
                          <p className="text-gray-700">{slide.hyderabadExample.question}</p>
                        </div>
                      )}

                      {slide.hyderabadExample.answer && (
                        <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                          <p className="font-semibold text-green-800 mb-2">Answer:</p>
                          <p className="text-green-700">{slide.hyderabadExample.answer}</p>
                        </div>
                      )}

                      {slide.hyderabadExample.silly && (
                        <div className="bg-purple-50 rounded-lg p-3 italic">
                          <p className="text-purple-800 text-sm">💡 {slide.hyderabadExample.silly}</p>
                        </div>
                      )}

                      {slide.hyderabadExample.examples && slide.hyderabadExample.examples.map((ex, idx) => (
                        <div key={idx} className="bg-white rounded-lg p-4 space-y-2">
                          <p className="text-gray-800 font-semibold">{ex.situation}</p>
                          <p className="text-2xl font-bold text-blue-600">{ex.fraction}</p>
                          <p className="text-gray-700 text-sm">{ex.explanation}</p>
                          {ex.visual && <p className="text-lg mt-2">{ex.visual}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Real World Connection */}
                {slide.realWorldConnection && (
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-blue-900 mb-3">🌍 Real-World Application</h3>
                    <p className="text-gray-800 mb-3">{slide.realWorldConnection.scenario}</p>
                    {slide.realWorldConnection.calculation && (
                      <div className="bg-white rounded-lg p-3 font-mono text-blue-700">
                        {slide.realWorldConnection.calculation}
                      </div>
                    )}
                  </div>
                )}

                {/* Method Section (for intermediate level) */}
                {slide.method && (
                  <div className="bg-blue-50 rounded-xl p-6">
                    <p className="text-gray-800 mb-4"><strong>Method:</strong> {slide.method.rule}</p>
                    {slide.method.hyderabadPractice && (
                      <div className="space-y-2">
                        <p className="font-semibold text-gray-800">{slide.method.hyderabadPractice.scenario}</p>
                        <p className="text-gray-700">{slide.method.hyderabadPractice.situation}</p>
                        <p className="text-xl font-bold text-blue-600">{slide.method.hyderabadPractice.fraction}</p>
                        <p className="text-gray-700">Simplifies to: {slide.method.hyderabadPractice.simplification}</p>
                      </div>
                    )}
                  </div>
                )}

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
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                  <span className="text-4xl">✏️</span>
                  {slide.title}
                </h2>
                {slide.instruction && (
                  <p className="text-lg text-gray-700 mb-4">{slide.instruction}</p>
                )}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8">
                  {slide.component || (
                    <div className="space-y-4">
                      {slide.practice && slide.practice.map((item, idx) => (
                        <div key={idx} className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
                          <p className="text-gray-800 font-semibold mb-2">{item.problem || item.question}</p>
                          {item.hint && (
                            <p className="text-sm text-gray-600 italic">💡 Hint: {item.hint}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Slide Type: Practice */}
            {slide.type === 'practice' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                  <span className="text-4xl">📝</span>
                  {slide.title}
                </h2>
                {slide.instruction && (
                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <p className="text-gray-800">{slide.instruction}</p>
                  </div>
                )}
                <div className="space-y-4">
                  {slide.problems && slide.problems.map((prob, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border-2 border-green-200"
                    >
                      <div className="flex items-start gap-3">
                        <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-800 font-semibold mb-2">{prob.question || prob.problem}</p>
                          {prob.hint && (
                            <p className="text-sm text-gray-600 italic mt-2">💡 {prob.hint}</p>
                          )}
                          {prob.answer && (
                            <details className="mt-3">
                              <summary className="cursor-pointer text-blue-600 font-semibold hover:text-blue-800">
                                Show Answer
                              </summary>
                              <div className="mt-2 bg-white rounded p-3 border-l-4 border-blue-500">
                                <p className="text-green-700 font-semibold">{prob.answer}</p>
                              </div>
                            </details>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                {slide.encouragement && (
                  <div className="bg-yellow-50 rounded-lg p-4 text-center">
                    <p className="text-yellow-900 font-semibold">✨ {slide.encouragement}</p>
                  </div>
                )}
              </div>
            )}

            {/* Slide Type: Advanced Problem */}
            {slide.type === 'advanced-problem' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                  <span className="text-4xl">🎓</span>
                  {slide.title}
                </h2>
                {slide.scenario && (
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
                    <h3 className="font-bold text-gray-800 mb-3">Scenario:</h3>
                    <p className="text-gray-800 mb-4">{slide.scenario.context}</p>

                    {slide.scenario.distribution && (
                      <div className="bg-white rounded-lg p-4 mb-4">
                        <p className="text-gray-700"><strong>Distribution:</strong> {slide.scenario.distribution}</p>
                      </div>
                    )}

                    {slide.scenario.status && (
                      <div className="bg-white rounded-lg p-4 mb-4">
                        <p className="text-gray-700"><strong>Status:</strong> {slide.scenario.status}</p>
                      </div>
                    )}

                    {slide.scenario.complication && (
                      <div className="bg-orange-50 rounded-lg p-4 mb-4 border-l-4 border-orange-400">
                        <p className="text-gray-700"><strong>Additional Info:</strong> {slide.scenario.complication}</p>
                      </div>
                    )}

                    {slide.scenario.challenges && (
                      <div className="space-y-4 mt-4">
                        <h4 className="font-bold text-gray-800">Challenges:</h4>
                        {slide.scenario.challenges.map((challenge, idx) => (
                          <div key={idx} className="bg-white rounded-lg p-4 space-y-3">
                            <p className="text-gray-800 font-semibold">{challenge.question}</p>
                            {challenge.solution && (
                              <details className="mt-2">
                                <summary className="cursor-pointer text-blue-600 font-semibold hover:text-blue-800">
                                  Show Solution
                                </summary>
                                <div className="mt-3 space-y-2">
                                  {typeof challenge.solution === 'object' ? (
                                    Object.entries(challenge.solution).map(([key, value]) => (
                                      <div key={key} className="bg-green-50 rounded p-3">
                                        <p className="text-gray-800">
                                          <strong>{key}:</strong> {value}
                                        </p>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="bg-green-50 rounded p-3">
                                      <p className="text-gray-800">{challenge.solution}</p>
                                    </div>
                                  )}
                                </div>
                              </details>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {slide.keyTakeaway && (
                  <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-4 border-l-4 border-green-500">
                    <p className="text-green-900 font-semibold">🔑 Key Takeaway: {slide.keyTakeaway}</p>
                  </div>
                )}
              </div>
            )}

            {/* Slide Type: Application (same as realworld) */}
            {(slide.type === 'realworld' || slide.type === 'application') && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                  <span className="text-4xl">🌍</span>
                  Real-World Application
                </h2>

                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
                  <p className="text-lg text-gray-700 mb-4">{slide.scenario}</p>

                  {slide.scenarios && slide.scenarios.map((sc, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-4 mb-4">
                      <p className="text-gray-800 font-semibold mb-2">{sc.context || sc.situation}</p>
                      {sc.calculation && <p className="text-gray-700 font-mono mt-2">{sc.calculation}</p>}
                      {sc.explanation && <p className="text-gray-700 text-sm mt-2">{sc.explanation}</p>}
                    </div>
                  ))}

                  {slide.visual && (
                    <div className="my-6">
                      {slide.visual}
                    </div>
                  )}

                  {slide.explanation && (
                    <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
                      <p className="text-gray-800 font-semibold">{slide.explanation}</p>
                    </div>
                  )}
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

      {/* AI Guru Assistant */}
      <AIGuru context={getSlideText()} pageType="lesson" />
    </div>
  )
}
