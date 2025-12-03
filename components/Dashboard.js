'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/appStore'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import jsPDF from 'jspdf'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function Dashboard() {
  const { sessionId, points, badges, timeSpent, performance, reset, setPhase } = useAppStore()
  const [sessionData, setSessionData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSessionData()
  }, [])

  const loadSessionData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/session/${sessionId}`)
      const data = await response.json()
      if (data.success) {
        setSessionData(data)
      }
    } catch (error) {
      console.error('Error loading session data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  const accuracy = performance.length > 0
    ? Math.round((performance.filter(p => p.isCorrect).length / performance.length) * 100)
    : 0

  const chartData = {
    labels: ['Level 1', 'Level 2', 'Assessment'],
    datasets: [
      {
        label: 'Scores',
        data: [
          sessionData?.score?.level_1_score || 0,
          sessionData?.score?.level_2_score || 0,
          sessionData?.score?.assessment_score || 0,
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(147, 51, 234, 0.8)',
          'rgba(16, 185, 129, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(147, 51, 234, 1)',
          'rgba(16, 185, 129, 1)',
        ],
        borderWidth: 2,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Performance Overview',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  }

  const exportToPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(20)
    doc.text('Fractions Learning Report', 20, 20)
    
    doc.setFontSize(12)
    doc.text(`Session ID: ${sessionId}`, 20, 35)
    doc.text(`Total Points: ${points}`, 20, 45)
    doc.text(`Time Spent: ${formatTime(timeSpent)}`, 20, 55)
    doc.text(`Accuracy: ${accuracy}%`, 20, 65)
    doc.text(`Badges Earned: ${badges.length}`, 20, 75)
    
    let yPos = 85
    if (badges.length > 0) {
      doc.text('Badges:', 20, yPos)
      yPos += 10
      badges.forEach((badge, idx) => {
        doc.text(`  ${idx + 1}. ${badge.name} (${badge.type})`, 20, yPos)
        yPos += 7
      })
    }
    
    doc.save(`fractions-report-${sessionId}.pdf`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            Learning Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Your progress and achievements
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="text-3xl font-bold text-blue-600 mb-2">{points}</div>
            <div className="text-gray-600">Total Points</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="text-3xl font-bold text-green-600 mb-2">{accuracy}%</div>
            <div className="text-gray-600">Accuracy</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="text-3xl font-bold text-purple-600 mb-2">{formatTime(timeSpent)}</div>
            <div className="text-gray-600">Time Spent</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="text-3xl font-bold text-yellow-600 mb-2">{badges.length}</div>
            <div className="text-gray-600">Badges Earned</div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Performance Chart</h2>
            <Bar data={chartData} options={chartOptions} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Badges Earned</h2>
            {badges.length > 0 ? (
              <div className="space-y-3">
                {badges.map((badge, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-l-4 border-yellow-500"
                  >
                    <span className="text-4xl">🏆</span>
                    <div>
                      <div className="font-semibold text-gray-800">{badge.name}</div>
                      <div className="text-sm text-gray-600 capitalize">{badge.type} Badge</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No badges earned yet. Keep practicing!</p>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Session Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 mb-2">
                <strong>Questions Answered:</strong> {performance.length}
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Correct Answers:</strong> {performance.filter(p => p.isCorrect).length}
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Incorrect Answers:</strong> {performance.filter(p => !p.isCorrect).length}
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-2">
                <strong>Session ID:</strong> {sessionId}
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Completion Date:</strong> {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={exportToPDF}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Export to PDF
          </button>
          <button
            onClick={() => {
              reset()
              setPhase('landing')
            }}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Start New Session
          </button>
        </div>
      </div>
    </div>
  )
}

