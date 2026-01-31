import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export function authenticateToken(req) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token || token === 'null' || token === 'undefined') {
    return null;
  }

  try {
    const user = jwt.verify(token, JWT_SECRET);
    return user;
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      console.warn('JWT expired at:', err.expiredAt);
    } else {
      console.error('JWT Verification Error:', err.message);
    }
    return null;
  }
}

export function requireAuth(handler) {
  return async (req, res) => {
    const user = authenticateToken(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.user = user;
    return handler(req, res);
  };
}

