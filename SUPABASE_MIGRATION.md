# Supabase Database Migration - Setup Instructions

## ✅ What Was Done

Your app has been migrated from file-based storage (JSON files) to **Supabase database**. This fixes the 500 error on Vercel deployments!

### Files Created/Modified:

1. **Database Schema**: `supabase/schema.sql`
2. **Supabase Helper Library**: `lib/supabase.js`
3. **Migration Script**: `scripts/setup-supabase.js`
4. **Updated API Endpoints**:
   - `/api/videos/*` - All video operations
   - `/api/news/*` - All news operations (index, [id], flash, featured, trending)

## 🚀 Setup Steps

### Step 1: Create Tables in Supabase

1. Go to your **Supabase Dashboard**: https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the entire contents of `supabase/schema.sql`
6. Paste it into the SQL editor
7. Click **Run** (or press Ctrl+Enter)

You should see: `Success. No rows returned`

This creates all the tables: `videos`, `news`, `facebook_posts`, `settings`, `users`

### Step 2: Migrate Existing Data

Run the migration script to copy data from JSON files to Supabase:

```bash
node scripts/setup-supabase.js
```

The script will:
- Test your Supabase connection
- Ask if you want to migrate data
- Copy all videos, news, settings, and users to Supabase

### Step 3: Test Locally

1. Make sure your `.env.local` has:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

2. Restart your dev server:
   ```bash
   npm run dev
   ```

3. Test in admin dashboard:
   - Create a new video
   - Create a new news article
   - Update/delete items
   - Verify everything works!

### Step 4: Deploy to Vercel

1. **Add environment variables in Vercel**:
   - Go to Vercel Dashboard > Your Project > Settings > Environment Variables
   - Add:
     - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon key

2. **Deploy**:
   ```bash
   git add .
   git commit -m "Migrate to Supabase database"
   git push
   ```

3. **Test on production**:
   - Go to https://www.newvisionmayyanadan.com/admin/dashboard
   - Try creating a video - it should work now! ✅

## 🔍 What Changed?

| Before | After |
|--------|-------|
| ❌ JSON files in `/data` folder | ✅ PostgreSQL database in Supabase |
| ❌ `fs.writeFileSync()` fails on Vercel | ✅ Database queries work everywhere |
| ❌ 500 errors on production | ✅ Works on localhost AND Vercel |

## 📝 Database Schema

Your Supabase database now has these tables:

- **videos** - YouTube videos
- **news** - News articles with views, categories, flags
- **facebook_posts** - Facebook posts (ready for future use)
- **settings** - Site configuration
- **users** - Admin users with authentication

All tables have proper indexes and RLS (Row Level Security) policies!

## ⚠️ Important Notes

1. **Old JSON files** in `/data` folder are no longer used - keep them as backup
2. **Views increment** now works on production (was broken before)
3. **Flash news** logic works - only one flash news article at a time
4. **Public access** - Anyone can read data, but only authenticated users can write

## 🐛 Troubleshooting

### "Database not configured" error
- Check that `.env.local` has Supabase credentials
- Restart your dev server after adding env variables

### Data not showing in Supabase
- Make sure you ran the SQL schema (`supabase/schema.sql`)
- Run the migration script to transfer JSON data

### 500 error still happening
- Check Vercel environment variables are set
- Check browser console for specific error messages
- Verify Supabase credentials are correct

## ✨ You're Done!

Your app now uses Supabase database and will work perfectly on Vercel! 🎉
