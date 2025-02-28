

import bcrypt from 'bcryptjs'
import userModel from "../models/userSchema.js";
import surveyModel from '../models/surveySchema.js';




export const signUpRepo = async (userData) => {
    try {
        console.log("This is the userData: ", userData);

        
        const existingUser = await userModel.findOne({ email: userData.email });

        if (existingUser) {
            return { success: false, message: "Email already exists" };
        }

        
        const createUser = await userModel.create(userData);
        
        if (!createUser) {
            return { success: false, message: "Failed to create User" };
        }

        
        const { password, ...mainData } = createUser.toObject();

        return { success: true, createUser: mainData };
    } catch (error) {
        console.log("Error in signUpRepo: ", error);
        return { success: false, message: "An error occurred during user creation" };
    }
};

export const signInRepo = async (userData) => {
    try {
      const { email, password } = userData;
  
      const findUser = await userModel.findOne({ email });
  
      if (!findUser) {
        return { success: false, message: "User is not found!!" };
      }
  
      const passwordValid = await bcrypt.compare(password, findUser.password);
  
      if (!passwordValid) {
        return { success: false, message: "Incorrect password!!" };
      }
  
      return {
        success: true,
        message: "Login Successfull",
        userId: findUser._id + "",
      };
    } catch (error) {
      console.log("Error in SignInRepo: ", error);
    }
  };

  export const submitDataRepo = async (userId, data) => {
           try {

            const savedSurvey = await surveyModel.create({userId, ...data});
           // console.log("This is the savedSurvery: ", savedSurvey);

            if(!savedSurvey){
              return {success:false, message:"Failed to save the formDaa"}
            }

            return {success:true, message:"Successfully Submitted!!"}

            
           } catch (error) {
            
           }
  }


  export const submittedDatasRepo = async(userId) => {
     try {
        const getDatas = await surveyModel.find({userId});
        console.log("This si the getData: ", getDatas);

        if (getDatas.length === 0) {
          return { success:true, message: 'No data found for the given userId', data: [] }
        }

        return {success:true, message:"Successfully fetched", formData:getDatas}

      
     } catch (error) {
        console.log("Error in submittedDatasRepo: ", error);
        throw error
     }
  }
