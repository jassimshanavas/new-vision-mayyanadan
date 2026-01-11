# Vercel Deployment Guide

This guide will help you deploy your New Vision News website to Vercel.

## Prerequisites

- A GitHub account with your repository pushed
- A Vercel account (sign up at https://vercel.com)
- Your backend API URL (if deploying backend separately)

## Frontend Deployment (React App)

### Step 1: Connect GitHub to Vercel

1. Go to [Vercel](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Select the repository: `new-vision-new`

### Step 2: Configure Project Settings

Vercel should automatically detect it's a React app. Configure these settings:

**Root Directory:** Leave as default (root)

**Build Settings:**
- **Framework Preset:** Create React App
- **Build Command:** `cd client && npm install && npm run build`
- **Output Directory:** `client/build`
- **Install Command:** `cd client && npm install`

### Step 3: Environment Variables

Add these environment variables in Vercel project settings:

1. Go to **Settings** → **Environment Variables**
2. Add the following variables:

```
REACT_APP_API_URL=https://your-backend-api-url.com
REACT_APP_SUPABASE_URL=your-supabase-project-url
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
```

**Important:** 
- Replace `REACT_APP_API_URL` with your backend API URL
- If you haven't deployed the backend yet, you can deploy it separately (see Backend Deployment section below)

### Step 4: Deploy

1. Click **Deploy**
2. Wait for the build to complete
3. Your site will be live at `https://your-project.vercel.app`

## Backend Deployment Options

Your Express backend uses file-based storage, which doesn't work well with Vercel's serverless functions. Here are your options:

### Option 1: Deploy Backend Separately (Recommended)

Deploy your backend to a platform that supports persistent file storage:

**Recommended Platforms:**
- **Railway** (https://railway.app) - Easy deployment, supports file storage
- **Render** (https://render.com) - Free tier available
- **Heroku** (https://heroku.com) - Paid plans
- **DigitalOcean App Platform** (https://www.digitalocean.com/products/app-platform)

**Steps for Railway:**
1. Sign up at Railway
2. Create a new project
3. Connect your GitHub repository
4. Set root directory to `server`
5. Add environment variables:
   - `PORT=5000`
   - `JWT_SECRET=your-secret-key`
   - `NODE_ENV=production`
6. Deploy

Then update `REACT_APP_API_URL` in Vercel with your Railway backend URL.

### Option 2: Migrate to Database (Best Long-term Solution)

For production, consider migrating from file-based storage to a database:

1. **Use Supabase** (already integrated):
   - Create tables for news, videos, facebook_posts, settings, users
   - Update server code to use Supabase instead of file system
   - This will work with Vercel serverless functions

2. **Use MongoDB Atlas** (free tier available):
   - Create a MongoDB cluster
   - Update server code to use MongoDB
   - Deploy backend as Vercel serverless functions

### Option 3: Convert to Vercel Serverless Functions

You can convert your Express routes to Vercel serverless functions, but you'll need to:
- Migrate file storage to a database (Supabase recommended)
- Convert Express routes to individual serverless functions
- Update API structure

## Post-Deployment

### 1. Update API URL

After deploying the backend, update the `REACT_APP_API_URL` environment variable in Vercel to point to your backend.

### 2. Test Your Deployment

1. Visit your Vercel URL
2. Test the frontend functionality
3. Test API calls (check browser console for errors)
4. Test admin login

### 3. Custom Domain (Optional)

1. Go to **Settings** → **Domains** in Vercel
2. Add your custom domain
3. Follow DNS configuration instructions

## Troubleshooting

### Build Fails

- Check build logs in Vercel dashboard
- Ensure all dependencies are in `client/package.json`
- Verify Node.js version (Vercel uses Node 18 by default)

### API Calls Fail

- Verify `REACT_APP_API_URL` is set correctly
- Check CORS settings on your backend
- Ensure backend is deployed and accessible

### Environment Variables Not Working

- Environment variables must start with `REACT_APP_` to be accessible in React
- Redeploy after adding new environment variables
- Check variable names for typos

## Quick Deploy Command

If you have Vercel CLI installed:

```bash
npm i -g vercel
cd client
vercel
```

Follow the prompts to deploy.

## Support

For issues:
- Check Vercel documentation: https://vercel.com/docs
- Check build logs in Vercel dashboard
- Verify all environment variables are set correctly

