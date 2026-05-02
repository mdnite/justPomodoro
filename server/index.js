import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRouter from './auth/auth.routes.js';
import tasksRouter from './tasks/tasks.routes.js';
import sessionsRouter from './sessions/sessions.routes.js';
import settingsRouter from './settings/settings.routes.js';
import weatherRouter from './weather/weather.routes.js';
import { authenticate } from './auth/auth.middleware.js';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cookieParser());
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/tasks', authenticate,tasksRouter);
app.use('/api/sessions', authenticate, sessionsRouter);
app.use('/api/settings', authenticate, settingsRouter);
app.use('/api/weather', weatherRouter);

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
