import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL environment variable is missing!');
}

// Render and other cloud databases require SSL in production
const isProduction = process.env.NODE_ENV === 'production' || 
  (connectionString && (connectionString.includes('render.com') || connectionString.includes('supabase.co') || connectionString.includes('neon.tech')));

export const pool = new Pool({
  connectionString,
  ssl: isProduction ? { rejectUnauthorized: false } : false
});

export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    // Optional logging in dev
    if (process.env.NODE_ENV !== 'production') {
      console.log('Executed query', { text, duration, rows: res.rowCount });
    }
    return res;
  } catch (err) {
    console.error('Query execution error:', err);
    throw err;
  }
};
