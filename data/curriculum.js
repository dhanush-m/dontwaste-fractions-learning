export const CURRICULUM = {
  fractions: {
    id: 'fractions',
    name: 'Fractions',
    icon: '🍕',
    color: 'from-blue-500 to-cyan-500',
    order: 1,
    description: 'Learn to understand and work with parts of a whole',
    lesson: {
      id: 'fractions-lesson',
      title: 'Understanding Fractions',
      slides: 7,
      duration: '10 min'
    },
    activities: [
      {
        id: 'equivalent-matcher',
        name: 'Equivalent Fractions',
        description: 'Match fractions with the same value',
        difficulty: 'easy',
        xp: 50
      },
      {
        id: 'fraction-comparison',
        name: 'Compare Fractions',
        description: 'Determine which fraction is larger',
        difficulty: 'medium',
        xp: 50
      },
      {
        id: 'adding-fractions',
        name: 'Adding Fractions',
        description: 'Add fractions step by step',
        difficulty: 'hard',
        xp: 50
      },
      {
        id: 'number-line',
        name: 'Number Line',
        description: 'Place fractions on a number line',
        difficulty: 'medium',
        xp: 50
      },
      {
        id: 'word-problems',
        name: 'Word Problems',
        description: 'Solve real-world fraction problems',
        difficulty: 'hard',
        xp: 50
      }
    ],
    masteryQuiz: {
      id: 'fractions-mastery',
      questions: 10,
      passingScore: 80
    }
  },

  decimals: {
    id: 'decimals',
    name: 'Decimals',
    icon: '💠',
    color: 'from-green-500 to-emerald-500',
    order: 2,
    description: 'Understand decimal numbers and place value',
    lesson: {
      id: 'decimals-lesson',
      title: 'Understanding Decimals',
      slides: 7,
      duration: '10 min'
    },
    activities: [
      {
        id: 'decimal-place-value',
        name: 'Decimal Place Value',
        description: 'Identify tenths, hundredths, and thousandths',
        difficulty: 'easy',
        xp: 50
      },
      {
        id: 'decimal-comparison',
        name: 'Compare Decimals',
        description: 'Order decimals from smallest to largest',
        difficulty: 'medium',
        xp: 50
      },
      {
        id: 'decimal-operations',
        name: 'Add & Subtract Decimals',
        description: 'Perform operations with decimals',
        difficulty: 'hard',
        xp: 50
      },
      {
        id: 'fraction-to-decimal',
        name: 'Fraction ↔ Decimal',
        description: 'Convert between fractions and decimals',
        difficulty: 'medium',
        xp: 50
      },
      {
        id: 'decimal-word-problems',
        name: 'Decimal Word Problems',
        description: 'Solve real-world decimal problems',
        difficulty: 'hard',
        xp: 50
      }
    ],
    masteryQuiz: {
      id: 'decimals-mastery',
      questions: 10,
      passingScore: 80
    }
  },

  percentages: {
    id: 'percentages',
    name: 'Percentages',
    icon: '📊',
    color: 'from-purple-500 to-pink-500',
    order: 3,
    description: 'Master percentages and their applications',
    lesson: {
      id: 'percentages-lesson',
      title: 'Understanding Percentages',
      slides: 7,
      duration: '10 min'
    },
    activities: [
      {
        id: 'percent-basics',
        name: 'Percentage Basics',
        description: 'Learn what percentages represent',
        difficulty: 'easy',
        xp: 50
      },
      {
        id: 'percent-conversions',
        name: 'Convert Percentages',
        description: 'Convert between fractions, decimals, and percentages',
        difficulty: 'medium',
        xp: 50
      },
      {
        id: 'find-percentage',
        name: 'Find Percentages',
        description: 'Calculate percentages of numbers',
        difficulty: 'hard',
        xp: 50
      },
      {
        id: 'percent-increase-decrease',
        name: 'Percent Change',
        description: 'Calculate percentage increase and decrease',
        difficulty: 'hard',
        xp: 50
      },
      {
        id: 'percent-word-problems',
        name: 'Percentage Word Problems',
        description: 'Solve real-world percentage problems',
        difficulty: 'hard',
        xp: 50
      }
    ],
    masteryQuiz: {
      id: 'percentages-mastery',
      questions: 10,
      passingScore: 80
    }
  },

  'number-sense': {
    id: 'number-sense',
    name: 'Number Sense',
    icon: '🔢',
    color: 'from-orange-500 to-red-500',
    order: 4,
    description: 'Develop strong number sense and estimation skills',
    lesson: {
      id: 'number-sense-lesson',
      title: 'Building Number Sense',
      slides: 7,
      duration: '10 min'
    },
    activities: [
      {
        id: 'place-value',
        name: 'Place Value',
        description: 'Understand place value to millions',
        difficulty: 'easy',
        xp: 50
      },
      {
        id: 'rounding',
        name: 'Rounding Numbers',
        description: 'Round to nearest ten, hundred, thousand',
        difficulty: 'medium',
        xp: 50
      },
      {
        id: 'estimation',
        name: 'Estimation',
        description: 'Estimate sums and products',
        difficulty: 'medium',
        xp: 50
      },
      {
        id: 'number-patterns',
        name: 'Number Patterns',
        description: 'Identify and complete number patterns',
        difficulty: 'medium',
        xp: 50
      },
      {
        id: 'mental-math',
        name: 'Mental Math',
        description: 'Practice quick mental calculations',
        difficulty: 'hard',
        xp: 50
      }
    ],
    masteryQuiz: {
      id: 'number-sense-mastery',
      questions: 10,
      passingScore: 80
    }
  }
}

export const getChapterById = (chapterId) => CURRICULUM[chapterId]

export const getAllChapters = () =>
  Object.values(CURRICULUM).sort((a, b) => a.order - b.order)

export const getNextChapter = (currentChapterId) => {
  const current = CURRICULUM[currentChapterId]
  if (!current) return null

  const all = getAllChapters()
  return all.find(c => c.order === current.order + 1) || null
}

export const getPreviousChapter = (currentChapterId) => {
  const current = CURRICULUM[currentChapterId]
  if (!current) return null

  const all = getAllChapters()
  return all.find(c => c.order === current.order - 1) || null
}
