'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useEnhancedStore } from '@/store/enhancedAppStore'
import { getChapterById } from '@/data/curriculum'
import LessonViewer from './lessons/LessonViewer'
import MasteryQuiz from './MasteryQuiz'
import AIChatbot from './AIChatbot'
import { fractionsLesson } from '@/data/lessons/fractionsLesson'
import { getAdaptiveFractionsLesson } from '@/data/lessons/adaptiveFractionsLesson'

// Import existing activities
import EquivalentFractionsMatcher from './activities/EquivalentFractionsMatcher'
import FractionComparison from './activities/FractionComparison'
import AddingFractions from './activities/AddingFractions'
import FractionNumberLine from './activities/FractionNumberLine'
import WordProblems from './activities/WordProblems'

const ACTIVITY_COMPONENTS = {
  'equivalent-matcher': EquivalentFractionsMatcher,
  'fraction-comparison': FractionComparison,
  'adding-fractions': AddingFractions,
  'number-line': FractionNumberLine,
  'word-problems': WordProblems
}

export default function ChapterFlow({ chapterId, onComplete }) {
  const { curriculum, completeLesson, completeActivity, setMastery, learningLevel } = useEnhancedStore()
  const [currentStep, setCurrentStep] = useState('menu') // menu, lesson, activity, mastery
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [adaptiveLesson, setAdaptiveLesson] = useState(null)

  const chapter = getChapterById(chapterId)
  const chapterProgress = curriculum[chapterId]

  // Get adaptive lesson based on learning level
  useEffect(() => {
    if (chapterId === 'fractions') {
      const lesson = getAdaptiveFractionsLesson(learningLevel)
      setAdaptiveLesson(lesson)
    } else {
      // For other chapters, use default lesson
      setAdaptiveLesson(fractionsLesson)
    }
  }, [chapterId, learningLevel])

  const lesson = adaptiveLesson

  useEffect(() => {
    // Auto-start with lesson if not completed
    if (!chapterProgress?.lesson && lesson) {
      setCurrentStep('lesson')
    }
  }, [chapterId, chapterProgress, lesson])

  const handleLessonComplete = () => {
    completeLesson(chapterId)
    setCurrentStep('menu')
  }

  const handleActivityStart = (activityId) => {
    setSelectedActivity(activityId)
    setCurrentStep('activity')
  }

  const handleActivityComplete = (score = 100) => {
    if (selectedActivity) {
      completeActivity(chapterId, selectedActivity, score)
    }
    setSelectedActivity(null)
    setCurrentStep('menu')

    // Check if all activities completed
    const allComplete = chapter.activities.every(a =>
      chapterProgress?.activities.includes(a.id)
    )

    if (allComplete && chapterProgress?.lesson) {
      // Trigger mastery quiz
      setTimeout(() => {
        setCurrentStep('mastery-prompt')
      }, 1500)
    }
  }

  const handleMasteryComplete = (score) => {
    setMastery(chapterId, score)
    onComplete?.()
  }

  // Render Lesson
  if (currentStep === 'lesson' && lesson) {
    return <LessonViewer lesson={lesson} onComplete={handleLessonComplete} />
  }

  // Render Activity
  if (currentStep === 'activity' && selectedActivity) {
    const ActivityComponent = ACTIVITY_COMPONENTS[selectedActivity]
    if (ActivityComponent) {
      return (
        <div className="relative">
          <div className="absolute top-4 left-4 z-50">
            <button
              onClick={() => {
                setSelectedActivity(null)
                setCurrentStep('menu')
              }}
              className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-lg flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Chapter
            </button>
          </div>
          <ActivityComponent
            onComplete={() => handleActivityComplete()}
            chapterId={chapterId}
          />
        </div>
      )
    }
  }

  // Render Mastery Prompt
  if (currentStep === 'mastery-prompt') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 to-blue-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl p-12 max-w-2xl text-center"
        >
          <div className="text-8xl mb-6">🎓</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Ready for the Mastery Quiz?
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            You&apos;ve completed all activities in this chapter! Take the mastery quiz to unlock the next chapter.
          </p>

          <div className="bg-blue-50 rounded-xl p-6 mb-8">
            <h3 className="font-bold text-blue-800 mb-3">Quiz Details:</h3>
            <div className="space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-gray-700">Questions:</span>
                <span className="font-bold">{chapter.masteryQuiz.questions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Passing Score:</span>
                <span className="font-bold">{chapter.masteryQuiz.passingScore}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">XP Reward:</span>
                <span className="font-bold text-blue-600">+100 XP</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setCurrentStep('menu')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-4 px-8 rounded-xl"
            >
              Review Chapter
            </button>
            <button
              onClick={() => setCurrentStep('mastery')}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-4 px-12 rounded-xl shadow-lg text-xl"
            >
              Start Quiz →
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  // Render Mastery Quiz
  if (currentStep === 'mastery') {
    return <MasteryQuiz chapterId={chapterId} onComplete={handleMasteryComplete} />
  }

  // Render Chapter Menu (Activities Overview)
  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onComplete}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Chapters
          </button>
        </div>

        {/* Chapter Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-gradient-to-r ${chapter.color} rounded-2xl p-12 text-center text-white mb-8 shadow-2xl`}
        >
          <div className="text-8xl mb-4">{chapter.icon}</div>
          <h1 className="text-5xl font-bold mb-4">{chapter.name}</h1>
          <p className="text-2xl opacity-90">{chapter.description}</p>
        </motion.div>

        {/* Lesson Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-5xl">📖</div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{chapter.lesson.title}</h2>
                <p className="text-gray-600">{chapter.lesson.duration} • +20 XP</p>
              </div>
            </div>

            {chapterProgress?.lesson ? (
              <div className="flex items-center gap-3">
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-bold">
                  ✓ Completed
                </div>
                <button
                  onClick={() => setCurrentStep('lesson')}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-2 px-6 rounded-xl"
                >
                  Review
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCurrentStep('lesson')}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg"
              >
                Start Lesson →
              </button>
            )}
          </div>
        </motion.div>

        {/* Activities Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Practice Activities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {chapter.activities.map((activity, index) => {
              const isComplete = chapterProgress?.activities.includes(activity.id)
              const isLocked = !chapterProgress?.lesson

              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className={`bg-white rounded-xl shadow-lg p-6 ${
                    isLocked ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{activity.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{activity.description}</p>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                          activity.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                          activity.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {activity.difficulty}
                        </span>
                        <span className="text-sm text-gray-600">+{activity.xp} XP</span>
                      </div>
                    </div>

                    {isComplete && (
                      <div className="bg-green-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl">
                        ✓
                      </div>
                    )}
                  </div>

                  {isLocked ? (
                    <div className="text-center text-sm text-gray-500 py-2">
                      Complete the lesson first
                    </div>
                  ) : (
                    <button
                      onClick={() => handleActivityStart(activity.id)}
                      disabled={!ACTIVITY_COMPONENTS[activity.id]}
                      className={`w-full font-bold py-3 rounded-xl ${
                        !ACTIVITY_COMPONENTS[activity.id]
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : isComplete
                          ? 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                          : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg'
                      }`}
                    >
                      {!ACTIVITY_COMPONENTS[activity.id] ? 'Coming Soon' :
                       isComplete ? 'Play Again' : 'Start Activity →'}
                    </button>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Mastery Quiz Section */}
        {chapterProgress?.lesson && chapterProgress.activities.length === chapter.activities.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 mt-8 text-center"
          >
            <div className="text-6xl mb-4">🎓</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Ready for the Mastery Quiz?</h2>
            <p className="text-gray-600 mb-6">
              Complete the quiz to master this chapter and unlock the next one!
            </p>
            <button
              onClick={() => setCurrentStep('mastery-prompt')}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-4 px-12 rounded-xl shadow-lg text-xl"
            >
              Take Mastery Quiz →
            </button>
          </motion.div>
        )}
      </div>

      {/* Floating AI Helper Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-2xl flex items-center justify-center text-2xl hover:shadow-3xl transition-shadow z-40"
      >
        <span>🤖</span>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
      </motion.button>

      {/* AI Chatbot */}
      <AIChatbot
        chapterId={chapterId}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  )
}
