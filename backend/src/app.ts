import express, { Express } from 'express';
import bodyParser from 'body-parser';
import cors, { CorsOptions } from 'cors';
import userRoute from './routes/userRoute';
import authRoute from './routes/authRoute';
import scheduleRoute from './routes/scheduleRoute';
import friendRoute from './routes/friendRoute';
import friendRequestRoute from './routes/friendRequestRoute';
import hobbyRoute from './routes/hobbyRoutes';

const defaultAllowedOrigins = [
  'http://localhost:5173',
  'https://schedulefinder.netlify.app',
  'https://www.schedulefinder.netlify.app',
];

const getCorsOptions = (): CorsOptions => {
  const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS ?? defaultAllowedOrigins.join(','))
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  return {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    optionsSuccessStatus: 204,
  };
};

export const createApp = (): Express => {
  const app = express();
  const corsOptions = getCorsOptions();

  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions));
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use('/api/users/friendRequest', friendRequestRoute);
  app.use('/api/users/friends', friendRoute);
  app.use('/api/users', userRoute);
  app.use('/api/auth', authRoute);
  app.use('/api/schedules', scheduleRoute);
  app.use('/api/hobbies', hobbyRoute);

  return app;
};
