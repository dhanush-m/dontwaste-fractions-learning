# Deploying DontWaste Education to Vercel

This guide will help you deploy the DontWaste Education platform to Vercel for production use.

## Prerequisites

Before you begin, make sure you have:
- A [Vercel account](https://vercel.com/signup) (free tier is sufficient)
- An [OpenAI API key](https://platform.openai.com/api-keys)
- Git installed on your computer
- Your project pushed to GitHub, GitLab, or Bitbucket

---

## Step 1: Prepare Your Repository

### 1.1 Push Your Code to Git

If you haven't already, push your code to a Git repository:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 1.2 Verify Environment Files

Make sure these files exist and are properly configured:
- `.env.example` - Template for local development
- `.env.production` - Template for production (don't commit with real values!)
- `.gitignore` - Should include `.env.local` and `.env.production`

---

## Step 2: Import Project to Vercel

### 2.1 Sign in to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub/GitLab/Bitbucket account

### 2.2 Import Your Repository
1. Click **"Add New..."** → **"Project"**
2. Select your Git provider (GitHub/GitLab/Bitbucket)
3. Find and import `dontwaste-fractions-learning` repository
4. Click **"Import"**

---

## Step 3: Configure Project Settings

### 3.1 Framework Preset
- Vercel should automatically detect **Next.js**
- If not, select "Next.js" from the Framework Preset dropdown

### 3.2 Build Settings
Leave these as default:
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 3.3 Root Directory
- Leave as `.` (root)

---

## Step 4: Configure Environment Variables

This is **CRITICAL** for the app to work properly.

### 4.1 Add OpenAI API Key

1. In the Vercel project settings, find **"Environment Variables"** section
2. Add the following variable:

   **Name**: `OPENAI_API_KEY`
   **Value**: `sk-your-actual-openai-api-key-here`
   **Environment**: Select all (Production, Preview, Development)

3. Click **"Add"**

### 4.2 Add Public API URL (Optional)

   **Name**: `NEXT_PUBLIC_API_URL`
   **Value**: (Leave empty - not needed for Vercel deployment)
   **Environment**: Production

---

## Step 5: Deploy

### 5.1 Initial Deployment

1. Click **"Deploy"** button
2. Wait for the build to complete (usually 2-3 minutes)
3. You'll see a success message with your deployment URL

### 5.2 Verify Deployment

Your app will be available at:
```
https://your-project-name.vercel.app
```

Test the following:
- ✅ Landing page loads
- ✅ Can enter name and proceed
- ✅ Pre-assessment works
- ✅ Lessons display correctly
- ✅ AI Guru chatbot responds (if enabled)

---

## Step 6: Custom Domain (Optional)

### 6.1 Add Your Domain

1. Go to Project Settings → **Domains**
2. Click **"Add"**
3. Enter your domain name (e.g., `learn.dontwaste.com`)
4. Follow DNS configuration instructions

### 6.2 Configure DNS

Add these records to your domain provider:
- **Type**: A or CNAME
- **Name**: Your subdomain or @
- **Value**: Provided by Vercel

---

## Important Notes

### About the Express Server

**NOTE**: The `/server/index.js` Express server is **NOT needed** for Vercel deployment. The app uses Next.js API routes instead:

- ✅ **Chat API**: `/app/api/chat/route.js` (already implemented)
- ❌ **Express Server**: `/server/index.js` (not used in production)

The Express server was for local development only. All API functionality is now handled by Next.js serverless functions.

### About SQLite Database

**IMPORTANT**: The SQLite database (`better-sqlite3`) is **NOT supported** on Vercel's serverless platform.

**Current Status**:
- The app works without the database
- Progress is stored in browser local storage (via Zustand persist)
- Database-related code in `/server/index.js` is not used

**Future Enhancement** (Optional):
If you need persistent server-side storage, consider:
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) (recommended)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [PlanetScale](https://planetscale.com/)
- [Supabase](https://supabase.com/)

---

## Deployment Checklist

Before going live, verify:

- [ ] OpenAI API key is configured in Vercel
- [ ] Landing page shows "DontWaste Education" branding
- [ ] Name input works and proceeds to welcome screen
- [ ] Pre-assessment displays 5 questions
- [ ] Chapters (Fractions, Decimals, Percentages, Number Sense) load
- [ ] Lessons display without blank slides
- [ ] XP and leveling system works
- [ ] Streak tracking increments daily
- [ ] Progress persists in browser
- [ ] AI Guru chatbot (if enabled) responds correctly
- [ ] No console errors in browser DevTools
- [ ] Mobile responsive design works
- [ ] Performance is acceptable (load time < 3 seconds)

---

## Continuous Deployment

### Automatic Deployments

Vercel automatically deploys your app when you push to your Git repository:

1. **Production**: Pushes to `main` branch
2. **Preview**: Pushes to other branches (feature branches)

### Manual Deployment

To trigger a manual deployment:
```bash
git add .
git commit -m "Your change description"
git push origin main
```

Vercel will automatically build and deploy within 2-3 minutes.

---

## Monitoring and Analytics

### 6.1 View Deployment Logs

1. Go to Vercel Dashboard → Your Project
2. Click on a deployment
3. View **"Build Logs"** and **"Function Logs"**

### 6.2 Analytics

Vercel provides free analytics:
- Page views
- Top pages
- Visitor locations
- Device types

Enable in Project Settings → **Analytics**

---

## Troubleshooting

### Build Fails

**Error**: `Module not found` or `Cannot find module`
**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
git add package-lock.json
git commit -m "Fix dependencies"
git push
```

### Environment Variables Not Working

**Error**: OpenAI API errors or undefined variables
**Solution**:
1. Check Project Settings → Environment Variables
2. Ensure `OPENAI_API_KEY` is set for all environments
3. Redeploy: Deployments → ⋯ (three dots) → Redeploy

### Blank Slides Still Appearing

**Error**: Some lesson slides are empty
**Solution**:
1. Verify `data/lessons/adaptiveFractionsLesson.js` has been updated
2. Clear browser cache and hard refresh (Cmd+Shift+R or Ctrl+Shift+F5)
3. Check browser console for errors

### OpenAI Rate Limits

**Error**: "Rate limit exceeded"
**Solution**:
1. Check your OpenAI account: https://platform.openai.com/usage
2. Add credits or upgrade your plan
3. Consider reducing chatbot usage

### Performance Issues

**Error**: Slow page loads
**Solution**:
1. Enable Next.js Image Optimization
2. Check Vercel Analytics for bottlenecks
3. Consider upgrading Vercel plan for better performance

---

## Cost Considerations

### Vercel Costs
- **Hobby (Free)**: Perfect for learning projects
  - Unlimited deployments
  - 100 GB bandwidth/month
  - Serverless function executions included

- **Pro ($20/month)**: For production apps
  - 1 TB bandwidth/month
  - Advanced analytics
  - Team collaboration

### OpenAI Costs
- **GPT-4o-mini**: ~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens
- **Estimated monthly cost**: $5-20 depending on usage
- Monitor at: https://platform.openai.com/usage

**Cost-Saving Tips**:
- Use GPT-4o-mini (already configured) instead of GPT-4
- Limit chatbot conversations to 10 messages
- Cache common responses
- Set usage limits in OpenAI dashboard

---

## Security Best Practices

### Environment Variables
- ✅ NEVER commit `.env.local` or `.env.production` with real values
- ✅ Use Vercel's environment variable encryption
- ✅ Rotate API keys periodically

### API Key Protection
- ✅ OpenAI API key is server-side only (not exposed to browser)
- ✅ Next.js API routes handle all OpenAI requests
- ✅ No client-side API key exposure

### Rate Limiting
Consider adding rate limiting to prevent abuse:
- Limit chatbot requests per user
- Implement request throttling
- Add CAPTCHA for suspicious activity

---

## Support and Resources

### Vercel Documentation
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Deployment](https://vercel.com/docs/concepts/deployments/overview)

### DontWaste Education Resources
- [GitHub Repository](https://github.com/yourusername/dontwaste-fractions-learning)
- Report issues in GitHub Issues
- Check CONTENT_SIMPLIFIED.md for lesson details

### OpenAI Resources
- [API Keys](https://platform.openai.com/api-keys)
- [Usage Dashboard](https://platform.openai.com/usage)
- [Documentation](https://platform.openai.com/docs)

---

## Quick Deployment Commands

```bash
# 1. Ensure all changes are committed
git status

# 2. Add any new files
git add .

# 3. Commit changes
git commit -m "Deploy DontWaste Education to Vercel"

# 4. Push to GitHub (triggers Vercel deployment)
git push origin main

# 5. Monitor deployment at vercel.com dashboard
```

---

## Success! 🎉

Your DontWaste Education platform is now live and helping students learn math!

**Next Steps**:
1. Share your deployment URL with students
2. Monitor usage and analytics
3. Gather feedback for improvements
4. Keep OpenAI API credits topped up
5. Update content as needed (auto-deploys on push)

---

*Deployment guide created 2025-12-03*
*For help: Create an issue on GitHub or contact support*
