# Vercel Deployment Checklist

Quick reference for deploying DontWaste Education to Vercel.

## Pre-Deployment

- [ ] All changes committed to Git
- [ ] Code pushed to GitHub/GitLab/Bitbucket
- [ ] OpenAI API key ready (starts with `sk-`)
- [ ] Tested locally with `npm run dev`
- [ ] No console errors in browser DevTools

## Vercel Setup

- [ ] Created Vercel account at [vercel.com](https://vercel.com)
- [ ] Imported repository to Vercel
- [ ] Framework detected as **Next.js** ✓
- [ ] Build settings left as default ✓

## Environment Variables

Add these in Vercel Project Settings → Environment Variables:

- [ ] `OPENAI_API_KEY` = `sk-your-actual-key-here`
  - Environment: ✓ Production ✓ Preview ✓ Development

## Deployment

- [ ] Clicked "Deploy" button
- [ ] Build completed successfully (2-3 minutes)
- [ ] Received deployment URL: `https://your-project.vercel.app`

## Testing Production

Test these features on your live URL:

- [ ] Landing page loads with "DontWaste Education" branding
- [ ] Name input accepts text and proceeds
- [ ] Welcome screen displays student name
- [ ] Pre-assessment shows 5 questions
- [ ] All 4 chapters are clickable (Fractions, Decimals, Percentages, Number Sense)
- [ ] Lesson viewer displays slides without blanks
- [ ] XP and level progress works
- [ ] Streak counter increments
- [ ] AI Guru chatbot (if enabled) responds
- [ ] Mobile responsive design works
- [ ] No 404 or 500 errors

## Post-Deployment

- [ ] Shared deployment URL with team/students
- [ ] Set up custom domain (optional)
- [ ] Enabled Vercel Analytics (optional)
- [ ] Monitored OpenAI usage at [platform.openai.com/usage](https://platform.openai.com/usage)
- [ ] Documented deployment URL in team docs

## Continuous Deployment

- [ ] Verified automatic deployments work:
  - Make a small change
  - Commit and push to main branch
  - Check Vercel dashboard for new deployment

## Troubleshooting

If issues occur:

1. **Build fails**: Check Vercel build logs, verify package.json
2. **Environment variables**: Double-check spelling and values
3. **OpenAI errors**: Verify API key and account credits
4. **Blank slides**: Clear browser cache, check browser console
5. **404 errors**: Verify Next.js routing, check vercel.json

For detailed help, see [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## Quick Commands

```bash
# Check status
git status

# Commit changes
git add .
git commit -m "Deploy to Vercel"

# Push to trigger deployment
git push origin main
```

---

**Deployment URL**: _______________________________

**Deployed on**: _______________________________

**Deployed by**: _______________________________

---

✅ **All done? Share your success!**

Your DontWaste Education platform is now helping students learn math! 🎉
