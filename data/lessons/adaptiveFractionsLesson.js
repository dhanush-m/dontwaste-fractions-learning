/**
 * Adaptive Fractions Lesson - Complete restructuring based on student level
 * Each level has entirely different content, examples, and complexity
 */

export const adaptiveFractionsLesson = {
  beginner: {
    id: 'fractions-beginner',
    title: 'Fractions Made Easy with Hyderabad Favorites! 🍛',
    subtitle: 'Learn fractions using food and fun from Hyderabad',
    duration: '15 minutes',
    xp: 20,

    slides: [
      {
        type: 'concept',
        icon: '🍕',
        title: 'What is a Fraction? (The Easy Way!)',
        content: 'A fraction is just a way to talk about PARTS of something! Like when you share food with friends, or when you eat SOME of your chocolate - not all of it! Let\'s learn with yummy Hyderabad examples! 😋',
        visual: 'biryani-visual',
        hyderabadExample: {
          title: 'Paradise Biryani Example',
          scenario: 'You go to Paradise with 3 friends. You order ONE big biryani. The waiter cuts it into 4 EQUAL pieces (one for each of you).',
          question: 'You eat YOUR piece. What fraction did you eat?',
          answer: '1/4 (one out of four pieces)',
          visual: '🍛🍛🍛🍛 → You ate one → That\'s 1/4!',
          silly: 'Think of it like this: 4 friends, 4 pieces, you ate 1 piece = 1/4! Easy peasy! 🎉'
        }
      },

      {
        type: 'concept',
        icon: '🍪',
        title: 'Top Number and Bottom Number',
        content: 'Every fraction has TWO numbers with a line between them. The BOTTOM number tells you TOTAL pieces. The TOP number tells you how many pieces YOU HAVE.',
        hyderabadExample: {
          title: 'Osmania Biscuits Example',
          scenario: 'You buy a packet with 8 Osmania biscuits from Karachi Bakery. You eat 3 biscuits with your Irani chai.',
          question: 'What fraction did you eat?',
          answer: '3/8 (three out of eight)',
          visual: '🍪🍪🍪 eaten | 🍪🍪🍪🍪🍪 left = 3 out of 8 total',
          silly: 'Remember: Bottom = Total (8 biscuits), Top = What you have (3 eaten) = 3/8!'
        }
      },

      {
        type: 'practice',
        icon: '🎯',
        title: 'Let\'s Practice!',
        instruction: 'Try these simple problems. Take your time!',
        problems: [
          {
            question: 'You have 6 samosas on a plate. You eat 2 samosas. What fraction did you eat?',
            hint: 'Count: 2 samosas eaten, 6 samosas total. Write as 2/6!',
            answer: '2/6 (You ate 2 out of 6 samosas)'
          },
          {
            question: 'Mom makes 8 idlis. You eat 3 for breakfast. What fraction of idlis are LEFT?',
            hint: '8 total - 3 eaten = 5 left. Write as 5/8!',
            answer: '5/8 (5 idlis left out of 8 total)'
          },
          {
            question: 'You buy 10 pieces of chocolate. Share 4 with your friend. What fraction did you share?',
            hint: 'You shared 4 out of 10 total pieces!',
            answer: '4/10 (which is the same as 2/5!)'
          }
        ],
        encouragement: 'Great job! You\'re learning fractions! 🌟'
      },

      {
        type: 'concept',
        icon: '🎂',
        title: 'Half and Quarter - Most Important!',
        content: 'These TWO fractions are super important! You will use them every single day. HALF = 1/2 (two equal pieces). QUARTER = 1/4 (four equal pieces).',
        hyderabadExample: {
          title: 'Easy Examples with Cake',
          scenario: 'You buy a cake from Karachi Bakery. Cut it into 2 equal pieces. Each piece is HALF = 1/2. If you cut into 4 equal pieces, each piece is QUARTER = 1/4.',
          question: 'Which is bigger: 1/2 or 1/4?',
          answer: '1/2 is BIGGER! (Half the cake is more than quarter of the cake)',
          visual: '🍰🍰 (Half = 2 pieces) vs 🍰🍰🍰🍰 (Quarter = 4 pieces, each smaller!)',
          silly: 'Remember: When you share with FEWER friends (2), you get MORE cake! When you share with MORE friends (4), you get LESS cake! 😄'
        }
      },

      {
        type: 'realworld',
        icon: '🚗',
        title: 'Fractions in Your Daily Life!',
        scenario: 'You use fractions every single day in Hyderabad! Here are some examples:',
        scenarios: [
          {
            situation: '🚇 Metro Ride: You travel from Charminar to Hitech City. At Malakpet, you\'re halfway = 1/2 of journey done!',
            explanation: 'Halfway means you completed half the journey = 1/2'
          },
          {
            situation: '🍫 Chocolate: You have 12 pieces of chocolate. Give 3 to sister = 3/12 (which equals 1/4!)',
            explanation: '3 out of 12 = 3/12 = 1/4'
          },
          {
            situation: '💰 Money: You get ₹100 pocket money. Spend ₹50 on snacks = 50/100 = 1/2 spent!',
            explanation: '50 out of 100 = 50/100 = 1/2 (half your money!)'
          },
          {
            situation: '📱 Battery: Phone shows 75% battery = 75/100 = 3/4 full. Still good! 🔋',
            explanation: '75 out of 100 = 75/100 = 3/4'
          }
        ],
        explanation: 'See? Fractions are EVERYWHERE! Now you can understand them! 🎉'
      },

      {
        type: 'practice',
        icon: '💪',
        title: 'Final Practice!',
        instruction: 'You\'re doing great! Try these last problems!',
        problems: [
          {
            question: 'You have a pizza with 8 slices. You eat 4 slices. What fraction did you eat?',
            hint: '4 slices eaten out of 8 total slices!',
            answer: '4/8 (which is the same as 1/2 - you ate HALF the pizza!)'
          },
          {
            question: 'Your friend has ₹20. Gives you ₹10. What fraction did they give you?',
            hint: '10 rupees out of 20 total rupees!',
            answer: '10/20 (which equals 1/2 - half the money!)'
          },
          {
            question: 'A cake has 6 pieces. You and your friend eat 2 pieces each (total 4). What fraction is left?',
            hint: 'Started with 6, ate 4, so 6-4 = 2 left!',
            answer: '2/6 (which simplifies to 1/3)'
          }
        ],
        encouragement: 'Amazing work! You learned fractions! 🎉🌟'
      }
    ],

    miniQuiz: {
      question: 'You buy haleem pot with 10 servings. You eat 3 servings. Your friend eats 2. What fraction of haleem is LEFT?',
      options: ['5/10 (or 1/2)', '3/10', '2/10', '7/10'],
      correctIndex: 0,
      explanation: 'Started with 10. You ate 3, friend ate 2. That\'s 5 eaten. So 10-5=5 left. 5 out of 10 = 5/10 = 1/2! 🍲',
      hyderabadBonus: 'Haleem is so good during Ramzan! Now you know fractions AND Hyderabad food! 🎉'
    }
  },

  intermediate: {
    id: 'fractions-intermediate',
    title: 'Understanding Fractions - Core Concepts',
    subtitle: 'Build strong foundations with practical Hyderabad examples',
    duration: '12 minutes',
    xp: 20,

    slides: [
      {
        type: 'concept',
        icon: '📊',
        title: 'Understanding Fractions',
        content: 'A fraction shows parts of a whole. The top number (numerator) shows how many parts you have. The bottom number (denominator) shows total equal parts.',
        hyderabadExample: {
          title: 'Metro Journey Example',
          scenario: 'You travel from Secunderabad to Hitech City on the Metro. Total journey has 16 stops. You have completed 12 stops.',
          question: 'What fraction of the journey is complete?',
          answer: '12/16 (which simplifies to 3/4)',
          silly: 'Think of it as: 12 stops done out of 16 total = 12/16 = 3/4 of journey complete!'
        },
        realWorldConnection: {
          scenario: 'Fractions help you track progress, measure distances, calculate time, and understand percentages.',
          calculation: 'Example: 3/4 = 75% = Three-quarters'
        }
      },

      {
        type: 'concept',
        icon: '🔢',
        title: 'Simplifying Fractions',
        content: 'Sometimes fractions can be made simpler! If the top and bottom numbers can both be divided by the same number, you can simplify. Example: 4/8 = 2/4 = 1/2 (all the same!)',
        hyderabadExample: {
          title: 'Stadium Example',
          scenario: 'Uppal Stadium cricket match has 20,000 total seats. 10,000 seats are filled.',
          question: 'What fraction of seats are filled? Can you simplify it?',
          answer: '10,000/20,000 = 10/20 = 5/10 = 1/2 (half the stadium is full!)',
          silly: 'Method: Both can be divided by 10,000. So 10,000÷10,000 = 1 and 20,000÷10,000 = 2. Result: 1/2!'
        }
      },

      {
        type: 'concept',
        icon: '⚖️',
        title: 'Comparing Fractions',
        content: 'Which is bigger: 2/3 or 3/4? To compare, make the bottom numbers the same! Find a common denominator and compare the top numbers.',
        hyderabadExample: {
          title: 'Biryani Shop Sales',
          scenario: 'Paradise sells 2/3 of their biryani today. Bawarchi sells 3/4 of their biryani. Who sold more?',
          question: 'Which fraction is bigger: 2/3 or 3/4?',
          answer: '3/4 is bigger! (Bawarchi sold more)',
          silly: 'How to check: Make bottom numbers same. 2/3 = 8/12 and 3/4 = 9/12. Now compare tops: 9 > 8, so 3/4 > 2/3!'
        },
        method: {
          rule: 'To compare fractions: Make denominators same, then compare numerators',
          hyderabadPractice: {
            scenario: 'Compare 1/2 and 2/5',
            situation: 'Common denominator is 10',
            fraction: '1/2 = 5/10 and 2/5 = 4/10',
            simplification: '5/10 > 4/10, so 1/2 > 2/5'
          }
        }
      },

      {
        type: 'practice',
        icon: '📏',
        title: 'Practice Problems',
        instruction: 'Try these problems step by step!',
        problems: [
          {
            question: 'A shop has 80 meters of cloth. Sells 60 meters. What fraction was sold? Simplify it.',
            hint: '60 out of 80 = 60/80. Both divide by 20!',
            answer: '60/80 = 3/4 (three-quarters of the cloth was sold)'
          },
          {
            question: 'You travel 30 km out of 45 km total. What fraction is complete?',
            hint: '30 out of 45 = 30/45. Both divide by 15!',
            answer: '30/45 = 2/3 (two-thirds of journey complete)'
          },
          {
            question: 'Compare: Which is bigger: 1/2 or 3/5?',
            hint: 'Make bottom same: 1/2 = 5/10, 3/5 = 6/10. Compare: 6 > 5',
            answer: '3/5 is bigger than 1/2'
          }
        ],
        encouragement: 'You\'re mastering fractions! Keep going! 💪'
      },

      {
        type: 'realworld',
        icon: '🎯',
        title: 'Using Fractions in Real Life',
        scenario: 'Fractions help solve real problems every day in Hyderabad!',
        scenarios: [
          {
            situation: '🛍️ Shopping: A dress costs ₹1,200 at Meena Bazaar. Sale gives 1/4 discount.',
            calculation: '1/4 of 1,200 = 1,200 ÷ 4 = ₹300 off',
            explanation: 'Final price: ₹1,200 - ₹300 = ₹900'
          },
          {
            situation: '🚇 Metro: Journey is 45 minutes. You traveled 30 minutes.',
            calculation: '30/45 = 2/3 of journey',
            explanation: 'You completed 2/3 (two-thirds) of the trip!'
          },
          {
            situation: '🍲 Haleem Shop: Makes 120 liters. Sells 3/5 in morning.',
            calculation: '3/5 × 120 = 72 liters sold',
            explanation: '72 liters sold, 48 liters remaining'
          }
        ],
        explanation: 'See how fractions help with money, time, and business! 🎯'
      }
    ],

    miniQuiz: {
      question: 'A shop has 60 Osmania biscuit packets. Sells 2/3 in the morning. How many packets were sold?',
      options: ['40 packets', '30 packets', '20 packets', '45 packets'],
      correctIndex: 0,
      explanation: '2/3 of 60 = 2/3 × 60 = (2 × 60) ÷ 3 = 120 ÷ 3 = 40 packets sold!',
      breakdown: 'Method: Multiply 60 by 2 = 120, then divide by 3 = 40. So 2/3 of 60 = 40.'
    }
  },

  advanced: {
    id: 'fractions-advanced',
    title: 'Advanced Fraction Concepts & Applications',
    subtitle: 'Master complex fractional operations with real-world Hyderabad scenarios',
    duration: '15 minutes',
    xp: 30,

    slides: [
      {
        type: 'concept',
        icon: '🎓',
        title: 'Fractions in Complex Systems',
        content: 'Advanced fractional thinking involves multi-step problems, compound operations, and real-world optimization scenarios.',
        framework: {
          approach: 'Break complex problems into fractional components',
          skills: ['Multi-step calculation', 'Fraction of fractions', 'Ratio analysis', 'Optimization'],
          mindset: 'Think systematically: identify all fractional relationships before calculating'
        }
      },

      {
        type: 'advanced-problem',
        icon: '🏢',
        title: 'Multi-Department Resource Allocation',
        scenario: {
          context: 'Tech company in Gachibowli with 240 employees',
          distribution: '3/8 in Development, 1/4 in Testing, 1/6 in Operations',
          challenges: [
            {
              question: 'Calculate employees in each department',
              solution: {
                development: '3/8 × 240 = 90 employees',
                testing: '1/4 × 240 = 60 employees',
                operations: '1/6 × 240 = 40 employees',
                others: '240 - (90+60+40) = 50 employees'
              }
            },
            {
              question: 'What fraction of employees are in "other" roles?',
              solution: {
                calculation: '50/240 = 5/24',
                verification: '3/8 + 1/4 + 1/6 + 5/24 = 9/24 + 6/24 + 4/24 + 5/24 = 24/24 = 1 ✓'
              }
            },
            {
              question: 'If Development grows by 1/3, how many new developers?',
              solution: '1/3 × 90 = 30 new developers (Total: 120 developers)'
            }
          ]
        }
      },

      {
        type: 'advanced-problem',
        icon: '🏗️',
        title: 'Project Completion Analysis',
        scenario: {
          context: 'Construction project in Jubilee Hills',
          status: '5/8 of project complete',
          complication: 'Of remaining work, 2/3 is electrical, 1/4 is painting',
          problems: [
            {
              question: 'What fraction of total project is electrical work?',
              solution: {
                remaining: '1 - 5/8 = 3/8',
                electrical: '2/3 × 3/8 = 6/24 = 1/4 of total project'
              }
            },
            {
              question: 'What fraction is painting?',
              solution: {
                painting: '1/4 × 3/8 = 3/32 of total project'
              }
            },
            {
              question: 'What fraction of remaining is other work?',
              solution: {
                allocated: '2/3 + 1/4 = 8/12 + 3/12 = 11/12',
                other: '1 - 11/12 = 1/12 of remaining'
              }
            }
          ]
        }
      },

      {
        type: 'advanced-problem',
        icon: '📈',
        title: 'Financial Analysis: Property Investment',
        scenario: {
          context: 'Property investment in Hitech City',
          initial: '₹80 lakhs',
          changes: [
            {
              year: 'Year 1',
              change: 'Increased by 3/8',
              calculation: {
                increase: '3/8 × 80 = 30 lakhs',
                newValue: '80 + 30 = ₹110 lakhs'
              }
            },
            {
              year: 'Year 2',
              change: 'Decreased by 1/5 of new value',
              calculation: {
                decrease: '1/5 × 110 = 22 lakhs',
                finalValue: '110 - 22 = ₹88 lakhs'
              }
            }
          ],
          analysis: {
            netChange: '88 - 80 = ₹8 lakhs gain',
            fractionalGain: '8/80 = 1/10 = 10% overall increase',
            insight: 'Despite year 2 decrease, net gain due to larger year 1 increase'
          }
        }
      },

      {
        type: 'optimization',
        icon: '🎯',
        title: 'Traffic Flow Optimization',
        scenario: {
          context: 'ORR (Outer Ring Road) traffic analysis',
          data: {
            cars: '3/7 of vehicles',
            bikes: '2/7 of vehicles',
            trucks: '1/7 of vehicles',
            others: 'Remaining fraction'
          },
          problems: [
            {
              question: 'If 14,000 vehicles use ORR daily, calculate each type',
              solution: {
                cars: '3/7 × 14,000 = 6,000',
                bikes: '2/7 × 14,000 = 4,000',
                trucks: '1/7 × 14,000 = 2,000',
                others: '14,000 - 12,000 = 2,000 (or 1/7)'
              }
            },
            {
              question: 'New policy aims to increase bikes to 2/5. How many more bikes needed?',
              solution: {
                target: '2/5 × 14,000 = 5,600 bikes',
                increase: '5,600 - 4,000 = 1,600 more bikes',
                fractionalIncrease: '1,600/4,000 = 2/5 = 40% increase in bikes'
              }
            }
          ]
        }
      }
    ],

    miniQuiz: {
      question: 'A Gachibowli tech park has 600 offices. 2/5 are tech companies, 1/3 of remaining are coworking spaces. Of the still remaining, 3/4 are service companies. How many offices are "other" businesses?',
      options: ['30 offices', '45 offices', '60 offices', '90 offices'],
      correctIndex: 2,
      explanation: 'Step 1: Tech = 2/5 × 600 = 240. Remaining = 360. Step 2: Coworking = 1/3 × 360 = 120. Remaining = 240. Step 3: Services = 3/4 × 240 = 180. Others = 240 - 180 = 60 offices.',
      breakdown: 'This tests multi-step "fraction of remaining" calculations - a key advanced skill.'
    }
  }
}

/**
 * Get lesson based on learning level
 */
export function getAdaptiveFractionsLesson(learningLevel) {
  const level = learningLevel || 'intermediate'
  return adaptiveFractionsLesson[level] || adaptiveFractionsLesson.intermediate
}
