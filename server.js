import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './src/config/db.js';

import adminRoutes from './src/routes/adminRoutes.js';
import abstractRoutes from './src/routes/abstractRoutes.js';
// import assessmentRoutes from './src/routes/assessmentRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

connectDB();

app.use('/api/admin', adminRoutes);
app.use('/api/abstracts', abstractRoutes);
// app.use('/api/assessment', assessmentRoutes);

app.get('/', (req, res) => {
    res.send('🎯 ePoster Judging API Running Successfully');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
