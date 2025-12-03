'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'

const ACTIVITY_TYPES = {
  pizza: {
    title: '🍕 Pizza Party!',
    description: 'Select slices to represent the fraction',
    items: 8,
    itemLabel: 'slices',
    color: 'orange',
  },
  cookies: {
    title: '🍪 Cookie Jar!',
    description: 'Pick cookies to show the fraction',
    items: 12,
    itemLabel: 'cookies',
    color: 'amber',
  },
  books: {
    title: '📚 Bookshelf!',
    description: 'Choose books to represent the fraction',
    items: 10,
    itemLabel: 'books',
    color: 'blue',
  },
  balloons: {
    title: '🎈 Balloon Bundle!',
    description: 'Select balloons for the fraction',
    items: 6,
    itemLabel: 'balloons',
    color: 'red',
  },
}

export default function VisualFractionActivity({ 
  question, 
  correctAnswer, 
  onAnswer, 
  hint 
}) {
  const [selectedItems, setSelectedItems] = useState([])
  const [showFeedback, setShowFeedback] = useState(false)
  
  // Parse the question to determine activity type and target fraction
  const parseQuestion = () => {
    // Extract fraction from question (e.g., "3/4" or "three fourths")
    const fractionMatch = question.match(/(\d+)\/(\d+)/) || 
                         question.match(/shade\s+(\d+)\/(\d+)/i) ||
                         correctAnswer.match(/(\d+)\/(\d+)/)
    
    if (fractionMatch) {
      const numerator = parseInt(fractionMatch[1])
      const denominator = parseInt(fractionMatch[2])
      
      // Determine activity type from question context
      let activityType = 'pizza'
      if (question.toLowerCase().includes('cookie')) activityType = 'cookies'
      else if (question.toLowerCase().includes('book')) activityType = 'books'
      else if (question.toLowerCase().includes('balloon')) activityType = 'balloons'
      
      const activity = ACTIVITY_TYPES[activityType]
      const totalItems = activity.items
      const targetCount = Math.round((numerator / denominator) * totalItems)
      
      return {
        activityType,
        activity,
        numerator,
        denominator,
        targetCount,
        totalItems,
      }
    }
    
    // Fallback
    return {
      activityType: 'pizza',
      activity: ACTIVITY_TYPES.pizza,
      numerator: 3,
      denominator: 4,
      targetCount: 6,
      totalItems: 8,
    }
  }

  const { activityType, activity, numerator, denominator, targetCount, totalItems } = parseQuestion()
  const itemsPerRow = Math.ceil(Math.sqrt(totalItems))
  const rows = Math.ceil(totalItems / itemsPerRow)

  const toggleItem = (index) => {
    if (showFeedback) return
    
    setSelectedItems(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index)
      } else {
        return [...prev, index]
      }
    })
  }

  const handleSubmit = () => {
    const userAnswer = `${selectedItems.length}/${totalItems}`
    // Check if the fraction matches (can be equivalent fractions)
    const userFraction = selectedItems.length / totalItems
    const targetFraction = numerator / denominator
    const isCorrect = Math.abs(userFraction - targetFraction) < 0.01 || selectedItems.length === targetCount
    
    setShowFeedback(true)
    
    if (isCorrect) {
      confetti({
        particleCount: 30,
        spread: 70,
        origin: { y: 0.6 }
      })
    }
    
    setTimeout(() => {
      // Pass the answer in the format expected (could be simplified)
      const simplifiedAnswer = `${numerator}/${denominator}`
      onAnswer(simplifiedAnswer, isCorrect)
    }, 1500)
  }

  const getItemEmoji = () => {
    const emojis = {
      pizza: '🍕',
      cookies: '🍪',
      books: '📚',
      balloons: '🎈',
    }
    return emojis[activityType] || '🍕'
  }

  const getColorClasses = () => {
    const colors = {
      orange: {
        selected: 'bg-orange-600 border-orange-800',
        unselected: 'bg-orange-200 border-orange-400 hover:bg-orange-300',
      },
      amber: {
        selected: 'bg-amber-600 border-amber-800',
        unselected: 'bg-amber-200 border-amber-400 hover:bg-amber-300',
      },
      blue: {
        selected: 'bg-blue-600 border-blue-800',
        unselected: 'bg-blue-200 border-blue-400 hover:bg-blue-300',
      },
      red: {
        selected: 'bg-red-600 border-red-800',
        unselected: 'bg-red-200 border-red-400 hover:bg-red-300',
      },
    }
    return colors[activity.color] || colors.orange
  }

  const colorClasses = getColorClasses()

  return (
    <div className="w-full">
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border-2 border-blue-200">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {activity.title}
          </h3>
          <p className="text-gray-600 mb-4">
            {activity.description}
          </p>
          <div className="bg-white rounded-lg p-4 inline-block shadow-md">
            <p className="text-sm text-gray-600 mb-1">Your Selection:</p>
            <p className="text-3xl font-bold text-blue-700">
              {selectedItems.length}/{totalItems}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Target: {numerator}/{denominator} = {targetCount} {activity.itemLabel}
            </p>
          </div>
        </div>

        {/* Visual Grid */}
        <div className="flex flex-col items-center gap-2 mb-6">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex gap-2">
              {Array.from({ length: itemsPerRow }).map((_, colIndex) => {
                const itemIndex = rowIndex * itemsPerRow + colIndex
                if (itemIndex >= totalItems) return null
                
                const isSelected = selectedItems.includes(itemIndex)
                
                return (
                  <motion.button
                    key={itemIndex}
                    onClick={() => toggleItem(itemIndex)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={showFeedback}
                    className={`
                      w-16 h-16 rounded-lg border-2 transition-all text-2xl
                      ${isSelected 
                        ? `${colorClasses.selected} text-white shadow-lg` 
                        : `${colorClasses.unselected}`
                      }
                      ${showFeedback ? 'cursor-default' : 'cursor-pointer'}
                    `}
                  >
                    {isSelected ? '✓' : getItemEmoji()}
                  </motion.button>
                )
              })}
            </div>
          ))}
        </div>

        {/* Visual Fraction Bar */}
        <div className="bg-white rounded-lg p-4 mb-4">
          <p className="text-center text-sm text-gray-600 mb-2">
            Visual Fraction:
          </p>
          <div className="flex justify-center items-center gap-2">
            <div className="flex gap-1">
              {Array.from({ length: totalItems }).map((_, i) => (
                <div
                  key={i}
                  className={`w-6 h-6 rounded ${
                    selectedItems.includes(i)
                      ? colorClasses.selected.split(' ')[0]
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-xl font-bold text-gray-700 mx-2">=</span>
            <span className="text-2xl font-bold text-blue-700">
              {selectedItems.length}/{totalItems}
            </span>
          </div>
        </div>

        {/* Feedback */}
        {showFeedback && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`border-l-4 p-4 rounded mb-4 ${
              selectedItems.length === targetCount
                ? 'bg-green-100 border-green-500'
                : 'bg-red-100 border-red-500'
            }`}
          >
            <p className={`font-semibold text-center ${
              selectedItems.length === targetCount ? 'text-green-800' : 'text-red-800'
            }`}>
              {selectedItems.length === targetCount ? (
                <>🎉 Perfect! You selected {selectedItems.length} {activity.itemLabel}, which is {numerator}/{denominator}!</>
              ) : (
                <>Not quite! You selected {selectedItems.length}, but you need {targetCount} {activity.itemLabel} for {numerator}/{denominator}.</>
              )}
            </p>
          </motion.div>
        )}

        {/* Progress Indicator */}
        {!showFeedback && selectedItems.length > 0 && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded mb-4">
            <p className="text-blue-800 text-sm text-center">
              {selectedItems.length < targetCount
                ? `Keep going! You need ${targetCount - selectedItems.length} more ${activity.itemLabel}.`
                : selectedItems.length > targetCount
                ? `You have ${selectedItems.length - targetCount} extra ${activity.itemLabel}. Click to deselect.`
                : 'Perfect! Click "Check Answer" to verify.'
              }
            </p>
          </div>
        )}

        {/* Hint */}
        {hint && !showFeedback && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mb-4">
            <p className="text-yellow-800 text-sm">
              <strong>💡 Hint:</strong> {hint}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={selectedItems.length === 0 || showFeedback}
          className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
            selectedItems.length > 0 && !showFeedback
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {showFeedback 
            ? (selectedItems.length === targetCount ? 'Correct! ✓' : 'Try Again')
            : 'Check Answer'
          }
        </button>
      </div>
    </div>
  )
}

