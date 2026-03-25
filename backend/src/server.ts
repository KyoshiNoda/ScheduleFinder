import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import cors, { CorsOptions } from 'cors';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import userRoute from './routes/userRoute';
import authRoute from './routes/authRoute';
import scheduleRoute from './routes/scheduleRoute';
import friendRoute from './routes/friendRoute';
import friendRequestRoute from './routes/friendRequestRoute';
import hobbyRoute from './routes/hobbyRoutes';
const port = process.env.PORT || 3001;
const app = express();

const allowedOrigins = (
  process.env.CORS_ALLOWED_ORIGINS ??
  [
    'http://localhost:5173',
    'https://schedulefinder.netlify.app',
    'https://www.schedulefinder.netlify.app',
  ].join(',')
)
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions: CorsOptions = {
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

cloudinary.config({
  cloud_name: `${process.env.CLOUDINARY_CLOUD_NAME}`,
  api_key: `${process.env.CLOUDINARY_API_KEY}`,
  api_secret: `${process.env.CLOUDINARY_API_SECRET}`,
  secure: true,
});

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
mongoose.set('strictQuery', true);

mongoose
  .connect(`${process.env.DB_URI}`, {})
  .then(() => console.log('connected to DB!'))
  .catch((err) => console.log(err));

const server = app.listen(port, () => {
  console.log('listening on port 3001');
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  server.close(() => {
    console.log('Server shutdown complete.');
    process.exit(0);
  });
});
