import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';

import userRoute from './routes/userRoute';
import authRoute from './routes/authRoute';
import scheduleRoute from './routes/scheduleRoute';

import sgMail from '@sendgrid/mail';

const port = process.env.PORT || 3001;
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

sgMail.setApiKey(`${process.env.SENDGRID_API_KEY}`);

// const msg: sgMail.MailDataRequired = {
//   to: "kyoshisew@gmail.com",
//   from: 'schedulefinder@gmail.com',
//   subject: 'Sending with SendGrid is Fun',
//   text: 'and easy to do anywhere, even with Node.js',
//   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
// };

// sgMail
//   .send(msg)
//   .then(() => {
//     console.log('Email sent');
//   })
//   .catch((error) => {
//     console.error(error);
//   });

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  server.close(() => {
    console.log('Server shutdown complete.');
    process.exit(0);
  });
});

