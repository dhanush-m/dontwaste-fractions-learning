'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'

export default function ChocolateBarActivity({ onComplete }) {
  const [selectedPieces, setSelectedPieces] = useState([])
  const [totalPieces] = useState(12) // A chocolate bar with 12 pieces
  const [targetFraction] = useState({ numerator: 3, denominator: 4 }) // 3/4 = 9 pieces out of 12
  const [isComplete, setIsComplete] = useState(false)
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    // Check if correct fraction is selected
    const selectedCount = selectedPieces.length
    const targetCount = Math.round((targetFraction.numerator / targetFraction.denominator) * totalPieces)
    
    if (selectedCount === targetCount && selectedCount > 0) {
      setIsComplete(true)
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 }
      })
      if (onComplete) {
        setTimeout(() => onComplete(), 1500)
      }
    } else {
      setIsComplete(false)
    }
  }, [selectedPieces, targetFraction, totalPieces, onComplete])

  const togglePiece = (index) => {
    if (isComplete) return
    
    setSelectedPieces(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index)
      } else {
        return [...prev, index]
      }
    })
  }

  const piecesPerRow = 4
  const rows = Math.ceil(totalPieces / piecesPerRow)

  return (
    <div className="w-full">
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-6 border-2 border-amber-200">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            🍫 Share a Chocolate Bar Fairly!
          </h3>
          <p className="text-gray-600 mb-4">
            You have a chocolate bar with <strong>{totalPieces} pieces</strong>. 
            Click on the pieces to select <strong>{targetFraction.numerator}/{targetFraction.denominator}</strong> of the bar.
          </p>
          <div className="bg-white rounded-lg p-4 inline-block shadow-md">
            <p className="text-sm text-gray-600 mb-1">Your Selection:</p>
            <p className="text-3xl font-bold text-amber-700">
              {selectedPieces.length}/{totalPieces}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Target: {Math.round((targetFraction.numerator / targetFraction.denominator) * totalPieces)} pieces
            </p>
          </div>
        </div>

        {/* Chocolate Bar Grid */}
        <div className="flex flex-col items-center gap-2 mb-6">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex gap-2">
              {Array.from({ length: piecesPerRow }).map((_, colIndex) => {
                const pieceIndex = rowIndex * piecesPerRow + colIndex
                if (pieceIndex >= totalPieces) return null
                
                const isSelected = selectedPieces.includes(pieceIndex)
                
                return (
                  <motion.button
                    key={pieceIndex}
                    onClick={() => togglePiece(pieceIndex)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isComplete}
                    className={`
                      w-16 h-16 rounded-lg border-2 transition-all
                      ${isSelected 
                        ? 'bg-amber-600 border-amber-800 shadow-lg' 
                        : 'bg-amber-200 border-amber-400 hover:bg-amber-300'
                      }
                      ${isComplete ? 'cursor-default' : 'cursor-pointer'}
                    `}
                  >
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-2xl"
                      >
                        ✓
                      </motion.div>
                    )}
                  </motion.button>
                )
              })}
            </div>
          ))}
        </div>

        {/* Visual Fraction Representation */}
        <div className="bg-white rounded-lg p-4 mb-4">
          <p className="text-center text-sm text-gray-600 mb-2">
            Visual Representation:
          </p>
          <div className="flex justify-center items-center gap-2">
            <div className="flex gap-1">
              {Array.from({ length: totalPieces }).map((_, i) => (
                <div
                  key={i}
                  className={`w-6 h-6 rounded ${
                    selectedPieces.includes(i)
                      ? 'bg-amber-600'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-xl font-bold text-gray-700 mx-2">=</span>
            <span className="text-2xl font-bold text-amber-700">
              {selectedPieces.length}/{totalPieces}
            </span>
          </div>
        </div>

        {/* Feedback */}
        {isComplete && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-green-100 border-l-4 border-green-500 p-4 rounded mb-4"
          >
            <p className="text-green-800 font-semibold text-center">
              🎉 Perfect! You selected {selectedPieces.length} pieces, which is {targetFraction.numerator}/{targetFraction.denominator} of the chocolate bar!
            </p>
            <p className="text-green-700 text-sm text-center mt-2">
              This means if you share it with 4 friends, each person gets {Math.round(selectedPieces.length / 4)} pieces!
            </p>
          </motion.div>
        )}

        {!isComplete && selectedPieces.length > 0 && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded mb-4">
            <p className="text-blue-800 text-sm text-center">
              {selectedPieces.length < Math.round((targetFraction.numerator / targetFraction.denominator) * totalPieces)
                ? `Keep going! You need ${Math.round((targetFraction.numerator / targetFraction.denominator) * totalPieces) - selectedPieces.length} more piece(s).`
                : `Almost there! You have ${selectedPieces.length - Math.round((targetFraction.numerator / targetFraction.denominator) * totalPieces)} extra piece(s). Click to deselect.`
              }
            </p>
          </div>
        )}

        {/* Hint */}
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mb-4"
          >
            <p className="text-yellow-800 text-sm">
              <strong>💡 Hint:</strong> {targetFraction.numerator}/{targetFraction.denominator} means {targetFraction.numerator} out of every {targetFraction.denominator} pieces. 
              Since you have {totalPieces} pieces total, you need to select {Math.round((targetFraction.numerator / targetFraction.denominator) * totalPieces)} pieces.
            </p>
          </motion.div>
        )}

        <div className="text-center">
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-blue-600 hover:text-blue-800 underline text-sm"
          >
            {showHint ? 'Hide Hint' : 'Show Hint'}
          </button>
        </div>
      </div>
    </div>
  )
}

