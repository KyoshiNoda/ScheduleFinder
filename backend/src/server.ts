import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';

import userRoute from './routes/userRoute';
import authRoute from './routes/authRoute';

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/user', userRoute);
app.use('/api/auth',authRoute)
mongoose.set('strictQuery', true);

mongoose.connect(`${process.env.DB_URI}`, {
}).then(() => console.log('connected to DB!'))
  .catch((err) => console.log(err));

app.listen(3001, () => {
  console.log('listening on port 3001');
});