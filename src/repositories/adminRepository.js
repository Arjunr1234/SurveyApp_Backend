import adminModel from "../models/adminSchema.js";
import surveyModel from "../models/surveySchema.js";






export const adminSignInRepo = async(email, password) => {
      try {
          const findAdmin = await adminModel.findOne({email})  ;
          if(!findAdmin){
            return {success:false, message:"User not found!!"}
          }
          const checkPassword = await adminModel.findOne({email, password});

          if(!checkPassword){
            return{success:false, message:"Invalid credentials!!"}
          }

          return {
            success: true,
            message: "Login Successfull",
            userId: findAdmin._id + "",
          };
        
      } catch (error) {
           console.log("Error in adminSignINRepo: ", error);
           throw error
      }
}

export const getFormDataRepo = async() => {
      try {
          
          const response = await surveyModel.aggregate([
            {
              $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userData"
              }
            },
            {
              $unwind: "$userData" 
            },
            {
              $project: {
                userName: "$userData.name",
                _id: 1,
                userId: 1,
                name: 1,
                gender: 1,
                nationality: 1,
                email: 1,
                phone: 1,
                address: 1,
                message: 1,
                createdAt: 1,
                updatedAt: 1,
                __v: 1,
                
              }
            }
          ]);
          
          
          
          

          if(response.length===0){
            return {success:true, message:"empty", formData:[]}
          }

         return {success:true, message:"Successfull fetched", formData:response}
        
      } catch (error) {
          console.log("Error in submittedDatas: ", error);
          throw error
      }
}