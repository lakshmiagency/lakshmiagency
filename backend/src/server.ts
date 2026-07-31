import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import router from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all requests (crucial for local development & Vercel deployment)
app.use(cors());

// Parse JSON body & URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure public uploads folder exists and serve it statically
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Root route
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Lakshmi Agency Business Catalogue API is running.',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api', router);

// Handle 404
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Resource not found' });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
