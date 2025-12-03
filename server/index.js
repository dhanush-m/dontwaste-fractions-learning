const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Root route - helpful message
app.get('/', (req, res) => {
  res.json({
    message: 'Fractions Learning API Server',
    status: 'running',
    endpoints: {
      'POST /api/create-session': 'Create a new learning session',
      'POST /api/generate-question': 'Generate adaptive question',
      'POST /api/get-feedback': 'Get AI feedback on answers',
      'POST /api/adapt-level': 'Determine level progression',
      'POST /api/save-progress': 'Save student progress',
      'POST /api/award-badge': 'Award a badge',
      'POST /api/update-score': 'Update session scores',
      'GET /api/session/:sessionId': 'Get session data'
    },
    frontend: 'Access the frontend at http://localhost:3000'
  });
});

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your-api-key-here',
});

// Initialize SQLite Database
const dbPath = path.join(__dirname, '..', 'data', 'progress.db');
const db = new Database(dbPath);

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed BOOLEAN DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    level INTEGER NOT NULL,
    question_number INTEGER NOT NULL,
    question TEXT NOT NULL,
    answer TEXT,
    is_correct BOOLEAN,
    points_earned INTEGER DEFAULT 0,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES sessions(session_id)
  );

  CREATE TABLE IF NOT EXISTS badges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    badge_name TEXT NOT NULL,
    badge_type TEXT NOT NULL,
    earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES sessions(session_id)
  );

  CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    total_points INTEGER DEFAULT 0,
    level_1_score INTEGER DEFAULT 0,
    level_2_score INTEGER DEFAULT 0,
    assessment_score INTEGER DEFAULT 0,
    time_spent INTEGER DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES sessions(session_id)
  );
`);

// Fallback question bank
const fallbackQuestions = {
  level1: [
    {
      question: "Select 3/4 of the pizza slices. Click on the slices to choose them.",
      type: "visual",
      correctAnswer: "6/8",
      hint: "3/4 means 3 out of every 4 pieces. With 8 slices total, you need 6 slices."
    },
    {
      question: "Pick 2/3 of the cookies from the jar. Click to select them.",
      type: "visual",
      correctAnswer: "8/12",
      hint: "2/3 means 2 out of every 3 cookies. With 12 cookies, you need 8 cookies."
    },
    {
      question: "Choose 1/2 of the books on the shelf. Select the books.",
      type: "visual",
      correctAnswer: "5/10",
      hint: "1/2 means half of the total. With 10 books, you need 5 books."
    },
    {
      question: "Select 5/6 of the balloons. Click to pick them.",
      type: "visual",
      correctAnswer: "5/6",
      hint: "5/6 means 5 out of 6 balloons. Select 5 balloons."
    }
  ],
  level2: [
    {
      question: "Is 2/4 equal to 1/2?",
      type: "equivalent",
      correctAnswer: "yes",
      hint: "Simplify 2/4 by dividing both numbers by 2."
    },
    {
      question: "Add 1/3 + 1/6",
      type: "operation",
      correctAnswer: "1/2",
      hint: "Find a common denominator. 6 is a common denominator for both."
    },
    {
      question: "If Meru school shares 5/8 of playground time for sports, how much is left for recess?",
      type: "word_problem",
      correctAnswer: "3/8",
      hint: "The whole playground time is 8/8. Subtract 5/8 from 8/8."
    }
  ]
};

// Helper function to generate question via OpenAI
async function generateQuestion(level, previousPerformance = null) {
  try {
    const prompt = level === 1
      ? `Generate a practical, real-world visual fraction question for grades 5-6 CBSE curriculum. Use engaging scenarios like:
      - Pizza slices (e.g., "Select 3/4 of the pizza slices")
      - Cookies in a jar (e.g., "Pick 2/3 of the cookies")
      - Books on a shelf (e.g., "Choose 1/2 of the books")
      - Balloons in a bundle (e.g., "Select 5/6 of the balloons")
      Make it interactive and relatable to everyday life at Meru International School. The question should be about selecting items to represent fractions visually. ${previousPerformance ? `Previous performance: ${JSON.stringify(previousPerformance)}. Adjust difficulty accordingly.` : ''}`
      : `Generate an intermediate fraction question for grades 5-6 CBSE curriculum. Include questions about equivalent fractions, adding/subtracting fractions, or word problems with real-world context (like Meru school playground, sports, or recipes). ${previousPerformance ? `Previous performance: ${JSON.stringify(previousPerformance)}. If the student struggled, make it simpler. If they did well, add word problems.` : ''}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful math teacher creating fraction questions for 5th-6th grade students. Always respond with a JSON object containing: {question: string, type: string, correctAnswer: string, hint: string, options: string[] (for multiple choice)}"
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices[0].message.content;
    // Try to parse JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error("Invalid response format");
  } catch (error) {
    console.error("OpenAI error:", error);
    // Return fallback question
    const questions = level === 1 ? fallbackQuestions.level1 : fallbackQuestions.level2;
    return questions[Math.floor(Math.random() * questions.length)];
  }
}

