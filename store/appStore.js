import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAppStore = create(
  persist(
    (set, get) => ({
      // Session state
      sessionId: null,
      currentPhase: 'landing', // landing, introduction, activities, games, assessment, dashboard
      currentLevel: 1,
      
      // Progress tracking
      points: 0,
      badges: [],
      questionsAnswered: 0,
      correctAnswers: 0,
      performance: [],
      
      // Timer
      timeSpent: 0,
      startTime: null,
      
      // Initialize session
      initializeSession: async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/create-session`)
          const data = await response.json()
          if (data.success) {
            set({ sessionId: data.sessionId, startTime: Date.now() })
          }
        } catch (error) {
          console.error('Error initializing session:', error)
          // Fallback to local session ID
          const localSessionId = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          set({ sessionId: localSessionId, startTime: Date.now() })
        }
      },
      
      // Phase navigation
      setPhase: (phase) => set({ currentPhase: phase }),
      
      // Level management
      setLevel: (level) => set({ currentLevel: level }),
      
      // Points and badges
      addPoints: (points) => set((state) => ({ points: state.points + points })),
      addBadge: (badge) => set((state) => ({ 
        badges: [...state.badges, badge] 
      })),
      
      // Progress tracking
      recordAnswer: (isCorrect, question, answer) => {
        set((state) => {
          const newPerformance = [...state.performance, { isCorrect, question, answer }]
          return {
            questionsAnswered: state.questionsAnswered + 1,
            correctAnswers: state.correctAnswers + (isCorrect ? 1 : 0),
            performance: newPerformance
          }
        })
      },
      
      // Timer
      updateTimeSpent: () => {
        const { startTime } = get()
        if (startTime) {
          const elapsed = Math.floor((Date.now() - startTime) / 1000)
          set({ timeSpent: elapsed })
        }
      },
      
      // Reset for new session
      reset: () => {
        set({
          currentPhase: 'landing',
          currentLevel: 1,
          points: 0,
          badges: [],
          questionsAnswered: 0,
          correctAnswers: 0,
          performance: [],
          timeSpent: 0,
          startTime: null
        })
      }
    }),
    {
      name: 'fractions-learning-storage',
      partialize: (state) => ({
        sessionId: state.sessionId,
        currentPhase: state.currentPhase,
        points: state.points,
        badges: state.badges
      })
    }
  )
)

