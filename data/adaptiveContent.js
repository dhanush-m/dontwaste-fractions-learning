// Adaptive content based on learning level
// Uses Hyderabad-specific examples to make learning relatable

export const ADAPTIVE_EXAMPLES = {
  fractions: {
    beginner: {
      introduction: {
        title: "Understanding Fractions with Hyderabadi Food! 🍽️",
        examples: [
          {
            concept: "What is a fraction?",
            explanation: "Imagine you ordered a delicious Hyderabadi biryani from Paradise! The whole biryani is cut into 4 equal pieces. If you eat 1 piece, you ate 1/4 (one-fourth) of the biryani!",
            visual: "biryani",
            relatable: "Just like sharing biryani with your family at dinner! 🍛"
          },
          {
            concept: "Parts and Whole",
            explanation: "You buy a packet of Osmania biscuits with 8 biscuits. You eat 2 biscuits. That's 2/8 of the packet! The top number (2) is how many you ate. The bottom number (8) is the total biscuits.",
            visual: "biscuits",
            relatable: "Perfect with Irani chai! ☕"
          },
          {
            concept: "Half and Quarter",
            explanation: "You go to Karachi Bakery and buy a cake. They cut it into 2 equal pieces - that's 1/2 (half). If they cut it into 4 pieces, each piece is 1/4 (quarter)!",
            visual: "cake",
            relatable: "Like cutting fruit biscuits to share with friends! 🍰"
          }
        ],
        activities: [
          "Count how many samosas in a plate (total 6), eat 2. What fraction did you eat?",
          "Your mom makes 8 idlis. You eat 3 for breakfast. What fraction is left?",
          "A Gachibowli metro train has 4 compartments. You're in 1 compartment. What fraction of the train are you in?"
        ]
      },
      comparison: {
        title: "Which is More? Hyderabad Style! 🎯",
        examples: [
          {
            concept: "Comparing with same food",
            explanation: "You have 2 plates of dosas. Plate A: You ate 2/4 dosas. Plate B: You ate 3/4 dosas. Which plate has more eaten? Plate B! Because 3 pieces is more than 2 pieces when plates are the same size!",
            tip: "Same bottom number? Just compare top numbers! Easy! 😊"
          },
          {
            concept: "Visual comparison",
            explanation: "Imagine cutting a mirchi bajji into 2 pieces (1/2) vs cutting it into 4 pieces (1/4). Which piece is bigger? The 1/2! Fewer pieces = bigger pieces!",
            relatable: "Like sharing one samosa vs two samosas with a friend! 🥟"
          }
        ],
        sillyExamples: [
          "Would you rather have 1/2 of a Hyderabadi haleem bowl or 1/8? Obviously 1/2 - that's more haleem! 🍲",
          "Your friend offers 2/3 of their pani puri or 1/3. Which do you pick? 2/3 for sure! More pani puri is always better! 💦"
        ]
      }
    },

    intermediate: {
      introduction: {
        title: "Understanding Fractions - Real-World Applications 📚",
        examples: [
          {
            concept: "Fractions in daily life",
            explanation: "When you travel from Secunderabad to Hitech City on the metro, if you've covered 12 stops out of 16 total stops, you've traveled 12/16 of the journey (which simplifies to 3/4).",
            application: "Used in: Distance, time, measurements"
          },
          {
            concept: "Fractions in shopping",
            explanation: "At Begum Bazaar, if a merchant sells 75 sarees out of 100, they've sold 75/100 or 3/4 of their stock.",
            application: "Useful for: Sales, inventory, business"
          }
        ],
        practice: [
          "A cricket match at Uppal Stadium: If 45,000 out of 55,000 seats are filled, what fraction is occupied?",
          "Ramzan special: If a haleem pot contains 24 liters and 18 liters are sold, what fraction remains?"
        ]
      },
      comparison: {
        title: "Comparing Fractions Systematically 🔍",
        method: "To compare fractions with different denominators, find a common denominator first.",
        examples: [
          {
            problem: "Compare 2/3 and 3/4",
            solution: "Common denominator: 12. Convert: 2/3 = 8/12, 3/4 = 9/12. Therefore, 3/4 > 2/3",
            context: "Like comparing prices: ₹2/3kg vs ₹3/4kg of mirchi at market"
          }
        ]
      }
    },

    advanced: {
      introduction: {
        title: "Fractions: Mathematical Precision & Applications 🎓",
        examples: [
          {
            concept: "Complex fractional calculations",
            explanation: "A software company in Madhapur has 240 employees. If 3/8 work in development, 1/4 in testing, and 1/6 in operations, how many employees are in each department? What fraction works in other roles?",
            solution: "Development: 90, Testing: 60, Operations: 40. Other roles: 50 (or 5/24 of total)"
          },
          {
            concept: "Multi-step problems",
            explanation: "A construction project in Gachibowli is 5/8 complete. Of the remaining work, 2/3 involves electrical fitting. What fraction of the total project is the electrical work?",
            solution: "Remaining: 3/8. Electrical: 2/3 of 3/8 = 6/24 = 1/4 of total project"
          }
        ],
        realWorld: [
          "Urban planning: Allocating 2/5 of Hitech City land to commercial, 1/3 to residential",
          "Traffic analysis: If 3/7 of vehicles on ORR are cars, 2/7 are bikes, what fraction are others?",
          "Budget distribution: Telangana state budget allocation across sectors using fractions"
        ]
      }
    }
  },

  decimals: {
    beginner: {
      introduction: {
        title: "Decimals with Rupees! 💰",
        examples: [
          {
            concept: "Understanding decimal point",
            explanation: "When you buy chai at Nimrah Cafe for ₹15.50, the .50 means 50 paise! The dot separates rupees from paise. ₹15.50 = 15 rupees and 50 paise!",
            visual: "money",
            relatable: "Like counting your pocket money! 💵"
          },
          {
            concept: "Tenths place",
            explanation: "Your auto meter shows 2.5 km from Charminar to Laad Bazaar. The .5 means half a kilometer (500 meters)!",
            silly: "Think of it as 2 and a half samosas! 🚗"
          }
        ],
        activities: [
          "Count money: ₹10.25 - how many rupees? How many paise?",
          "Distance: 3.7 km from home to school - is it more or less than 4 km?",
          "Temperature: Today's high is 35.8°C - is it hotter than 36°C?"
        ]
      }
    },

    intermediate: {
      introduction: {
        title: "Decimals in Measurements & Money 📏",
        examples: [
          {
            concept: "Place value understanding",
            explanation: "In 24.75, the 7 represents 7 tenths (7/10) and 5 represents 5 hundredths (5/100). Total: 24 + 0.7 + 0.05 = 24.75",
            application: "Used in: Prices, measurements, calculations"
          }
        ]
      }
    },

    advanced: {
      introduction: {
        title: "Precision with Decimals 🎯",
        examples: [
          {
            concept: "Multi-decimal operations",
            explanation: "Calculating fuel efficiency: A car travels 156.8 km using 12.5 liters on the Hyderabad-Vijayawada highway. Calculate km per liter: 156.8 ÷ 12.5 = 12.544 km/L",
            precision: "Rounding to appropriate decimal places based on context"
          }
        ]
      }
    }
  },

  percentages: {
    beginner: {
      introduction: {
        title: "Percentages - Out of 100! 💯",
        examples: [
          {
            concept: "What is percentage?",
            explanation: "Your friend scored 85 out of 100 in math test = 85%! The % symbol means 'out of 100'. If you ate 50 out of 100 pieces of a chocolate, you ate 50%!",
            relatable: "Like getting 100% marks means all correct! 📝"
          },
          {
            concept: "Common percentages",
            explanation: "50% = half (like 50 out of 100 mangoes). 25% = quarter (like 25 out of 100 biryani plates). 100% = everything!",
            silly: "If you're 100% hungry, you want ALL the dosas! 🤤"
          }
        ],
        activities: [
          "Your phone battery: 75% - more or less than half?",
          "Exam score: 60 out of 100 = what percentage?",
          "Paradise biryani discount: 20% off - good deal or not?"
        ]
      }
    },

    intermediate: {
      introduction: {
        title: "Calculating Percentages 🧮",
        examples: [
          {
            concept: "Finding percentage",
            explanation: "To find 30% of ₹500 (sale at Meena Bazaar): Convert to decimal: 30% = 0.30, then multiply: 0.30 × 500 = ₹150 discount!",
            formula: "Percentage = (Part/Whole) × 100"
          }
        ]
      }
    },

    advanced: {
      introduction: {
        title: "Advanced Percentage Applications 📊",
        examples: [
          {
            concept: "Compound percentages",
            explanation: "Property value in Jubilee Hills increased by 15% last year and 12% this year. Total increase is NOT 27% - it's 28.8% due to compounding!",
            calculation: "100 → 115 → 115 × 1.12 = 128.8 (28.8% increase)"
          }
        ]
      }
    }
  }
}

