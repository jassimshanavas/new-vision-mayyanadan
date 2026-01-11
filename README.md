# New Vision Mayyanadan - News Website (Next.js)

A modern, unified news reporting website built with Next.js. Everything (frontend + backend) in one codebase, deployed easily to Vercel.

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit http://localhost:3000

### Build for Production

```bash
npm run build
npm start
```

## 📦 Deployment to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Vercel auto-detects Next.js
4. Deploy!

**That's it!** No separate backend deployment needed - everything runs on Vercel.

## 🔐 Default Admin Credentials

- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Important**: Change the default password immediately after first login!

## 📁 Project Structure

```
new-vision-new/
├── pages/
│   ├── api/          # API routes (backend)
│   ├── admin/        # Admin pages
│   ├── news/         # News pages  
│   └── index.js      # Home page
├── components/       # React components
├── lib/             # Utilities and helpers
├── data/            # JSON data files
└── styles/          # Global styles
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Authentication**: JWT
- **Data Storage**: JSON files (easily upgradable to database)

## ✨ Features

- 🎨 Modern & Responsive Design
- 📰 News Management with full CRUD
- 🎥 YouTube Integration
- 📱 Facebook Integration
- 🔐 Secure Admin Dashboard
- ⚡ Fast Performance (Next.js SSR/SSG)
- 🚀 Easy Deployment (Vercel)

## 📝 Environment Variables

Create a `.env.local` file (optional for development):

```env
JWT_SECRET=your-secret-key-change-in-production
```

For production on Vercel, add this in the Vercel dashboard under Settings → Environment Variables.

## 📚 API Endpoints

All API routes are in `pages/api/`:

- `/api/auth/login` - Admin login
- `/api/news` - News CRUD operations
- `/api/videos` - Video management
- `/api/facebook-posts` - Facebook posts
- `/api/settings` - Site settings

## 🔄 Migration from Separate Frontend/Backend

This is the unified Next.js version. If you had a separate React + Express setup:
- API routes moved from `server/index.js` to `pages/api/`
- React components work the same (with Next.js Link)
- Single deployment instead of two separate ones
- No CORS issues (same origin)

## 📖 Documentation

- See `README_NEXTJS.md` for migration details
- See `MIGRATION_NOTES.md` for component update notes

## 🐛 Troubleshooting

### Port Already in Use
Change the port: `PORT=3001 npm run dev`

### Build Errors
Make sure all dependencies are installed: `npm install`

## 📄 License

MIT License - feel free to use and modify as needed.

## 🤝 Support

- Facebook: https://www.facebook.com/profile.php?id=61577465543293
- YouTube: https://www.youtube.com/@newvisionmayyanadan

---

Built with ❤️ for New Vision Mayyanadan
