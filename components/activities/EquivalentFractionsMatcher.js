'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEnhancedStore } from '@/store/enhancedAppStore'
import confetti from 'canvas-confetti'

// Generate equivalent fraction sets
const generateEquivalentSets = () => {
  const sets = [
    // Set 1: 1/2 family
    { base: { num: 1, den: 2 }, equivalents: [{ num: 2, den: 4 }, { num: 3, den: 6 }, { num: 4, den: 8 }] },
    // Set 2: 1/3 family
    { base: { num: 1, den: 3 }, equivalents: [{ num: 2, den: 6 }, { num: 3, den: 9 }, { num: 4, den: 12 }] },
    // Set 3: 1/4 family
    { base: { num: 1, den: 4 }, equivalents: [{ num: 2, den: 8 }, { num: 3, den: 12 }, { num: 4, den: 16 }] },
    // Set 4: 2/3 family
    { base: { num: 2, den: 3 }, equivalents: [{ num: 4, den: 6 }, { num: 6, den: 9 }, { num: 8, den: 12 }] },
    // Set 5: 3/4 family
    { base: { num: 3, den: 4 }, equivalents: [{ num: 6, den: 8 }, { num: 9, den: 12 }, { num: 12, den: 16 }] },
  ]
  return sets
}

export default function EquivalentFractionsMatcher({ onComplete, chapterId = 'fractions' }) {
  const { addXP, addBadge, recordAnswer, useHint: trackHintUsage } = useEnhancedStore()
  const [currentSet, setCurrentSet] = useState(0)
  const [sets] = useState(generateEquivalentSets())
  const [selectedCards, setSelectedCards] = useState([])
  const [matchedPairs, setMatchedPairs] = useState([])
  const [cards, setCards] = useState([])
  const [attempts, setAttempts] = useState(0)
  const [correctMatches, setCorrectMatches] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    initializeCards()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSet])

  const initializeCards = () => {
    const set = sets[currentSet]
    const allFractions = [set.base, ...set.equivalents.slice(0, 3)]

    // Shuffle cards
    const shuffled = allFractions
      .map((frac, index) => ({ ...frac, id: index, matched: false }))
      .sort(() => Math.random() - 0.5)

    setCards(shuffled)
    setSelectedCards([])
    setMatchedPairs([])
    setFeedback('')
  }

  const handleCardClick = (card) => {
    if (selectedCards.length >= 2 || card.matched) return

    const newSelected = [...selectedCards, card]
    setSelectedCards(newSelected)

    if (newSelected.length === 2) {
      setAttempts(prev => prev + 1)
      checkMatch(newSelected[0], newSelected[1])
    }
  }

  const checkMatch = (card1, card2) => {
    // Check if fractions are equivalent
    const value1 = card1.num / card1.den
    const value2 = card2.num / card2.den

    if (Math.abs(value1 - value2) < 0.001) {
      // Match!
      setFeedback('Perfect! These fractions are equivalent! 🎉')
      setCorrectMatches(prev => prev + 1)

      const newMatched = [...matchedPairs, card1.id, card2.id]
      setMatchedPairs(newMatched)

      setCards(prev => prev.map(c =>
        c.id === card1.id || c.id === card2.id ? { ...c, matched: true } : c
      ))

      // Record correct answer and award XP
      recordAnswer(true, chapterId, `${card1.num}/${card1.den} = ${card2.num}/${card2.den}`)
      addXP(10, 'Equivalent Match')

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      })

      setTimeout(() => {
        setSelectedCards([])
        setFeedback('')

        // Check if all matched
        if (newMatched.length === cards.length) {
          handleSetComplete()
        }
      }, 1500)
    } else {
      // No match
      setFeedback('Not quite! These fractions aren&apos;t equivalent. Try again!')

      // Record wrong answer
      recordAnswer(false, chapterId, `${card1.num}/${card1.den} ≠ ${card2.num}/${card2.den}`)

      setTimeout(() => {
        setSelectedCards([])
        setFeedback('')
      }, 1500)
    }
  }

  const handleSetComplete = () => {
    if (currentSet < sets.length - 1) {
      setTimeout(() => {
        setCurrentSet(prev => prev + 1)
      }, 2000)
    } else {
      // All sets complete!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })

      if (correctMatches >= 8) {
        addBadge({
          name: 'Equivalent Expert',
          type: 'equivalence',
          icon: '🎯'
        })
      }

      setTimeout(() => {
        onComplete?.()
      }, 2000)
    }
  }

  const getAccuracy = () => {
    return attempts > 0 ? Math.round((correctMatches / attempts) * 100) : 100
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-xl p-6 mb-6"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Equivalent Fractions Matcher
          </h1>
          <p className="text-gray-600 mb-4">
            Match fractions that have the same value! For example, 1/2 = 2/4 = 3/6
          </p>

          {/* Progress */}
          <div className="flex items-center justify-between text-sm">
            <div>
              <span className="font-semibold">Set {currentSet + 1}</span> of {sets.length}
            </div>
            <div>
              <span className="font-semibold">Accuracy:</span> {getAccuracy()}%
            </div>
            <div>
              <span className="font-semibold">Matches:</span> {correctMatches}
            </div>
          </div>
        </motion.div>

        {/* Hint Button */}
        <div className="text-center mb-4">
          <button
            onClick={() => {
              if (!showHint) {
                trackHintUsage('equivalent-matcher', 1)
              }
              setShowHint(!showHint)
            }}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg"
          >
            {showHint ? 'Hide Hint' : 'Need Help?'}
          </button>
        </div>

        {/* Hint */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-6"
            >
              <p className="text-blue-800 font-semibold mb-2">💡 Hint:</p>
              <p className="text-blue-700">
                Equivalent fractions have the same value. To check: multiply or divide both the numerator and denominator by the same number.
                For example: 1/2 = 2/4 because 1×2 = 2 and 2×2 = 4
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feedback */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`text-center p-4 rounded-lg mb-6 ${
                feedback.includes('Perfect')
                  ? 'bg-green-100 text-green-800'
                  : 'bg-orange-100 text-orange-800'
              }`}
            >
              <p className="text-lg font-bold">{feedback}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cards.map((card) => (
            <motion.div
              key={card.id}
              whileHover={{ scale: card.matched ? 1 : 1.05 }}
              whileTap={{ scale: card.matched ? 1 : 0.95 }}
              onClick={() => handleCardClick(card)}
              className={`aspect-square rounded-xl shadow-lg cursor-pointer transition-all ${
                card.matched
                  ? 'bg-green-200 border-4 border-green-500'
                  : selectedCards.find(c => c.id === card.id)
                  ? 'bg-blue-200 border-4 border-blue-500'
                  : 'bg-white hover:bg-gray-50 border-2 border-gray-300'
              }`}
            >
              <div className="h-full flex flex-col items-center justify-center p-4">
                {!card.matched ? (
                  <>
                    <div className="text-4xl md:text-5xl font-bold text-gray-800">
                      {card.num}
                    </div>
                    <div className="w-full h-1 bg-gray-800 my-2"></div>
                    <div className="text-4xl md:text-5xl font-bold text-gray-800">
                      {card.den}
                    </div>
                  </>
                ) : (
                  <div className="text-6xl">✓</div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 text-center"
        >
          <p className="text-gray-700">
            Click two cards to match equivalent fractions. Selected: {selectedCards.length}/2
          </p>
        </motion.div>
      </div>
    </div>
  )
}
