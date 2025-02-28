import express from 'express';
import { adminSignIn, getFormData, logout } from '../controllers/adminController.js';
import { verification } from '../middleware/verification.js';


const adminRoute = express.Router()


adminRoute.post('/login',adminSignIn);

adminRoute.get('/form-data', verification('admin'), getFormData);
adminRoute.get('/logout', verification('admin'), logout)




export default adminRoute