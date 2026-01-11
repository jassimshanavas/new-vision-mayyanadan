# Quick Setup Guide

## Prerequisites
- Node.js (v14 or higher)
- npm or yarn

## Installation Steps

### 1. Install All Dependencies

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

Or use the convenience script:
```bash
npm run install-all
```

### 2. Configure Environment

Create a `.env` file in the `server` directory:

```bash
cd server
cp env.example.txt .env
```

Edit `.env` and set your JWT_SECRET (change the default value for production).

### 3. Start Development Server

**Option 1: Run both together (Recommended)**
```bash
npm run dev
```

**Option 2: Run separately**

Terminal 1 - Backend:
```bash
cd server
npm run dev
```

Terminal 2 - Frontend:
```bash
cd client
npm start
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Admin Dashboard**: http://localhost:3000/admin/login

### 5. Default Login Credentials

- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Important**: Change the default password after first login!

## First Steps After Setup

1. **Login to Admin Dashboard**
   - Go to http://localhost:3000/admin/login
   - Login with admin credentials

2. **Add Your First News Article**
   - Click "Add News" button
   - Fill in the form with your news content
   - Add an image URL (optional)
   - Select category
   - Mark as "Published" if you want it to appear on the homepage
   - Click "Save"

3. **Add YouTube Videos**
   - Go to Videos tab
   - Click "Add Video"
   - Paste YouTube video URL
   - Add title and description
   - Mark as "Featured" if you want to highlight it
   - Click "Save"

4. **Customize Settings** (Optional)
   - Go to Settings tab
   - Review site information
   - Update contact details if needed

## Production Deployment

### Build for Production

```bash
# Build React app
cd client
npm run build

# This creates a 'build' folder with production-ready files
```

### Deploy

1. **Backend**: Deploy the `server` folder to your Node.js hosting
2. **Frontend**: Deploy the `client/build` folder to a static hosting service (Netlify, Vercel, etc.)

### Environment Variables for Production

Make sure to set these in your production environment:
- `PORT` - Your server port (default: 5000)
- `JWT_SECRET` - A strong, random secret key
- `NODE_ENV` - Set to "production"

## Troubleshooting

### Port Already in Use
If port 5000 or 3000 is already in use:
- Change `PORT` in server `.env` file
- Update `proxy` in `client/package.json`

### Dependencies Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Facebook Embed Not Showing
- Check if Facebook page is public
- Verify page ID: `61577465543293`
- Check browser console for errors

### CORS Errors
- Ensure backend is running on port 5000
- Check `client/package.json` has correct proxy setting
- Verify CORS settings in `server/index.js`

## Need Help?

Check the main README.md for more detailed information.

