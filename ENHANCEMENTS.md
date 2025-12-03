# Enhancement Implementation Guide

## Overview

This document outlines the implementation of enhanced gamification, interactive manipulatives, collaborative features, and multimedia elements to boost engagement in the Fractions Learning Module.

## Implementation Priority

### Phase 1: Core Gamification (High Priority)
1. Fraction Pizza Builder (Mini-game)
2. Fraction War Card Game
3. Enhanced Badge System
4. Leaderboard System

### Phase 2: Interactive Manipulatives (Medium Priority)
1. Paper Plate Fractions
2. Fraction Spin to Win
3. Roll a Fraction Dice Game

### Phase 3: Real-World Activities (Medium Priority)
1. Fraction of the Day Poll
2. Class Survey Integration
3. Image Annotation Tool

### Phase 4: Collaborative Features (Lower Priority)
1. Fraction Partner Matching
2. Multiplayer Lobbies
3. Group Challenges

## Component Structure

```
components/
├── games/
│   ├── FractionPizzaBuilder.js    # Drag-drop pizza game
│   ├── FractionWar.js             # Card comparison game
│   ├── FractionBingo.js           # Bingo game
│   ├── FractionSpin.js            # Spinner game
│   └── PaperPlateFractions.js     # Manipulative tool
├── collaborative/
│   ├── FractionPartner.js         # Partner matching
│   └── GroupChallenge.js           # Team activities
└── realworld/
    ├── FractionOfTheDay.js         # Daily poll
    └── ImageAnnotator.js           # Image fraction finder
```

## Database Schema Updates

```sql
-- Game sessions tracking
CREATE TABLE game_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  game_type TEXT NOT NULL,
  game_state TEXT,  -- JSON string
  score INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES sessions(session_id)
);

-- Leaderboard
CREATE TABLE leaderboards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  game_type TEXT NOT NULL,
  score INTEGER NOT NULL,
  rank INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES sessions(session_id)
);

-- Collaborative sessions
CREATE TABLE collaborative_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  room_id TEXT UNIQUE NOT NULL,
  host_session_id TEXT NOT NULL,
  participants TEXT,  -- JSON array of session_ids
  game_type TEXT NOT NULL,
  status TEXT DEFAULT 'waiting',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints to Add

```
POST /api/games/pizza-builder/start
POST /api/games/fraction-war/start
POST /api/games/bingo/start
POST /api/games/save-game-state
GET /api/leaderboard/:gameType
POST /api/collaborative/create-room
POST /api/collaborative/join-room
GET /api/collaborative/room/:roomId
```

## Integration Points

1. **Adaptive Activities Component**: Add "Mini-Games" section after Level 2
2. **Dashboard**: Add leaderboard section
3. **Badge System**: Add game-specific badges
4. **State Management**: Extend Zustand store for game states