// API Routes

// Generate adaptive question
app.post('/api/generate-question', async (req, res) => {
  try {
    const { level, sessionId, previousPerformance } = req.body;
    const question = await generateQuestion(level, previousPerformance);
    res.json({ success: true, question });
  } catch (error) {
    console.error("Error generating question:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get feedback
app.post('/api/get-feedback', async (req, res) => {
  try {
    const { question, userAnswer, isCorrect } = req.body;
    
    const prompt = `Provide encouraging feedback for a ${isCorrect ? 'correct' : 'incorrect'} answer: "${userAnswer}" to the question: "${question}". 
    If correct, celebrate and connect it to real-world applications (like recipes, sharing, or Meru school activities). 
    If incorrect, provide a gentle hint and encouragement. Keep it brief (2-3 sentences) and age-appropriate for grades 5-6.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an encouraging math teacher providing feedback to 5th-6th grade students."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 200,
    });

    const feedback = completion.choices[0].message.content;
    res.json({ success: true, feedback });
  } catch (error) {
    console.error("Error getting feedback:", error);
    res.json({ 
      success: true, 
      feedback: isCorrect 
        ? "Well done! Fractions help us share things fairly in everyday life, like dividing a chocolate bar among friends at Meru school." 
        : "Not quite right, but keep trying! Remember to think about equal parts. You're doing great!" 
    });
  }
});

// Adapt level based on performance
app.post('/api/adapt-level', async (req, res) => {
  try {
    const { sessionId, currentLevel, performance } = req.body;
    
    // Calculate performance metrics
    const correctCount = performance.filter(p => p.isCorrect).length;
    const totalCount = performance.length;
    const accuracy = (correctCount / totalCount) * 100;

    let newLevel = currentLevel;
    let recommendation = "continue";

    if (currentLevel === 1 && accuracy >= 80 && totalCount >= 5) {
      newLevel = 2;
      recommendation = "advance";
    } else if (currentLevel === 2 && accuracy < 60 && totalCount >= 5) {
      newLevel = 1;
      recommendation = "review";
    }

    res.json({ 
      success: true, 
      newLevel, 
      recommendation,
      accuracy: Math.round(accuracy)
    });
  } catch (error) {
    console.error("Error adapting level:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Save progress
app.post('/api/save-progress', (req, res) => {
  try {
    const { sessionId, level, questionNumber, question, answer, isCorrect, pointsEarned } = req.body;
    
    const stmt = db.prepare(`
      INSERT INTO progress (session_id, level, question_number, question, answer, is_correct, points_earned)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(sessionId, level, questionNumber, question, answer, isCorrect ? 1 : 0, pointsEarned || 0);
    
    res.json({ success: true });
  } catch (error) {
    console.error("Error saving progress:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Award badge
app.post('/api/award-badge', (req, res) => {
  try {
    const { sessionId, badgeName, badgeType } = req.body;
    
    const stmt = db.prepare(`
      INSERT INTO badges (session_id, badge_name, badge_type)
      VALUES (?, ?, ?)
    `);
    
    stmt.run(sessionId, badgeName, badgeType);
    
    res.json({ success: true });
  } catch (error) {
    console.error("Error awarding badge:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update score
app.post('/api/update-score', (req, res) => {
  try {
    const { sessionId, totalPoints, level1Score, level2Score, assessmentScore, timeSpent } = req.body;
    
    // Check if score exists
    const existing = db.prepare('SELECT id FROM scores WHERE session_id = ?').get(sessionId);
    
    if (existing) {
      const stmt = db.prepare(`
        UPDATE scores 
        SET total_points = ?, level_1_score = ?, level_2_score = ?, assessment_score = ?, time_spent = ?, updated_at = CURRENT_TIMESTAMP
        WHERE session_id = ?
      `);
      stmt.run(totalPoints, level1Score, level2Score, assessmentScore, timeSpent, sessionId);
    } else {
      const stmt = db.prepare(`
        INSERT INTO scores (session_id, total_points, level_1_score, level_2_score, assessment_score, time_spent)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      stmt.run(sessionId, totalPoints, level1Score, level2Score, assessmentScore, timeSpent);
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error("Error updating score:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get session data
app.get('/api/session/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const progress = db.prepare('SELECT * FROM progress WHERE session_id = ? ORDER BY timestamp').all(sessionId);
    const badges = db.prepare('SELECT * FROM badges WHERE session_id = ?').all(sessionId);
    const score = db.prepare('SELECT * FROM scores WHERE session_id = ?').get(sessionId);
    
    res.json({ 
      success: true, 
      progress, 
      badges, 
      score: score || { total_points: 0, level_1_score: 0, level_2_score: 0, assessment_score: 0, time_spent: 0 }
    });
  } catch (error) {
    console.error("Error getting session:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create session
app.post('/api/create-session', (req, res) => {
  try {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const stmt = db.prepare('INSERT INTO sessions (session_id) VALUES (?)');
    stmt.run(sessionId);
    
    res.json({ success: true, sessionId });
  } catch (error) {
    console.error("Error creating session:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Game API Endpoints

// Start Pizza Builder game
app.post('/api/games/pizza-builder/start', async (req, res) => {
  try {
    const { sessionId } = req.body;
    
    // Generate pizza order via OpenAI or use fallback
    try {
      const prompt = `Create a pizza order for a fraction learning game. The order should require students to add specific fractions of toppings (e.g., "Add 3/8 cheese and 2/8 pepperoni"). Make it engaging and suitable for grades 5-6. Return JSON: {instruction: string, targetFractions: {topping: number}, totalSlices: number}`;
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are creating educational pizza orders for fraction learning." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 200,
      });
      
      const response = completion.choices[0].message.content;
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const order = JSON.parse(jsonMatch[0]);
        res.json({ success: true, order, slices: order.totalSlices || 8 });
        return;
      }
    } catch (error) {
      console.error("OpenAI error for pizza builder:", error);
    }
    
    // Fallback order
    const fallbackOrder = {
      instruction: 'Add 3/8 cheese and 2/8 pepperoni to the pizza',
      targetFractions: { cheese: 3, pepperoni: 2 },
      totalSlices: 8,
    };
    
    res.json({ success: true, order: fallbackOrder, slices: 8 });
  } catch (error) {
    console.error("Error starting pizza builder:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start Fraction War game
app.post('/api/games/fraction-war/start', async (req, res) => {
  try {
    const { sessionId, difficulty = 'basic' } = req.body;
    
    // Generate deck based on difficulty
    const generateDeck = (diff) => {
      const deck = [];
      if (diff === 'basic') {
        for (let den = 2; den <= 8; den++) {
          for (let num = 1; num < den; num++) {
            deck.push({ numerator: num, denominator: den, value: num / den });
          }
        }
      } else if (diff === 'intermediate') {
        deck.push(
          { numerator: 1, denominator: 2, value: 0.5 },
          { numerator: 2, denominator: 4, value: 0.5 },
          { numerator: 3, denominator: 6, value: 0.5 },
          { numerator: 1, denominator: 3, value: 1/3 },
          { numerator: 2, denominator: 6, value: 1/3 },
          { numerator: 3, denominator: 4, value: 0.75 },
          { numerator: 5, denominator: 8, value: 0.625 },
          { numerator: 7, denominator: 8, value: 0.875 },
        );
      } else {
        deck.push(
          { numerator: 1, denominator: 2, value: 0.5 },
          { numerator: 3, denominator: 6, value: 0.5 },
          { numerator: 2, denominator: 3, value: 2/3 },
          { numerator: 4, denominator: 6, value: 2/3 },
          { numerator: 3, denominator: 4, value: 0.75 },
          { numerator: 6, denominator: 8, value: 0.75 },
          { numerator: 5, denominator: 6, value: 5/6 },
          { numerator: 7, denominator: 8, value: 0.875 },
        );
      }
      
      // Shuffle
      for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }
      
      return deck;
    };
    
    const deck = generateDeck(difficulty);
    const mid = Math.floor(deck.length / 2);
    
    res.json({
      success: true,
      playerDeck: deck.slice(0, mid),
      aiDeck: deck.slice(mid),
    });
  } catch (error) {
    console.error("Error starting fraction war:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Save game state
app.post('/api/games/save-game-state', (req, res) => {
  try {
    const { sessionId, gameType, gameState, score, completed } = req.body;
    
    // Create game_sessions table if it doesn't exist
    db.exec(`
      CREATE TABLE IF NOT EXISTS game_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT NOT NULL,
        game_type TEXT NOT NULL,
        game_state TEXT,
        score INTEGER DEFAULT 0,
        completed BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES sessions(session_id)
      );
    `);
    
    const stmt = db.prepare(`
      INSERT INTO game_sessions (session_id, game_type, game_state, score, completed)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      sessionId,
      gameType,
      gameState ? JSON.stringify(gameState) : null,
      score || 0,
      completed ? 1 : 0
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error("Error saving game state:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Save wasted time
app.post('/api/save-wasted-time', (req, res) => {
  try {
    const { sessionId, wastedTime } = req.body;
    
    // Create wasted_time table if it doesn't exist
    db.exec(`
      CREATE TABLE IF NOT EXISTS wasted_time (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT NOT NULL,
        wasted_time INTEGER DEFAULT 0,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES sessions(session_id)
      );
    `);
    
    // Check if record exists
    const existing = db.prepare('SELECT id FROM wasted_time WHERE session_id = ?').get(sessionId);
    
    if (existing) {
      const stmt = db.prepare('UPDATE wasted_time SET wasted_time = ?, updated_at = CURRENT_TIMESTAMP WHERE session_id = ?');
      stmt.run(wastedTime, sessionId);
    } else {
      const stmt = db.prepare('INSERT INTO wasted_time (session_id, wasted_time) VALUES (?, ?)');
      stmt.run(sessionId, wastedTime);
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving wasted time:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get leaderboard
app.get('/api/leaderboard/:gameType', (req, res) => {
  try {
    const { gameType } = req.params;
    
    const stmt = db.prepare(`
      SELECT session_id, MAX(score) as max_score, COUNT(*) as games_played
      FROM game_sessions
      WHERE game_type = ? AND completed = 1
      GROUP BY session_id
      ORDER BY max_score DESC
      LIMIT 10
    `);
    
    const leaderboard = stmt.all(gameType);
    
    res.json({ success: true, leaderboard });
  } catch (error) {
    console.error("Error getting leaderboard:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

