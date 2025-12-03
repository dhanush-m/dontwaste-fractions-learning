'use client'

import { motion } from 'framer-motion'
import { useEnhancedStore } from '@/store/enhancedAppStore'
import { CURRICULUM, getAllChapters } from '@/data/curriculum'

export default function ChapterNavigator({ onSelectChapter }) {
  const { curriculum, student, xp, level, streak } = useEnhancedStore()

  const chapters = getAllChapters()

  const getChapterProgress = (chapterId) => {
    const chapter = curriculum[chapterId]
    if (!chapter) return { completed: 0, total: 0, percentage: 0 }

    const total = CURRICULUM[chapterId].activities.length + 1 // +1 for lesson
    const completed = (chapter.lesson ? 1 : 0) + chapter.activities.length

    return {
      completed,
      total,
      percentage: Math.round((completed / total) * 100)
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto">
        {/* Header with Profile */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Student Profile */}
            <div className="flex items-center gap-4">
              <div className="text-6xl">{student.avatar}</div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Welcome back, {student.name}!
                </h1>
                <p className="text-gray-600">Grade {student.grade} • Level {level}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{xp}</div>
                <div className="text-sm text-gray-600">XP</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">{streak}</div>
                <div className="text-sm text-gray-600">Day Streak 🔥</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{level}</div>
                <div className="text-sm text-gray-600">Level</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-3">
            Your Learning Path
          </h2>
          <p className="text-xl text-gray-600">
            Master math concepts one chapter at a time
          </p>
        </motion.div>

        {/* Chapter Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {chapters.map((chapter, index) => {
            const progress = getChapterProgress(chapter.id)
            const isUnlocked = curriculum[chapter.id]?.unlocked
            const isMastered = curriculum[chapter.id]?.mastery >= 80

            return (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={isUnlocked ? { scale: 1.02, y: -5 } : {}}
                onClick={() => isUnlocked && onSelectChapter(chapter.id)}
                className={`relative bg-white rounded-2xl shadow-xl overflow-hidden ${
                  isUnlocked ? 'cursor-pointer' : 'opacity-60 cursor-not-allowed'
                }`}
              >
                {/* Status Badge */}
                <div className="absolute top-4 right-4 z-10">
                  {isMastered ? (
                    <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                      <span>✓</span> Mastered
                    </div>
                  ) : !isUnlocked ? (
                    <div className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      Locked
                    </div>
                  ) : progress.completed > 0 ? (
                    <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      In Progress
                    </div>
                  ) : null}
                </div>

                {/* Header */}
                <div className={`bg-gradient-to-r ${chapter.color} p-8 text-center text-white`}>
                  <div className="text-7xl mb-4">{chapter.icon}</div>
                  <h3 className="text-sm uppercase tracking-wide mb-2 opacity-90">
                    Chapter {chapter.order}
                  </h3>
                  <h2 className="text-3xl font-bold mb-2">{chapter.name}</h2>
                  <p className="opacity-90">{chapter.description}</p>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span className="font-bold">{progress.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress.percentage}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                        className={`bg-gradient-to-r ${chapter.color} h-3 rounded-full`}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {progress.completed} of {progress.total} completed
                    </div>
                  </div>

                  {/* Lesson Status */}
                  <div className="space-y-2 mb-4">
                    <div className={`flex items-center gap-3 p-3 rounded-lg ${
                      curriculum[chapter.id]?.lesson ? 'bg-green-50' : 'bg-gray-50'
                    }`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                        curriculum[chapter.id]?.lesson ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                      }`}>
                        {curriculum[chapter.id]?.lesson ? '✓' : '📖'}
                      </div>
                      <span className="text-sm font-semibold text-gray-700">
                        {chapter.lesson.title}
                      </span>
                      {curriculum[chapter.id]?.lesson && (
                        <span className="ml-auto text-xs text-green-600 font-bold">+20 XP</span>
                      )}
                    </div>
                  </div>

                  {/* Activities Summary */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">Activities</span>
                      <span className="text-xs text-gray-600">
                        {curriculum[chapter.id]?.activities.length || 0} / {chapter.activities.length}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {chapter.activities.map((activity, i) => {
                        const isComplete = curriculum[chapter.id]?.activities.includes(activity.id)
                        return (
                          <div
                            key={i}
                            className={`flex-1 h-2 rounded-full ${
                              isComplete ? 'bg-blue-500' : 'bg-gray-200'
                            }`}
                          />
                        )
                      })}
                    </div>
                  </div>

                  {/* Mastery Score */}
                  {curriculum[chapter.id]?.mastery > 0 && (
                    <div className="mt-4 text-center">
                      <div className="text-sm text-gray-600 mb-1">Mastery Score</div>
                      <div className={`text-3xl font-bold ${
                        curriculum[chapter.id].mastery >= 80 ? 'text-green-600' :
                        curriculum[chapter.id].mastery >= 60 ? 'text-blue-600' :
                        'text-orange-600'
                      }`}>
                        {curriculum[chapter.id].mastery}%
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="mt-6">
                    {!isUnlocked ? (
                      <div className="text-center text-sm text-gray-500">
                        Complete previous chapter to unlock
                      </div>
                    ) : isMastered ? (
                      <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 rounded-xl transition-colors">
                        Review Chapter →
                      </button>
                    ) : progress.completed > 0 ? (
                      <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 rounded-xl transition-colors">
                        Continue Learning →
                      </button>
                    ) : (
                      <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 rounded-xl transition-colors">
                        Start Chapter →
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-6 text-center"
        >
          <p className="text-gray-600 mb-4">
            Want to practice? Try our mini-games!
          </p>
          <button
            onClick={() => {
              // Navigate to games
              const { setPhase } = useEnhancedStore.getState()
              setPhase('games')
            }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-8 rounded-xl transition-colors"
          >
            Play Games 🎮
          </button>
        </motion.div>
      </div>
    </div>
  )
}
