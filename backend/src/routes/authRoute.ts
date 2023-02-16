import express from 'express';
import AuthController from '../controllers/AuthController';
const router = express.Router();
const calander = [
  {
    email : "kyoshisew@gmail.com",
    timeSlot : [
      {time : "blah"},
      {time : "hi"}
    ]
  },
  {
    email : "carlosduque@gmail.com",
    timeSlot : [
      {time : "boo"},
      {time : "yooo"}
    ]
  }
];

router.post('/login',AuthController.loginUser);

router.get('/calander', AuthController.authToken, (req : any, res : any ) => { 
  res.send(calander.filter((user) => user.email  === req.user.data.email));
 });

export default router;