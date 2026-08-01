import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend routing
app.use(cors());

// Parse JSON body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Lakshmi Agency Business Catalogue Static API is running.',
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
