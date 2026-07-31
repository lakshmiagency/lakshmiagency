import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    const result = await query('SELECT * FROM admins WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const admin = result.rows[0];
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const secret = process.env.JWT_SECRET || 'super_secret_lakshmi_agency_jwt_key_2026';
    const token = jwt.sign({ id: admin.id, username: admin.username }, secret, {
      expiresIn: '7d',
    });

    res.json({
      token,
      admin: {
        id: admin.id,
        username: admin.username,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const verifyToken = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const adminRes = await query('SELECT id, username FROM admins WHERE id = $1', [req.adminId]);
    if (adminRes.rows.length === 0) {
      return res.status(404).json({ message: 'Admin not found.' });
    }
    res.json({ verified: true, admin: adminRes.rows[0] });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
