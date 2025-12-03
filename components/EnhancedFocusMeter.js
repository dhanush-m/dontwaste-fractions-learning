'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/appStore'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

// Focus states with descriptions
const FOCUS_STATES = {
  HIGHLY_FOCUSED: {
    label: 'Highly Focused',
    color: 'emerald',
    emoji: '🎯',
    message: 'Excellent! You\'re in the zone!',
  },
  FOCUSED: {
    label: 'Focused',
    color: 'green',
    emoji: '✨',
    message: 'Great focus! Keep it up!',
  },
  MODERATE: {
    label: 'Moderate Focus',
    color: 'yellow',
    emoji: '👀',
    message: 'Good effort! Stay with it!',
  },
  DISTRACTED: {
    label: 'Getting Distracted',
    color: 'orange',
    emoji: '⚠️',
    message: 'Let\'s refocus together!',
  },
  DISENGAGED: {
    label: 'Disengaged',
    color: 'red',
    emoji: '💭',
    message: 'Take a break or refocus?',
  },
}

export default function EnhancedFocusMeter() {
  const { sessionId } = useAppStore()

  // Core metrics
  const [focusState, setFocusState] = useState(FOCUS_STATES.FOCUSED)
  const [focusScore, setFocusScore] = useState(100) // 0-100
  const [wastedTime, setWastedTime] = useState(0)
  const [focusedTime, setFocusedTime] = useState(0)
  const [totalTime, setTotalTime] = useState(0)

  // Advanced analytics
  const [focusStreak, setFocusStreak] = useState(0) // consecutive seconds of focus
  const [longestStreak, setLongestStreak] = useState(0)
  const [distractionCount, setDistractionCount] = useState(0)
  const [attentionSpan, setAttentionSpan] = useState([]) // Array of focus durations
  const [productivityPattern, setProductivityPattern] = useState('morning') // morning, afternoon, evening

  // Detection state
  const [isActive, setIsActive] = useState(false)
  const [cameraPermission, setCameraPermission] = useState('prompt')
  const [showInsights, setShowInsights] = useState(false)
  const [showEncouragement, setShowEncouragement] = useState(false)
  const [encouragementMessage, setEncouragementMessage] = useState('')

  // Auto-pause feature
  const [isPaused, setIsPaused] = useState(false)
  const [pauseCountdown, setPauseCountdown] = useState(0)
  const [showPauseOverlay, setShowPauseOverlay] = useState(false)

  // Refs
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const detectionIntervalRef = useRef(null)
  const lastActivityRef = useRef(Date.now())
  const focusIntervalRef = useRef(null)
  const modelRef = useRef(null)
  const activityHistoryRef = useRef([]) // Track activity over time
  const lastSavedRef = useRef(0)

  // Face detection
  let faceLandmarksDetection = null
  if (typeof window !== 'undefined') {
    import('@tensorflow-models/face-landmarks-detection').then(module => {
      faceLandmarksDetection = module
    })
  }

  useEffect(() => {
    loadFaceModel()
    requestCameraAccess()
    startFocusTracking()
    const cleanupActivity = startActivityDetection()

    return () => {
      stopDetection()
      if (cleanupActivity) cleanupActivity()
    }
  }, [])

  const loadFaceModel = async () => {
    if (typeof window === 'undefined') return

    try {
      const tf = await import('@tensorflow/tfjs')
      await tf.setBackend('webgl')
      await tf.ready()

      const faceDetectionModule = await import('@tensorflow-models/face-landmarks-detection')
      faceLandmarksDetection = faceDetectionModule

      const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh
      const detectorConfig = {
        runtime: 'tfjs',
        maxFaces: 1,
        refineLandmarks: false,
      }

      const detector = await faceLandmarksDetection.createDetector(model, detectorConfig)
      modelRef.current = detector
      console.log('👁️ Enhanced eye tracking enabled')
    } catch (error) {
      console.log('Using activity-based focus tracking')
      modelRef.current = null
    }
  }

  const requestCameraAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 320 },
          height: { ideal: 240 }
        }
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraPermission('granted')
        setIsActive(true)
        startDetection()
      }
    } catch (error) {
      setCameraPermission('denied')
      setIsActive(false)
    }
  }

  const startDetection = () => {
    detectionIntervalRef.current = setInterval(() => {
      detectAttention()
    }, 1000) // Check every second
  }

  const detectAttention = async () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { willReadFrequently: true })

    if (video.videoWidth > 0 && video.videoHeight > 0) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      let faceDetected = false

      // Try face detection if available
      if (modelRef.current && faceLandmarksDetection) {
        try {
          const faces = await modelRef.current.estimateFaces(video, {
            flipHorizontal: false,
          })

          if (faces && faces.length > 0) {
            faceDetected = true
            recordActivity('engaged')
            // console.log('✅ Face detected - engaged') // Disabled verbose logging
          } else {
            // No face detected - user might be looking away
            recordActivity('idle')
            // console.log('❌ No face detected - idle') // Disabled verbose logging
          }
          return // Exit early if face detection worked
        } catch (error) {
          // Fall through to motion detection
          console.log('Face detection error, using motion fallback')
        }
      }

      // Fallback to motion detection if face detection not available or failed
      if (!faceDetected) {
        const hasMotion = detectMotion(ctx, canvas)
        if (hasMotion) {
          recordActivity('engaged')
        } else {
          recordActivity('idle')
        }
      }
    } else {
      // Video not ready, consider idle
      recordActivity('idle')
    }
  }

  const detectMotion = (ctx, canvas) => {
    try {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      let sum = 0
      const sampleSize = Math.min(data.length, 10000)

      for (let i = 0; i < sampleSize; i += 4) {
        sum += (data[i] + data[i + 1] + data[i + 2]) / 3
      }

      return sum / (sampleSize / 4) > 10
    } catch {
      return false
    }
  }

  const recordActivity = (type) => {
    const now = Date.now()

    // Only update lastActivityRef if engaged
    if (type === 'engaged') {
      lastActivityRef.current = now
    }

    // Keep last 60 seconds of activity
    activityHistoryRef.current.push({ type, timestamp: now })
    activityHistoryRef.current = activityHistoryRef.current.filter(
      a => now - a.timestamp < 60000
    )
  }

  const startActivityDetection = () => {
    const updateActivity = () => {
      recordActivity('engaged')
    }

    window.addEventListener('mousemove', updateActivity, { passive: true })
    window.addEventListener('keydown', updateActivity, { passive: true })
    window.addEventListener('click', updateActivity, { passive: true })
    window.addEventListener('scroll', updateActivity, { passive: true })

    return () => {
      window.removeEventListener('mousemove', updateActivity)
      window.removeEventListener('keydown', updateActivity)
      window.removeEventListener('click', updateActivity)
      window.removeEventListener('scroll', updateActivity)
    }
  }

  const startFocusTracking = () => {
    focusIntervalRef.current = setInterval(() => {
      analyzeFocus()
      saveFocusData()
    }, 1000)
  }

  const analyzeFocus = () => {
    const now = Date.now()
    const timeSinceActivity = now - lastActivityRef.current
    const recentActivity = activityHistoryRef.current.filter(
      a => now - a.timestamp < 10000
    )
    const engagementRatio = recentActivity.filter(a => a.type === 'engaged').length / Math.max(recentActivity.length, 1)

    // Auto-pause logic: Trigger pause after 60 seconds of inactivity
    const PAUSE_THRESHOLD = 60000 // 60 seconds
    const PAUSE_WARNING_THRESHOLD = 57000 // 57 seconds (show warning)

    if (timeSinceActivity > PAUSE_THRESHOLD && !isPaused) {
      // Trigger auto-pause
      setIsPaused(true)
      setShowPauseOverlay(true)
      setPauseCountdown(Math.floor(timeSinceActivity / 1000))
      console.log('⏸️ Auto-pause triggered after', Math.floor(timeSinceActivity / 1000), 'seconds of inactivity')
    } else if (timeSinceActivity > PAUSE_WARNING_THRESHOLD && !isPaused) {
      // Show warning countdown
      const countdown = Math.ceil((PAUSE_THRESHOLD - timeSinceActivity) / 1000)
      setPauseCountdown(countdown)
    } else if (timeSinceActivity <= PAUSE_WARNING_THRESHOLD) {
      // Reset countdown
      setPauseCountdown(0)
      if (isPaused) {
        // Resume from pause
        setIsPaused(false)
        setShowPauseOverlay(false)
        console.log('▶️ Activity resumed')
      }
    }

    // Calculate focus score (0-100) with more sensitive thresholds
    let newFocusScore = 100
    if (timeSinceActivity > 15000) {
      newFocusScore = 0 // 15+ seconds idle = disengaged
    } else if (timeSinceActivity > 8000) {
      newFocusScore = 30 // 8-15 seconds = distracted
    } else if (timeSinceActivity > 5000) {
      newFocusScore = 60 // 5-8 seconds = moderate
    } else if (timeSinceActivity > 3000) {
      newFocusScore = 80 // 3-5 seconds = good
    } else if (engagementRatio > 0.7) {
      newFocusScore = 100 // highly focused
    } else {
      newFocusScore = 90 // focused
    }

    setFocusScore(newFocusScore)

    // Update focus state
    let newFocusState
    if (newFocusScore >= 95) newFocusState = FOCUS_STATES.HIGHLY_FOCUSED
    else if (newFocusScore >= 75) newFocusState = FOCUS_STATES.FOCUSED
    else if (newFocusScore >= 50) newFocusState = FOCUS_STATES.MODERATE
    else if (newFocusScore >= 25) newFocusState = FOCUS_STATES.DISTRACTED
    else newFocusState = FOCUS_STATES.DISENGAGED

    // Debug logging every 5 seconds
    if (totalTime % 5 === 0) {
      console.log(`📊 Focus Analysis:`, {
        score: newFocusScore,
        state: newFocusState.label,
        timeSinceActivity: Math.round(timeSinceActivity / 1000) + 's',
        engagementRatio: Math.round(engagementRatio * 100) + '%',
      })
    }

    setFocusState(newFocusState)

    // Update metrics
    setTotalTime(prev => prev + 1)

    if (newFocusScore >= 50) {
      // Considered focused
      setFocusedTime(prev => prev + 1)
      setFocusStreak(prev => {
        const newStreak = prev + 1
        setLongestStreak(current => Math.max(current, newStreak))

        // Show encouragement at milestones
        if (newStreak === 60) showEncouragementPopup('1 minute of solid focus! 🎉')
        else if (newStreak === 300) showEncouragementPopup('5 minutes straight! You\'re amazing! 🌟')
        else if (newStreak === 600) showEncouragementPopup('10 minutes of focus! Incredible! 🏆')

        return newStreak
      })
    } else {
      // Distracted or disengaged
      setWastedTime(prev => prev + 1)

      if (focusStreak > 0) {
        // Just lost focus
        setDistractionCount(prev => prev + 1)
        attentionSpan.push(focusStreak)
        setAttentionSpan(prev => [...prev, focusStreak])
      }

      setFocusStreak(0)

      // Gentle nudge after prolonged distraction
      if (newFocusScore < 25 && wastedTime % 30 === 0 && wastedTime > 0) {
        showEncouragementPopup('Let\'s get back on track! You can do this! 💪')
      }
    }
  }

  const showEncouragementPopup = (message) => {
    setEncouragementMessage(message)
    setShowEncouragement(true)
    setTimeout(() => setShowEncouragement(false), 4000)
  }

  const saveFocusData = async () => {
    if (!sessionId) return
    const now = Date.now()
    if (now - lastSavedRef.current < 10000) return // Save every 10 seconds

    try {
      await fetch(`${API_URL}/api/save-focus-data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          focusScore,
          wastedTime,
          focusedTime,
          totalTime,
          focusStreak,
          longestStreak,
          distractionCount,
        }),
      })
      lastSavedRef.current = now
    } catch (error) {
      console.error('Error saving focus data:', error)
    }
  }

  const stopDetection = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current)
    }
    if (focusIntervalRef.current) {
      clearInterval(focusIntervalRef.current)
    }
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop())
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${String(secs).padStart(2, '0')}`
  }

  const getFocusPercentage = () => {
    return totalTime > 0 ? Math.round((focusedTime / totalTime) * 100) : 100
  }

  const getAverageAttentionSpan = () => {
    if (attentionSpan.length === 0) return 0
    const sum = attentionSpan.reduce((a, b) => a + b, 0)
    return Math.round(sum / attentionSpan.length)
  }

  return (
    <>
      {/* Main Focus Meter Widget */}
      <div className="fixed bottom-4 left-4 z-50">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-2xl border-2 border-gray-200 p-4 min-w-[240px]"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{focusState.emoji}</span>
              <div>
                <div className="text-xs text-gray-500">Focus Status</div>
                <div className={`text-sm font-bold text-${focusState.color}-600`}>
                  {focusState.label}
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowInsights(!showInsights)}
              className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
            >
              {showInsights ? '←' : 'Stats →'}
            </button>
          </div>

          {/* Focus Score Progress Bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600">Focus Score</span>
              <span className="text-xs font-bold text-gray-800">{focusScore}/100</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r from-${focusState.color}-400 to-${focusState.color}-600`}
                initial={{ width: 0 }}
                animate={{ width: `${focusScore}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Time Stats */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-green-50 rounded-lg p-2 text-center">
              <div className="text-xs text-green-700">Focused</div>
              <div className="text-lg font-bold text-green-800">{formatTime(focusedTime)}</div>
            </div>
            <div className="bg-red-50 rounded-lg p-2 text-center">
              <div className="text-xs text-red-700">Distracted</div>
              <div className="text-lg font-bold text-red-800">{formatTime(wastedTime)}</div>
            </div>
          </div>

          {/* Current Streak */}
          {focusStreak > 10 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-2 mb-3 text-center border border-purple-200"
            >
              <div className="text-xs text-purple-700">Focus Streak</div>
              <div className="text-xl font-bold text-purple-800">🔥 {formatTime(focusStreak)}</div>
            </motion.div>
          )}

          {/* Motivational Message */}
          <div className="text-xs text-center text-gray-600 italic">
            {focusState.message}
          </div>

          {/* Camera Status */}
          <div className="text-xs text-center text-gray-400 mt-2">
            {cameraPermission === 'granted' ? '📹 Active' : '📹 Activity Mode'}
          </div>
        </motion.div>
      </div>

      {/* Insights Panel */}
      <AnimatePresence>
        {showInsights && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="fixed bottom-4 left-64 z-50"
          >
            <div className="bg-white rounded-2xl shadow-2xl border-2 border-blue-200 p-4 w-64">
              <h3 className="text-lg font-bold text-gray-800 mb-3">📊 Focus Insights</h3>

              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-600 mb-1">Focus Rate</div>
                  <div className="text-2xl font-bold text-blue-600">{getFocusPercentage()}%</div>
                </div>

                <div>
                  <div className="text-xs text-gray-600 mb-1">Longest Streak</div>
                  <div className="text-lg font-bold text-green-600">🏆 {formatTime(longestStreak)}</div>
                </div>

                <div>
                  <div className="text-xs text-gray-600 mb-1">Distractions</div>
                  <div className="text-lg font-bold text-orange-600">{distractionCount}x</div>
                </div>

                <div>
                  <div className="text-xs text-gray-600 mb-1">Avg Attention Span</div>
                  <div className="text-lg font-bold text-purple-600">{formatTime(getAverageAttentionSpan())}</div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-xs font-semibold text-blue-800 mb-1">💡 AI Tip</div>
                <div className="text-xs text-blue-700">
                  {getFocusPercentage() >= 80
                    ? 'Amazing focus! You\'re learning efficiently!'
                    : getFocusPercentage() >= 60
                    ? 'Good work! Try minimizing distractions.'
                    : 'Let\'s improve focus. Take short breaks every 20 mins!'}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Encouragement Popup */}
      <AnimatePresence>
        {showEncouragement && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 rounded-2xl shadow-2xl">
              <div className="text-lg font-bold text-center">{encouragementMessage}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auto-Pause Overlay */}
      <AnimatePresence>
        {showPauseOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl p-8 max-w-md mx-4 text-center"
            >
              <div className="text-6xl mb-4">⏸️</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                Activity Paused
              </h2>
              <p className="text-gray-600 mb-6">
                We noticed you stepped away for a moment. Take your time!
              </p>

              <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4 mb-6">
                <div className="text-sm text-orange-700 mb-2">
                  No activity detected for:
                </div>
                <div className="text-4xl font-bold text-orange-600">
                  {pauseCountdown}s
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsPaused(false)
                  setShowPauseOverlay(false)
                  lastActivityRef.current = Date.now()
                }}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg text-lg"
              >
                ▶️ Resume Learning
              </motion.button>

              <div className="mt-4 text-sm text-gray-500">
                Click anywhere or move your mouse to resume
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pause Warning (countdown before auto-pause) */}
      <AnimatePresence>
        {pauseCountdown > 0 && pauseCountdown <= 3 && !isPaused && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-orange-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3">
              <div className="text-2xl">⚠️</div>
              <div className="font-bold">
                Pausing in {pauseCountdown}s... Move to stay active!
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden elements */}
      <video ref={videoRef} autoPlay playsInline muted className="hidden" />
      <canvas ref={canvasRef} className="hidden" />
    </>
  )
}
