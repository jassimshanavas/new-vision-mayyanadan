# Supabase Storage Setup Guide

This guide will help you set up Supabase Storage for image uploads in the News Admin Dashboard. Supabase offers a free tier with generous storage limits!

## Step 1: Create a Supabase Project

1. Go to [Supabase](https://supabase.com/)
2. Sign up or log in to your account
3. Click **New Project**
4. Fill in your project details:
   - **Name**: Choose a name for your project (e.g., "New Vision News")
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Select the region closest to your users
5. Click **Create new project**
6. Wait for the project to finish setting up (this takes a few minutes)

## Step 2: Create a Storage Bucket

1. In your Supabase project dashboard, go to **Storage** in the left sidebar
2. Click **New bucket**
3. Configure the bucket:
   - **Name**: `news-images` (must match exactly)
   - **Public bucket**: ✅ Enable this (so images are publicly accessible)
   - **File size limit**: 5 MB (or adjust as needed)
   - **Allowed MIME types**: Leave empty or add: `image/jpeg,image/png,image/gif,image/webp`
4. Click **Create bucket**

## Step 3: Set Storage Policies (REQUIRED)

**IMPORTANT:** Even though you enabled "Public bucket", you still need to create RLS policies to allow uploads. This is a common gotcha!

1. In your Supabase dashboard, go to **Storage** in the left sidebar
2. Click on the `news-images` bucket you just created
3. Click on the **Policies** tab
4. You'll see options to create policies. Click **New Policy** or use the SQL Editor

### Option A: Use Policy Templates (Easier)

1. Click **New Policy** in the Policies tab
2. Select **For full customization, use SQL editor**
3. Or use the pre-built templates if available

### Option B: Use SQL Editor (Recommended)

1. Go to **SQL Editor** in the left sidebar
2. Click **New Query**
3. Paste the following SQL and click **Run**:

```sql
-- Allow anyone to upload files to the bucket
CREATE POLICY "Allow public uploads"
ON storage.objects
FOR INSERT
TO public
WITH CHECK ( bucket_id = 'news-images' );

-- Allow anyone to read files from the bucket
CREATE POLICY "Allow public read access"
ON storage.objects
FOR SELECT
TO public
USING ( bucket_id = 'news-images' );

-- Allow anyone to delete files from the bucket (optional - remove if you don't want public deletes)
CREATE POLICY "Allow public deletes"
ON storage.objects
FOR DELETE
TO public
USING ( bucket_id = 'news-images' );
```

**Note:** These policies allow anyone (including unauthenticated users) to upload, read, and delete files. If you want to restrict uploads to authenticated users only, use this instead:

```sql
-- Allow authenticated users to upload
CREATE POLICY "Allow authenticated uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'news-images' );

-- Allow public read access
CREATE POLICY "Allow public read access"
ON storage.objects
FOR SELECT
TO public
USING ( bucket_id = 'news-images' );
```

4. After running the SQL, verify the policies were created by going back to Storage > news-images > Policies tab

## Step 4: Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** (gear icon) > **API**
2. You'll need two values:
   - **Project URL**: Found under "Project URL" (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key**: Found under "Project API keys" > **anon public** key

## Step 5: Configure Environment Variables

1. Create or update a `.env` file in the `client` folder
2. Add the following environment variables with your Supabase credentials:

```env
REACT_APP_SUPABASE_URL=https://xxxxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Replace the placeholder values with your actual Supabase credentials:
   - Replace `https://xxxxx.supabase.co` with your Project URL
   - Replace `your-anon-key-here` with your anon/public key

4. **Important**: Restart your development server after adding/changing `.env` variables

## Step 6: Install Dependencies

1. Navigate to the `client` folder
2. Run:
```bash
npm install
```

This will install the `@supabase/supabase-js` package.

## Step 7: Test the Upload Feature

1. Start your React app: `npm start` (in the `client` folder)
2. Log in to the Admin Dashboard
3. Click "Add News"
4. Click "Upload Image" button
5. Select an image file
6. The image should upload and the URL will be automatically filled in

## Troubleshooting

### Error: "Invalid API key" or "Failed to upload image"
- Make sure your `.env` file has the correct Supabase URL and anon key
- Verify there are no extra spaces or quotes around the values
- Restart your development server after changing `.env` files
- Check that your `.env` file is in the `client` folder (not the root)

### Error: "Bucket not found" or "new row violates row-level security policy"
- **This is the most common error!** You need to create RLS policies for the bucket
- Verify that the bucket name is exactly `news-images` (case-sensitive)
- Make sure the bucket is set to **Public** in Supabase Storage settings
- **Go to Storage > news-images > Policies tab and create INSERT, SELECT, and DELETE policies**
- Use the SQL in Step 3 above to create the necessary policies
- After creating policies, try uploading again

### Images not showing after upload
- Check browser console for errors
- Verify the download URL is being saved correctly
- Check Supabase Storage console to see if files are actually uploaded
- Make sure the bucket is set to Public so images can be accessed

### CORS errors
- Supabase handles CORS automatically for public buckets
- If you see CORS errors, double-check that the bucket is set to Public

## File Size Limits

- Maximum file size: **5MB** (configurable in bucket settings)
- Supported formats: JPEG, JPG, PNG, GIF, WebP

## Supabase Free Tier Benefits

- **500 MB** of file storage (more than Firebase's free tier!)
- Unlimited API requests
- Up to 2 GB bandwidth per month
- No credit card required for free tier

## Notes

- Images are stored in the `news-images` bucket in Supabase Storage
- Files are automatically renamed with timestamps to prevent conflicts
- The bucket is set to public, so images are accessible via public URLs
- Supabase Storage is built on top of object storage and is very reliable
- All files are stored securely and backed up automatically

## Upgrading (Optional)

If you need more storage or features, Supabase offers paid plans:
- **Pro Plan**: $25/month - 100 GB storage, 250 GB bandwidth
- **Team Plan**: $599/month - 500 GB storage, 1 TB bandwidth

For most projects, the free tier is more than sufficient!

