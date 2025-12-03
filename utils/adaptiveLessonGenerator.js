import { ADAPTIVE_EXAMPLES, HYDERABAD_CONTEXT } from '@/data/adaptiveContent'

/**
 * Generates adaptive lesson content based on student's learning level
 * Uses Hyderabad-specific examples for better relatability
 */

export function generateAdaptiveLesson(concept, learningLevel) {
  const adaptiveContent = ADAPTIVE_EXAMPLES[concept]?.[learningLevel]

  if (!adaptiveContent) {
    return null
  }

  return {
    introduction: adaptiveContent.introduction,
    examples: adaptiveContent.introduction?.examples || [],
    activities: adaptiveContent.introduction?.activities || [],
    learningLevel: learningLevel
  }
}

/**
 * Get adaptive examples for a specific concept and level
 */
export function getAdaptiveExamples(concept, subTopic, learningLevel) {
  return ADAPTIVE_EXAMPLES[concept]?.[learningLevel]?.[subTopic]
}

/**
 * Generate practice problems adapted to learning level
 */
export function generateAdaptivePractice(concept, learningLevel, count = 5) {
  const problems = []

  if (learningLevel === 'beginner') {
    // Beginner: Very simple, visual, Hyderabad examples
    problems.push(
      {
        question: `You ordered ${HYDERABAD_CONTEXT.foods[0]} from Paradise. It's cut into 4 pieces. You eat 1 piece. What fraction did you eat?`,
        answer: '1/4',
        hint: 'Count: 1 piece you ate, 4 total pieces',
        visual: 'Show 4 boxes, 1 colored'
      },
      {
        question: `Your mom makes 8 ${HYDERABAD_CONTEXT.foods[6]}s. You eat 3 for breakfast. How many are left? Write as a fraction.`,
        answer: '5/8',
        hint: '8 total - 3 eaten = 5 left. Write as 5 out of 8',
        silly: true
      },
      {
        question: `You buy a packet of ${HYDERABAD_CONTEXT.foods[1]} with 6 biscuits. You share 2 with your friend. What fraction did you share?`,
        answer: '2/6 or 1/3',
        hint: '2 biscuits shared out of 6 total'
      },
      {
        question: `Auto ride from Charminar to Laad Bazaar costs ₹20. You paid ₹10. What fraction did you pay?`,
        answer: '10/20 or 1/2',
        hint: '10 rupees out of 20 total rupees = half!'
      },
      {
        question: `Your phone battery shows 50 out of 100. What fraction is that?`,
        answer: '50/100 or 1/2',
        hint: '50 parts out of 100 total = half charged!'
      }
    )
  } else if (learningLevel === 'intermediate') {
    // Intermediate: Moderate complexity, structured problems
    problems.push(
      {
        question: 'A cricket match at Uppal Stadium has 36,000 seats. If 27,000 seats are filled, what fraction of seats are occupied? Simplify your answer.',
        answer: '3/4',
        steps: ['27,000/36,000', 'Divide both by 9,000', '3/4'],
        context: 'Real stadium capacity problem'
      },
      {
        question: 'At Karachi Bakery, 2/3 of cookies are fruit biscuits and 1/4 are butter cookies. What fraction are other types?',
        answer: '1/12',
        steps: ['Find common denominator: 12', '2/3 = 8/12, 1/4 = 3/12', 'Other = 12/12 - 8/12 - 3/12 = 1/12'],
        concept: 'Fraction subtraction'
      },
      {
        question: 'A metro train travels 24 km from Secunderabad to Hitech City in 45 minutes. Express the distance covered in first 15 minutes as a fraction of total.',
        answer: '1/3',
        steps: ['15 minutes out of 45 total', '15/45', 'Simplify: 1/3'],
        application: 'Time and distance'
      }
    )
  } else if (learningLevel === 'advanced') {
    // Advanced: Complex, multi-step, real-world scenarios
    problems.push(
      {
        question: 'A software company in Gachibowli has 180 employees. 2/5 work in development, 1/3 in testing. Of the remaining, 3/4 work in operations. How many employees are in operations?',
        answer: '27',
        steps: [
          'Development: 2/5 of 180 = 72',
          'Testing: 1/3 of 180 = 60',
          'Remaining: 180 - 72 - 60 = 48',
          'Operations: 3/4 of 48 = 36'
        ],
        complexity: 'Multi-step with multiple fractions'
      },
      {
        question: 'Property in Jubilee Hills worth ₹80 lakhs increased by 3/8 in year 1, then decreased by 1/5 of the new value in year 2. What is the final value?',
        answer: '₹88 lakhs',
        steps: [
          'Year 1 increase: 3/8 of 80 = 30 lakhs',
          'After year 1: 80 + 30 = 110 lakhs',
          'Year 2 decrease: 1/5 of 110 = 22 lakhs',
          'Final: 110 - 22 = 88 lakhs'
        ],
        realWorld: 'Property investment calculation'
      }
    )
  }

  return problems.slice(0, count)
}

