import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// XP values
const XP_VALUES = {
  LESSON: 20,
  ACTIVITY: 50,
  MASTERY: 100,
  QUIZ: 30,
  DAILY_GOAL: 25,
  PERFECT_SCORE: 10
}

// Chapter structure
const CHAPTERS = [
  { id: 'fractions', name: 'Fractions', order: 1 },
  { id: 'decimals', name: 'Decimals', order: 2 },
  { id: 'percentages', name: 'Percentages', order: 3 },
  { id: 'number-sense', name: 'Number Sense', order: 4 }
]

export const useEnhancedStore = create(
  persist(
    (set, get) => ({
      // ===== STUDENT PROFILE =====
      student: {
        id: null,
        name: 'Student',
        grade: 5,
        avatar: '👨‍🎓',
        createdAt: null
      },

      setStudent: (student) => set({ student: { ...get().student, ...student } }),

      // ===== SESSION STATE =====
      sessionId: null,
      currentPhase: 'landing',

      initializeSession: async () => {
        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        set({
          sessionId,
          student: {
            ...get().student,
            id: sessionId,
            createdAt: get().student.createdAt || Date.now()
          }
        })
      },

      setPhase: (phase) => set({ currentPhase: phase }),

      // ===== XP & LEVEL SYSTEM =====
      xp: 0,
      level: 1,
      xpToNextLevel: 100,

      addXP: (amount, reason = '') => {
        const { xp, level, xpToNextLevel } = get()
        const newXP = xp + amount
        let newLevel = level
        let newXPToNext = xpToNextLevel

        // Level up logic
        if (newXP >= xpToNextLevel) {
          newLevel = level + 1
          newXPToNext = Math.floor(xpToNextLevel * 1.5) // 50% increase per level

          // Trigger level up celebration
          setTimeout(() => {
            get().addNotification({
              type: 'levelup',
              message: `Level Up! You're now level ${newLevel}!`,
              icon: '🎉'
            })
          }, 500)
        }

        set({
          xp: newXP,
          level: newLevel,
          xpToNextLevel: newXPToNext
        })

        // Log XP gain
        get().logActivity({
          type: 'xp_gain',
          amount,
          reason,
          timestamp: Date.now()
        })
      },

      // ===== STREAK SYSTEM =====
      streak: 0,
      lastActivityDate: null,
      longestStreak: 0,

      updateStreak: () => {
        const { lastActivityDate, streak, longestStreak } = get()
        const today = new Date().toDateString()
        const lastDate = lastActivityDate ? new Date(lastActivityDate).toDateString() : null

        if (lastDate === today) {
          // Already logged today
          return
        }

        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayStr = yesterday.toDateString()

        let newStreak = streak

        if (lastDate === yesterdayStr) {
          // Continuing streak
          newStreak = streak + 1
        } else if (lastDate === null || lastDate !== today) {
          // Starting new streak or broke streak
          newStreak = 1
        }

        const newLongest = Math.max(newStreak, longestStreak)

        set({
          streak: newStreak,
          lastActivityDate: Date.now(),
          longestStreak: newLongest
        })

        if (newStreak > 1) {
          get().addNotification({
            type: 'streak',
            message: `${newStreak} day streak! 🔥`,
            icon: '🔥'
          })
        }
      },

      // ===== DAILY GOALS =====
      dailyGoals: {
        lessonsCompleted: 0,
        activitiesCompleted: 0,
        xpEarned: 0,
        target: {
          lessons: 1,
          activities: 2,
          xp: 100
        }
      },

      updateDailyGoal: (type) => {
        const { dailyGoals } = get()
        const goals = { ...dailyGoals }

        if (type === 'lesson') goals.lessonsCompleted++
        if (type === 'activity') goals.activitiesCompleted++

        set({ dailyGoals: goals })

        // Check if all goals met
        if (
          goals.lessonsCompleted >= goals.target.lessons &&
          goals.activitiesCompleted >= goals.target.activities &&
          get().xp >= goals.target.xp
        ) {
          get().addXP(XP_VALUES.DAILY_GOAL, 'Daily Goal Complete')
          get().addNotification({
            type: 'goal',
            message: 'Daily Goal Complete! +25 XP',
            icon: '🎯'
          })
        }
      },

      resetDailyGoals: () => {
        set({
          dailyGoals: {
            lessonsCompleted: 0,
            activitiesCompleted: 0,
            xpEarned: 0,
            target: {
              lessons: 1,
              activities: 2,
              xp: 100
            }
          }
        })
      },

      // ===== CURRICULUM PROGRESS =====
      curriculum: {
        fractions: { lesson: false, activities: [], mastery: 0, unlocked: true },
        decimals: { lesson: false, activities: [], mastery: 0, unlocked: false },
        percentages: { lesson: false, activities: [], mastery: 0, unlocked: false },
        'number-sense': { lesson: false, activities: [], mastery: 0, unlocked: false }
      },

      currentChapter: 'fractions',
      setCurrentChapter: (chapterId) => set({ currentChapter: chapterId }),

      completeLesson: (chapterId) => {
        const { curriculum } = get()
        set({
          curriculum: {
            ...curriculum,
            [chapterId]: {
              ...curriculum[chapterId],
              lesson: true
            }
          }
        })
        get().addXP(XP_VALUES.LESSON, `Completed ${chapterId} lesson`)
        get().updateDailyGoal('lesson')
      },

      completeActivity: (chapterId, activityId, score) => {
        const { curriculum } = get()
        const chapter = curriculum[chapterId]

        set({
          curriculum: {
            ...curriculum,
            [chapterId]: {
              ...chapter,
              activities: [...new Set([...chapter.activities, activityId])]
            }
          }
        })

        get().addXP(XP_VALUES.ACTIVITY, `Completed ${activityId}`)
        get().updateDailyGoal('activity')

        // Check for perfect score bonus
        if (score >= 100) {
          get().addXP(XP_VALUES.PERFECT_SCORE, 'Perfect Score Bonus')
        }
      },

      setMastery: (chapterId, masteryScore) => {
        const { curriculum } = get()
        set({
          curriculum: {
            ...curriculum,
            [chapterId]: {
              ...curriculum[chapterId],
              mastery: masteryScore
            }
          }
        })

        if (masteryScore >= 80) {
          get().addXP(XP_VALUES.MASTERY, `Mastered ${chapterId}`)
          get().unlockNextChapter(chapterId)
        }
      },

      unlockNextChapter: (currentChapterId) => {
        const currentChapter = CHAPTERS.find(c => c.id === currentChapterId)
        if (!currentChapter) return

        const nextChapter = CHAPTERS.find(c => c.order === currentChapter.order + 1)
        if (!nextChapter) return

        const { curriculum } = get()
        set({
          curriculum: {
            ...curriculum,
            [nextChapter.id]: {
              ...curriculum[nextChapter.id],
              unlocked: true
            }
          }
        })

        get().addNotification({
          type: 'unlock',
          message: `${nextChapter.name} chapter unlocked!`,
          icon: '🔓'
        })
      },

      // ===== BADGES =====
      badges: [],

      addBadge: (badge) => {
        const { badges } = get()
        const exists = badges.find(b => b.name === badge.name)
        if (!exists) {
          set({ badges: [...badges, { ...badge, earnedAt: Date.now() }] })
          get().addNotification({
            type: 'badge',
            message: `New Badge: ${badge.name}!`,
            icon: badge.icon || '🏆'
          })
        }
      },

      // ===== FOCUS TRACKING =====
      focusScores: {
        daily: [],
        perActivity: {}
      },

      recordFocusScore: (activityId, score, distractionCount, totalTime) => {
        const { focusScores } = get()
        const today = new Date().toDateString()

        set({
          focusScores: {
            daily: [
              ...focusScores.daily.filter(d => new Date(d.date).toDateString() !== today),
              { date: Date.now(), score, distractionCount, totalTime }
            ],
            perActivity: {
              ...focusScores.perActivity,
              [activityId]: { score, distractionCount, totalTime, timestamp: Date.now() }
            }
          }
        })
      },

      // ===== PERFORMANCE TRACKING =====
      performance: {
        totalQuestions: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        mistakePatterns: {}
      },

      recordAnswer: (isCorrect, concept, question) => {
        const { performance } = get()
        const { mistakePatterns } = performance

        set({
          performance: {
            totalQuestions: performance.totalQuestions + 1,
            correctAnswers: performance.correctAnswers + (isCorrect ? 1 : 0),
            wrongAnswers: performance.wrongAnswers + (isCorrect ? 0 : 1),
            mistakePatterns: isCorrect ? mistakePatterns : {
              ...mistakePatterns,
              [concept]: (mistakePatterns[concept] || 0) + 1
            }
          }
        })
      },

      // ===== NOTIFICATIONS =====
      notifications: [],

      addNotification: (notification) => {
        const { notifications } = get()
        set({
          notifications: [
            ...notifications,
            { ...notification, id: Date.now(), timestamp: Date.now() }
          ].slice(-10) // Keep only last 10
        })
      },

      clearNotifications: () => set({ notifications: [] }),

      // ===== ACTIVITY LOG =====
      activityLog: [],

      logActivity: (activity) => {
        const { activityLog } = get()
        set({
          activityLog: [
            ...activityLog,
            { ...activity, id: Date.now(), timestamp: Date.now() }
          ].slice(-100) // Keep last 100 activities
        })
      },

      // ===== ADAPTIVE DIFFICULTY =====
      adaptiveDifficulty: {
        current: 'medium', // easy, medium, hard
        history: []
      },

      adjustDifficulty: (performance) => {
        const { adaptiveDifficulty } = get()
        let newDifficulty = adaptiveDifficulty.current

        if (performance >= 85) {
          newDifficulty = adaptiveDifficulty.current === 'easy' ? 'medium' : 'hard'
        } else if (performance < 50) {
          newDifficulty = adaptiveDifficulty.current === 'hard' ? 'medium' : 'easy'
        }

        set({
          adaptiveDifficulty: {
            current: newDifficulty,
            history: [
              ...adaptiveDifficulty.history,
              { difficulty: newDifficulty, performance, timestamp: Date.now() }
            ]
          }
        })
      },

      // ===== HINTS USED =====
      hintsUsed: {},

      useHint: (activityId, level) => {
        const { hintsUsed } = get()
        set({
          hintsUsed: {
            ...hintsUsed,
            [activityId]: [...(hintsUsed[activityId] || []), { level, timestamp: Date.now() }]
          }
        })
      },

      // ===== RESET =====
      reset: () => {
        set({
          currentPhase: 'landing',
          xp: 0,
          level: 1,
          streak: 0,
          curriculum: {
            fractions: { lesson: false, activities: [], mastery: 0, unlocked: true },
            decimals: { lesson: false, activities: [], mastery: 0, unlocked: false },
            percentages: { lesson: false, activities: [], mastery: 0, unlocked: false },
            'number-sense': { lesson: false, activities: [], mastery: 0, unlocked: false }
          },
          badges: [],
          performance: {
            totalQuestions: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            mistakePatterns: {}
          },
          focusScores: {
            daily: [],
            perActivity: {}
          },
          activityLog: [],
          notifications: []
        })
      }
    }),
    {
      name: 'timeback-learning-storage',
      partialize: (state) => ({
        student: state.student,
        xp: state.xp,
        level: state.level,
        streak: state.streak,
        lastActivityDate: state.lastActivityDate,
        longestStreak: state.longestStreak,
        curriculum: state.curriculum,
        badges: state.badges,
        performance: state.performance,
        focusScores: state.focusScores,
        dailyGoals: state.dailyGoals,
        currentChapter: state.currentChapter
      })
    }
  )
)

export { XP_VALUES, CHAPTERS }
