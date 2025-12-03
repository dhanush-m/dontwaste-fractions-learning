'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import FractionPizzaBuilder from './games/FractionPizzaBuilder'
import FractionWar from './games/FractionWar'

const GAMES = [
  {
    id: 'pizza-builder',
    name: '🍕 Pizza Builder',
    description: 'Build pizzas by dragging toppings to represent fractions',
    component: FractionPizzaBuilder,
    color: 'bg-orange-500',
  },
  {
    id: 'fraction-war',
    name: '⚔️ Fraction War',
    description: 'Compare fractions in a card battle game',
    component: FractionWar,
    color: 'bg-purple-500',
  },
  {
    id: 'bingo',
    name: '🎯 Fraction Bingo',
    description: 'Mark fractions on your bingo card',
    component: null, // TODO: Implement
    color: 'bg-blue-500',
    comingSoon: true,
  },
  {
    id: 'spin',
    name: '🎰 Spin to Win',
    description: 'Spin the wheel and compare fractions',
    component: null, // TODO: Implement
    color: 'bg-green-500',
    comingSoon: true,
  },
]

export default function GamesMenu({ onBack }) {
  const [selectedGame, setSelectedGame] = useState(null)

  if (selectedGame) {
    const GameComponent = selectedGame.component
    return (
      <div>
        <button
          onClick={() => setSelectedGame(null)}
          className="mb-4 text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          ← Back to Games
        </button>
        <GameComponent onComplete={() => {
          setSelectedGame(null)
          if (onBack) onBack()
        }} />
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            🎮 Mini-Games
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Practice fractions through fun, interactive games!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {GAMES.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => !game.comingSoon && setSelectedGame(game)}
                className={`bg-white rounded-lg shadow-lg p-6 cursor-pointer transition-all hover:shadow-xl ${
                  game.comingSoon ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105'
                }`}
              >
                <div className={`${game.color} text-white rounded-lg p-4 mb-4 text-center`}>
                  <div className="text-4xl mb-2">{game.name.split(' ')[0]}</div>
                  <h3 className="text-xl font-bold">{game.name.split(' ').slice(1).join(' ')}</h3>
                </div>
                <p className="text-gray-600 mb-4">{game.description}</p>
                {game.comingSoon ? (
                  <div className="text-center">
                    <span className="bg-gray-200 text-gray-600 px-4 py-2 rounded-full text-sm font-semibold">
                      Coming Soon
                    </span>
                  </div>
                ) : (
                  <div className="text-center">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg">
                      Play Now →
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {onBack && (
            <div className="mt-8 text-center">
              <button
                onClick={onBack}
                className="text-gray-600 hover:text-gray-800 underline"
              >
                ← Back to Activities
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

