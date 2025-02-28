import mongoose from "mongoose";

const surveySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',  
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    gender: {
      type: String,
      required: true,
      enum: ['Male', 'Female', 'Other']
    },
    nationality: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      
    },
    address: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

const surveyModel = mongoose.model('Survey', surveySchema);

export default surveyModel;
