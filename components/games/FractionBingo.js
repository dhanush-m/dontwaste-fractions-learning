'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

export default function FractionBingo({ onComplete, sessionId, difficulty = 'beginner' }) {
  const [bingoCard, setBingoCard] = useState([])
  const [calledFractions, setCalledFractions] = useState([])
  const [currentCall, setCurrentCall] = useState(null)
  const [markedCells, setMarkedCells] = useState(new Set())
  const [bingoCount, setBingoCount] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)
  const [score, setScore] = useState(0)

  const GRID_SIZE = 5

  useEffect(() => {
    initializeBingoCard()
    startCalling()
  }, [])

  const initializeBingoCard = () => {
    const fractions = []
    const usedFractions = new Set()

    // Generate unique fractions for bingo card
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
      let fraction
      do {
        const denominator = difficulty === 'beginner' 
          ? [2, 4, 8][Math.floor(Math.random() * 3)]
          : [3, 4, 5, 6, 8, 12][Math.floor(Math.random() * 6)]
        const numerator = Math.floor(Math.random() * (denominator - 1)) + 1
        fraction = `${numerator}/${denominator}`
      } while (usedFractions.has(fraction))
      
      usedFractions.add(fraction)
      fractions.push({
        id: i,
        fraction,
        marked: false
      })
    }

    setBingoCard(fractions)
  }

  const startCalling = () => {
    const callInterval = setInterval(() => {
      if (gameComplete) {
        clearInterval(callInterval)
        return
      }

      // Generate a new fraction call
      const denominator = difficulty === 'beginner'
        ? [2, 4, 8][Math.floor(Math.random() * 3)]
        : [3, 4, 5, 6, 8, 12][Math.floor(Math.random() * 6)]
      const numerator = Math.floor(Math.random() * (denominator - 1)) + 1
      const calledFraction = `${numerator}/${denominator}`

      setCurrentCall(calledFraction)
      setCalledFractions(prev => [...prev, calledFraction])

      // Auto-mark if equivalent exists
      setTimeout(() => {
        checkAndMarkEquivalents(calledFraction)
      }, 2000)
    }, 5000) // Call every 5 seconds
  }

  const checkAndMarkEquivalents = (calledFraction) => {
    const [num, den] = calledFraction.split('/').map(Number)
    const calledValue = num / den

    const updatedCard = bingoCard.map(cell => {
      const [cellNum, cellDen] = cell.fraction.split('/').map(Number)
      const cellValue = cellNum / cellDen

      if (Math.abs(cellValue - calledValue) < 0.001 && !cell.marked) {
        return { ...cell, marked: true }
      }
      return cell
    })

    setBingoCard(updatedCard)
    checkForBingo(updatedCard)
  }

  const handleCellClick = (cellId) => {
    if (gameComplete) return

    const updatedCard = bingoCard.map(cell => {
      if (cell.id === cellId) {
        return { ...cell, marked: !cell.marked }
      }
      return cell
    })

    setBingoCard(updatedCard)
    checkForBingo(updatedCard)
  }

  const checkForBingo = (card) => {
    const marked = new Set(card.filter(c => c.marked).map(c => c.id))
    
    // Check rows
    for (let row = 0; row < GRID_SIZE; row++) {
      const rowCells = []
      for (let col = 0; col < GRID_SIZE; col++) {
        rowCells.push(row * GRID_SIZE + col)
      }
      if (rowCells.every(id => marked.has(id))) {
        celebrateBingo()
        return
      }
    }

    // Check columns
    for (let col = 0; col < GRID_SIZE; col++) {
      const colCells = []
      for (let row = 0; row < GRID_SIZE; row++) {
        colCells.push(row * GRID_SIZE + col)
      }
      if (colCells.every(id => marked.has(id))) {
        celebrateBingo()
        return
      }
    }

    // Check diagonal (top-left to bottom-right)
    const diag1 = []
    for (let i = 0; i < GRID_SIZE; i++) {
      diag1.push(i * GRID_SIZE + i)
    }
    if (diag1.every(id => marked.has(id))) {
      celebrateBingo()
      return
    }

    // Check diagonal (top-right to bottom-left)
    const diag2 = []
    for (let i = 0; i < GRID_SIZE; i++) {
      diag2.push(i * GRID_SIZE + (GRID_SIZE - 1 - i))
    }
    if (diag2.every(id => marked.has(id))) {
      celebrateBingo()
      return
    }
  }

  const celebrateBingo = () => {
    setBingoCount(prev => prev + 1)
    setScore(prev => prev + 100)
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })

    // Speak bingo
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance('Bingo!')
      window.speechSynthesis.speak(utterance)
    }

    if (bingoCount >= 2) {
      setGameComplete(true)
      if (onComplete) {
        onComplete({ score, bingos: bingoCount + 1 })
      }
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-xl">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">🎯 Fraction Bingo</h2>
        <p className="text-gray-600">Mark fractions as they're called!</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="bg-blue-100 px-4 py-2 rounded-lg">
            <p className="text-sm text-gray-600">Score:</p>
            <p className="text-2xl font-bold text-blue-600">{score}</p>
          </div>
          <div className="bg-green-100 px-4 py-2 rounded-lg">
            <p className="text-sm text-gray-600">Bingos:</p>
            <p className="text-2xl font-bold text-green-600">{bingoCount}</p>
          </div>
        </div>
      </div>

      {currentCall && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-6 bg-yellow-100 border-4 border-yellow-500 rounded-lg p-6 text-center"
        >
          <p className="text-sm text-gray-600 mb-2">Current Call:</p>
          <p className="text-5xl font-bold text-yellow-700">{currentCall}</p>
        </motion.div>
      )}

      <div className="grid grid-cols-5 gap-2 mb-6">
        {bingoCard.map((cell) => (
          <motion.button
            key={cell.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCellClick(cell.id)}
            className={`p-4 rounded-lg border-2 font-bold text-lg transition-all ${
              cell.marked
                ? 'bg-green-500 text-white border-green-600'
                : 'bg-gray-100 text-gray-800 border-gray-300 hover:border-blue-400'
            }`}
          >
            {cell.fraction}
          </motion.button>
        ))}
      </div>

      {gameComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-100 border-l-4 border-green-500 p-4 rounded"
        >
          <p className="text-green-800 font-semibold text-xl">
            🎉 Congratulations! You got {bingoCount} bingos!
          </p>
        </motion.div>
      )}

      <div className="mt-4">
        <p className="text-sm text-gray-600">Called Fractions:</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {calledFractions.slice(-10).map((frac, idx) => (
            <span key={idx} className="px-3 py-1 bg-gray-200 rounded-full text-sm">
              {frac}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