// Helper function to get content based on learning level
export function getAdaptiveContent(concept, learningLevel, topic = 'introduction') {
  const level = learningLevel || 'intermediate'
  return ADAPTIVE_EXAMPLES[concept]?.[level]?.[topic] || ADAPTIVE_EXAMPLES[concept]?.intermediate?.[topic]
}

// Hyderabad-specific vocabulary for examples
export const HYDERABAD_CONTEXT = {
  foods: [
    'Hyderabadi biryani', 'Osmania biscuits', 'Irani chai', 'mirchi bajji',
    'samosa', 'haleem', 'dosa', 'idli', 'pani puri', 'Karachi biscuits'
  ],
  places: [
    'Charminar', 'Hitech City', 'Gachibowli', 'Secunderabad', 'Begum Bazaar',
    'Laad Bazaar', 'Paradise Restaurant', 'Nimrah Cafe', 'Karachi Bakery',
    'Uppal Stadium', 'Madhapur', 'Jubilee Hills'
  ],
  activities: [
    'metro ride', 'auto ride', 'shopping at market', 'watching movie at Prasads',
    'cricket match', 'festival shopping', 'Ramzan celebrations'
  ],
  currency: '₹',
  measurements: {
    distance: 'km',
    weight: 'kg',
    temperature: '°C'
  }
}
