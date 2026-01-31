import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { readData, usersFile } from '../../../lib/data';
import { supabaseHelpers, isSupabaseConfigured } from '../../../lib/supabase';
import { JWT_SECRET } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;
    let user = null;

    if (isSupabaseConfigured()) {
      // Try to get user from Supabase
      try {
        user = await supabaseHelpers.getUserByUsername(username);
      } catch (error) {
        console.error('Supabase user fetch error:', error);
      }
    }

    // Fallback to local files if not found in Supabase or Supabase not configured
    if (!user) {
      const users = readData(usersFile);
      user = users.find(u => u.username === username || u.email === username);
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

