import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import path from 'path';
import authRoutes from './routes/authRoutes.js';
import bikeRoutes from './routes/bikeRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const uploadsDir = path.join(process.cwd(), 'uploads');

app.use(cors({ origin: true }));
app.use(express.json({ limit: '5mb' }));
app.use(morgan('dev'));
app.use('/api/files', express.static(uploadsDir));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'factory-motor-bike-node-api' });
});

app.use('/api/auth', authRoutes);
app.use('/api/bikes', bikeRoutes);
app.use('/api/contact', contactRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
