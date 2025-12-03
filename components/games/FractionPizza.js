'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

export default function FractionPizza({ onComplete, sessionId }) {
  const [pizzaSlices, setPizzaSlices] = useState([])
  const [selectedToppings, setSelectedToppings] = useState([])
  const [targetFraction, setTargetFraction] = useState(null)
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [gameComplete, setGameComplete] = useState(false)
  const [feedback, setFeedback] = useState('')

  // Initialize pizza with slices
  useEffect(() => {
    initializeGame()
  }, [level])

  const initializeGame = () => {
    // Generate target fraction based on level
    const denominators = level === 1 ? [4, 6, 8] : [8, 12, 16]
    const denominator = denominators[Math.floor(Math.random() * denominators.length)]
    const numerator = Math.floor(Math.random() * (denominator - 1)) + 1
    
    setTargetFraction({ numerator, denominator })
    
    // Create pizza slices
    const slices = Array.from({ length: denominator }, (_, i) => ({
      id: i,
      fraction: `1/${denominator}`,
      hasTopping: false,
      toppingType: null
    }))
    
    setPizzaSlices(slices)
    setSelectedToppings([])
    setFeedback('')
  }

  const handleSliceClick = (sliceId) => {
    if (gameComplete) return

    const updatedSlices = [...pizzaSlices]
    const slice = updatedSlices[sliceId]
    
    // Toggle topping
    if (slice.hasTopping) {
      slice.hasTopping = false
      slice.toppingType = null
      setSelectedToppings(prev => prev.filter(id => id !== sliceId))
    } else {
      slice.hasTopping = true
      slice.toppingType = 'cheese' // Default topping
      setSelectedToppings(prev => [...prev, sliceId])
    }
    
    setPizzaSlices(updatedSlices)
    checkCompletion(updatedSlices)
  }

  const checkCompletion = (slices) => {
    const toppedCount = slices.filter(s => s.hasTopping).length
    
    if (toppedCount === targetFraction.numerator) {
      // Correct!
      setGameComplete(true)
      const pointsEarned = level === 1 ? 20 : 30
      setScore(prev => prev + pointsEarned)
      setFeedback(`🎉 Perfect! You've correctly represented ${targetFraction.numerator}/${targetFraction.denominator}!`)
      
      // Celebrate
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
      
      // Save progress
      if (sessionId) {
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/save-progress`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            level,
            questionNumber: 1,
            question: `Build a pizza with ${targetFraction.numerator}/${targetFraction.denominator} toppings`,
            answer: `${toppedCount}/${targetFraction.denominator}`,
            isCorrect: true,
            pointsEarned
          })
        }).catch(console.error)
      }
    } else if (toppedCount > targetFraction.numerator) {
      setFeedback(`Too many slices! You need ${targetFraction.numerator} slices with toppings.`)
    } else {
      setFeedback(`Add ${targetFraction.numerator - toppedCount} more slice(s) to complete the pizza!`)
    }
  }

  const handleNextLevel = () => {
    if (level < 3) {
      setLevel(prev => prev + 1)
      setGameComplete(false)
      initializeGame()
    } else {
      // Game complete
      if (onComplete) {
        onComplete(score)
      }
    }
  }

  const getSliceColor = (hasTopping) => {
    return hasTopping ? '#F59E0B' : '#FDE68A' // Gold for topped, light yellow for plain
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-xl">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">🍕 Fraction Pizza Builder</h2>
        <p className="text-gray-600">Level {level} - Build a pizza with the target fraction!</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="bg-blue-100 px-4 py-2 rounded-lg">
            <p className="text-sm text-gray-600">Target Fraction:</p>
            <p className="text-2xl font-bold text-blue-600">
              {targetFraction?.numerator}/{targetFraction?.denominator}
            </p>
          </div>
          <div className="bg-green-100 px-4 py-2 rounded-lg">
            <p className="text-sm text-gray-600">Score:</p>
            <p className="text-2xl font-bold text-green-600">{score}</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-center text-gray-700 mb-4">
          Click on slices to add toppings. You need {targetFraction?.numerator} out of {targetFraction?.denominator} slices!
        </p>
        
        {/* Pizza Visualization */}
        <div className="flex justify-center mb-6">
          <div className="relative" style={{ width: '300px', height: '300px' }}>
            <svg width="300" height="300" viewBox="0 0 300 300" className="transform rotate-0">
              {pizzaSlices.map((slice, index) => {
                const angle = (360 / pizzaSlices.length)
                const startAngle = (index * angle - 90) * (Math.PI / 180)
                const endAngle = ((index + 1) * angle - 90) * (Math.PI / 180)
                const radius = 120
                const centerX = 150
                const centerY = 150
                
                const x1 = centerX + radius * Math.cos(startAngle)
                const y1 = centerY + radius * Math.sin(startAngle)
                const x2 = centerX + radius * Math.cos(endAngle)
                const y2 = centerY + radius * Math.sin(endAngle)
                
                const largeArc = angle > 180 ? 1 : 0
                
                return (
                  <g key={slice.id}>
                    <path
                      d={`M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`}
                      fill={getSliceColor(slice.hasTopping)}
                      stroke="#92400E"
                      strokeWidth="2"
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => handleSliceClick(slice.id)}
                    />
                    {slice.hasTopping && (
                      <text
                        x={centerX + (radius * 0.6) * Math.cos((startAngle + endAngle) / 2)}
                        y={centerY + (radius * 0.6) * Math.sin((startAngle + endAngle) / 2)}
                        textAnchor="middle"
                        fontSize="20"
                        fill="#92400E"
                        fontWeight="bold"
                      >
                        🧀
                      </text>
                    )}
                  </g>
                )
              })}
            </svg>
          </div>
        </div>

        {/* Current Fraction Display */}
        <div className="text-center mb-4">
          <p className="text-lg text-gray-700">
            Current: <span className="font-bold text-blue-600">
              {selectedToppings.length}/{targetFraction?.denominator}
            </span>
          </p>
        </div>

        {/* Feedback */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`p-4 rounded-lg mb-4 ${
                gameComplete 
                  ? 'bg-green-100 border-l-4 border-green-500' 
                  : 'bg-blue-100 border-l-4 border-blue-500'
              }`}
            >
              <p className={gameComplete ? 'text-green-800 font-semibold' : 'text-blue-800'}>
                {feedback}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={initializeGame}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
          >
            Reset Pizza
          </button>
          {gameComplete && (
            <button
              onClick={handleNextLevel}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
            >
              {level < 3 ? 'Next Level →' : 'Complete Game ✓'}
            </button>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">How to Play:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Click on pizza slices to add toppings (cheese emoji)</li>
          <li>• Click again to remove toppings</li>
          <li>• Match the target fraction to complete the level</li>
          <li>• Complete 3 levels to finish the game!</li>
        </ul>
      </div>
    </div>
  )
}

