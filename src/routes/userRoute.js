import express from 'express';
import { logout, signIn, signUp, submitData, submittedDatas } from '../controllers/userController.js';
import { verification } from '../middleware/verification.js';


const userRoute = express.Router();

userRoute.post('/signin', signIn);
userRoute.post('/signup', signUp);

userRoute.post('/submit', verification('user'), submitData);
userRoute.get('/submissions', verification('user'), submittedDatas)
userRoute.get('/logout', verification('user'), logout)


export default userRoute