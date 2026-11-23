import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import userRouter from './routes/userRoutes.js';
import quizRouter from './routes/quizRoutes.js';
import adaptiveRouter from './routes/adaptiveRoutes.js';
import spotTheBugRouter from './routes/spotTheBugRoutes.js';
import seniorArchitectRouter from './routes/seniorArchitectRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Route handlers
app.use('/api/users', userRouter);
app.use('/api/adaptive', adaptiveRouter);
app.use('/api/spot-the-bug', spotTheBugRouter);
app.use('/api/senior-architect', seniorArchitectRouter);
app.use('/api', quizRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
