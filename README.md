# DontWaste Education

An adaptive math learning platform for Grades 1-8 students, featuring personalized learning paths with Hyderabad-specific cultural context.

## Features

- 🎯 **Adaptive Learning**: AI-powered questions that adjust difficulty based on student performance
- 🎨 **Interactive Activities**: Visual fraction shading, multiple-choice questions, and word problems
- 🎮 **Gamification**: Points, badges, and progress tracking
- 🗣️ **Voice Input/Output**: Accessibility features using Web Speech API
- 📊 **Progress Dashboard**: Comprehensive tracking with charts and exportable PDF reports
- ⏱️ **Time Management**: 25-30 minute sessions with timer tracking
- 📱 **Mobile Responsive**: Works seamlessly on all devices

## Tech Stack

- **Frontend**: Next.js 14+, React, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express.js
- **AI**: OpenAI GPT-4o-mini for adaptive question generation
- **Database**: SQLite for progress tracking
- **Additional**: React Konva (Canvas), Chart.js, jsPDF, Canvas Confetti

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- OpenAI API key (get one from [OpenAI](https://platform.openai.com/))

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd Dontwaste
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   
   Create a `.env.local` file in the root directory (or edit the existing one):
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=3001
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

4. **Create the data directory:**
   ```bash
   mkdir -p data
   ```
   (This directory will store the SQLite database)

### Running the Application

1. **Start the backend server** (in one terminal):
   ```bash
   npm run server
   ```
   The server will run on `http://localhost:3001`

2. **Start the Next.js frontend** (in another terminal):
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`

3. **Open your browser** and navigate to `http://localhost:3000`

## Project Structure

```
Dontwaste/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.js          # Root layout
│   └── page.js            # Main page component
├── components/            # React components
│   ├── LandingPage.js     # Landing page
│   ├── Introduction.js    # Introduction phase
│   ├── AdaptiveActivities.js  # Main learning activities
│   ├── Assessment.js      # Final assessment
│   ├── Dashboard.js       # Progress dashboard
│   ├── FractionCanvas.js  # Interactive fraction shading
│   ├── VoiceInput.js      # Voice input component
│   ├── Timer.js           # Timer component
│   └── BadgeAnimation.js  # Badge celebration animation
├── server/                # Backend server
│   └── index.js           # Express server with API routes
├── store/                 # State management
│   └── appStore.js        # Zustand store
├── data/                  # Database storage (created at runtime)
├── package.json           # Dependencies
├── tailwind.config.js     # Tailwind configuration
└── README.md              # This file
```

## Lesson Flow

1. **Landing Page** - Welcome screen with lesson overview
2. **Introduction (5 mins)** - Interactive fraction shading activity
3. **Adaptive Activities (15 mins)** - Two levels of questions:
   - Level 1: Basic visual fraction tasks
   - Level 2: Intermediate operations and word problems
4. **Assessment (5 mins)** - 5-question final quiz
5. **Dashboard** - View progress, badges, and export report

## API Endpoints

The backend server exposes the following endpoints:

- `POST /api/create-session` - Create a new learning session
- `POST /api/generate-question` - Generate adaptive question
- `POST /api/get-feedback` - Get AI feedback on answers
- `POST /api/adapt-level` - Determine level progression
- `POST /api/save-progress` - Save student progress
- `POST /api/award-badge` - Award a badge
- `POST /api/update-score` - Update session scores
- `GET /api/session/:sessionId` - Get session data

## Features in Detail

### Adaptive Learning
- Questions adjust based on student performance
- Automatic level progression when accuracy ≥ 80%
- Hints and scaffolding for struggling students

### Gamification
- Points system (10 for Level 1, 20 for Level 2)
- Badges: First Step, Level 1 Master, Level 2 Master, Level Up
- Confetti animations for achievements

### Voice Features
- Text-to-speech for reading questions
- Speech recognition for voice answers
- Accessible for students with different learning needs

### Progress Tracking
- Real-time score tracking
- Performance charts
- Badge collection
- Exportable PDF reports

## Browser Compatibility

- **Chrome/Edge**: Full support (including voice features)
- **Firefox**: Full support (voice features may vary)
- **Safari**: Full support (voice features limited)

## Troubleshooting

### OpenAI API Errors
- Ensure your API key is correctly set in `.env.local`
- Check your OpenAI account has sufficient credits
- The app includes fallback questions if the API fails

### Database Issues
- Ensure the `data/` directory exists and is writable
- The database is created automatically on first server start

### Voice Input Not Working
- Voice input requires HTTPS in production (works on localhost)
- Use Chrome or Edge for best voice recognition support
- Grant microphone permissions when prompted

## Deployment

### Quick Deploy to Vercel ▶️

The easiest way to deploy this application is using Vercel:

1. **Push to Git**: Commit and push your code to GitHub/GitLab/Bitbucket
2. **Import to Vercel**: Go to [vercel.com](https://vercel.com) and import your repository
3. **Configure Environment Variables**:
   - Add `OPENAI_API_KEY` in Vercel project settings
4. **Deploy**: Click deploy and you're live!

**📖 For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)**

### Important Notes

- ✅ The app uses Next.js API routes (no separate backend needed)
- ✅ Express server (`/server/index.js`) is for local development only
- ✅ Progress is stored in browser local storage (no database required)
- ✅ All features work on Vercel's free tier

### Custom Domain

After deployment, you can add a custom domain in Vercel project settings.

## Future Enhancements

- User authentication and persistent accounts
- Teacher dashboard for monitoring student progress
- More mini-games (fraction pizza builder)
- Multi-language support
- Advanced analytics

## License

This project is created for educational purposes.

## Documentation

For detailed information about the system architecture, syllabus alignment, and how activities are generated:

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Complete architecture documentation including:
  - CBSE syllabus alignment (Grades 5-6)
  - Activity generation system (OpenAI integration)
  - System architecture and data flow
  - Component structure
  - API design
  - Database schema
  - Deployment architecture

- **[SETUP.md](./SETUP.md)** - Quick setup guide
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Technical overview

## Support

For issues or questions, please refer to the project documentation or contact the development team.

---

**Built with ❤️ for Meru International School**

