'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * AI Guru - Intelligent Chat Assistant
 *
 * A floating chatbot that helps students with doubts about current page/question
 * Features:
 * - Minimalistic floating button in bottom-left corner
 * - Expandable chat interface
 * - Context-aware responses based on current page
 * - Animated AI responses
 * - Voice input option
 */

export default function AIGuru({ context = '', pageType = 'general' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm AI Guru 🎓 Ask me anything about this lesson, question, or concept!",
      timestamp: Date.now()
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Debug: Log component mount
  useEffect(() => {
    console.log('🧙‍♂️ AI Guru mounted!', { context, pageType })
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Simulate AI response (replace with actual API call to OpenAI)
  const getAIResponse = async (userQuestion) => {
    setIsTyping(true)

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Build context-aware prompt
    let systemPrompt = `You are AI Guru, a friendly math tutor helping Grade 5-6 students.
Current page type: ${pageType}
Current context: ${context}

Answer in a simple, encouraging way. Break down complex concepts. Use examples.
Keep responses concise (2-3 sentences) unless explanation needed.`

    // TODO: Replace with actual OpenAI API call
    // For now, use pattern matching for common questions
    let response = generateResponse(userQuestion, context, pageType)

    setIsTyping(false)
    return response
  }

  // Pattern-based response generator (fallback until API is connected)
  const generateResponse = (question, context, pageType) => {
    const q = question.toLowerCase()

    // Context-aware responses
    if (context.includes('fraction')) {
      if (q.includes('what') && q.includes('fraction')) {
        return "A fraction represents part of a whole! The top number (numerator) shows how many parts you have, and the bottom number (denominator) shows the total equal parts. Like 3/4 means 3 out of 4 equal parts! 🍕"
      }
      if (q.includes('add') || q.includes('plus')) {
        return "To add fractions, first make sure the denominators (bottom numbers) are the same. Then add only the numerators (top numbers). For example: 1/4 + 2/4 = 3/4. Keep the denominator the same! ✨"
      }
      if (q.includes('equivalent')) {
        return "Equivalent fractions have the same value but different numbers! Like 1/2 = 2/4 = 3/6. Multiply or divide both top and bottom by the same number. Try it! 🎯"
      }
    }

    if (context.includes('decimal')) {
      if (q.includes('what') && q.includes('decimal')) {
        return "Decimals are another way to write fractions! The dot is called a decimal point. Numbers after it represent tenths, hundredths, etc. Like 0.5 = 5/10 = 1/2! 💠"
      }
      if (q.includes('place value')) {
        return "Each position after the decimal point has a value: first is tenths (0.1), second is hundredths (0.01), third is thousandths (0.001). Easy way: just divide by 10, 100, 1000! 📊"
      }
    }

    if (context.includes('percentage')) {
      if (q.includes('what') && q.includes('percent')) {
        return "Percent means 'out of 100'! 50% means 50 out of 100, which is the same as 1/2 or 0.5. The % symbol is like saying '/100'! 📈"
      }
      if (q.includes('calculate') || q.includes('find')) {
        return "To find a percentage: convert % to decimal (50% = 0.50), then multiply by the number. Example: 25% of 80 = 0.25 × 80 = 20! 🎯"
      }
    }

    // General help responses
    if (q.includes('how') && (q.includes('solve') || q.includes('do'))) {
      return "Let's break it down step by step! First, identify what the question is asking. Then, use the formula or method you learned. Show your work, and check your answer. I'm here to help with each step! 💪"
    }

    if (q.includes('stuck') || q.includes('don\'t understand') || q.includes('confused')) {
      return "No worries! Everyone gets stuck sometimes. 😊 Can you tell me which specific part is confusing? Let's work through it together, one step at a time!"
    }

    if (q.includes('hint') || q.includes('help')) {
      return "Great question! Let me give you a hint: " + (context ? `Think about ${context.slice(0, 50)}... ` : "") + "Try breaking the problem into smaller parts. What do you know already? 🤔"
    }

    if (q.includes('example')) {
      return "Sure! Let me give you an example to make it clearer. " + (pageType === 'lesson' ? "Look at the lesson slide for similar examples!" : "Think about real-world situations like sharing pizza or measuring ingredients!") + " 🍕"
    }

    // Encouraging responses for emotions
    if (q.includes('hard') || q.includes('difficult')) {
      return "I know it feels challenging right now, but you're doing great by asking for help! 🌟 Remember, every expert was once a beginner. Let's tackle this together - what specific part seems hard?"
    }

    if (q.includes('thank')) {
      return "You're welcome! 😊 Keep up the great work! Remember, I'm always here if you need help. Happy learning! 🎓"
    }

    // Default response
    return `Great question! ${context ? 'Based on what we\'re learning: ' + context.slice(0, 100) + '...' : ''} Can you be more specific about what you'd like to know? I'm here to help! 🎓`
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: Date.now()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')

    // Get AI response
    const aiResponse = await getAIResponse(input)

    const assistantMessage = {
      role: 'assistant',
      content: aiResponse,
      timestamp: Date.now()
    }

    setMessages(prev => [...prev, assistantMessage])
  }

  // Removed Enter key functionality - keeping dummy for now
  const handleKeyPress = (e) => {
    // Disabled
  }

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: "Chat cleared! Ask me anything! 🎓",
        timestamp: Date.now()
      }
    ])
  }

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-[9999] w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full shadow-2xl flex items-center justify-center text-white text-2xl cursor-pointer"
            title="AI Guru - Ask me anything!"
            style={{ position: 'fixed', bottom: '24px', right: '24px' }}
          >
            🧙‍♂️
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-[9999] w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border-2 border-purple-200"
            style={{ position: 'fixed', bottom: '24px', right: '24px' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-3xl">🧙‍♂️</div>
                <div>
                  <h3 className="text-white font-bold text-lg">AI Guru</h3>
                  <p className="text-purple-100 text-xs">Your Learning Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearChat}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                  title="Clear chat"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                  title="Close"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white rounded-br-none'
                        : 'bg-white text-gray-800 border-2 border-purple-200 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white border-2 border-purple-200 rounded-2xl rounded-bl-none px-4 py-3">
                    <div className="flex gap-1">
                      <motion.div
                        className="w-2 h-2 bg-purple-500 rounded-full"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-purple-500 rounded-full"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-purple-500 rounded-full"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t-2 border-gray-200">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  className="flex-1 px-4 py-2 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 text-sm"
                  autoFocus
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={true}
                  className="bg-gradient-to-r from-gray-300 to-gray-300 text-white p-3 rounded-xl transition-colors cursor-not-allowed opacity-50"
                  title="Chatbot send is currently disabled"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </motion.button>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2 mt-2 flex-wrap">
                <button
                  onClick={() => setInput("Can you explain this?")}
                  className="text-xs px-3 py-1 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-full transition-colors"
                >
                  💡 Explain
                </button>
                <button
                  onClick={() => setInput("Give me a hint")}
                  className="text-xs px-3 py-1 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-full transition-colors"
                >
                  🎯 Hint
                </button>
                <button
                  onClick={() => setInput("Show me an example")}
                  className="text-xs px-3 py-1 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-full transition-colors"
                >
                  📝 Example
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
