# New Vision Mayyanadan - News Website

A modern, stylish news reporting website with YouTube and Facebook integration, featuring a comprehensive admin dashboard for content management.

## Features

- 🎨 **Modern & Responsive Design**: Beautiful, mobile-friendly interface built with React and Tailwind CSS
- 📰 **News Management**: Full CRUD operations for news articles with categories and image support
- 🎥 **YouTube Integration**: Display and manage videos from your YouTube channel
- 📱 **Facebook Integration**: Embed and showcase your Facebook page updates
- 🔐 **Admin Dashboard**: Secure authentication system for content management
- 🎯 **Real-time Updates**: Easy daily content updates through admin panel

## Tech Stack

- **Frontend**: React 18, React Router, Tailwind CSS, React Icons
- **Backend**: Node.js, Express.js
- **Authentication**: JWT (JSON Web Tokens)
- **Data Storage**: JSON files (easily upgradable to database)

## Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Step 1: Install Dependencies

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Or use the convenience script
npm run install-all
```

### Step 2: Environment Setup

Create a `.env` file in the `server` directory:

```env
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

### Step 3: Run the Application

**Development Mode (Recommended):**

```bash
# From root directory - runs both server and client
npm run dev

# Or run separately:
# Terminal 1 - Start server
cd server
npm run dev

# Terminal 2 - Start client
cd client
npm start
```

**Production Mode:**

```bash
# Build client
cd client
npm run build

# Start server
cd ../server
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Default Admin Credentials

- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Important**: Change the default password immediately after first login in production!

## Usage Guide

### Admin Dashboard

1. Navigate to `/admin/login`
2. Login with admin credentials
3. Manage content:
   - **News Tab**: Add, edit, delete news articles
   - **Videos Tab**: Add YouTube videos by URL
   - **Settings Tab**: View site settings

### Adding News Articles

1. Click "Add News" in the News tab
2. Fill in the form:
   - Title (required)
   - Content (required)
   - Excerpt (optional, auto-generated if empty)
   - Image URL (optional)
   - Category (General, Local, Sports, Politics, Entertainment, Technology)
   - Published status (checkbox)
3. Click "Save"

### Adding Videos

1. Click "Add Video" in the Videos tab
2. Enter YouTube video URL (e.g., `https://www.youtube.com/watch?v=...`)
3. Add title and description
4. Mark as "Featured" if needed
5. Click "Save"

### Facebook Integration

The Facebook page is automatically embedded using Facebook's Page Plugin. Update the page ID in the code if needed:
- Current Page ID: `61577465543293`
- Page URL: `https://www.facebook.com/profile.php?id=61577465543293`

### YouTube Integration

- Channel: `@newvisionmayyanadan`
- Channel URL: `https://www.youtube.com/@newvisionmayyanadan`

## Project Structure

```
new-vision-new/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context (Auth)
│   │   └── App.js         # Main app component
│   └── package.json
├── server/                 # Node.js backend
│   ├── data/              # JSON data files (auto-created)
│   ├── index.js           # Express server
│   └── package.json
├── package.json           # Root package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login

### News
- `GET /api/news` - Get all news articles
- `GET /api/news/:id` - Get single article
- `POST /api/news` - Create article (requires auth)
- `PUT /api/news/:id` - Update article (requires auth)
- `DELETE /api/news/:id` - Delete article (requires auth)

### Videos
- `GET /api/videos` - Get all videos
- `POST /api/videos` - Add video (requires auth)
- `DELETE /api/videos/:id` - Delete video (requires auth)

### Settings
- `GET /api/settings` - Get site settings
- `PUT /api/settings` - Update settings (requires auth)

## Customization

### Changing Colors

Edit `client/tailwind.config.js` to customize the color scheme:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your color values
      }
    }
  }
}
```

### Adding More Categories

Edit the category select in `client/src/pages/AdminDashboard.js`:

```javascript
<option>Your Category</option>
```

## Future Enhancements

- Database integration (MongoDB/PostgreSQL)
- Image upload functionality
- Advanced search and filtering
- Comments system
- Newsletter subscription
- SEO optimization
- Analytics integration

## Troubleshooting

### Port Already in Use

If port 5000 or 3000 is already in use:

1. Change server port in `server/index.js`
2. Update `client/package.json` proxy setting
3. Update API calls in client components

### CORS Errors

Ensure CORS is enabled in `server/index.js`. Already configured by default.

### Facebook Embed Not Showing

- Check if Facebook page is public
- Verify page ID is correct
- Ensure internet connection for Facebook SDK

## License

MIT License - feel free to use and modify as needed.

## Support

For issues or questions, please check:
- Facebook Page: https://www.facebook.com/profile.php?id=61577465543293
- YouTube Channel: https://www.youtube.com/@newvisionmayyanadan

---

Built with ❤️ for New Vision Mayyanadan

