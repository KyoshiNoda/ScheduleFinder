import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import userRoute from './routes/userRoute';
import cors from 'cors';
import mongoose from 'mongoose';
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/users', userRoute);
mongoose.set('strictQuery', true);

mongoose.connect(`${process.env.DB_URI}`, {
}).then(() => console.log('connected to DB!'))
  .catch((err) => console.log(err));

app.listen(3001, () => {
  console.log('listening on port 3001');
});