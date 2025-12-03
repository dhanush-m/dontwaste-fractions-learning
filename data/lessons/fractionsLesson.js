export const fractionsLesson = {
  id: 'fractions-intro',
  title: 'Understanding Fractions',
  subtitle: 'Learn what fractions are and why we use them',
  duration: '10 minutes',
  xp: 20,

  slides: [
    {
      type: 'concept',
      icon: '🍕',
      title: 'What is a Fraction?',
      content: 'A fraction represents a part of a whole. When you share a pizza with friends or measure ingredients for a recipe, you\'re using fractions! A fraction has two parts: the numerator (top number) shows how many parts you have, and the denominator (bottom number) shows how many equal parts make up the whole.',
      visual: (
        <div className="flex flex-col items-center gap-6">
          <div className="text-center">
            <div className="text-6xl font-bold text-blue-600 mb-2">3</div>
            <div className="h-1 w-32 bg-blue-600 mx-auto mb-2"></div>
            <div className="text-6xl font-bold text-blue-600">4</div>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                className={`w-16 h-16 border-2 border-gray-400 rounded ${
                  i <= 3 ? 'bg-blue-500' : 'bg-white'
                }`}
              />
            ))}
          </div>
          <p className="text-gray-700 text-center">
            This shows <span className="font-bold">3/4</span> - three parts out of four total parts are shaded
          </p>
        </div>
      )
    },

    {
      type: 'concept',
      icon: '🎯',
      title: 'Why Do We Use Fractions?',
      content: 'Fractions help us describe amounts that aren\'t whole numbers. In everyday life, we use fractions when cooking (1/2 cup of sugar), telling time (quarter past 3), measuring (3/4 inch), sharing things fairly (split the pizza into 8 slices), and understanding sports statistics (made 3 out of 5 free throws).',
      visual: (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="text-4xl mb-2">🍪</div>
            <div className="font-semibold">Cooking</div>
            <div className="text-sm text-gray-600">1/2 cup flour</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="text-4xl mb-2">⏰</div>
            <div className="font-semibold">Time</div>
            <div className="text-sm text-gray-600">1/4 hour = 15 min</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="text-4xl mb-2">📏</div>
            <div className="font-semibold">Measuring</div>
            <div className="text-sm text-gray-600">3/4 inch</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="text-4xl mb-2">⚽</div>
            <div className="font-semibold">Sports</div>
            <div className="text-sm text-gray-600">3/5 goals made</div>
          </div>
        </div>
      )
    },

    {
      type: 'example',
      title: 'Example: Sharing a Chocolate Bar',
      problem: 'You have a chocolate bar with 8 pieces. You eat 3 pieces. What fraction of the chocolate bar did you eat?',
      steps: [
        'Count the total number of pieces: 8 pieces (this is the denominator)',
        'Count how many pieces you ate: 3 pieces (this is the numerator)',
        'Write as a fraction: 3/8 (three out of eight pieces)',
        'Visualize: 3 pieces eaten out of 8 total pieces'
      ],
      solution: '3/8 of the chocolate bar'
    },

    {
      type: 'concept',
      icon: '🔄',
      title: 'Equivalent Fractions',
      content: 'Different fractions can represent the same amount! For example, 1/2 is the same as 2/4, 3/6, or 4/8. These are called equivalent fractions. You create equivalent fractions by multiplying or dividing both the numerator and denominator by the same number.',
      visual: (
        <div className="space-y-4">
          <div className="text-center text-2xl font-bold text-purple-600 mb-4">
            1/2 = 2/4 = 3/6 = 4/8
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-600 mb-1">1/2</div>
              <div className="flex gap-1">
                {[1, 2].map(i => (
                  <div key={i} className={`flex-1 h-12 border-2 border-gray-400 ${i === 1 ? 'bg-purple-500' : 'bg-white'}`} />
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">2/4</div>
              <div className="flex gap-1">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className={`flex-1 h-12 border-2 border-gray-400 ${i <= 2 ? 'bg-purple-500' : 'bg-white'}`} />
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">4/8</div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                  <div key={i} className={`flex-1 h-12 border-2 border-gray-400 ${i <= 4 ? 'bg-purple-500' : 'bg-white'}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    },

    {
      type: 'example',
      title: 'Example: Finding Equivalent Fractions',
      problem: 'Find a fraction equivalent to 2/3',
      steps: [
        'Start with 2/3',
        'Multiply both top and bottom by the same number (let\'s use 2)',
        'Numerator: 2 × 2 = 4',
        'Denominator: 3 × 2 = 6',
        'Result: 4/6 is equivalent to 2/3'
      ],
      solution: '2/3 = 4/6 (and also 6/9, 8/12, etc.)'
    },

    {
      type: 'realworld',
      title: 'Fractions in Real Life',
      scenario: 'Sarah is baking cookies. The recipe calls for 3/4 cup of sugar, but she only has a 1/4 cup measuring cup. How many times does she need to fill the 1/4 cup to get 3/4 cup?',
      visual: (
        <div className="flex justify-center gap-2 my-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-16 h-20 bg-pink-200 border-2 border-pink-400 rounded-b-lg relative overflow-hidden">
                <div className="absolute bottom-0 w-full h-full bg-pink-400"></div>
              </div>
              <div className="text-xs mt-1">1/4 cup</div>
            </div>
          ))}
        </div>
      ),
      explanation: 'Sarah needs to fill the 1/4 cup measuring cup 3 times because 1/4 + 1/4 + 1/4 = 3/4. This shows how fractions help us in everyday tasks like cooking!'
    },

    {
      type: 'concept',
      icon: '🎓',
      title: 'Key Takeaways',
      content: 'Great job learning about fractions! Remember these important points: (1) Fractions represent parts of a whole, (2) The top number (numerator) shows how many parts you have, (3) The bottom number (denominator) shows how many equal parts make the whole, (4) Different fractions can be equivalent (same value), (5) Fractions are used everywhere in real life. Now you\'re ready to practice!',
      visual: (
        <div className="bg-white rounded-lg p-6 space-y-3">
          <div className="flex items-start gap-3">
            <div className="text-2xl">✓</div>
            <div>
              <div className="font-semibold">Numerator (top)</div>
              <div className="text-sm text-gray-600">Parts you have</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="text-2xl">✓</div>
            <div>
              <div className="font-semibold">Denominator (bottom)</div>
              <div className="text-sm text-gray-600">Total equal parts</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="text-2xl">✓</div>
            <div>
              <div className="font-semibold">Equivalent Fractions</div>
              <div className="text-sm text-gray-600">Same value, different numbers (1/2 = 2/4)</div>
            </div>
          </div>
        </div>
      )
    }
  ],

  miniQuiz: {
    question: 'If you have a pizza cut into 8 slices and you eat 3 slices, what fraction of the pizza did you eat?',
    options: [
      '3/8 - Three out of eight slices',
      '5/8 - Five out of eight slices',
      '3/5 - Three out of five slices',
      '8/3 - Eight out of three slices'
    ],
    correctIndex: 0,
    explanation: 'You ate 3 slices out of 8 total slices, so the fraction is 3/8. The numerator (3) represents what you ate, and the denominator (8) represents the total number of slices.'
  }
}
