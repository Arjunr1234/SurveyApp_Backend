import { adminSignInRepo, getFormDataRepo } from "../repositories/adminRepository.js";
import jwt from "jsonwebtoken";

export const adminSignInService = async (email, password) => {
  try {
    const response = await adminSignInRepo(email, password);

    if(!response.success){
        return {success:response.success, message:response.message}
    }

    const payload = { id: response.userId, role:'admin' };

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
    console.log("Error in adminSignInService: ", error);
    throw error;
  }
};

export const getFormDataService = async() => {
   try {
      const response = await getFormDataRepo();
      return response
    
   } catch (error) {
      console.log("Error in submittedDataService: ", error);
      throw error
   }
}
