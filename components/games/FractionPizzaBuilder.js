'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDrag, useDrop } from 'react-dnd'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import confetti from 'canvas-confetti'
import { useAppStore } from '@/store/appStore'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

// Pizza topping types
const TOPPINGS = [
  { id: 'cheese', name: 'Cheese', color: '#FFD700', emoji: '🧀' },
  { id: 'pepperoni', name: 'Pepperoni', color: '#DC143C', emoji: '🍕' },
  { id: 'mushroom', name: 'Mushroom', color: '#8B4513', emoji: '🍄' },
  { id: 'pepper', name: 'Pepper', color: '#FF6347', emoji: '🫑' },
  { id: 'olive', name: 'Olive', color: '#2F4F2F', emoji: '🫒' },
]

function ToppingItem({ topping, onDragStart }) {
  const [{ isDragging }, drag] = useDrag({
    type: 'topping',
    item: { id: topping.id, name: topping.name, color: topping.color },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  return (
    <div
      ref={drag}
      className={`p-3 rounded-lg cursor-move transition-all ${
        isDragging ? 'opacity-50 scale-95' : 'hover:scale-105'
      }`}
      style={{ backgroundColor: topping.color + '40' }}
    >
      <div className="text-3xl mb-1">{topping.emoji}</div>
      <div className="text-xs font-semibold text-gray-700">{topping.name}</div>
    </div>
  )
}

function PizzaSlice({ sliceIndex, totalSlices, toppings, onDrop }) {
  const [{ isOver }, drop] = useDrop({
    accept: 'topping',
    drop: (item) => {
      onDrop(sliceIndex, item)
      return { name: `slice-${sliceIndex}` }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  })

  const sliceAngle = 360 / totalSlices
  const rotation = sliceIndex * sliceAngle

  return (
    <div
      ref={drop}
      className={`absolute w-full h-full transition-all ${
        isOver ? 'scale-110 z-10' : ''
      }`}
      style={{
        transform: `rotate(${rotation}deg)`,
        clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos(0)}% ${50 + 50 * Math.sin(0)}%, ${50 + 50 * Math.cos((sliceAngle * Math.PI) / 180)}% ${50 + 50 * Math.sin((sliceAngle * Math.PI) / 180)}%)`,
      }}
    >
      <div
        className="w-full h-full rounded-full border-2 border-gray-300"
        style={{
          backgroundColor: toppings[sliceIndex]?.color + '80' || '#F3F4F6',
        }}
      >
        {toppings[sliceIndex] && (
          <div className="flex items-center justify-center h-full text-2xl">
            {toppings[sliceIndex].emoji}
          </div>
        )}
      </div>
    </div>
  )
}

export default function FractionPizzaBuilder({ onComplete }) {
  const { sessionId, addPoints, addBadge } = useAppStore()
  const [pizzaOrder, setPizzaOrder] = useState(null)
  const [slices, setSlices] = useState(8)
  const [toppings, setToppings] = useState({})
  const [score, setScore] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    loadPizzaOrder()
  }, [])

  const loadPizzaOrder = async () => {
    try {
      const response = await fetch(`${API_URL}/api/games/pizza-builder/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      })
      const data = await response.json()
      if (data.success) {
        setPizzaOrder(data.order)
        setSlices(data.slices || 8)
      } else {
        // Fallback order
        setPizzaOrder({
          instruction: 'Add 3/8 cheese and 2/8 pepperoni to the pizza',
          targetFractions: { cheese: 3, pepperoni: 2 },
          totalSlices: 8,
        })
        setSlices(8)
      }
    } catch (error) {
      console.error('Error loading pizza order:', error)
      // Fallback
      setPizzaOrder({
        instruction: 'Add 3/8 cheese and 2/8 pepperoni to the pizza',
        targetFractions: { cheese: 3, pepperoni: 2 },
        totalSlices: 8,
      })
      setSlices(8)
    }
  }

  const handleDrop = (sliceIndex, topping) => {
    setToppings((prev) => ({
      ...prev,
      [sliceIndex]: topping,
    }))
  }

  const calculateFractions = () => {
    const counts = {}
    Object.values(toppings).forEach((topping) => {
      counts[topping.id] = (counts[topping.id] || 0) + 1
    })

    const fractions = {}
    Object.keys(counts).forEach((toppingId) => {
      fractions[toppingId] = {
        numerator: counts[toppingId],
        denominator: slices,
        fraction: `${counts[toppingId]}/${slices}`,
      }
    })

    return fractions
  }

  const checkOrder = () => {
    const currentFractions = calculateFractions()
    const targetFractions = pizzaOrder?.targetFractions || {}

    let correct = true
    const feedbackMessages = []

    Object.keys(targetFractions).forEach((toppingId) => {
      const target = targetFractions[toppingId]
      const current = currentFractions[toppingId]?.numerator || 0

      if (current !== target) {
        correct = false
        feedbackMessages.push(
          `You need ${target}/${slices} ${toppingId}, but you have ${current}/${slices}`
        )
      }
    })

    if (correct) {
      const pointsEarned = 50
      setScore(score + pointsEarned)
      addPoints(pointsEarned)
      addBadge({ name: 'Pizza Master', type: 'gold' })
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
      setFeedback('🎉 Perfect! You built the pizza correctly!')
      setShowFeedback(true)

      // Save game state
      fetch(`${API_URL}/api/games/save-game-state`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          gameType: 'pizza-builder',
          score: pointsEarned,
          completed: true,
        }),
      }).catch(console.error)

      setTimeout(() => {
        if (onComplete) onComplete()
      }, 2000)
    } else {
      setFeedback(feedbackMessages.join('\n'))
      setShowFeedback(true)
    }
  }

  const currentFractions = calculateFractions()

  if (!pizzaOrder) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            🍕 Fraction Pizza Builder
          </h2>
          <p className="text-gray-600 mb-6">
            Build a pizza by dragging toppings to represent fractions!
          </p>

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-lg mb-2">Your Order:</h3>
            <p className="text-gray-700">{pizzaOrder.instruction}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Pizza Canvas */}
            <div className="flex flex-col items-center">
              <h3 className="font-semibold mb-4">Your Pizza</h3>
              <div className="relative w-64 h-64 mb-4">
                {Array.from({ length: slices }).map((_, i) => (
                  <PizzaSlice
                    key={i}
                    sliceIndex={i}
                    totalSlices={slices}
                    toppings={toppings}
                    onDrop={handleDrop}
                  />
                ))}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 bg-yellow-200 rounded-full border-4 border-yellow-400"></div>
                </div>
              </div>

              {/* Current Fractions */}
              <div className="w-full bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Current Fractions:</h4>
                {Object.keys(currentFractions).length > 0 ? (
                  <div className="space-y-1">
                    {Object.entries(currentFractions).map(([id, frac]) => (
                      <div key={id} className="text-sm">
                        <span className="font-semibold">{id}:</span>{' '}
                        {frac.fraction}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Drag toppings to slices</p>
                )}
              </div>
            </div>

            {/* Toppings Panel */}
            <div>
              <h3 className="font-semibold mb-4">Available Toppings</h3>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {TOPPINGS.map((topping) => (
                  <ToppingItem key={topping.id} topping={topping} />
                ))}
              </div>

              <button
                onClick={checkOrder}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Check Order ✓
              </button>

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">Score: {score} points</p>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`p-4 rounded-lg ${
                  feedback.includes('🎉')
                    ? 'bg-green-100 border-l-4 border-green-500'
                    : 'bg-yellow-100 border-l-4 border-yellow-500'
                }`}
              >
                <p className={feedback.includes('🎉') ? 'text-green-800' : 'text-yellow-800'}>
                  {feedback}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </DndProvider>
  )
}

