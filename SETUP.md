# Quick Setup Guide

## Prerequisites
- Node.js 18+ installed
- npm package manager
- OpenAI API key

## Installation Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   - Open `.env.local` file
   - Replace `your_openai_api_key_here` with your actual OpenAI API key
   - Save the file

3. **Create data directory:**
   ```bash
   mkdir -p data
   ```

4. **Start the application:**

   **Option A: Run both servers separately (Recommended)**
   
   Terminal 1 (Backend):
   ```bash
   npm run server
   ```
   
   Terminal 2 (Frontend):
   ```bash
   npm run dev
   ```

   **Option B: Use the start script (if on Mac/Linux)**
   ```bash
   chmod +x scripts/start.sh
   ./scripts/start.sh
   ```

5. **Open your browser:**
   - Navigate to `http://localhost:3000`
   - The backend API will be running on `http://localhost:3001`

## Troubleshooting

### Port Already in Use
If port 3000 or 3001 is already in use:
- Change `PORT` in `.env.local` for backend
- Change port in `package.json` scripts for frontend

### OpenAI API Errors
- Verify your API key is correct
- Check your OpenAI account has credits
- The app includes fallback questions if API fails

### Database Issues
- Ensure `data/` directory exists and is writable
- Database is created automatically on first run

### Voice Features Not Working
- Use Chrome or Edge for best support
- Grant microphone permissions when prompted
- Voice features require HTTPS in production (works on localhost)

## Next Steps

1. Test the application flow:
   - Landing page → Introduction → Activities → Assessment → Dashboard
2. Try voice input features
3. Complete a full session to see progress tracking
4. Export a PDF report from the dashboard

## Development

- Frontend code: `app/` and `components/`
- Backend API: `server/index.js`
- State management: `store/appStore.js`
- Database: SQLite in `data/progress.db`

Happy learning! 🎓

