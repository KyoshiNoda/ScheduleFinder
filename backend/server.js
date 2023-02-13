const express = require('express');
const app = express();

app.listen(3001,(req,res) =>{
  console.log('listening on port 3001');
});

app.get('/',(req,res) =>{
  res.send(`running on port ${3001}`)
})