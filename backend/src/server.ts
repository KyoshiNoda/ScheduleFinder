import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';

import userRoute from './routes/userRoute';
import authRoute from './routes/authRoute';
import scheduleRoute from './routes/scheduleRoute';
import friendRoute from './routes/friendRoute';
const port = process.env.PORT || 3001;
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/users/friends',friendRoute);
app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/schedules', scheduleRoute);
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
