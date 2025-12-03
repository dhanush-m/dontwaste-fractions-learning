'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useEnhancedStore } from '@/store/enhancedAppStore'

export default function NameInput({ onComplete }) {
  const { setStudent } = useEnhancedStore()
  const [name, setName] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return

    // Set student profile with default values
    setStudent({
      name: name.trim(),
      grade: 5,
      avatar: '👨‍🎓'
    })

    // Proceed to pre-assessment
    onComplete?.()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="text-7xl mb-6"
        >
          👋
        </motion.div>

        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Welcome to DontWaste Education!
        </h1>
        <p className="text-gray-600 mb-8">
          Let&apos;s get to know you! What&apos;s your first name?
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your first name"
            autoFocus
            className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-center"
            maxLength={20}
          />

          <motion.button
            type="submit"
            disabled={!name.trim()}
            whileHover={{ scale: name.trim() ? 1.05 : 1 }}
            whileTap={{ scale: name.trim() ? 0.95 : 1 }}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-colors ${
              name.trim()
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Continue →
          </motion.button>
        </form>

        <p className="text-sm text-gray-400 mt-6">
          We&apos;ll use this to personalize your learning experience
        </p>
      </motion.div>
    </div>
  )
}
