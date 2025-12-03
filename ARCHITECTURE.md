# Architecture & Syllabus Documentation

## Table of Contents
1. [Syllabus Alignment](#syllabus-alignment)
2. [Activity Generation System](#activity-generation-system)
3. [System Architecture](#system-architecture)
4. [Data Flow](#data-flow)
5. [Component Structure](#component-structure)
6. [API Design](#api-design)
7. [Database Schema](#database-schema)

---

## Syllabus Alignment

### CBSE Curriculum (Grades 5-6)

This application is aligned with the **Central Board of Secondary Education (CBSE)** curriculum, specifically targeting **NCERT Mathematics** standards for Grades 5-6. The content follows the competency-based education framework adopted by schools like Meru International School.

### Learning Objectives

#### Grade 5 Standards
- **Understanding Fractions as Parts of a Whole**
  - Visual representation of fractions
  - Identifying fractions from shapes and objects
  - Comparing fractions with same denominator
  - Equivalent fractions (e.g., 1/2 = 2/4)

#### Grade 6 Standards
- **Operations with Fractions**
  - Addition and subtraction of fractions with same denominator
  - Addition and subtraction of fractions with different denominators
  - Word problems involving fractions
  - Real-world applications (sharing, recipes, measurements)

### Lesson Structure (25-30 minutes)

1. **Introduction Phase (5 minutes)**
   - Interactive fraction shading activity
   - Real-world context: "Dividing a chocolate bar among friends"
   - Visual learning: Shade 3/4 of a rectangle
   - Learning Outcome: Understanding fractions as parts of a whole

2. **Adaptive Activities Phase (15 minutes)**
   - **Level 1 (Basic)**: Visual fraction tasks
     - Shading fractions in shapes
     - Identifying fractions from visual representations
     - Basic equivalent fraction recognition
   - **Level 2 (Intermediate)**: Operations and applications
     - Adding/subtracting fractions
     - Word problems with real-world context
     - Equivalent fraction calculations
     - Meru school-specific scenarios (playground time, sports, recipes)

3. **Assessment Phase (5 minutes)**
   - 5-question comprehensive quiz
   - Mix of visual, operational, and word problems
   - Minimum 70% required for completion

4. **Dashboard Phase**
   - Progress visualization
   - Badge collection
   - Performance analytics
   - Exportable reports

### Competency-Based Learning Approach

The application follows CBSE's competency-based education principles:

- **Knowledge**: Understanding fraction concepts
- **Understanding**: Applying fractions to real-world scenarios
- **Application**: Solving word problems
- **Analysis**: Comparing and evaluating fractions
- **Synthesis**: Creating fraction representations
- **Evaluation**: Self-assessment through feedback

---

## Activity Generation System

### AI-Powered Question Generation

The application uses **OpenAI GPT-4o-mini** to generate adaptive, personalized questions based on:

1. **Student Performance History**
   - Previous answers (correct/incorrect)
   - Response patterns
   - Time spent on questions
   - Difficulty level progression

2. **Adaptive Prompts**

   **Level 1 Prompt Template:**
   ```
   Generate an easy visual fraction question for grades 5-6 CBSE curriculum. 
   The question should be about shading fractions or identifying fractions 
   from visual representations. Make it engaging and suitable for students 
   at Meru International School. 
   [Previous performance data if available]
   ```

   **Level 2 Prompt Template:**
   ```
   Generate an intermediate fraction question for grades 5-6 CBSE curriculum. 
   Include questions about equivalent fractions, adding/subtracting fractions, 
   or word problems with real-world context (like Meru school playground, 
   sports, or recipes). 
   [Previous performance data if available]
   If the student struggled, make it simpler. 
   If they did well, add word problems.
   ```

3. **Response Format**
   - Questions are returned as JSON objects:
     ```json
     {
       "question": "Shade 3/4 of the rectangle below.",
       "type": "visual",
       "correctAnswer": "3/4",
       "hint": "Divide into 4 equal parts and shade 3.",
       "options": ["3/4", "1/4", "2/4", "4/4"]
     }
     ```

### Fallback Question Bank

To ensure reliability, the system includes a **pre-generated question bank** that activates when:

- OpenAI API is unavailable
- API rate limits are exceeded
- Network connectivity issues occur
- API key is invalid

**Fallback Questions Structure:**
```javascript
{
  level1: [
    {
      question: "Shade 3/4 of the rectangle below.",
      type: "visual",
      correctAnswer: "3/4",
      hint: "Divide the shape into 4 equal parts and color 3 of them."
    },
    // ... more questions
  ],
  level2: [
    {
      question: "Is 2/4 equal to 1/2?",
      type: "equivalent",
      correctAnswer: "yes",
      hint: "Simplify 2/4 by dividing both numbers by 2."
    },
    // ... more questions
  ]
}
```

### Adaptive Level Progression

The system automatically adjusts difficulty based on performance:

- **Level 1 → Level 2**: 
  - Trigger: ≥80% accuracy AND ≥5 questions answered
  - Action: Unlock intermediate questions, award "Level Up" badge

- **Level 2 → Assessment**:
  - Trigger: ≥5 questions answered in Level 2 OR total time ≥14 minutes
  - Action: Proceed to final assessment

- **Scaffolding**:
  - If accuracy <60%: Provide simpler questions
  - If accuracy ≥80%: Introduce word problems
  - Real-time hints based on incorrect answers

### Feedback Generation

AI generates personalized feedback for each answer:

**Correct Answer Feedback:**
- Celebrates success
- Connects to real-world applications
- Encourages continued learning
- Example: "Well done! Fractions help us share things fairly in everyday life, like dividing a chocolate bar among friends at Meru school."

**Incorrect Answer Feedback:**
- Provides gentle encouragement
- Offers hints without giving away the answer
- Suggests strategies
- Example: "Not quite right, but keep trying! Remember to think about equal parts. You're doing great!"

---

## System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Client (Browser)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Next.js    │  │   React     │  │   Zustand   │       │
│  │   Frontend   │  │ Components  │  │   Store     │       │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘       │
│         │                 │                  │                │
│         └─────────────────┼──────────────────┘                │
│                           │                                    │
└───────────────────────────┼────────────────────────────────────┘
                            │ HTTP/REST API
                            │
┌───────────────────────────┼────────────────────────────────────┐
│                    Backend Server                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Express    │  │   OpenAI    │  │   SQLite     │       │
│  │     API      │  │     API     │  │  Database    │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└───────────────────────────────────────────────────────────────┘
```

### Technology Stack

#### Frontend
- **Framework**: Next.js 14+ (React 18)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Canvas**: React Konva (client-side only)
- **State Management**: Zustand with persistence
- **Charts**: Chart.js + react-chartjs-2
- **PDF Export**: jsPDF
- **Voice**: Web Speech API (browser native)

#### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **AI Integration**: OpenAI SDK (GPT-4o-mini)
- **Database**: SQLite (better-sqlite3)
- **CORS**: Enabled for cross-origin requests

#### Infrastructure
- **Development**: Local development servers
- **Deployment Ready**: Vercel (frontend), Railway/Render (backend)
- **Database**: File-based SQLite (can migrate to PostgreSQL)

---

## Data Flow

### Session Initialization Flow

```
1. User opens application
   ↓
2. Frontend calls POST /api/create-session
   ↓
3. Backend generates unique sessionId
   ↓
4. Backend creates session record in SQLite
   ↓
5. Frontend stores sessionId in Zustand store + localStorage
   ↓
6. User proceeds to Introduction phase
```

### Question Generation Flow

```
1. User completes Introduction
   ↓
2. Frontend calls POST /api/generate-question
   │  Body: { level: 1, sessionId, previousPerformance }
   ↓
3. Backend checks previousPerformance array
   ↓
4. Backend constructs adaptive prompt for OpenAI
   ↓
5. OpenAI API call (or fallback to question bank)
   ↓
6. Backend returns question JSON
   ↓
7. Frontend displays question to user
```

### Answer Submission Flow

```
1. User submits answer
   ↓
2. Frontend validates answer locally
   ↓
3. Frontend calls POST /api/get-feedback
   │  Body: { question, userAnswer, isCorrect }
   ↓
4. Backend generates AI feedback
   ↓
5. Frontend calls POST /api/save-progress
   │  Body: { sessionId, level, question, answer, isCorrect, points }
   ↓
6. Backend saves to SQLite progress table
   ↓
7. Frontend updates Zustand store
   ↓
8. Frontend checks for badge eligibility
   ↓
9. If eligible, calls POST /api/award-badge
```

### Level Adaptation Flow

```
1. User answers ≥5 questions in current level
   ↓
2. Frontend calls POST /api/adapt-level
   │  Body: { sessionId, currentLevel, performance }
   ↓
3. Backend calculates accuracy percentage
   ↓
4. Backend determines recommendation:
   │  - advance: accuracy ≥80% AND level 1
   │  - review: accuracy <60% AND level 2
   │  - continue: otherwise
   ↓
5. Frontend updates level in Zustand store
   ↓
6. Frontend loads new question for new level
```

### Assessment Completion Flow

```
1. User completes 5 assessment questions
   ↓
2. Frontend calculates final score
   ↓
3. Frontend calls POST /api/update-score
   │  Body: { sessionId, assessmentScore, totalPoints, timeSpent }
   ↓
4. Backend updates scores table
   ↓
5. Frontend navigates to Dashboard
   ↓
6. Dashboard calls GET /api/session/:sessionId
   ↓
7. Backend returns complete session data
   ↓
8. Dashboard displays charts, badges, progress
```

---

## Component Structure

### Frontend Components Hierarchy

```
app/
├── page.js (Root - Phase Router)
│   ├── LandingPage
│   ├── Introduction
│   │   ├── FractionCanvas (React Konva)
│   │   ├── VoiceInput (Web Speech API)
│   │   └── Timer
│   ├── AdaptiveActivities
│   │   ├── Timer
│   │   ├── VoiceInput
│   │   └── BadgeAnimation (Confetti)
│   ├── Assessment
│   │   └── Timer
│   └── Dashboard
│       ├── Chart.js (Performance Charts)
│       └── jsPDF (Export)
│
store/
└── appStore.js (Zustand - Global State)
    ├── Session Management
    ├── Progress Tracking
    ├── Points & Badges
    └── Phase Navigation
```

### Component Responsibilities

#### LandingPage
- **Purpose**: Welcome screen and lesson overview
- **State**: None (stateless)
- **Actions**: Navigate to Introduction

#### Introduction
- **Purpose**: 5-minute interactive introduction
- **State**: 
  - `shadedFraction`: Current fraction state
  - `isComplete`: Activity completion status
  - `timeElapsed`: Timer state
- **Features**:
  - Interactive fraction shading (FractionCanvas)
  - Voice input/output
  - Auto-advance after 5 minutes

#### AdaptiveActivities
- **Purpose**: Main learning phase (15 minutes)
- **State**:
  - `currentQuestion`: Current question object
  - `userAnswer`: User's input
  - `showFeedback`: Feedback visibility
  - `questionNumber`: Progress counter
  - `currentLevel`: 1 or 2
- **Features**:
  - Dynamic question loading
  - Real-time feedback
  - Badge awards
  - Level progression
  - Voice input support

#### Assessment
- **Purpose**: Final evaluation (5 minutes)
- **State**:
  - `questions`: Array of 5 questions
  - `answers`: User's answers object
  - `currentQuestionIndex`: Navigation
  - `score`: Final percentage
- **Features**:
  - Multiple-choice questions
  - Score calculation
  - Pass/fail determination

#### Dashboard
- **Purpose**: Progress visualization and reporting
- **State**:
  - `sessionData`: Complete session information
  - Charts data
- **Features**:
  - Performance charts (Chart.js)
  - Badge display
  - PDF export (jsPDF)
  - Session summary

### State Management (Zustand)

```javascript
{
  // Session
  sessionId: string | null
  currentPhase: 'landing' | 'introduction' | 'activities' | 'assessment' | 'dashboard'
  currentLevel: 1 | 2
  
  // Progress
  points: number
  badges: Array<{name: string, type: string}>
  questionsAnswered: number
  correctAnswers: number
  performance: Array<{isCorrect: boolean, question: string, answer: string}>
  
  // Timer
  timeSpent: number (seconds)
  startTime: number (timestamp)
  
  // Actions
  initializeSession()
  setPhase(phase)
  setLevel(level)
  addPoints(points)
  addBadge(badge)
  recordAnswer(isCorrect, question, answer)
  updateTimeSpent()
  reset()
}
```

**Persistence**: Zustand persists `sessionId`, `currentPhase`, `points`, and `badges` to localStorage.

---

## API Design

### Endpoint Specifications

#### 1. Create Session
```
POST /api/create-session
Request Body: {} (empty)
Response: {
  success: boolean,
  sessionId: string
}
```

#### 2. Generate Question
```
POST /api/generate-question
Request Body: {
  level: number (1 or 2),
  sessionId: string,
  previousPerformance?: Array<{
    isCorrect: boolean,
    question: string,
    answer: string
  }>
}
Response: {
  success: boolean,
  question: {
    question: string,
    type: 'visual' | 'equivalent' | 'operation' | 'word_problem',
    correctAnswer: string,
    hint: string,
    options?: string[]
  }
}
```

#### 3. Get Feedback
```
POST /api/get-feedback
Request Body: {
  question: string,
  userAnswer: string,
  isCorrect: boolean
}
Response: {
  success: boolean,
  feedback: string
}
```

#### 4. Adapt Level
```
POST /api/adapt-level
Request Body: {
  sessionId: string,
  currentLevel: number,
  performance: Array<{
    isCorrect: boolean,
    question: string,
    answer: string
  }>
}
Response: {
  success: boolean,
  newLevel: number,
  recommendation: 'advance' | 'review' | 'continue',
  accuracy: number (percentage)
}
```

#### 5. Save Progress
```
POST /api/save-progress
Request Body: {
  sessionId: string,
  level: number,
  questionNumber: number,
  question: string,
  answer: string,
  isCorrect: boolean,
  pointsEarned: number
}
Response: {
  success: boolean
}
```

#### 6. Award Badge
```
POST /api/award-badge
Request Body: {
  sessionId: string,
  badgeName: string,
  badgeType: 'bronze' | 'silver' | 'gold'
}
Response: {
  success: boolean
}
```

#### 7. Update Score
```
POST /api/update-score
Request Body: {
  sessionId: string,
  totalPoints: number,
  level1Score?: number,
  level2Score?: number,
  assessmentScore: number,
  timeSpent: number
}
Response: {
  success: boolean
}
```

#### 8. Get Session Data
```
GET /api/session/:sessionId
Response: {
  success: boolean,
  progress: Array<ProgressRecord>,
  badges: Array<BadgeRecord>,
  score: {
    total_points: number,
    level_1_score: number,
    level_2_score: number,
    assessment_score: number,
    time_spent: number
  }
}
```

---

## Database Schema

### SQLite Tables

#### 1. sessions
```sql
CREATE TABLE sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed BOOLEAN DEFAULT 0
);
```

**Purpose**: Track learning sessions
**Indexes**: `session_id` (UNIQUE)

#### 2. progress
```sql
CREATE TABLE progress (
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
```

**Purpose**: Record each question answered
**Indexes**: `session_id` (for queries)

#### 3. badges
```sql
CREATE TABLE badges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  badge_name TEXT NOT NULL,
  badge_type TEXT NOT NULL,
  earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES sessions(session_id)
);
```

**Purpose**: Track badges earned
**Badge Types**: 'bronze', 'silver', 'gold'

#### 4. scores
```sql
CREATE TABLE scores (
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
```

**Purpose**: Aggregate session scores
**Scores**: Stored as percentages (0-100)

### Data Relationships

```
sessions (1) ──< (many) progress
sessions (1) ──< (many) badges
sessions (1) ──< (1) scores
```

### Query Patterns

**Get complete session data:**
```sql
SELECT * FROM sessions WHERE session_id = ?;
SELECT * FROM progress WHERE session_id = ? ORDER BY timestamp;
SELECT * FROM badges WHERE session_id = ?;
SELECT * FROM scores WHERE session_id = ?;
```

**Calculate accuracy:**
```sql
SELECT 
  COUNT(*) as total,
  SUM(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END) as correct
FROM progress 
WHERE session_id = ? AND level = ?;
```

---

## Security Considerations

### API Security
- **CORS**: Configured for localhost (update for production)
- **Input Validation**: All user inputs validated before database operations
- **SQL Injection**: Parameterized queries (better-sqlite3 handles this)
- **Rate Limiting**: Not implemented (add for production)

### Data Privacy
- **Session IDs**: Randomly generated, not tied to user identity
- **No PII**: No personally identifiable information stored
- **Local Storage**: Session data persisted locally (can be cleared)

### OpenAI API
- **API Key**: Stored in `.env.local` (never committed)
- **Error Handling**: Graceful fallback if API fails
- **Cost Control**: Using GPT-4o-mini (lower cost model)

---

## Deployment Architecture

### Development
```
localhost:3000 (Next.js) ──> localhost:3001 (Express)
                              └──> SQLite (local file)
                              └──> OpenAI API (external)
```

### Production (Recommended)
```
Vercel (Frontend)
  └──> Railway/Render (Backend API)
        └──> PostgreSQL (Database)
        └──> OpenAI API (external)
```

### Environment Variables

**Frontend (.env.local):**
```
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

**Backend (.env):**
```
OPENAI_API_KEY=sk-...
PORT=3001
DATABASE_URL=postgresql://... (if using PostgreSQL)
```

---

## Performance Optimizations

### Frontend
- **Code Splitting**: Next.js automatic code splitting
- **Dynamic Imports**: React Konva loaded only on client
- **Image Optimization**: Next.js Image component (if added)
- **Caching**: Zustand persistence reduces API calls

### Backend
- **Database Indexing**: Indexed on session_id
- **Connection Pooling**: SQLite file-based (no pooling needed)
- **API Caching**: Not implemented (consider Redis for production)
- **Error Handling**: Graceful degradation with fallbacks

---

## Future Enhancements

### Educational
- [ ] Multi-language support (Hindi, regional languages)
- [ ] Video integration (TimeBack-style attention tracking)
- [ ] Fraction pizza builder mini-game
- [ ] Collaborative learning features
- [ ] Teacher dashboard for monitoring

### Technical
- [ ] User authentication system
- [ ] Cloud database (PostgreSQL)
- [ ] Real-time analytics
- [ ] Advanced AI prompt engineering
- [ ] A/B testing framework
- [ ] Mobile app (React Native)

### Accessibility
- [ ] Screen reader optimization
- [ ] Keyboard navigation
- [ ] High contrast mode toggle
- [ ] Font size adjustment
- [ ] Multiple language support

---

## Enhanced Features (New)

### Gamification System

The application now includes interactive mini-games to boost engagement:

#### Available Games

1. **Fraction Pizza Builder** 🍕
   - Drag-and-drop toppings to represent fractions
   - Adaptive difficulty based on performance
   - Real-time feedback and scoring
   - Badge rewards: "Pizza Master"

2. **Fraction War** ⚔️
   - Card comparison game
   - Adaptive deck generation (basic/intermediate/advanced)
   - Score tracking and leaderboards
   - Badge rewards: "Fraction Warrior"

3. **Coming Soon**
   - Fraction Bingo
   - Spin to Win
   - Paper Plate Fractions
   - Collaborative Partner Games

#### Game Integration

- **Unlock Mechanism**: Games unlock after answering 3+ questions
- **API Endpoints**: 
  - `POST /api/games/pizza-builder/start`
  - `POST /api/games/fraction-war/start`
  - `POST /api/games/save-game-state`
  - `GET /api/leaderboard/:gameType`

- **Database**: New `game_sessions` table tracks game performance
- **State Management**: Extended Zustand store for game states

### Enhanced Architecture

```
components/
├── games/
│   ├── FractionPizzaBuilder.js    # Drag-drop pizza game
│   ├── FractionWar.js             # Card comparison game
│   └── [More games coming...]
├── GamesMenu.js                    # Games selection menu
└── [Existing components...]
```

### Implementation Status

✅ **Completed:**
- Pizza Builder game with drag-drop
- Fraction War card game
- Games menu and navigation
- API endpoints for games
- Database schema for game tracking

🚧 **In Progress:**
- Leaderboard display
- More game types
- Collaborative features

📋 **Planned:**
- Fraction Bingo
- Spin to Win spinner
- Paper Plate manipulatives
- Real-world survey activities
- Collaborative multiplayer games

See `ENHANCEMENTS.md` for detailed implementation guide.

## References

- **CBSE Curriculum**: [NCERT Mathematics Grades 5-6](https://ncert.nic.in/)
- **OpenAI API**: [GPT-4o-mini Documentation](https://platform.openai.com/docs/)
- **Next.js**: [Next.js 14 Documentation](https://nextjs.org/docs)
- **React Konva**: [React Konva Documentation](https://konvajs.org/docs/react/)
- **React DnD**: [React DnD Documentation](https://react-dnd.github.io/react-dnd/)

---

**Document Version**: 1.1  
**Last Updated**: December 2024  
**Maintained By**: Development Team

