'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/appStore'
// Dynamic import for TensorFlow to avoid SSR issues
let faceLandmarksDetection = null
if (typeof window !== 'undefined') {
  import('@tensorflow-models/face-landmarks-detection').then(module => {
    faceLandmarksDetection = module
  })
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function WasteMeter() {
  const { sessionId } = useAppStore()
  const [wastedTime, setWastedTime] = useState(0) // in seconds
  const [isWasting, setIsWasting] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [cameraPermission, setCameraPermission] = useState('prompt') // 'prompt', 'granted', 'denied'
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const intervalRef = useRef(null)
  const detectionIntervalRef = useRef(null)
  const lastFaceDetectedRef = useRef(Date.now())
  const isDetectingRef = useRef(false)
  const lastSavedTimeRef = useRef(0)
  const isWastingRef = useRef(false) // Keep ref in sync with state
  const modelRef = useRef(null)
  const lastEyePositionRef = useRef(null)
  const eyeMovementCountRef = useRef(0)

  useEffect(() => {
    // Load face detection model
    loadFaceModel()

    // Request camera permission and start detection
    requestCameraAccess()

    // Always set up activity detection as backup/primary method
    const cleanupActivity = startActivityDetection()

    return () => {
      stopDetection()
      stopTimer()
      if (cleanupActivity) cleanupActivity()
    }
  }, [])

  const loadFaceModel = async () => {
    if (typeof window === 'undefined') return
    
    try {
      // Dynamically import TensorFlow modules
      const tf = await import('@tensorflow/tfjs')
      await tf.ready()
      
      const faceDetectionModule = await import('@tensorflow-models/face-landmarks-detection')
      faceLandmarksDetection = faceDetectionModule
      
      const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh
      const detectorConfig = {
        runtime: 'mediapipe',
        solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh',
        refineLandmarks: true,
      }
      
      const detector = await faceLandmarksDetection.createDetector(model, detectorConfig)
      modelRef.current = detector
      console.log('Face detection model loaded - Eye tracking enabled')
    } catch (error) {
      console.error('Error loading face detection model:', error)
      console.log('Falling back to motion detection')
      // Continue without eye tracking - will use fallback methods
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
      console.error('Camera access denied:', error)
      setCameraPermission('denied')
      setIsActive(false)
      // Activity detection is already running from useEffect
    }
  }

  const startDetection = () => {
    if (isDetectingRef.current) return
    isDetectingRef.current = true

    detectionIntervalRef.current = setInterval(() => {
      detectAttention()
    }, 500) // Check every 500ms for better eye tracking responsiveness
  }

  const detectAttention = async () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    // Set canvas size to match video
    if (video.videoWidth > 0 && video.videoHeight > 0) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
    } else {
      checkIfWasting()
      return
    }

    // Draw video frame to canvas
    try {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    } catch (error) {
      checkIfWasting()
      return
    }

    // Try eye tracking first if model is loaded
    if (modelRef.current && faceLandmarksDetection) {
      try {
        const faces = await modelRef.current.estimateFaces(video, {
          flipHorizontal: false,
          staticImageMode: false,
        })

        if (faces && faces.length > 0) {
          const face = faces[0]
          const keypoints = face.keypoints

          // Find eye landmarks (MediaPipe face mesh indices)
          // Left eye: 33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246
          // Right eye: 362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398
          
          const leftEyeIndices = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246]
          const rightEyeIndices = [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398]

          // Get eye center positions
          const leftEyeCenter = getEyeCenter(keypoints, leftEyeIndices)
          const rightEyeCenter = getEyeCenter(keypoints, rightEyeIndices)

          if (leftEyeCenter && rightEyeCenter) {
            const currentEyePosition = {
              left: leftEyeCenter,
              right: rightEyeCenter,
              timestamp: Date.now(),
            }

            // Always update timestamp when eyes are detected (user is present)
            const now = Date.now()
            lastFaceDetectedRef.current = now

            // Check for eye movement
            if (lastEyePositionRef.current) {
              const movement = calculateEyeMovement(
                lastEyePositionRef.current,
                currentEyePosition
              )

              // Eye movement detected - user is actively looking around (paying attention)
              if (movement > 3) { // Lower threshold for better detection
                eyeMovementCountRef.current += 1
                
                // Eye movement = user is paying attention
                if (isWastingRef.current) {
                  setIsWasting(false)
                  stopTimer()
                }
              } else {
                // Eyes relatively still - might be reading or focused on screen
                // Still consider as active if eyes are detected (user is present)
                if (isWastingRef.current) {
                  setIsWasting(false)
                  stopTimer()
                }
              }
            } else {
              // First detection - eyes found, user is present
              if (isWastingRef.current) {
                setIsWasting(false)
                stopTimer()
              }
            }

            lastEyePositionRef.current = currentEyePosition
            return // Exit early if eye tracking worked
          } else {
            // Eyes not detected - might be looking away
            checkIfWasting()
            return
          }
        }
      } catch (error) {
        console.error('Eye tracking error:', error)
        // Fall through to motion detection
      }
    }

    // Fallback to motion detection if eye tracking not available
    detectMotionFallback(video, canvas, ctx)
  }

  const getEyeCenter = (keypoints, indices) => {
    if (!keypoints || indices.length === 0) return null

    let sumX = 0
    let sumY = 0
    let count = 0

    indices.forEach(index => {
      if (keypoints[index]) {
        sumX += keypoints[index].x
        sumY += keypoints[index].y
        count++
      }
    })

    if (count === 0) return null

    return {
      x: sumX / count,
      y: sumY / count,
    }
  }

  const calculateEyeMovement = (prev, current) => {
    if (!prev || !current) return 0

    const leftEyeMovement = Math.sqrt(
      Math.pow(current.left.x - prev.left.x, 2) +
      Math.pow(current.left.y - prev.left.y, 2)
    )

    const rightEyeMovement = Math.sqrt(
      Math.pow(current.right.x - prev.right.x, 2) +
      Math.pow(current.right.y - prev.right.y, 2)
    )

    return (leftEyeMovement + rightEyeMovement) / 2
  }

  const detectMotionFallback = (video, canvas, ctx) => {
    // Get image data for motion detection
    let imageData
    try {
      imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    } catch (error) {
      checkIfWasting()
      return
    }

    const data = imageData.data

    // Simple motion detection: compare pixel values
    let sum = 0
    let variance = 0
    const sampleSize = Math.min(data.length, 10000)

    for (let i = 0; i < sampleSize; i += 4) {
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3
      sum += brightness
    }

    const avgBrightness = sum / (sampleSize / 4)

    for (let i = 0; i < sampleSize; i += 4) {
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3
      variance += Math.pow(brightness - avgBrightness, 2)
    }

    variance = variance / (sampleSize / 4)

    const isVideoActive = video.readyState === 4 && video.videoWidth > 0 && video.videoHeight > 0
    const hasMotion = variance > 50
    
    if (isVideoActive && hasMotion) {
      const now = Date.now()
      lastFaceDetectedRef.current = now
      
      if (isWastingRef.current) {
        setIsWasting(false)
        stopTimer()
      }
    } else {
      checkIfWasting()
    }
  }

  const checkIfWasting = () => {
    const now = Date.now()
    const idleTime = now - lastFaceDetectedRef.current
    
    // Consider wasting if idle for more than 5 seconds (adjustable threshold)
    const WASTE_THRESHOLD = 5000 // 5 seconds
    
    if (idleTime > WASTE_THRESHOLD) {
      // User is wasting time
      if (!isWastingRef.current) {
        setIsWasting(true)
        startTimer()
      }
    } else {
      // User is active (within threshold)
      if (isWastingRef.current) {
        setIsWasting(false)
        stopTimer()
      }
    }
  }

  const startActivityDetection = () => {
    // Fallback: detect activity through mouse/keyboard events
    let lastActivity = Date.now()
    const IDLE_THRESHOLD = 10000 // 10 seconds

    const updateActivity = () => {
      const now = Date.now()
      lastActivity = now
      lastFaceDetectedRef.current = now // Update face detection time too
      
      // Immediately stop wasting if activity detected (use ref to avoid stale closure)
      if (isWastingRef.current) {
        setIsWasting(false)
        stopTimer()
      }
    }

    const checkIdle = () => {
      const idleTime = Date.now() - lastActivity
      if (idleTime > IDLE_THRESHOLD) {
        if (!isWastingRef.current) {
          setIsWasting(true)
          startTimer()
        }
      } else {
        if (isWastingRef.current) {
          setIsWasting(false)
          stopTimer()
        }
      }
    }

    // Listen to user activity
    window.addEventListener('mousemove', updateActivity, { passive: true })
    window.addEventListener('keydown', updateActivity, { passive: true })
    window.addEventListener('click', updateActivity, { passive: true })
    window.addEventListener('scroll', updateActivity, { passive: true })
    window.addEventListener('touchstart', updateActivity, { passive: true })

    // Check for idle periodically
    const idleCheckInterval = setInterval(checkIdle, 1000)

    return () => {
      window.removeEventListener('mousemove', updateActivity)
      window.removeEventListener('keydown', updateActivity)
      window.removeEventListener('click', updateActivity)
      window.removeEventListener('scroll', updateActivity)
      window.removeEventListener('touchstart', updateActivity)
      clearInterval(idleCheckInterval)
    }
  }

  const startTimer = () => {
    if (intervalRef.current) return
    
    isWastingRef.current = true
    intervalRef.current = setInterval(() => {
      setWastedTime(prev => {
        const newTime = prev + 1
        // Save to database every 10 seconds
        if (newTime - lastSavedTimeRef.current >= 10) {
          saveWastedTime(newTime)
          lastSavedTimeRef.current = newTime
        }
        return newTime
      })
    }, 1000)
  }

  const saveWastedTime = async (time) => {
    if (!sessionId) return
    
    try {
      await fetch(`${API_URL}/api/save-wasted-time`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          wastedTime: time,
        }),
      })
    } catch (error) {
      console.error('Error saving wasted time:', error)
    }
  }

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    isWastingRef.current = false
  }

  const stopDetection = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current)
      detectionIntervalRef.current = null
    }
    isDetectingRef.current = false

    // Stop camera stream
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks()
      tracks.forEach(track => track.stop())
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const getCurrentTime = () => {
    const now = new Date()
    return now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: false 
    })
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-lg shadow-2xl border-2 border-gray-200 p-4 min-w-[200px]"
      >
        {/* Clock */}
        <div className="text-center mb-3 pb-3 border-b border-gray-200">
          <div className="text-xs text-gray-500 mb-1">Current Time</div>
          <div className="text-lg font-mono font-bold text-gray-800">
            {getCurrentTime()}
          </div>
        </div>

        {/* Waste Meter */}
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-1">Wasted Time</div>
          <AnimatePresence mode="wait">
            {isWasting ? (
              <motion.div
                key="wasting"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="text-2xl font-mono font-bold text-red-600 mb-2"
              >
                {formatTime(wastedTime)}
              </motion.div>
            ) : (
              <motion.div
                key="not-wasting"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="text-2xl font-mono font-bold text-green-600 mb-2"
              >
                {formatTime(wastedTime)}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Status Indicator */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isWasting ? 'bg-red-500 animate-pulse' : 'bg-green-500'
              }`}
            />
            <span className="text-xs font-semibold text-gray-600">
              {isWasting ? 'Not Focused' : 'Focused'}
            </span>
          </div>

          {/* Camera Status */}
          <div className="text-xs text-gray-400 mt-2">
            {cameraPermission === 'granted' ? (
              <span className="text-green-600">📹 Camera Active</span>
            ) : cameraPermission === 'denied' ? (
              <span className="text-gray-500">📹 Using Activity Detection</span>
            ) : (
              <span className="text-yellow-600">📹 Requesting Access...</span>
            )}
          </div>
        </div>

        {/* Hidden video and canvas for detection */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="hidden"
        />
        <canvas ref={canvasRef} className="hidden" />
      </motion.div>
    </div>
  )
}

