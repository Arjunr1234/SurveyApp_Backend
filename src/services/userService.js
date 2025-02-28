import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { signInRepo, signUpRepo, submitDataRepo, submittedDatasRepo } from '../repositories/userRepository.js';
dotenv.config()


 export const signUpService = async (userData) => {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const data = {
        ...userData,
        password: hashedPassword,
      };
     
     const response = await signUpRepo(data)
     console.log("This is the respose servcie: ", response);
      return response;
    } catch (error) {
      console.log("Error in signUPService: ", error);
    }
  };

  export const signInService = async (userData) => {
    try {
        const response = await signInRepo(userData);
  
        if (!response.success) {
            return { success: false, message: response.message };
        }

        
        const payload = { id: response.userId, role:"user" };

    
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, {
            expiresIn: "15m",
        });
 
        
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_KEY, {
            expiresIn: "7d",
        });

        return {
            success: true,
            message: response.message,
            accessToken,
            refreshToken,
            userId: response.userId,
        };
    } catch (error) {
        console.log("Error in SignInService: ", error);
        throw error;
    }
};

export const submitDataService = async(userId, data) => {
    try {
      const response = await submitDataRepo(userId, data);
      return response;
      
    } catch (error) {
        console.log("Error in submitDataService: ", error);
        throw error
    }
}

export const submittedDatasService = async(userId) => {
    try {

      const response = await submittedDatasRepo(userId);
      return response
      
    } catch (error) {
       console.log("Error in submittedDatasService: ", error);
       throw error
    }
}
  