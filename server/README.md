# Server Documentation

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
  - Body: `{ username: string, password: string }`
  - Returns: `{ token: string, user: object }`

### News
- `GET /api/news` - Get all news articles (public)
- `GET /api/news/:id` - Get single article (public)
- `POST /api/news` - Create article (requires auth)
  - Body: `{ title: string, content: string, excerpt?: string, imageUrl?: string, category?: string, published?: boolean }`
- `PUT /api/news/:id` - Update article (requires auth)
- `DELETE /api/news/:id` - Delete article (requires auth)

### Videos
- `GET /api/videos` - Get all videos (public)
- `POST /api/videos` - Add video (requires auth)
  - Body: `{ url: string, title: string, description?: string, featured?: boolean }`
- `DELETE /api/videos/:id` - Delete video (requires auth)

### Settings
- `GET /api/settings` - Get site settings (public)
- `PUT /api/settings` - Update settings (requires auth)

## Data Storage

Data is stored in JSON files in the `server/data/` directory:
- `news.json` - News articles
- `videos.json` - YouTube videos
- `settings.json` - Site settings
- `users.json` - Admin users

These files are created automatically on first run.

## Authentication

Authentication uses JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <token>
```

## Default Admin User

- Username: `admin`
- Password: `admin123`

⚠️ Change the password in production!

## Environment Variables

See `env.example.txt` for required environment variables.

