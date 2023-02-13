import express from 'express';
import bodyParser from 'body-parser';
import userRoute from './routes/userRoute';
import cors from 'cors';
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/users', userRoute);

app.listen(3001, () => {
  console.log('listening on port 3001');
});