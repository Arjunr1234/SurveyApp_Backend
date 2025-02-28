import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './src/config/db.js';
import adminRoute from './src/routes/adminRoute.js';
import userRoute from './src/routes/userRoute.js';

const app = express();

const origin = 'https://survey-app-frontend-red.vercel.app'
//const origin = 'http://localhost:5173'
  
const corsOptions = {
    origin: origin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
};

connectDB();
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', userRoute);
app.use('/api/auth/admin', adminRoute)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
