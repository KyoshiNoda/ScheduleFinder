import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import userRoute from './routes/userRoute';
import cors from 'cors';
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/users', userRoute);

app.get('/', (req, res) => {
  res.send(`running on port ${3001}`)
})

app.get('/ts', (req, res) => {
  res.send("this is typescript change! part 10");
})

app.listen(3001, () => {
  console.log('listening on port 3001');
});