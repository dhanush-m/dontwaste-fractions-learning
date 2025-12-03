'use client'

import { motion } from 'framer-motion'
import { useEnhancedStore } from '@/store/enhancedAppStore'

export default function DailySummary({ onContinue, showDashboardButton = false }) {
  const {
    dailyGoals,
    xp,
    streak,
    focusScores,
    activityLog,
    level,
    student
  } = useEnhancedStore()

  // Calculate today's stats
  const today = new Date().toDateString()
  const todayActivities = activityLog.filter(
    log => new Date(log.timestamp).toDateString() === today
  )

  const todayXP = todayActivities
    .filter(log => log.type === 'xp_gain')
    .reduce((sum, log) => sum + log.amount, 0)

  const todayFocus = focusScores.daily
    .filter(score => new Date(score.date).toDateString() === today)
    .reduce((sum, score, _, arr) => sum + score.score / arr.length, 0) || 0

  // Calculate goal progress
  const lessonProgress = (dailyGoals.lessonsCompleted / dailyGoals.target.lessons) * 100
  const activityProgress = (dailyGoals.activitiesCompleted / dailyGoals.target.activities) * 100
  const xpProgress = Math.min((todayXP / dailyGoals.target.xp) * 100, 100)

  const allGoalsMet = lessonProgress >= 100 && activityProgress >= 100 && xpProgress >= 100

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onContinue}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-7xl mb-4">{student.avatar}</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Great Work, {student.name}!
          </h1>
          <p className="text-xl text-gray-600">Here&apos;s your progress today</p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon="⭐"
            label="XP Earned"
            value={todayXP}
            color="yellow"
          />
          <StatCard
            icon="🔥"
            label="Day Streak"
            value={streak}
            color="orange"
          />
          <StatCard
            icon="📊"
            label="Level"
            value={level}
            color="blue"
          />
          <StatCard
            icon="🎯"
            label="Focus"
            value={`${Math.round(todayFocus)}%`}
            color="purple"
          />
        </div>

        {/* Daily Goals Progress */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Daily Goals {allGoalsMet && '🎉'}
          </h2>

          <div className="space-y-4">
            <GoalProgress
              label="Lessons Completed"
              current={dailyGoals.lessonsCompleted}
              target={dailyGoals.target.lessons}
              progress={lessonProgress}
              icon="📖"
            />
            <GoalProgress
              label="Activities Completed"
              current={dailyGoals.activitiesCompleted}
              target={dailyGoals.target.activities}
              progress={activityProgress}
              icon="✅"
            />
            <GoalProgress
              label="XP Earned"
              current={todayXP}
              target={dailyGoals.target.xp}
              progress={xpProgress}
              icon="⭐"
            />
          </div>

          {allGoalsMet && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 bg-green-100 border-2 border-green-500 rounded-lg p-4 text-center"
            >
              <div className="text-3xl mb-2">🏆</div>
              <div className="font-bold text-green-800 text-lg">
                All Daily Goals Complete!
              </div>
              <div className="text-green-700 text-sm">
                +25 Bonus XP Earned
              </div>
            </motion.div>
          )}
        </div>

        {/* Today's Activities */}
        {todayActivities.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Today&apos;s Activities</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 max-h-40 overflow-y-auto">
              {todayActivities.slice(0, 10).map((activity, index) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-gray-700">
                    {activity.reason || activity.type}
                  </span>
                  {activity.amount && (
                    <span className="text-blue-600 font-semibold">
                      +{activity.amount} XP
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Motivational Message */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 mb-6 text-center">
          <p className="text-lg font-semibold text-gray-800">
            {getMotivationalMessage(streak, allGoalsMet, todayXP)}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          {showDashboardButton && (
            <button
              onClick={() => {
                const { setPhase } = useEnhancedStore.getState()
                setPhase('dashboard')
                onContinue?.()
              }}
              className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold py-4 rounded-xl transition-colors"
            >
              View Dashboard
            </button>
          )}
          <button
            onClick={onContinue}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 rounded-xl shadow-lg"
          >
            Continue Learning →
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

function StatCard({ icon, label, value, color }) {
  const colors = {
    yellow: 'from-yellow-400 to-orange-400',
    orange: 'from-orange-400 to-red-400',
    blue: 'from-blue-400 to-cyan-400',
    purple: 'from-purple-400 to-pink-400',
  }

  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-xl p-4 text-center text-white shadow-lg`}>
      <div className="text-4xl mb-2">{icon}</div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm opacity-90">{label}</div>
    </div>
  )
}

function GoalProgress({ label, current, target, progress, icon }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-700 font-semibold flex items-center gap-2">
          <span>{icon}</span>
          {label}
        </span>
        <span className="text-gray-600">
          {current} / {target}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`h-3 rounded-full ${
            progress >= 100 ? 'bg-green-500' : 'bg-blue-500'
          }`}
        />
      </div>
    </div>
  )
}

function getMotivationalMessage(streak, allGoalsMet, todayXP) {
  if (allGoalsMet && streak >= 7) {
    return "🌟 Incredible! A week-long streak and all goals complete! You're on fire!"
  } else if (allGoalsMet) {
    return "🎉 Amazing! You crushed all your daily goals today!"
  } else if (streak >= 7) {
    return "🔥 7 days in a row! Your dedication is paying off. Keep it up!"
  } else if (streak >= 3) {
    return "💪 Great streak going! You're building an excellent learning habit."
  } else if (todayXP >= 100) {
    return "⭐ Fantastic progress today! You earned over 100 XP!"
  } else {
    return "👏 Nice work today! Every step forward counts. Come back tomorrow!"
  }
}
