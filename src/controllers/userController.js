//import { signInService, signUpService } from "../services/userContrller.js";
import {
  signInService,
  signUpService,
  submitDataService,
  submittedDatasService,
} from "../services/userService.js";
import { HttpStatusCode } from "../utils/statusCodes.js";

export const signUp = async (req, res, next) => {
  try {
    console.log("Entered into signup controller");

    const { name, email, phone, password } = req.body;
    console.log(req.body);

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide necessary data",
      });
    }

    const userData = { name, email, phone, password };

    const response = await signUpService(userData);

    //console.log('response in controller: ', response)
    if (!response?.success) {
      return res.status(401).json({
        success: false,
        message: response.message,
      });
    }

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      userData: response.createUser,
    });
  } catch (error) {
    console.log("Error in signUp:", error);
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log("Thsi is the body: ", req.body);

    if (!email || !password) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        success: false,
        message: "Please provide necessary data",
      });
    }

    const data = { email, password };
    const response = await signInService(data);
    console.log("This is the login response: ", response);

    if (!response.success) {
      return res.status(HttpStatusCode.UNAUTHORIZED).json({
        success: false,
        message: response.message,
      });
    }

    res.cookie("userAccessToken", response.accessToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("userRefreshToken", response.refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(HttpStatusCode.OK).json({
      success: true,
      message: response.message,
      userId: response.userId,
    });
  } catch (error) {
    console.error("Error in SignIn: ", error);
    next(error);
  }
};

export const submitData = async (req, res, next) => {
  try {
    console.log("Entered into submitDATa");
    console.log("This is req.user: ", req.user);
    console.log(req.body);
    const { name, gender, nationality, email, phone, address, message } =
      req.body;
    if (
      !name ||
      !gender ||
      !nationality ||
      !email ||
      !phone ||
      !address ||
      !message
    ) {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .json({ success: false, message: "Please provide all the data" });
      return;
    }
    const userId = req.user.id;
    console.log("This is userId : ", userId);
    const data = { name, gender, nationality, email, phone, address, message };
    const response = await submitDataService(userId, data);

    if (!response.success) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        success: false,
        message: response.message,
      });
      return;
    }

    res.status(HttpStatusCode.CREATED).json({
      success: true,
      message: response.message,
    });
  } catch (error) {
    console.log("Error in submit data: ", error);
    next(error);
  }
};

export const submittedDatas = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const response = await submittedDatasService(userId);
    if (!response.success) {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .json({ success: false, message: response.message });
      return;
    }

    res
      .status(HttpStatusCode.OK)
      .json({
        success: response.success,
        message: response.success,
        formData: response.formData,
      });
  } catch (error) {
    console.log("Error in submittedDatas: ", error);
    next(error);
  }
};

export const logout = (req, res, next) => {
  
  res.clearCookie("userAccessToken", {
    httpOnly: true,
    sameSite: "None",
    secure: true, 
  });

  
  res.clearCookie("userRefreshToken", {
    httpOnly: true,
    sameSite: "None",
    secure: true,  
  });

  
  res.status(HttpStatusCode.OK).json({ success:true, message: "Logged out successfully" });
};
