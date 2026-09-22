import * as dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import { createApp } from './app';

const port = process.env.PORT || 3001;
const app = createApp();

cloudinary.config({
  cloud_name: `${process.env.CLOUDINARY_CLOUD_NAME}`,
  api_key: `${process.env.CLOUDINARY_API_KEY}`,
  api_secret: `${process.env.CLOUDINARY_API_SECRET}`,
  secure: true,
});

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
