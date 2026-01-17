# Firebase Storage Setup Guide

This guide will help you set up Firebase Storage for image uploads in the News Admin Dashboard.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard

## Step 2: Enable Firebase Storage

1. In your Firebase project, go to **Storage** in the left sidebar
2. Click **Get started**
3. Start in **production mode** (or test mode if you prefer)
4. Choose a storage location (select the closest to your users)
5. Click **Done**

## Step 3: Get Your Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to **Your apps** section
3. Click the **Web** icon (`</>`) to add a web app if you haven't already
4. Register your app with a nickname (e.g., "New Vision News")
5. Copy the configuration object

## Step 4: Configure Environment Variables

1. Create a `.env` file in the `client` folder
2. Add the following environment variables with your Firebase credentials:

```env
REACT_APP_FIREBASE_API_KEY=your-api-key-here
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=your-app-id
```

3. Replace all placeholder values with your actual Firebase project credentials

## Step 5: Set Storage Security Rules (Optional but Recommended)

1. In Firebase Console, go to **Storage** > **Rules**
2. Update the rules based on your needs:

### For Public Uploads (Any authenticated user can upload):
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /news-images/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### For Admin-Only Uploads (Only authenticated admins):
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /news-images/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

3. Click **Publish**

## Step 6: Test the Upload Feature

1. Start your React app: `npm start` (in the `client` folder)
2. Log in to the Admin Dashboard
3. Click "Add News"
4. Click "Upload Image" button
5. Select an image file
6. The image should upload and the URL will be automatically filled in

## Troubleshooting

### Error: "Firebase: Error (auth/invalid-api-key)"
- Make sure your `.env` file has the correct API key
- Restart your development server after changing `.env` files

### Error: "Permission denied"
- Check your Storage Security Rules
- Make sure the rules allow uploads for authenticated users

### Error: "Storage bucket not found"
- Verify the `REACT_APP_FIREBASE_STORAGE_BUCKET` value in your `.env` file
- Check that Storage is enabled in your Firebase project

### Images not showing after upload
- Check browser console for errors
- Verify the download URL is being saved correctly
- Check Firebase Storage console to see if files are actually uploaded

## File Size Limits

- Maximum file size: **5MB**
- Supported formats: JPEG, JPG, PNG, GIF, WebP

## Notes

- Images are stored in the `news-images` folder in Firebase Storage
- Files are automatically renamed with timestamps to prevent conflicts
- Original filenames are stored in metadata
- The upload progress is shown in real-time