/**
 * Get adaptive hints based on learning level
 */
export function getAdaptiveHint(learningLevel, attemptNumber) {
  if (learningLevel === 'beginner') {
    const hints = [
      "Let's think about it with food! 🍕",
      "Imagine you're sharing with friends!",
      "Count the pieces - it's easier than you think!",
      "The bottom number is always the TOTAL pieces",
      "The top number is how many pieces we're talking about"
    ]
    return hints[Math.min(attemptNumber, hints.length - 1)]
  } else if (learningLevel === 'intermediate') {
    const hints = [
      "Break the problem into smaller steps",
      "What information do you know? What do you need to find?",
      "Can you simplify before calculating?",
      "Draw it out or visualize the problem"
    ]
    return hints[Math.min(attemptNumber, hints.length - 1)]
  } else {
    const hints = [
      "Consider the relationship between the quantities",
      "Can you break this into multiple steps?",
      "What mathematical principle applies here?"
    ]
    return hints[Math.min(attemptNumber, hints.length - 1)]
  }
}

/**
 * Get adaptive feedback based on performance
 */
export function getAdaptiveFeedback(isCorrect, learningLevel, conceptMastery) {
  if (isCorrect) {
    if (learningLevel === 'beginner') {
      const messages = [
        "Awesome! You're getting it! 🎉",
        "Perfect! That's exactly right! 🌟",
        "Yes! You're a fractions champion! 🏆",
        "Brilliant! Keep going! 💫"
      ]
      return messages[Math.floor(Math.random() * messages.length)]
    } else if (learningLevel === 'intermediate') {
      return "Correct! You've understood the concept well."
    } else {
      return "Excellent work! Your mathematical reasoning is strong."
    }
  } else {
    if (learningLevel === 'beginner') {
      return "Oops! Let's try again! Think about sharing biryani with friends - it makes fractions easier! 🍛"
    } else if (learningLevel === 'intermediate') {
      return "Not quite. Review the steps and try breaking down the problem."
    } else {
      return "Incorrect. Consider reviewing the underlying concept and approach."
    }
  }
}

/**
 * Determine if student should level up or down
 */
export function shouldAdjustLevel(recentPerformance, currentLevel) {
  const avgScore = recentPerformance.reduce((a, b) => a + b, 0) / recentPerformance.length

  if (currentLevel === 'beginner' && avgScore >= 85) {
    return { shouldChange: true, newLevel: 'intermediate', message: '🎉 Great progress! Moving to Intermediate level!' }
  }

  if (currentLevel === 'intermediate' && avgScore >= 90) {
    return { shouldChange: true, newLevel: 'advanced', message: '🌟 Outstanding! You\'re ready for Advanced content!' }
  }

  if (currentLevel === 'intermediate' && avgScore < 50) {
    return { shouldChange: true, newLevel: 'beginner', message: 'Let\'s build a stronger foundation with simpler examples!' }
  }

  if (currentLevel === 'advanced' && avgScore < 60) {
    return { shouldChange: true, newLevel: 'intermediate', message: 'Let\'s review some concepts with guided examples.' }
  }

  return { shouldChange: false, newLevel: currentLevel }
}

/**
 * Get culturally relevant example for any fraction concept
 */
export function getHyderabadiExample(concept, fraction) {
  const examples = {
    'half': `Like splitting ${HYDERABAD_CONTEXT.foods[2]} cost with a friend! ☕`,
    'quarter': `Like sharing ${HYDERABAD_CONTEXT.foods[0]} among 4 people! 🍛`,
    'third': `Like dividing ${HYDERABAD_CONTEXT.foods[3]} into 3 equal parts!`,
    'general': `Think of it like portions at a Hyderabadi feast!`
  }

  // Determine which example to use
  if (fraction === '1/2') return examples.half
  if (fraction === '1/4' || fraction === '3/4') return examples.quarter
  if (fraction === '1/3' || fraction === '2/3') return examples.third
  return examples.general
}
