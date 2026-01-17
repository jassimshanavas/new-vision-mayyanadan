# New Vision News - Next.js Unified App

This is the unified Next.js version of the New Vision News website. Everything (frontend + backend) is now in one codebase and can be deployed to Vercel with a single deployment.

## What Changed

- ✅ **Single Codebase**: No more separate `client/` and `server/` folders
- ✅ **Next.js API Routes**: Backend API routes are now in `pages/api/`
- ✅ **Single Deployment**: Deploy everything to Vercel with one command
- ✅ **Simpler Development**: Run `npm run dev` - that's it!

## Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit http://localhost:3000

### Build & Production

```bash
npm run build
npm start
```

## Deployment to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Vercel will auto-detect Next.js
4. Deploy!

That's it - no separate backend deployment needed!

## Environment Variables

Create a `.env.local` file (optional for development):

```env
JWT_SECRET=your-secret-key-change-in-production
```

For production on Vercel, add this in the Vercel dashboard under Settings → Environment Variables.

## Default Admin Credentials

- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Important**: Change the default password after first login!

## Project Structure

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
├── styles/          # Global styles
└── public/          # Static files
```

## Migration Notes

- API routes moved from `server/index.js` to `pages/api/`
- React components work the same, but use Next.js `Link` instead of react-router-dom
- All API calls use relative paths (no CORS issues!)
- Data files remain in JSON format (can upgrade to database later)

## Next Steps

1. Update components to use Next.js `Link` (change `to=` to `href=`)
2. Test all functionality
3. Deploy to Vercel!
4. (Optional) Migrate to a database (MongoDB, PostgreSQL, etc.)

