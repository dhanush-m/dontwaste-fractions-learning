'use client'

import { motion } from 'framer-motion'
import { useEffect } from 'react'
import confetti from 'canvas-confetti'

export default function BadgeAnimation({ badge }) {
  useEffect(() => {
    // Trigger confetti when badge appears
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
  }, [])

  const badgeColors = {
    bronze: 'bg-amber-600',
    silver: 'bg-gray-400',
    gold: 'bg-yellow-500'
  }

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, y: 50 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
    >
      <div className={`${badgeColors[badge.type] || 'bg-blue-600'} text-white rounded-lg shadow-2xl p-8 text-center min-w-[300px]`}>
        <motion.div
          animate={{ rotate: [0, 10, -10, 10, 0] }}
          transition={{ duration: 0.5 }}
          className="text-6xl mb-4"
        >
          🏆
        </motion.div>
        <h3 className="text-2xl font-bold mb-2">Badge Earned!</h3>
        <p className="text-xl">{badge.name}</p>
      </div>
    </motion.div>
  )
}

