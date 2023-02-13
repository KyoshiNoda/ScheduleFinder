import express, { Express, Request, Response } from 'express';
const app = express();

app.listen(3001, () => {
  console.log('listening on port 3001');
});

app.get('/', (req, res) => {
  res.send(`running on port ${3001}`)
})

app.get('/ts', (req, res) => {
  res.send("this is typescript change! part 10");
})