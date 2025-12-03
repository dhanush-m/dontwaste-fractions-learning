'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/appStore'
import confetti from 'canvas-confetti'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function FractionWar({ onComplete }) {
  const { sessionId, addPoints, addBadge, performance } = useAppStore()
  const [playerCard, setPlayerCard] = useState(null)
  const [aiCard, setAiCard] = useState(null)
  const [playerDeck, setPlayerDeck] = useState([])
  const [aiDeck, setAiDeck] = useState([])
  const [playerScore, setPlayerScore] = useState(0)
  const [aiScore, setAiScore] = useState(0)
  const [round, setRound] = useState(1)
  const [gameOver, setGameOver] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [resultMessage, setResultMessage] = useState('')

  useEffect(() => {
    initializeGame()
  }, [])

  const initializeGame = async () => {
    try {
      // Determine difficulty based on performance
      const accuracy = performance.length > 0
        ? (performance.filter(p => p.isCorrect).length / performance.length) * 100
        : 50

      const difficulty = accuracy >= 80 ? 'advanced' : accuracy >= 60 ? 'intermediate' : 'basic'

      const response = await fetch(`${API_URL}/api/games/fraction-war/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, difficulty }),
      })

      const data = response.ok ? await response.json() : null

      if (data?.success) {
        setPlayerDeck(data.playerDeck)
        setAiDeck(data.aiDeck)
      } else {
        // Fallback deck generation
        const deck = generateDeck(difficulty)
        const shuffled = shuffleDeck([...deck])
        const mid = Math.floor(shuffled.length / 2)
        setPlayerDeck(shuffled.slice(0, mid))
        setAiDeck(shuffled.slice(mid))
      }
    } catch (error) {
      console.error('Error initializing game:', error)
      // Fallback
      const deck = generateDeck('basic')
      const shuffled = shuffleDeck([...deck])
      const mid = Math.floor(shuffled.length / 2)
      setPlayerDeck(shuffled.slice(0, mid))
      setAiDeck(shuffled.slice(mid))
    }
  }

  const generateDeck = (difficulty) => {
    const deck = []
    
    if (difficulty === 'basic') {
      // Same denominator fractions
      for (let den = 2; den <= 8; den++) {
        for (let num = 1; num < den; num++) {
          deck.push({ numerator: num, denominator: den, value: num / den })
        }
      }
    } else if (difficulty === 'intermediate') {
      // Mixed denominators, easier equivalents
      deck.push(
        { numerator: 1, denominator: 2, value: 0.5 },
        { numerator: 2, denominator: 4, value: 0.5 },
        { numerator: 3, denominator: 6, value: 0.5 },
        { numerator: 1, denominator: 3, value: 1/3 },
        { numerator: 2, denominator: 6, value: 1/3 },
        { numerator: 1, denominator: 4, value: 0.25 },
        { numerator: 2, denominator: 8, value: 0.25 },
        { numerator: 3, denominator: 4, value: 0.75 },
        { numerator: 5, denominator: 8, value: 0.625 },
        { numerator: 7, denominator: 8, value: 0.875 },
      )
    } else {
      // Advanced: different denominators, harder equivalents
      deck.push(
        { numerator: 1, denominator: 2, value: 0.5 },
        { numerator: 3, denominator: 6, value: 0.5 },
        { numerator: 5, denominator: 10, value: 0.5 },
        { numerator: 2, denominator: 3, value: 2/3 },
        { numerator: 4, denominator: 6, value: 2/3 },
        { numerator: 3, denominator: 4, value: 0.75 },
        { numerator: 6, denominator: 8, value: 0.75 },
        { numerator: 5, denominator: 6, value: 5/6 },
        { numerator: 7, denominator: 8, value: 0.875 },
        { numerator: 11, denominator: 12, value: 11/12 },
      )
    }

    return deck
  }

  const shuffleDeck = (deck) => {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[deck[i], deck[j]] = [deck[j], deck[i]]
    }
    return deck
  }

  const flipCard = () => {
    if (playerDeck.length === 0 || aiDeck.length === 0) {
      endGame()
      return
    }

    const newPlayerCard = playerDeck[0]
    const newAiCard = aiDeck[0]

    setPlayerCard(newPlayerCard)
    setAiCard(newAiCard)

    setPlayerDeck(playerDeck.slice(1))
    setAiDeck(aiDeck.slice(1))

    // Compare cards
    setTimeout(() => {
      compareCards(newPlayerCard, newAiCard)
    }, 500)
  }

  const compareCards = (player, ai) => {
    let winner = null
    let message = ''

    if (player.value > ai.value) {
      winner = 'player'
      setPlayerScore(playerScore + 1)
      message = `You win! ${player.numerator}/${player.denominator} > ${ai.numerator}/${ai.denominator}`
    } else if (ai.value > player.value) {
      winner = 'ai'
      setAiScore(aiScore + 1)
      message = `AI wins! ${ai.numerator}/${ai.denominator} > ${player.numerator}/${player.denominator}`
    } else {
      winner = 'tie'
      message = `Tie! Both cards are ${player.numerator}/${player.denominator}`
    }

    setResultMessage(message)
    setShowResult(true)

    if (winner === 'player') {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.6 },
      })
    }

    setRound(round + 1)

    // Check if game over
    if (playerDeck.length === 1 || aiDeck.length === 1) {
      setTimeout(() => {
        endGame()
      }, 2000)
    }
  }

  const endGame = () => {
    setGameOver(true)
    const finalWinner = playerScore > aiScore ? 'player' : aiScore > playerScore ? 'ai' : 'tie'

    if (finalWinner === 'player') {
      const pointsEarned = 100
      addPoints(pointsEarned)
      addBadge({ name: 'Fraction Warrior', type: 'gold' })
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
      })
    }

    // Save game state
    fetch(`${API_URL}/api/games/save-game-state`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        gameType: 'fraction-war',
        score: playerScore,
        completed: true,
      }),
    }).catch(console.error)
  }

  const resetGame = () => {
    setPlayerCard(null)
    setAiCard(null)
    setPlayerScore(0)
    setAiScore(0)
    setRound(1)
    setGameOver(false)
    setShowResult(false)
    initializeGame()
  }

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-2">⚔️ Fraction War</h2>
        <p className="text-gray-600 mb-6">
          Flip cards and compare fractions. The larger fraction wins!
        </p>

        {gameOver ? (
          <div className="text-center py-8">
            <h3 className="text-2xl font-bold mb-4">Game Over!</h3>
            <div className="text-4xl mb-4">
              {playerScore > aiScore ? '🎉 You Win!' : aiScore > playerScore ? '😔 AI Wins' : '🤝 Tie Game'}
            </div>
            <div className="text-xl mb-6">
              Final Score: You {playerScore} - AI {aiScore}
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={resetGame}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg"
              >
                Play Again
              </button>
              {onComplete && (
                <button
                  onClick={onComplete}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg"
                >
                  Continue
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">You</div>
                <div className="text-4xl font-bold">{playerScore}</div>
                <div className="text-sm text-gray-500">{playerDeck.length} cards left</div>
              </div>
              <div className="text-center">
                <div className="text-lg text-gray-600">Round {round}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">AI</div>
                <div className="text-4xl font-bold">{aiScore}</div>
                <div className="text-sm text-gray-500">{aiDeck.length} cards left</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Player Card */}
              <div className="text-center">
                <h3 className="font-semibold mb-4">Your Card</h3>
                <AnimatePresence mode="wait">
                  {playerCard ? (
                    <motion.div
                      key={playerCard.numerator + playerCard.denominator}
                      initial={{ rotateY: 90, opacity: 0 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      exit={{ rotateY: -90, opacity: 0 }}
                      className="bg-blue-100 border-4 border-blue-500 rounded-lg p-8 text-center"
                    >
                      <div className="text-6xl font-bold text-blue-700">
                        {playerCard.numerator}/{playerCard.denominator}
                      </div>
                      <div className="text-sm text-gray-600 mt-2">
                        = {playerCard.value.toFixed(3)}
                      </div>
                    </motion.div>
                  ) : (
                    <div className="bg-gray-200 border-4 border-gray-400 rounded-lg p-8 text-center">
                      <div className="text-4xl">🂠</div>
                      <div className="text-sm text-gray-500 mt-2">Flip to reveal</div>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* AI Card */}
              <div className="text-center">
                <h3 className="font-semibold mb-4">AI Card</h3>
                <AnimatePresence mode="wait">
                  {aiCard ? (
                    <motion.div
                      key={aiCard.numerator + aiCard.denominator}
                      initial={{ rotateY: 90, opacity: 0 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      exit={{ rotateY: -90, opacity: 0 }}
                      className="bg-red-100 border-4 border-red-500 rounded-lg p-8 text-center"
                    >
                      <div className="text-6xl font-bold text-red-700">
                        {aiCard.numerator}/{aiCard.denominator}
                      </div>
                      <div className="text-sm text-gray-600 mt-2">
                        = {aiCard.value.toFixed(3)}
                      </div>
                    </motion.div>
                  ) : (
                    <div className="bg-gray-200 border-4 border-gray-400 rounded-lg p-8 text-center">
                      <div className="text-4xl">🂠</div>
                      <div className="text-sm text-gray-500 mt-2">Flip to reveal</div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded mb-4"
                >
                  <p className="text-yellow-800 font-semibold">{resultMessage}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={flipCard}
              disabled={playerDeck.length === 0 || aiDeck.length === 0}
              className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all ${
                playerDeck.length === 0 || aiDeck.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {playerCard ? 'Next Round →' : 'Flip Cards 🎴'}
            </button>
          </>
        )}
      </motion.div>
    </div>
  )
}
