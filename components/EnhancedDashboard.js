'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEnhancedStore } from '@/store/enhancedAppStore'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export default function EnhancedDashboard() {
  const {
    student,
    xp,
    level,
    streak,
    longestStreak,
    curriculum,
    badges,
    performance,
    focusScores,
    dailyGoals,
    setPhase
  } = useEnhancedStore()

  const [activeTab, setActiveTab] = useState('overview')

  // Calculate statistics
  const totalChapters = Object.keys(curriculum).length
  const completedLessons = Object.values(curriculum).filter(c => c.lesson).length
  const totalActivities = Object.values(curriculum).reduce((sum, c) => sum + c.activities.length, 0)
  const masteryAverage = Object.values(curriculum).reduce((sum, c) => sum + c.mastery, 0) / totalChapters

  const accuracy = performance.totalQuestions > 0
    ? Math.round((performance.correctAnswers / performance.totalQuestions) * 100)
    : 0

  // Focus Chart Data
  const focusChartData = {
    labels: focusScores.daily.slice(-7).map((_, i) => `Day ${i + 1}`),
    datasets: [
      {
        label: 'Focus Score',
        data: focusScores.daily.slice(-7).map(d => d.score),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  }

  // Mistake Patterns Chart
  const mistakeData = Object.entries(performance.mistakePatterns)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  const mistakeChartData = {
    labels: mistakeData.map(([concept]) => concept),
    datasets: [
      {
        label: 'Mistakes',
        data: mistakeData.map(([, count]) => count),
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(234, 179, 8, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(236, 72, 153, 0.8)'
        ],
        borderColor: [
          'rgb(239, 68, 68)',
          'rgb(249, 115, 22)',
          'rgb(234, 179, 8)',
          'rgb(168, 85, 247)',
          'rgb(236, 72, 153)'
        ],
        borderWidth: 2
      }
    ]
  }

  // Chapter Progress Data
  const chapterProgressData = {
    labels: Object.keys(curriculum).map(key => curriculum[key].unlocked ? key : 'Locked'),
    datasets: [
      {
        label: 'Mastery %',
        data: Object.values(curriculum).map(c => c.mastery),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(249, 115, 22, 0.8)'
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(168, 85, 247)',
          'rgb(249, 115, 22)'
        ],
        borderWidth: 2
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top'
      }
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="text-6xl">{student.avatar}</div>
              <div>
                <h1 className="text-4xl font-bold text-gray-800">
                  Welcome back, {student.name}! 👋
                </h1>
                <p className="text-gray-600">Grade {student.grade} • Level {level}</p>
              </div>
            </div>
            <button
              onClick={() => setPhase('curriculum')}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg"
            >
              Continue Learning →
            </button>
          </div>

          {/* XP Progress Bar */}
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Level {level}</span>
              <span className="text-sm font-semibold text-blue-600">{xp} XP</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${(xp / 100) * 100}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {['overview', 'focus', 'progress', 'badges'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Stat Cards */}
                <motion.div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-3xl">🔥</div>
                    <div>
                      <div className="text-sm text-gray-600">Streak</div>
                      <div className="text-2xl font-bold text-orange-600">{streak} days</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">Longest: {longestStreak} days</div>
                </motion.div>

                <motion.div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-3xl">🎯</div>
                    <div>
                      <div className="text-sm text-gray-600">Accuracy</div>
                      <div className="text-2xl font-bold text-green-600">{accuracy}%</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {performance.correctAnswers}/{performance.totalQuestions} correct
                  </div>
                </motion.div>

                <motion.div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-3xl">📚</div>
                    <div>
                      <div className="text-sm text-gray-600">Lessons</div>
                      <div className="text-2xl font-bold text-blue-600">
                        {completedLessons}/{totalChapters}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">Chapters completed</div>
                </motion.div>

                <motion.div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-3xl">⭐</div>
                    <div>
                      <div className="text-sm text-gray-600">Mastery</div>
                      <div className="text-2xl font-bold text-purple-600">
                        {Math.round(masteryAverage)}%
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">Average across chapters</div>
                </motion.div>

                {/* Daily Goals */}
                <div className="md:col-span-2 lg:col-span-4 bg-white rounded-xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span>🎯</span>
                    <span>Today&apos;s Goals</span>
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-700">
                          Complete {dailyGoals.target.lessons} lesson
                        </span>
                        <span className="text-sm font-bold text-blue-600">
                          {dailyGoals.lessonsCompleted}/{dailyGoals.target.lessons}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{
                            width: `${Math.min((dailyGoals.lessonsCompleted / dailyGoals.target.lessons) * 100, 100)}%`
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-700">
                          Complete {dailyGoals.target.activities} activities
                        </span>
                        <span className="text-sm font-bold text-green-600">
                          {dailyGoals.activitiesCompleted}/{dailyGoals.target.activities}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500"
                          style={{
                            width: `${Math.min((dailyGoals.activitiesCompleted / dailyGoals.target.activities) * 100, 100)}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mistake Patterns */}
                {mistakeData.length > 0 && (
                  <div className="md:col-span-2 lg:col-span-4 bg-white rounded-xl p-6 shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <span>⚠️</span>
                      <span>Areas to Practice</span>
                    </h3>
                    <div className="h-64">
                      <Bar data={mistakeChartData} options={chartOptions} />
                    </div>
                    <div className="mt-4 text-sm text-gray-600">
                      💡 Focus on these concepts to improve your mastery!
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Focus Tab */}
            {activeTab === 'focus' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">📊 Focus Trends (Last 7 Days)</h3>
                  <div className="h-80">
                    <Line data={focusChartData} options={chartOptions} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="text-3xl mb-2">⏱️</div>
                    <div className="text-sm text-gray-600">Avg Focus Time</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {focusScores.daily.length > 0
                        ? Math.round(
                            focusScores.daily.reduce((sum, d) => sum + d.totalTime, 0) /
                              focusScores.daily.length
                          ) + ' min'
                        : '0 min'}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="text-3xl mb-2">💭</div>
                    <div className="text-sm text-gray-600">Total Distractions</div>
                    <div className="text-2xl font-bold text-orange-600">
                      {focusScores.daily.reduce((sum, d) => sum + (d.distractionCount || 0), 0)}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="text-3xl mb-2">🎯</div>
                    <div className="text-sm text-gray-600">Avg Focus Score</div>
                    <div className="text-2xl font-bold text-green-600">
                      {focusScores.daily.length > 0
                        ? Math.round(
                            focusScores.daily.reduce((sum, d) => sum + d.score, 0) /
                              focusScores.daily.length
                          )
                        : 0}
                      %
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Progress Tab */}
            {activeTab === 'progress' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">📈 Chapter Mastery</h3>
                  <div className="h-80">
                    <Bar data={chapterProgressData} options={chartOptions} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(curriculum).map(([key, chapter]) => (
                    <div
                      key={key}
                      className={`bg-white rounded-xl p-6 shadow-lg ${
                        !chapter.unlocked ? 'opacity-50' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-bold text-gray-800 capitalize">{key}</h4>
                        {chapter.unlocked ? '🔓' : '🔒'}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Lesson:</span>
                          <span>{chapter.lesson ? '✅' : '⏳'}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Activities:</span>
                          <span className="font-bold">{chapter.activities.length}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Mastery:</span>
                          <span className="font-bold text-blue-600">{chapter.mastery}%</span>
                        </div>
                      </div>
                      {chapter.mastery >= 80 && (
                        <div className="mt-3 px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full inline-block">
                          ⭐ Mastered!
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Badges Tab */}
            {activeTab === 'badges' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">🏆 Your Achievements</h3>
                  {badges.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🎯</div>
                      <p className="text-gray-600">
                        Keep learning to earn badges and achievements!
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {badges.map((badge, index) => (
                        <motion.div
                          key={index}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 text-center border-2 border-yellow-300"
                        >
                          <div className="text-4xl mb-2">{badge.icon || '🏆'}</div>
                          <div className="font-bold text-gray-800">{badge.name}</div>
                          <div className="text-xs text-gray-600 mt-1">
                            {new Date(badge.earnedAt).toLocaleDateString()}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
